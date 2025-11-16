import React, { useState } from 'react';
import { Transaction, TransactionType } from '../types';

interface AddTransactionFormProps {
    onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

export const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ onAddTransaction }) => {
    const [text, setText] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim() || !amount.trim() || !category.trim()) {
            alert('অনুগ্রহ করে সকল ঘর পূরণ করুন।');
            return;
        }

        const newTransaction = {
            text,
            amount: +amount,
            type,
            category,
        };

        onAddTransaction(newTransaction);
        setText('');
        setAmount('');
        setCategory('');
    };
    
    const inputClasses = "w-full bg-slate-100 border border-slate-300 rounded-md py-2 px-3 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition duration-300";

    return (
        <div className="p-6 rounded-2xl bg-white shadow-md backdrop-blur-sm border border-slate-200/50 h-[450px]">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">নতুন লেনদেন যোগ করুন</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
                    <button type="button" onClick={() => setType(TransactionType.INCOME)} className={`w-full py-2 rounded-md transition-all duration-300 ${type === TransactionType.INCOME ? 'bg-green-500 shadow-lg text-white' : 'hover:bg-slate-200'}`}>আয়</button>
                    <button type="button" onClick={() => setType(TransactionType.EXPENSE)} className={`w-full py-2 rounded-md transition-all duration-300 ${type === TransactionType.EXPENSE ? 'bg-red-500 shadow-lg text-white' : 'hover:bg-slate-200'}`}>ব্যয়</button>
                </div>
                <div>
                    <label htmlFor="text" className="block text-sm font-medium text-gray-500 mb-1">বিবরণ</label>
                    <input type="text" id="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="যেমন: রাতের খাবার" className={inputClasses} />
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-500 mb-1">বিভাগ</label>
                    <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="যেমন: খাবার" className={inputClasses} />
                </div>
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-500 mb-1">টাকার পরিমাণ (৳)</label>
                    <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" className={inputClasses} />
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold py-3 px-4 rounded-lg hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                    যোগ করুন
                </button>
            </form>
        </div>
    );
};