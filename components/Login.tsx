
import React, { useState } from 'react';
import { auth, isFirebaseEnabled } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

interface LoginProps {
  onLogin: (email: string) => void;
  isDemoMode: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, isDemoMode }) => {
  const [email, setEmail] = useState('demo@smartfinance.ai');
  const [password, setPassword] = useState('password123');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return alert("請輸入電子郵件與密碼");

    setLoading(true);
    try {
      if (isFirebaseEnabled() && auth) {
        // 正式模式：使用 Firebase
        if (isRegistering) {
          await createUserWithEmailAndPassword(auth, email, password);
        } else {
          await signInWithEmailAndPassword(auth, email, password);
        }
      } else {
        // 展示模式：直接回傳
        onLogin(email);
      }
    } catch (error: any) {
      alert(`錯誤: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        <div className="p-8">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl">
              <i className="fas fa-coins"></i>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">
            {isRegistering ? '註冊新帳號' : '歡迎回來 SmartFinance'}
          </h2>
          <p className="text-center text-slate-500 mb-8">
            {!isFirebaseEnabled() ? '【展示模式】請直接登入' : '請登入您的個人財務管理系統'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">電子郵件</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <i className="fas fa-envelope"></i>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="email@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">密碼</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <i className="fas fa-lock"></i>
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? '處理中...' : (isRegistering ? '註冊' : '登入')}
            </button>
          </form>

          <div className="mt-8 text-center space-y-4">
            <p className="text-sm text-slate-600">
              {isRegistering ? '已經有帳號了？' : '還沒有帳號嗎？'}
              <button 
                onClick={() => setIsRegistering(!isRegistering)}
                className="ml-1 text-indigo-600 font-semibold hover:underline"
              >
                {isRegistering ? '立即登入' : '立即註冊'}
              </button>
            </p>
            <div className="pt-4 border-t border-slate-100">
               {!isFirebaseEnabled() && <p className="text-xs text-amber-600 font-medium">⚠️ 目前處於離線展示模式</p>}
               <p className="text-xs text-slate-400 mt-1">預設展示帳號：demo@smartfinance.ai / password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
