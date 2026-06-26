export interface Recurrent {
  id: number;
  name: string;
  amount: number;
  establishment: string;
  periodicity: number | null;
  periodicityType: string;
  periodicityMonth: number | null;
  link: string | null;
  nextPredictedDate: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface RecurrentPriceEntry {
  id: number;
  amount: number;
  recordedAt: string;
}

export interface RecurrentLink {
  recurrentId: number;
  transactionId: number;
  name: string;
  establishment: string;
  amountSnapshot: number;
  transactionDate?: string;
  transactionAmount?: number;
}
