export type StillWantedOption =
  | 'yes'
  | 'probably'
  | 'dont_care'
  | 'why_did_i';

export interface Reflection {
  id: string;
  orderId: string;
  createdAt: string; // ISO 8601 string
  stillWanted: StillWantedOption;
  wouldBuyReal: boolean;
  reason?: string;
}
