
import React, { useMemo } from 'react';
import { AppState, TransactionType } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface DashboardProps {
  state: AppState;
}

const Dashboard: React.FC<DashboardProps> = ({ state }) => {
  const { accounts, transactions, categories } = state;

  const totalBalance = useMemo(() => 
    accounts.reduce((sum, acc) => sum + acc.balance, 0), [accounts]);

  const monthlyStats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return transactions.reduce((acc, t) => {
      const tDate = new Date(t.date);
      if (tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear) {
        if (t.type === TransactionType.INCOME) acc.income += t.amount;
        else acc.expense += t.amount;
      }
      return acc;
    }, { income: 0, expense: 0 });
  }, [transactions]);

  const categoryData = useMemo(() => {
    const expenseMap: Record<string, number> = {};
    transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .forEach(t => {
        const cat = categories.find(c => c.id === t.categoryId)?.name || '其他';
        expenseMap[cat] = (expenseMap[cat] || 0) + t.amount;
      });

    return Object.entries(expenseMap).map(([name, value]) => ({ name, value }));
  }, [transactions, categories]);

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#06b6d4'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">歡迎回來！</h1>
          <p className="text-slate-500">這是您目前的財務狀況摘要</p>
        </div>
        <div className="flex items-center space-x-2 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
           <i className="fas fa-calendar text-indigo-500 ml-2"></i>
           <span className="text-sm font-medium text-slate-600">{new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: 'long' })}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 text-sm font-medium">總資產淨值</span>
            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
              <i className="fas fa-wallet"></i>
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">NT$ {totalBalance.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 text-sm font-medium">本月總收入</span>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
              <i className="fas fa-hand-holding-usd"></i>
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">NT$ {monthlyStats.income.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 text-sm font-medium">本月總支出</span>
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
              <i className="fas fa-shopping-cart"></i>
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">NT$ {monthlyStats.expense.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">支出分類統計</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <h3 className="text-lg font-bold text-slate-800 mb-6">最近交易</h3>
           <div className="space-y-4">
             {transactions.slice(0, 5).map(t => {
               const cat = categories.find(c => c.id === t.categoryId);
               return (
                 <div key={t.id} className="flex items-center justify-between">
                   <div className="flex items-center space-x-3">
                     <div className={`w-10 h-10 rounded-full ${cat?.color || 'bg-slate-200'} flex items-center justify-center text-white`}>
                       <i className={`fas ${cat?.icon || 'fa-tag'}`}></i>
                     </div>
                     <div>
                       <p className="text-sm font-semibold text-slate-900">{t.description}</p>
                       <p className="text-xs text-slate-500">{t.date} · {cat?.name}</p>
                     </div>
                   </div>
                   <p className={`text-sm font-bold ${t.type === TransactionType.INCOME ? 'text-green-600' : 'text-slate-900'}`}>
                     {t.type === TransactionType.INCOME ? '+' : '-'} {t.amount.toLocaleString()}
                   </p>
                 </div>
               );
             })}
             {transactions.length === 0 && <p className="text-center text-slate-400 py-10">尚無交易紀錄</p>}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
