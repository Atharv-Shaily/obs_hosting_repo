import React, { useState } from 'react';
import { Modal, Radio, Space, Typography, Button, Divider, Card, Row, Col, Alert } from 'antd';
import { CheckCircleOutlined, WalletOutlined, CreditCardOutlined } from '@ant-design/icons';
import { useDarkMode } from '../contexts/DarkModeContext';
import type { PricingDetails } from '../assets/treks/TrekData';
import { api } from '../api/axios';
import '../styles/components/BookingModal.less';

const { Title, Text, Paragraph } = Typography;

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  trekTitle: string;
  pricing: PricingDetails;
  transportationRoute?: string;
}

const BookingModal: React.FC<BookingModalProps> = ({ 
  open, 
  onClose, 
  trekTitle, 
  pricing, 
  transportationRoute = 'Transportation included'
}) => {
  const { isDarkMode } = useDarkMode();
  const [alreadyPaidRegistration, setAlreadyPaidRegistration] = useState<boolean>(false);
  
  const hasWithTransport = pricing.totalCostWithTransport > 0;
  const hasWithoutTransport = pricing.totalCostWithoutTransport > 0;

  const [withTransportation, setWithTransportation] = useState<boolean>(hasWithTransport);
  const [paymentType, setPaymentType] = useState<'full' | 'registration'>('registration');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Synchronize withTransportation when modal opens or pricing changes
  React.useEffect(() => {
    if (open) {
      setWithTransportation(pricing.totalCostWithTransport > 0);
    }
  }, [open, pricing]);

  // Derive the display amount from user selections (for UI display only — not sent to server)
  const calculatedAmount = (() => {
    if (alreadyPaidRegistration) {
      return withTransportation
        ? pricing.remainingAmountWithTransport
        : pricing.remainingAmountWithoutTransport;
    }
    if (paymentType === 'full') {
      return withTransportation
        ? pricing.totalCostWithTransport
        : pricing.totalCostWithoutTransport;
    }
    return pricing.registrationFee;
  })();

  /**
   * Maps user selections to one of the 5 server-recognised paymentOption keys.
   * The server resolves this key to the real INR price from the Trek DB record.
   * The client never sends a raw amount — this eliminates the price-tampering risk.
   */
  const getPaymentOption = (): string => {
    if (alreadyPaidRegistration) {
      return withTransportation ? 'remainingWithTransport' : 'remainingWithoutTransport';
    }
    if (paymentType === 'full') {
      return withTransportation ? 'fullWithTransport' : 'fullWithoutTransport';
    }
    return 'registration';
  };

  const handleBookNow = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      // Send only the intent (which option the user chose) — never the price.
      // The server resolves the real INR amount from the Trek DB record.
      const data = await api.post<{
        key: string;
        txnid: string;
        amount: string;
        productinfo: string;
        firstname: string;
        email: string;
        hash: string;
        surl: string;
        furl: string;
        actionUrl: string;
      }>('/api/payments/initiate', {
        trekTitle,
        paymentOption: getPaymentOption(),
      });

      // Dynamically submit the form to PayU
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = data.actionUrl;

      const fields = {
        key: data.key,
        txnid: data.txnid,
        amount: data.amount,
        productinfo: data.productinfo,
        firstname: data.firstname,
        email: data.email,
        hash: data.hash,
        surl: data.surl,
        furl: data.furl,
      };

      Object.entries(fields).forEach(([name, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
      
      onClose();
    } catch (err: any) {
      console.error('Payment initiation failed:', err);
      setErrorMsg(err?.message || 'Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAlreadyPaidRegistration(false);
    setWithTransportation(pricing.totalCostWithTransport > 0);
    setPaymentType('registration');
    setErrorMsg(null);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
      centered
      className={`booking-modal ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
      afterClose={handleReset}
    >
      <div className="booking-modal-content">
        {/* Header */}
        <div className="modal-header">
          <CreditCardOutlined className="header-icon" />
          <Title level={3} style={{ margin: 0 }}>
            Customize Your Trek Plan
          </Title>
          <Paragraph style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
            {trekTitle}
          </Paragraph>
        </div>

        <Divider />

        {/* Registration Status */}
        <div className="form-section">
          <div className="section-label">
            <Text strong style={{ fontSize: '16px' }}>
              Registration Status
            </Text>
          </div>
          <Radio.Group
            value={alreadyPaidRegistration}
            onChange={(e) => setAlreadyPaidRegistration(e.target.value)}
            className="custom-radio-group"
          >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Radio value={false} className="custom-radio">
                <div className="radio-content">
                  <Text strong>Haven't Paid Registration Yet</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '13px' }}>
                    I'm booking for the first time
                  </Text>
                </div>
              </Radio>
              <Radio value={true} className="custom-radio">
                <div className="radio-content">
                  <Text strong>Already Paid Registration Fees</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '13px' }}>
                    I've paid ₹{pricing.registrationFee} earlier
                  </Text>
                </div>
              </Radio>
            </Space>
          </Radio.Group>
        </div>

        <Divider />

        {/* Transportation Preference */}
        <div className="form-section">
          <div className="section-label">
            <Text strong style={{ fontSize: '16px' }}>
              Transportation Preference
            </Text>
          </div>
          <Radio.Group
            value={withTransportation}
            onChange={(e) => setWithTransportation(e.target.value)}
            className="custom-radio-group"
          >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Radio value={true} className="custom-radio" disabled={!hasWithTransport}>
                <div className="radio-content">
                  <Text strong style={{ color: !hasWithTransport ? 'rgba(0, 0, 0, 0.25)' : undefined }}>
                    With Transportation
                  </Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '13px' }}>
                    {hasWithTransport 
                      ? `${transportationRoute} (+₹${pricing.transportationFee})`
                      : 'Not available for this trek'}
                  </Text>
                </div>
              </Radio>
              <Radio value={false} className="custom-radio" disabled={!hasWithoutTransport}>
                <div className="radio-content">
                  <Text strong style={{ color: !hasWithoutTransport ? 'rgba(0, 0, 0, 0.25)' : undefined }}>
                    Without Transportation
                  </Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '13px' }}>
                    {hasWithoutTransport 
                      ? "I'll arrange my own transport"
                      : 'Transportation is bundled with this trek'}
                  </Text>
                </div>
              </Radio>
            </Space>
          </Radio.Group>
        </div>

        {/* Payment Type - Only show if registration not paid */}
        {!alreadyPaidRegistration && (
          <>
            <Divider />
            <div className="form-section">
              <div className="section-label">
                <Text strong style={{ fontSize: '16px' }}>
                  Payment Option
                </Text>
              </div>
              <Radio.Group
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                className="custom-radio-group"
              >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Radio value="registration" className="custom-radio">
                    <div className="radio-content">
                      <Text strong>Just Book Slot for Now</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '13px' }}>
                        Pay ₹{pricing.registrationFee} now, rest before {pricing.paymentDeadline}
                      </Text>
                    </div>
                  </Radio>
                  <Radio value="full" className="custom-radio">
                    <div className="radio-content">
                      <Text strong>Pay Full Amount</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '13px' }}>
                        Complete payment in one go
                      </Text>
                    </div>
                  </Radio>
                </Space>
              </Radio.Group>
            </div>
          </>
        )}

        <Divider />

        {/* Amount Summary */}
        <Card 
          className={`amount-summary-card ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
          style={{ marginBottom: '20px' }}
        >
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <WalletOutlined style={{ fontSize: '24px', color: '#52c41a', marginRight: '8px' }} />
                  <Text strong style={{ fontSize: '16px' }}>
                    Amount to Pay:
                  </Text>
                </div>
                <Title level={2} style={{ margin: 0, color: '#52c41a' }}>
                  ₹{calculatedAmount.toLocaleString('en-IN')}
                </Title>
              </div>
            </Col>
            
            {/* Breakdown */}
            <Col span={24}>
              <div className={`amount-breakdown ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
                {alreadyPaidRegistration ? (
                  <Alert
                    message="Remaining Dues"
                    description={
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Text>Total Cost:</Text>
                          <Text strong>
                            ₹{withTransportation 
                              ? pricing.totalCostWithTransport 
                              : pricing.totalCostWithoutTransport}
                          </Text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Text>Already Paid:</Text>
                          <Text type="success" strong>-₹{pricing.registrationFee}</Text>
                        </div>
                        <Divider style={{ margin: '8px 0' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Text strong>Remaining:</Text>
                          <Text strong style={{ fontSize: '16px', color: '#52c41a' }}>
                            ₹{calculatedAmount.toLocaleString('en-IN')}
                          </Text>
                        </div>
                      </Space>
                    }
                    type="info"
                    showIcon
                    icon={<CheckCircleOutlined />}
                  />
                ) : (
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    {paymentType === 'full' ? (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Text>Trek Fee:</Text>
                          <Text>₹{pricing.trekFee.toLocaleString('en-IN')}</Text>
                        </div>
                        {withTransportation && (
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text>Transportation:</Text>
                            <Text>₹{pricing.transportationFee.toLocaleString('en-IN')}</Text>
                          </div>
                        )}
                        <Divider style={{ margin: '8px 0' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Text strong>Total Amount:</Text>
                          <Text strong style={{ fontSize: '16px', color: '#52c41a' }}>
                            ₹{calculatedAmount.toLocaleString('en-IN')}
                          </Text>
                        </div>
                      </>
                    ) : (
                      <>
                        <Alert
                          message="Registration Fee"
                          description={`Secure your spot now with ₹${pricing.registrationFee}. Pay the remaining amount before ${pricing.paymentDeadline}.`}
                          type="success"
                          showIcon
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                          <Text type="secondary">Remaining to pay later:</Text>
                          <Text type="secondary">
                            ₹{(withTransportation 
                              ? pricing.remainingAmountWithTransport 
                              : pricing.remainingAmountWithoutTransport).toLocaleString('en-IN')}
                          </Text>
                        </div>
                      </>
                    )}
                  </Space>
                )}
              </div>
            </Col>
          </Row>
        </Card>

        {errorMsg && (
          <Alert
            message="Payment Error"
            description={errorMsg}
            type="error"
            showIcon
            style={{ marginBottom: '16px' }}
          />
        )}

        {/* Action Buttons */}
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={12}>
            <Button
              size="large"
              block
              onClick={onClose}
              disabled={loading}
              style={{ height: '50px', fontSize: '16px' }}
            >
              Cancel
            </Button>
          </Col>
          <Col xs={24} sm={12}>
            <Button
              type="primary"
              size="large"
              block
              onClick={handleBookNow}
              loading={loading}
              style={{ 
                height: '50px', 
                fontSize: '16px',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #d4a574 0%, #b8941f 100%)',
                border: 'none'
              }}
              icon={<CreditCardOutlined />}
            >
              Proceed to Payment
            </Button>
          </Col>
        </Row>

        {/* Info Footer */}
        <div className="modal-footer-info">
          <Alert
            message="After Payment"
            description="You'll receive a confirmation email from Team OBS with the WhatsApp group link. Please join to stay updated!"
            type="info"
            showIcon
            style={{ marginTop: '16px' }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default BookingModal;

