export type PaymentLinks = {
  fullPaymentWithTransport: string;
  fullPaymentWithoutTransport: string;
  registrationOnly: string;
  remainingDuesWithTransport: string;
  remainingDuesWithoutTransport: string;
}

export type PricingDetails = {
  trekFee: number;
  transportationFee: number | string;
  totalCostWithTransport: number | string;
  totalCostWithoutTransport: number | string;
  registrationFee: number;
  remainingAmountWithTransport: number | string;
  remainingAmountWithoutTransport: number | string;
  paymentDeadline: string;
  /** Original price before discount (shown with strikethrough in pricing card and cost breakdown) */
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
  videoCoverImage?: string;
  transportationRoute?: string;
  registrationLink?: string; // For direct registration (non-modal booking)
  /** Highlight as "All girls trip" */
  allGirlsTrip?: boolean;
  /** Special package note (e.g. "Pilani to Pilani - call for details") */
  specialPackageNote?: string;
  specialPackagePhone?: string;
  /** Time-limited special offer — when active replaces the displayed price */
  specialOffer?: {
    label: string;
    originalPrice: number;
    offerPrice: number;
    /** IST date on which this offer is valid (month is 1-indexed) */
    validOn: { month: number; day: number };
  };
}

