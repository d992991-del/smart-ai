
import { Category, TransactionType, BankAccount, Transaction } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: '薪資', icon: 'fa-money-bill-wave', color: 'bg-green-500', type: TransactionType.INCOME },
  { id: '2', name: '獎金', icon: 'fa-gift', color: 'bg-emerald-500', type: TransactionType.INCOME },
  { id: '3', name: '投資收益', icon: 'fa-chart-line', color: 'bg-teal-500', type: TransactionType.INCOME },
  { id: '4', name: '餐飲', icon: 'fa-utensils', color: 'bg-orange-500', type: TransactionType.EXPENSE },
  { id: '5', name: '交通', icon: 'fa-bus', color: 'bg-blue-500', type: TransactionType.EXPENSE },
  { id: '6', name: '購物', icon: 'fa-shopping-bag', color: 'bg-pink-500', type: TransactionType.EXPENSE },
  { id: '7', name: '娛樂', icon: 'fa-gamepad', color: 'bg-purple-500', type: TransactionType.EXPENSE },
  { id: '8', name: '住房', icon: 'fa-home', color: 'bg-indigo-500', type: TransactionType.EXPENSE },
  { id: '9', name: '醫療', icon: 'fa-heartbeat', color: 'bg-red-500', type: TransactionType.EXPENSE },
  { id: '10', name: '教育', icon: 'fa-book', color: 'bg-cyan-500', type: TransactionType.EXPENSE },
];

export const DEMO_ACCOUNTS: BankAccount[] = [
  { id: 'acc1', name: '國泰世華 主帳戶', type: 'Checking', balance: 125000, lastUpdated: new Date().toISOString() },
  { id: 'acc2', name: '台新 Richart', type: 'Savings', balance: 50000, lastUpdated: new Date().toISOString() },
  { id: 'acc3', name: '玉山 Pi 卡', type: 'Credit Card', balance: -12500, lastUpdated: new Date().toISOString() },
];

export const DEMO_TRANSACTIONS: Transaction[] = [
  { id: 't1', accountId: 'acc1', categoryId: '1', amount: 65000, date: '2024-03-01', description: '3月薪資', type: TransactionType.INCOME },
  { id: 't2', accountId: 'acc1', categoryId: '4', amount: 150, date: '2024-03-02', description: '午餐', type: TransactionType.EXPENSE },
  { id: 't3', accountId: 'acc3', categoryId: '6', amount: 2500, date: '2024-03-03', description: 'Uniqlo 衣物', type: TransactionType.EXPENSE },
  { id: 't4', accountId: 'acc2', categoryId: '3', amount: 1200, date: '2024-03-05', description: '股息收入', type: TransactionType.INCOME },
  { id: 't5', accountId: 'acc1', categoryId: '5', amount: 1280, date: '2024-03-05', description: '定期票', type: TransactionType.EXPENSE },
];
