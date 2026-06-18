export interface Account {
  id: number;
  number: string;
  name: string;
  description: string;
  balance: number;
  bankId: string;
  saving: boolean;
  savingTarget: number | null;
  savingStartDate: string | null;
  savingStartBalance: number | null;
}
