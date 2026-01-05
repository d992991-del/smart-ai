
import React from 'react';
import { Category, TransactionType } from '../types';

interface SettingsPageProps {
  categories: Category[];
}

const SettingsPage: React.FC<SettingsPageProps> = ({ categories }) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">分類管理</h1>
        <p className="text-slate-500">自定義收支分類，讓記帳更有條理</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Income Categories */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center">
              <i className="fas fa-arrow-down text-green-500 mr-2"></i> 收入分類
            </h3>
            <button className="text-indigo-600 text-sm font-bold hover:underline">新增分類</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {categories.filter(c => c.type === TransactionType.INCOME).map(c => (
              <div key={c.id} className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className={`w-8 h-8 rounded-lg ${c.color} flex items-center justify-center text-white text-xs`}>
                  <i className={`fas ${c.icon}`}></i>
                </div>
                <span className="text-sm font-medium text-slate-700">{c.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Categories */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center">
              <i className="fas fa-arrow-up text-red-500 mr-2"></i> 支出分類
            </h3>
            <button className="text-indigo-600 text-sm font-bold hover:underline">新增分類</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {categories.filter(c => c.type === TransactionType.EXPENSE).map(c => (
              <div key={c.id} className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className={`w-8 h-8 rounded-lg ${c.color} flex items-center justify-center text-white text-xs`}>
                  <i className={`fas ${c.icon}`}></i>
                </div>
                <span className="text-sm font-medium text-slate-700">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-amber-800 text-sm">
        <p className="flex items-center">
          <i className="fas fa-info-circle mr-2"></i>
          分類編輯功能目前正在開發中。目前的分類清單是系統預設。
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;
