import React from 'react';
import { Transaction, TransactionType } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { MinusIcon } from './icons/MinusIcon';

interface TransactionListProps {
    transactions: Transaction[];
    onDeleteTransaction: (id: number) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDeleteTransaction }) => {

    const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
        const isIncome = transaction.type === TransactionType.INCOME;
        const sign = isIncome ? '+' : '-';
        const amountColor = isIncome ? 'text-green-600' : 'text-red-600';
        const borderColor = isIncome ? 'border-green-500' : 'border-red-500';

        return (
             <li
                className={`flex items-center justify-between p-3 mb-3 rounded-lg bg-slate-50 border-l-4 ${borderColor} transition-transform transform hover:scale-[1.02] hover:bg-slate-100 animate-slide-in`}
            >
                <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-full ${isIncome ? 'bg-green-100' : 'bg-red-100'}`}>
                        {isIncome ? <PlusIcon className="w-4 h-4 text-green-600" /> : <MinusIcon className="w-4 h-4 text-red-600" />}
                    </div>
                    <div>
                        <span className="font-medium text-gray-800">{transaction.text}</span>
                        <span className="block text-xs text-gray-500">{transaction.category}</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className={`font-semibold ${amountColor}`}>
                        {sign}৳{transaction.amount.toLocaleString('bn-BD')}
                    </span>
                    <button onClick={() => onDeleteTransaction(transaction.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                        ✕
                    </button>
                </div>
            </li>
        )
    };

    return (
        <div className="p-6 rounded-2xl bg-white shadow-md backdrop-blur-sm border border-slate-200/50 h-[450px] flex flex-col">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">লেনদেনের তালিকা</h3>
            {transactions.length > 0 ? (
                <ul className="overflow-y-auto pr-2 flex-grow">
                    {transactions.slice().reverse().map(transaction => (
                        <TransactionItem key={transaction.id} transaction={transaction} />
                    ))}
                </ul>
            ) : (
                <div className="flex-grow flex items-center justify-center">
                    <p className="text-gray-400">কোনো লেনদেন পাওয়া যায়নি।</p>
                </div>
            )}
        </div>
    );
};