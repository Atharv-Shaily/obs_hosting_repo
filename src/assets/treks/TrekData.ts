export type PaymentLinks = {
  fullPaymentWithTransport: string;
  fullPaymentWithoutTransport: string;
  registrationOnly: string;
  remainingDuesWithTransport: string;
  remainingDuesWithoutTransport: string;
}

export type PricingDetails = {
  trekFee: number;
  transportationFee: number;
  totalCostWithTransport: number;
  totalCostWithoutTransport: number;
  registrationFee: number;
  remainingAmountWithTransport: number;
  remainingAmountWithoutTransport: number;
  paymentDeadline: string;
  /** Original price before discount (e.g. for early-bird display) */
  originalPrice?: number;
  /** Number of seats left at discounted price (e.g. "Only 2 seats left") */
  earlyBirdSeatsLeft?: number;
}

export type TrekData = {
  id: string;
  title: string;
  date: string;
  duration: string;
  difficulty: string;
  location: string;
  images: string[];
  /** Optional – omit for treks without a brochure (e.g. Kerala) */
  brochure?: string;
  description: string;
  highlights: string[];
  itinerary: Array<{
    day: string;
    title: string;
    description: string;
    type: string;
  }>;
  inclusions: string[];
  exclusions: string[];
  pricing: PricingDetails;
  paymentLinks: PaymentLinks;
  cancellationPolicy: Array<{
    period: string;
    fee: string;
    refund: string;
  }>;
  videoUrl?: string;
  transportationRoute?: string;
  registrationLink?: string; // For direct registration (non-modal booking)
  /** Highlight as "All girls trip" */
  allGirlsTrip?: boolean;
  /** Special package note (e.g. "Pilani to Pilani - call for details") */
  specialPackageNote?: string;
  specialPackagePhone?: string;
}

