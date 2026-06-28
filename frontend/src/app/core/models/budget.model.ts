import { Tag } from './tag.model';

export interface Budget {
  id: number;
  value: number;
  tag: Tag;
}

export interface BudgetStatus {
  budget: Budget;
  spent: number;
  remaining: number;
  percentage: number;
  over: boolean;
}
