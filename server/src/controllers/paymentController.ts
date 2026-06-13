import { Request, Response } from 'express';
import crypto from 'crypto';
import { Types } from 'mongoose';
import Trek from '../models/Trek';
import Booking from '../models/Booking';
import { processCompletedTrek } from '../services/loyaltyService';

/**
 * Valid payment option keys sent by the frontend BookingModal.
 * The server resolves these to real INR amounts from the DB — never from the client.
 */
type PaymentOption =
  | 'registration'
  | 'fullWithTransport'
  | 'fullWithoutTransport'
  | 'remainingWithTransport'
  | 'remainingWithoutTransport';

/**
 * POST /api/payments/initiate
 * Initiates a payment:
 * 1. Resolves/Creates the Trek document in DB.
 * 2. Creates/Finds a Pending Booking.
 * 3. Resolves the authoritative price from the Trek's DB pricing record.
 * 4. Generates the PayU signature hash using Merchant Key & Salt.
 * 5. Returns the form arguments and action URL.
 *
 * The client sends a paymentOption key (e.g. 'registration', 'fullWithTransport').
 * The server resolves the real INR amount — the client never controls the price.
 */
export const initiatePayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = new Types.ObjectId(req.user!.id);
    const email = req.user!.email;
    const { trekTitle, paymentOption } = req.body as { trekTitle: string; paymentOption: PaymentOption };

    if (!trekTitle || !paymentOption) {
      res.status(400).json({ message: 'trekTitle and paymentOption are required.' });
      return;
    }

    const validOptions: PaymentOption[] = [
      'registration',
      'fullWithTransport',
      'fullWithoutTransport',
      'remainingWithTransport',
      'remainingWithoutTransport',
    ];
    if (!validOptions.includes(paymentOption)) {
      res.status(400).json({ message: 'Invalid paymentOption.' });
      return;
    }

    // 1. Look up the trek by title.
    const searchTitle = trekTitle.replace(/\s+Trek$/i, '').trim();
    const escapedSearchTitle = searchTitle.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    let trek = await Trek.findOne({ title: { $regex: new RegExp(escapedSearchTitle, 'i') } });
    if (!trek) {
      trek = await Trek.create({
        title: trekTitle,
        description: `Auto-generated trek entry for: ${trekTitle}`,
        loyaltyReward: 500,
        pricing: null, // auto-created treks have no pricing → all payments blocked
      });
    }

    // 2. Resolve the authoritative price from the DB.
    // If trek has no pricing configured, or the selected option is null, reject immediately.
    const p = trek.pricing;
    let amount: number | null = null;

    if (p) {
      switch (paymentOption) {
        case 'registration':
          amount = p.registrationFee;        // always a number when pricing exists
          break;
        case 'fullWithTransport':
          amount = p.totalCostWithTransport; // number | null
          break;
        case 'fullWithoutTransport':
          amount = p.totalCostWithoutTransport;
          break;
        case 'remainingWithTransport':
          amount = p.remainingAmountWithTransport;
          break;
        case 'remainingWithoutTransport':
          amount = p.remainingAmountWithoutTransport;
          break;
      }
    }

    // TypeScript type guard: after this check, `amount` is narrowed to `number`
    if (amount === null) {
      res.status(400).json({
        message: 'This payment option is not available for this trek. Please select a valid option.',
      });
      return;
    }

    // 3. Block re-booking a Completed trek; reuse a Pending booking; allow fresh booking after Cancellation.
    let booking = await Booking.findOne({
      userId,
      trekId: trek._id,
      status: { $in: ['Pending', 'Completed'] },
    });

    if (booking?.status === 'Completed') {
      res.status(409).json({ message: 'You have already completed this trek and cannot book it again.' });
      return;
    }

    if (!booking) {
      try {
        booking = await Booking.create({
          userId,
          trekId: trek._id,
          status: 'Pending',
        });
      } catch (createError: any) {
        if (createError?.code === 11000) {
          res.status(409).json({ message: 'You already have an active booking for this trek.' });
          return;
        }
        throw createError;
      }
    }

    // 4. Prepare parameters for PayU using the server-resolved amount.
    const key = process.env.PAYU_MERCHANT_KEY;
    const salt = process.env.PAYU_MERCHANT_SALT;
    if (!key || !salt) {
      console.error('[initiatePayment] PAYU_MERCHANT_KEY or PAYU_MERCHANT_SALT not configured.');
      res.status(500).json({ message: 'Payment system is not configured. Please contact support.' });
      return;
    }

    // txnid must be unique per PayU attempt — append a timestamp so retries don't collide.
    const txnid = `${booking._id.toString()}-${Date.now()}`;
    const productinfo = trekTitle.replace(/[^a-zA-Z0-9 ]/g, '').substring(0, 80);
    const firstname = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '') || 'customer';
    const surl = `${process.env.BACKEND_URL}/api/payments/payu-callback`;
    const furl = surl;

    // Hash formula: sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT)
    const hashString = `${key}|${txnid}|${amount.toFixed(2)}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

    res.status(200).json({
      key,
      txnid,
      amount: amount.toFixed(2),
      productinfo,
      firstname,
      email,
      hash,
      surl,
      furl,
      actionUrl: process.env.PAYU_ACTION_URL || 'https://test.payu.in/_payment',
    });
  } catch (error) {
    console.error('[initiatePayment]', error);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};

/**
 * POST /api/payments/payu-callback
 * PayU Webhook / Callback endpoint:
 * 1. Verifies the SHA-512 signature hash to prevent tampering.
 * 2. If status is 'success', sets the Booking status to 'Completed'.
 * 3. Triggers processCompletedTrek() to award loyalty points.
 * 4. Redirects the user's browser back to the frontend profile page.
 */
export const payuCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, txnid, hash, amount, productinfo, firstname, email } = req.body;
    
    if (!status || !txnid || !hash) {
      res.status(400).send('Invalid callback parameters.');
      return;
    }

    const key = process.env.PAYU_MERCHANT_KEY;
    const salt = process.env.PAYU_MERCHANT_SALT;

    // If PayU credentials are missing, reject loudly — do not process with broken credentials.
    if (!key || !salt) {
      console.error('[payuCallback] PAYU_MERCHANT_KEY or PAYU_MERCHANT_SALT not configured.');
      res.status(500).send('Payment system configuration error.');
      return;
    }

    // Default missing fields to empty strings for hash verification
    const statusVal = status || '';
    const emailVal = email || '';
    const firstnameVal = firstname || '';
    const productinfoVal = productinfo || '';
    const amountVal = amount || '';
    const txnidVal = txnid || '';

    // If additionalcharges exists, use it at the beginning of the hash formula
    const additionalChargesVal = req.body.additionalCharges || req.body.additionalcharges;
    let calculatedHashString = '';
    if (additionalChargesVal) {
      calculatedHashString = `${additionalChargesVal}|${salt}|${statusVal}|||||||||||${emailVal}|${firstnameVal}|${productinfoVal}|${amountVal}|${txnidVal}|${key}`;
    } else {
      calculatedHashString = `${salt}|${statusVal}|||||||||||${emailVal}|${firstnameVal}|${productinfoVal}|${amountVal}|${txnidVal}|${key}`;
    }
    
    const calculatedHash = crypto.createHash('sha512').update(calculatedHashString).digest('hex');

    // Log the callback details to a file in the workspace for debugging
    try {
      const fs = require('fs');
      const path = require('path');
      const logFilePath = path.join(__dirname, '../../payment-logs.txt');
      const logData = {
        timestamp: new Date().toISOString(),
        body: req.body,
        calculatedHash,
        hashMatches: calculatedHash.toLowerCase() === hash.toLowerCase()
      };
      fs.appendFileSync(logFilePath, JSON.stringify(logData, null, 2) + '\n\n');
    } catch (logErr) {
      console.error('Failed to write payment log:', logErr);
    }

    // Strictly enforce hash verification on success to prevent fraud.
    // On failure/canceled transactions, we log warnings but allow the user to be redirected back
    // to the website with ?payment=failure, rather than leaving them stuck on PayU's error page.
    if (statusVal === 'success') {
      if (calculatedHash.toLowerCase() !== hash.toLowerCase()) {
        console.error('PayU hash verification failed for successful payment!', { calculated: calculatedHash, received: hash });
        res.status(400).send('Hash verification failed.');
        return;
      }

      // txnid is "bookingId-timestamp" — strip the timestamp suffix to get the real booking ID.
      const bookingId = txnidVal.includes('-') ? txnidVal.substring(0, 24) : txnidVal;
      const booking = await Booking.findById(bookingId);
      if (booking) {
        const wasAlreadyCompleted = booking.status === 'Completed';
        if (!wasAlreadyCompleted) {
          booking.status = 'Completed';
          await booking.save();
          
          // Award loyalty points & update rank
          await processCompletedTrek(booking.userId, booking.trekId);
        }
      }
    } else {
      // Log the payment failure details for auditing
      console.warn(`PayU payment callback reported status: ${statusVal} for txnid: ${txnidVal}. Hash matches: ${calculatedHash.toLowerCase() === hash.toLowerCase()}`);
    }

    // Redirect user back to profile page with payment status query param
    const redirectStatus = statusVal === 'success' ? 'success' : 'failure';
    const redirectUrl = process.env.FRONTEND_URL 
      ? `${process.env.FRONTEND_URL}/profile?payment=${redirectStatus}`
      : `/profile?payment=${redirectStatus}`;

    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Error in PayU callback:', error);
    res.status(500).send('Internal server error processing payment.');
  }
};
