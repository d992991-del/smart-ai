
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

export interface BankAccount {
  id: string;
  name: string;
  type: 'Checking' | 'Savings' | 'Credit Card' | 'Investment';
  balance: number;
  lastUpdated: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  categoryId: string;
  amount: number;
  date: string;
  description: string;
  type: TransactionType;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
}

export interface AppState {
  accounts: BankAccount[];
  transactions: Transaction[];
  categories: Category[];
  isDemoMode: boolean;
  user: User | null;
}
