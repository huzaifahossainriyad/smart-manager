import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { TransactionList } from './components/TransactionList';
import { AddTransactionForm } from './components/AddTransactionForm';
import { GeminiPanel } from './components/GeminiPanel';
import { SpendingChart } from './components/SpendingChart';
import { BudgetTracker } from './components/BudgetTracker';
import { Transaction, TransactionType, Budget } from './types';

const initialTransactions: Transaction[] = [
    { id: 1, text: 'বেতন', amount: 50000, type: TransactionType.INCOME, category: 'বেতন' },
    { id: 2, text: 'বাড়ি ভাড়া', amount: 15000, type: TransactionType.EXPENSE, category: 'বাসা' },
    { id: 3, text: 'সকালের নাস্তা', amount: 300, type: TransactionType.EXPENSE, category: 'খাবার' },
    { id: 4, text: 'ইন্টারনেট বিল', amount: 1000, type: TransactionType.EXPENSE, category: 'বিল' },
    { id: 5, text: 'ফ্রিল্যান্সিং প্রকল্প', amount: 20000, type: TransactionType.INCOME, category: 'ফ্রিল্যান্স' },
];

const initialBudgets: Budget[] = [
    { category: 'খাবার', amount: 10000 },
    { category: 'বাসা', amount: 15000 },
    { category: 'যাতায়াত', amount: 5000 },
];


const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const localData = localStorage.getItem('transactions');
      return localData ? JSON.parse(localData) : initialTransactions;
    } catch (error) {
      return initialTransactions;
    }
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    try {
      const localData = localStorage.getItem('budgets');
      return localData ? JSON.parse(localData) : initialBudgets;
    } catch (error) {
      return initialBudgets;
    }
  });

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
    setTransactions(prevTransactions => [
      ...prevTransactions,
      { ...transaction, id: Date.now() }
    ]);
  }, []);

  const deleteTransaction = useCallback((id: number) => {
    setTransactions(prevTransactions => prevTransactions.filter(t => t.id !== id));
  }, []);

  const addBudget = useCallback((newBudget: Budget) => {
    setBudgets(prevBudgets => {
      const existingIndex = prevBudgets.findIndex(b => b.category === newBudget.category);
      if (existingIndex > -1) {
        const updatedBudgets = [...prevBudgets];
        updatedBudgets[existingIndex] = newBudget;
        return updatedBudgets;
      }
      return [...prevBudgets, newBudget];
    });
  }, []);

  const transactionsForAnalysis = useMemo(() => {
    return transactions.map(({ text, amount, type, category }) => ({ text, amount, type, category })).slice(-15);
  }, [transactions]);

  const budgetsForAnalysis = useMemo(() => {
    return budgets;
  }, [budgets]);


  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 transition-colors duration-500">
      <Header />
      <main className="container mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Dashboard transactions={transactions} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <SpendingChart transactions={transactions} />
              <BudgetTracker transactions={transactions} budgets={budgets} onAddBudget={addBudget} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AddTransactionForm onAddTransaction={addTransaction} />
              <TransactionList transactions={transactions} onDeleteTransaction={deleteTransaction} />
            </div>
          </div>
          <div className="lg:col-span-1">
            <GeminiPanel transactionData={transactionsForAnalysis} budgetData={budgetsForAnalysis} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;