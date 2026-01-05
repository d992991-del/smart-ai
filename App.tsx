
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import AccountsPage from './components/AccountsPage';
import TransactionsPage from './components/TransactionsPage';
import AnalysisPage from './components/AnalysisPage';
import SettingsPage from './components/SettingsPage';
import { AppState, User, BankAccount, Transaction, TransactionType } from './types';
import { DEFAULT_CATEGORIES, DEMO_ACCOUNTS, DEMO_TRANSACTIONS } from './constants';
import { auth, db, isFirebaseEnabled } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('smart_finance_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...parsed, isDemoMode: parsed.isDemoMode ?? true };
      } catch (e) {
        console.error("載入本機數據失敗", e);
      }
    }
    return {
      accounts: DEMO_ACCOUNTS,
      transactions: DEMO_TRANSACTIONS,
      categories: DEFAULT_CATEGORIES,
      isDemoMode: true,
      user: null
    };
  });

  // 1. 監聽 Auth 狀態
  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const user: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User'
          };
          
          setState(prev => ({ ...prev, user, isDemoMode: false }));
          
          // 嘗試從 Firestore 載入數據
          if (db) {
            try {
              const docRef = doc(db, "user_data", firebaseUser.uid);
              const docSnap = await getDoc(docRef);
              if (docSnap.exists()) {
                const data = docSnap.data();
                setState(prev => ({
                  ...prev,
                  accounts: data.accounts || [],
                  transactions: data.transactions || [],
                }));
              }
            } catch (err) {
              console.error("Firestore 數據載入失敗", err);
            }
          }
        } else {
          // 如果沒有 Firebase 使用者且不在展示模式，則登出
          if (!state.isDemoMode) {
            setState(prev => ({ ...prev, user: null }));
          }
        }
      });
      return () => unsubscribe();
    }
  }, [state.isDemoMode]);

  // 2. 數據持久化 (Local + Firestore)
  useEffect(() => {
    localStorage.setItem('smart_finance_state', JSON.stringify(state));
    
    // 如果是正式模式且已登入，同步到 Firestore
    if (!state.isDemoMode && state.user && db) {
      const syncToCloud = async () => {
        try {
          await setDoc(doc(db, "user_data", state.user!.id), {
            accounts: state.accounts,
            transactions: state.transactions,
            updatedAt: new Date().toISOString()
          }, { merge: true });
        } catch (err) {
          console.error("Firestore 同步失敗", err);
        }
      };
      syncToCloud();
    }
  }, [state.accounts, state.transactions, state.isDemoMode, state.user]);

  const handleLogin = (email: string) => {
    if (state.isDemoMode) {
      setState(prev => ({
        ...prev,
        user: { id: 'demo_user', email, displayName: email.split('@')[0] }
      }));
    }
  };

  const handleLogout = async () => {
    if (auth) await signOut(auth);
    setState(prev => ({ ...prev, user: null }));
  };

  const handleToggleMode = () => {
    const nextMode = !state.isDemoMode;
    if (!nextMode && !isFirebaseEnabled()) {
      alert("環境變數中缺少 Firebase 設定，無法啟動正式模式。");
      return;
    }
    setState(prev => ({ ...prev, isDemoMode: nextMode, user: null }));
  };

  const addAccount = (acc: Omit<BankAccount, 'id'>) => {
    const newAcc = { ...acc, id: Math.random().toString(36).substr(2, 9) };
    setState(prev => ({ ...prev, accounts: [...prev.accounts, newAcc] }));
  };

  const updateAccount = (id: string, updates: Partial<BankAccount>) => {
    setState(prev => ({
      ...prev,
      accounts: prev.accounts.map(a => a.id === id ? { ...a, ...updates } : a)
    }));
  };

  const deleteAccount = (id: string) => {
    setState(prev => ({
      ...prev,
      accounts: prev.accounts.filter(a => a.id !== id),
      transactions: prev.transactions.filter(t => t.accountId !== id)
    }));
  };

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const newT = { ...t, id: Math.random().toString(36).substr(2, 9) };
    setState(prev => {
      const updatedAccounts = prev.accounts.map(acc => {
        if (acc.id === t.accountId) {
          const newBalance = t.type === TransactionType.INCOME 
            ? acc.balance + t.amount 
            : acc.balance - t.amount;
          return { ...acc, balance: newBalance };
        }
        return acc;
      });
      return {
        ...prev,
        accounts: updatedAccounts,
        transactions: [newT, ...prev.transactions]
      };
    });
  };

  const deleteTransaction = (id: string) => {
    const t = state.transactions.find(x => x.id === id);
    if (!t) return;
    setState(prev => {
      const updatedAccounts = prev.accounts.map(acc => {
        if (acc.id === t.accountId) {
          const newBalance = t.type === TransactionType.INCOME 
            ? acc.balance - t.amount 
            : acc.balance + t.amount;
          return { ...acc, balance: newBalance };
        }
        return acc;
      });
      return {
        ...prev,
        accounts: updatedAccounts,
        transactions: prev.transactions.filter(x => x.id !== id)
      };
    });
  };

  if (!state.user) {
    return <Login onLogin={handleLogin} isDemoMode={state.isDemoMode} />;
  }

  return (
    <Router>
      <Layout 
        user={state.user} 
        onLogout={handleLogout} 
        isDemoMode={state.isDemoMode}
        onToggleMode={handleToggleMode}
      >
        <Routes>
          <Route path="/" element={<Dashboard state={state} />} />
          <Route path="/accounts" element={<AccountsPage accounts={state.accounts} onAdd={addAccount} onUpdate={updateAccount} onDelete={deleteAccount} />} />
          <Route path="/transactions" element={<TransactionsPage state={state} onAdd={addTransaction} onDelete={deleteTransaction} />} />
          <Route path="/analysis" element={<AnalysisPage state={state} />} />
          <Route path="/settings" element={<SettingsPage categories={state.categories} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
