
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
import { auth, isFirebaseEnabled } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('smart_finance_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...parsed, isDemoMode: !isFirebaseEnabled() };
      } catch (e) {
        console.error("Failed to load local state", e);
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

  // 監聽 Firebase 登入狀態
  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          setState(prev => ({
            ...prev,
            user: {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User'
            },
            isDemoMode: false
          }));
        } else if (!state.isDemoMode) {
          setState(prev => ({ ...prev, user: null }));
        }
      });
      return () => unsubscribe();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('smart_finance_state', JSON.stringify(state));
  }, [state]);

  const handleLogin = (email: string) => {
    // 如果是展示模式
    if (state.isDemoMode) {
      setState(prev => ({
        ...prev,
        user: { id: 'demo_user', email, displayName: email.split('@')[0] }
      }));
    }
  };

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
    setState(prev => ({ ...prev, user: null }));
  };

  const handleToggleMode = () => {
    const nextIsDemo = !state.isDemoMode;
    if (!nextIsDemo && !isFirebaseEnabled()) {
      alert("偵測不到 Firebase 配置。正式模式需要正確的環境變數設置，請檢查 GitHub Secrets。");
      return;
    }
    setState(prev => ({ ...prev, isDemoMode: nextIsDemo }));
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
