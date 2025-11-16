import React from 'react';
import { Transaction, TransactionType } from '../types';

interface DashboardProps {
    transactions: Transaction[];
}

export const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
    const totalIncome = transactions
        .filter(t => t.type === TransactionType.INCOME)
        .reduce((acc, t) => acc + t.amount, 0);

    const totalExpense = transactions
        .filter(t => t.type === TransactionType.EXPENSE)
        .reduce((acc, t) => acc + t.amount, 0);

    const balance = totalIncome - totalExpense;
    
    const formatCurrency = (amount: number) => `৳${amount.toLocaleString('bn-BD')}`;

    const Card = ({ title, amount, colorClass, delay }: { title: string, amount: number, colorClass: string, delay: number }) => (
        <div className={`
            p-6 rounded-2xl shadow-md transform transition-all duration-500 hover:scale-105 hover:shadow-xl 
            bg-white backdrop-blur-sm border border-slate-200/50
            animate-fade-in-up
        `} style={{animationDelay: `${delay}ms`}}>
            <h4 className="text-lg font-medium text-gray-500">{title}</h4>
            <p className={`text-3xl font-bold ${colorClass}`}>{formatCurrency(amount)}</p>
        </div>
    );
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card title="মোট আয়" amount={totalIncome} colorClass="text-green-600" delay={100} />
            <Card title="মোট ব্যয়" amount={totalExpense} colorClass="text-red-600" delay={200} />
            <Card title="বর্তমান ব্যালেন্স" amount={balance} colorClass={balance >= 0 ? 'text-cyan-600' : 'text-orange-500'} delay={300} />
        </div>
    );
};