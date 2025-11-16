import React, { useState, useMemo } from 'react';
import { Transaction, Budget, TransactionType } from '../types';

interface BudgetTrackerProps {
    transactions: Transaction[];
    budgets: Budget[];
    onAddBudget: (budget: Budget) => void;
}

export const BudgetTracker: React.FC<BudgetTrackerProps> = ({ transactions, budgets, onAddBudget }) => {
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!category.trim() || !amount.trim() || +amount <= 0) {
            alert('অনুগ্রহ করে সঠিক বিভাগ এবং টাকার পরিমাণ লিখুন।');
            return;
        }
        onAddBudget({ category, amount: +amount });
        setCategory('');
        setAmount('');
    };

    const spendingByBudget = useMemo(() => {
        const now = new Date();
        const monthlyExpenses = transactions.filter(t => t.type === TransactionType.EXPENSE && new Date(t.id).getMonth() === now.getMonth() && new Date(t.id).getFullYear() === now.getFullYear());

        return budgets.map(budget => {
            const spent = monthlyExpenses
                .filter(t => t.category === budget.category)
                .reduce((sum, t) => sum + t.amount, 0);
            const remaining = budget.amount - spent;
            const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
            return { ...budget, spent, remaining, percentage };
        });
    }, [transactions, budgets]);

    const getProgressBarColor = (percentage: number) => {
        if (percentage > 100) return 'bg-red-500';
        if (percentage > 75) return 'bg-yellow-400';
        return 'bg-green-500';
    };
    
    const inputClasses = "w-full bg-slate-100 border border-slate-300 rounded-md py-2 px-3 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition duration-300";

    return (
        <div className="p-6 rounded-2xl bg-white shadow-md backdrop-blur-sm border border-slate-200/50 h-[450px] flex flex-col animate-fade-in-up">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">বাজেট ট্র্যাকার</h3>
            <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
                <input type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="বিভাগ" className={inputClasses} />
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="টাকার পরিমাণ" className={`${inputClasses} w-32`} />
                <button type="submit" className="bg-cyan-500 text-white px-4 rounded-md hover:bg-cyan-600 transition-colors">+</button>
            </form>
            <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                {spendingByBudget.length > 0 ? spendingByBudget.map(b => (
                    <div key={b.category}>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700">{b.category}</span>
                            <span className="text-gray-500">৳{b.spent.toLocaleString('bn-BD')} / ৳{b.amount.toLocaleString('bn-BD')}</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2.5">
                            <div
                                className={`h-2.5 rounded-full transition-all duration-500 ${getProgressBarColor(b.percentage)}`}
                                style={{ width: `${Math.min(b.percentage, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                )) : (
                     <div className="flex-grow flex items-center justify-center h-full">
                        <p className="text-gray-400">কোনো বাজেট সেট করা হয়নি।</p>
                    </div>
                )}
            </div>
        </div>
    );
};