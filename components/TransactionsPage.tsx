
import React, { useState } from 'react';
import { AppState, Transaction, TransactionType } from '../types';

interface TransactionsPageProps {
  state: AppState;
  onAdd: (t: Omit<Transaction, 'id'>) => void;
  onDelete: (id: string) => void;
}

const TransactionsPage: React.FC<TransactionsPageProps> = ({ state, onAdd, onDelete }) => {
  const { transactions, accounts, categories } = state;
  const [isAdding, setIsAdding] = useState(false);
  const [newT, setNewT] = useState<Omit<Transaction, 'id'>>({
    accountId: accounts[0]?.id || '',
    categoryId: categories[0]?.id || '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    description: '',
    type: TransactionType.EXPENSE
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newT.accountId || !newT.categoryId) {
      alert("請先建立帳戶與分類");
      return;
    }
    onAdd(newT);
    setNewT({
      accountId: accounts[0]?.id || '',
      categoryId: categories[0]?.id || '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      description: '',
      type: TransactionType.EXPENSE
    });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">收支明細</h1>
          <p className="text-slate-500">記錄您的每一筆日常收支</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
        >
          <i className="fas fa-plus mr-2"></i> 記一筆
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100">
          <h3 className="text-lg font-bold mb-4">記帳</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">類型</label>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button 
                  type="button"
                  onClick={() => setNewT({...newT, type: TransactionType.EXPENSE})}
                  className={`flex-1 py-1.5 text-sm font-bold rounded-md transition ${newT.type === TransactionType.EXPENSE ? 'bg-white text-red-500 shadow-sm' : 'text-slate-500'}`}
                >支出</button>
                <button 
                  type="button"
                  onClick={() => setNewT({...newT, type: TransactionType.INCOME})}
                  className={`flex-1 py-1.5 text-sm font-bold rounded-md transition ${newT.type === TransactionType.INCOME ? 'bg-white text-green-500 shadow-sm' : 'text-slate-500'}`}
                >收入</button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">金額</label>
              <input 
                required
                type="number" 
                value={newT.amount}
                onChange={e => setNewT({...newT, amount: parseFloat(e.target.value)})}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">日期</label>
              <input 
                required
                type="date" 
                value={newT.date}
                onChange={e => setNewT({...newT, date: e.target.value})}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">分類</label>
              <select 
                value={newT.categoryId}
                onChange={e => setNewT({...newT, categoryId: e.target.value})}
                className="w-full p-2 border rounded-lg"
              >
                {categories.filter(c => c.type === newT.type).map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">支付帳戶</label>
              <select 
                value={newT.accountId}
                onChange={e => setNewT({...newT, accountId: e.target.value})}
                className="w-full p-2 border rounded-lg"
              >
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>{acc.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">描述</label>
              <input 
                type="text" 
                value={newT.description}
                onChange={e => setNewT({...newT, description: e.target.value})}
                className="w-full p-2 border rounded-lg"
                placeholder="備註..."
              />
            </div>
            <div className="md:col-span-2 lg:col-span-3 flex justify-end space-x-2 pt-2">
              <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold">取消</button>
              <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold">儲存紀錄</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">日期</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">分類</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">描述</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">帳戶</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">金額</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center w-16"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.map(t => {
              const cat = categories.find(c => c.id === t.categoryId);
              const acc = accounts.find(a => a.id === t.accountId);
              return (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 text-sm text-slate-500">{t.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className={`w-8 h-8 rounded-full ${cat?.color || 'bg-slate-200'} flex items-center justify-center text-white text-xs`}>
                        <i className={`fas ${cat?.icon || 'fa-tag'}`}></i>
                      </div>
                      <span className="text-sm font-medium text-slate-700">{cat?.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">{t.description}</td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-500">{acc?.name}</td>
                  <td className={`px-6 py-4 text-sm font-bold text-right ${t.type === TransactionType.INCOME ? 'text-green-600' : 'text-slate-900'}`}>
                    {t.type === TransactionType.INCOME ? '+' : '-'} {t.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => onDelete(t.id)}
                      className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                    >
                      <i className="fas fa-trash text-sm"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">目前尚無收支明細</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsPage;
