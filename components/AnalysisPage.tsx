
import React, { useState, useEffect } from 'react';
import { AppState } from '../types';
import { getFinancialAdvice } from '../services/geminiService';

interface AnalysisPageProps {
  state: AppState;
}

const AnalysisPage: React.FC<AnalysisPageProps> = ({ state }) => {
  const [advice, setAdvice] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchAdvice = async () => {
    setIsLoading(true);
    try {
      const res = await getFinancialAdvice(state.transactions, state.accounts, state.categories);
      setAdvice(res);
    } catch (e) {
      setAdvice("抱歉，目前無法取得分析建議。");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (state.transactions.length > 0 && advice === '') {
      fetchAdvice();
    }
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">AI 智能分析報表</h1>
        <p className="text-slate-500">結合 Gemini AI 的深層財務洞察與理財建議</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Data Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">本期收支速覽</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-sm">交易總數</span>
                <span className="font-bold text-slate-900">{state.transactions.length} 筆</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-sm">平均單筆支出</span>
                <span className="font-bold text-slate-900">
                  NT$ {(state.transactions.filter(t => t.type === 'EXPENSE').reduce((s, x) => s + x.amount, 0) / Math.max(state.transactions.filter(t => t.type === 'EXPENSE').length, 1)).toFixed(0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-sm">收支平衡狀態</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">健康良好</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-2xl shadow-lg text-white">
            <h3 className="font-bold mb-2">想要更精準的建議？</h3>
            <p className="text-sm text-indigo-100 mb-4">持續記錄日常開銷，AI 能更了解您的消費習慣。</p>
            <button 
              onClick={fetchAdvice}
              disabled={isLoading}
              className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 py-2 rounded-lg font-bold transition flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>AI 分析中...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-sync-alt"></i>
                  <span>重新生成建議</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: AI Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 min-h-[400px]">
            <div className="p-4 border-b border-slate-50 flex items-center space-x-2 text-indigo-600 font-bold">
              <i className="fas fa-magic"></i>
              <span>Gemini 理財顧問</span>
            </div>
            
            <div className="p-8">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  <p className="text-slate-400 font-medium">正在深入剖析您的財務數據...</p>
                </div>
              ) : advice ? (
                <div className="prose prose-slate max-w-none">
                   {/* Simple markdown-style rendering using custom styling */}
                   <div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-lg">
                     {advice}
                   </div>
                </div>
              ) : (
                <div className="text-center py-20 text-slate-400">
                   <p>點擊按鈕，啟動 AI 財務顧問為您進行深度分析。</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
