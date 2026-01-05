
import React, { useState } from 'react';
import { BankAccount } from '../types';

interface AccountsPageProps {
  accounts: BankAccount[];
  onAdd: (acc: Omit<BankAccount, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<BankAccount>) => void;
  onDelete: (id: string) => void;
}

const AccountsPage: React.FC<AccountsPageProps> = ({ accounts, onAdd, onUpdate, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newAcc, setNewAcc] = useState<Omit<BankAccount, 'id'>>({
    name: '',
    type: 'Checking',
    balance: 0,
    lastUpdated: new Date().toISOString()
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(newAcc);
    setNewAcc({ name: '', type: 'Checking', balance: 0, lastUpdated: new Date().toISOString() });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">銀行帳戶管理</h1>
          <p className="text-slate-500">管理您的銀行存款、儲蓄與信用卡帳戶</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
        >
          <i className="fas fa-plus mr-2"></i> 新增帳戶
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold mb-4">新增帳戶</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">帳戶名稱</label>
              <input 
                required
                type="text" 
                value={newAcc.name}
                onChange={e => setNewAcc({...newAcc, name: e.target.value})}
                className="w-full p-2 border rounded-lg"
                placeholder="例如：國泰世華 主帳戶"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">類型</label>
              <select 
                value={newAcc.type}
                onChange={e => setNewAcc({...newAcc, type: e.target.value as any})}
                className="w-full p-2 border rounded-lg"
              >
                <option value="Checking">一般帳戶 (Checking)</option>
                <option value="Savings">儲蓄帳戶 (Savings)</option>
                <option value="Credit Card">信用卡 (Credit Card)</option>
                <option value="Investment">投資帳戶 (Investment)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">初始餘額</label>
              <input 
                required
                type="number" 
                value={newAcc.balance}
                onChange={e => setNewAcc({...newAcc, balance: parseFloat(e.target.value)})}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div className="flex items-end space-x-2">
              <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-bold">儲存</button>
              <button type="button" onClick={() => setIsAdding(false)} className="flex-1 bg-slate-100 text-slate-600 py-2 rounded-lg font-bold">取消</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map(acc => (
          <div key={acc.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative group">
            <button 
              onClick={() => onDelete(acc.id)}
              className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
            >
              <i className="fas fa-trash"></i>
            </button>
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl ${
                acc.type === 'Credit Card' ? 'bg-purple-500' : 
                acc.type === 'Savings' ? 'bg-emerald-500' : 'bg-indigo-500'
              }`}>
                <i className={`fas ${
                  acc.type === 'Credit Card' ? 'fa-credit-card' : 
                  acc.type === 'Savings' ? 'fa-piggy-bank' : 'fa-university'
                }`}></i>
              </div>
              <div>
                <h3 className="font-bold text-slate-800">{acc.name}</h3>
                <span className="text-xs text-slate-400 px-2 py-0.5 bg-slate-100 rounded-full">{acc.type}</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-slate-500 text-sm">當前餘額</p>
              <p className={`text-2xl font-bold ${acc.balance < 0 ? 'text-red-500' : 'text-slate-900'}`}>
                NT$ {acc.balance.toLocaleString()}
              </p>
            </div>
            <p className="mt-4 text-[10px] text-slate-300">最後更新：{new Date(acc.lastUpdated).toLocaleString()}</p>
          </div>
        ))}
        {accounts.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-400">目前沒有帳戶，請點擊右上角新增。</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountsPage;
