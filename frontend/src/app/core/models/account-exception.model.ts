export interface AccountException {
  id: number;
  accountId: number;
  regex: string;
  description: string | null;
  createdAt: string;
}
