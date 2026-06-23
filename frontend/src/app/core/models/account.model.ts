export type MovementType = 'INCOME' | 'EXPENSE' | 'BOTH';

export interface Account {
  id: number;
  number: string;
  name: string;
  description: string;
  balance: number;
  bankId: string;
  movementType: MovementType;
  saving: boolean;
  savingTarget: number | null;
  savingStartDate: string | null;
  savingStartBalance: number | null;
}
