import React, { useMemo } from 'react';
import { Transaction, TransactionType } from '../types';

interface SpendingChartProps {
    transactions: Transaction[];
}

const COLORS = ['#10B981', '#3B82F6', '#F97316', '#EC4899', '#8B5CF6', '#F59E0B', '#6366F1', '#EF4444'];

const DonutSlice = ({ percentage, radius, strokeWidth, color, offset, index }: any) => {
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = `${(percentage * circumference) / 100} ${circumference}`;
    const strokeDashoffset = -offset * circumference / 100;

    return (
        <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90 ${radius + strokeWidth} ${radius + strokeWidth})`}
            className="transition-all duration-1000 ease-out"
            style={{ animation: `chart-draw 1s ease-out ${index * 100}ms forwards`, opacity: 0 }}
        />
    );
};


export const SpendingChart: React.FC<SpendingChartProps> = ({ transactions }) => {
    const chartData = useMemo(() => {
        const now = new Date();
        const expenseByCategory = transactions
            .filter(t => t.type === TransactionType.EXPENSE && new Date(t.id).getMonth() === now.getMonth() && new Date(t.id).getFullYear() === now.getFullYear())
            .reduce((acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + t.amount;
                return acc;
            }, {} as { [key: string]: number });

        const totalExpense = Object.values(expenseByCategory).reduce((sum, amount) => sum + amount, 0);

        if (totalExpense === 0) return [];

        return Object.entries(expenseByCategory)
            .map(([category, amount]) => ({
                category,
                amount,
                percentage: (amount / totalExpense) * 100,
            }))
            .sort((a, b) => b.amount - a.amount);
    }, [transactions]);

    let cumulativeOffset = 0;

    return (
        <div className="p-6 rounded-2xl bg-white shadow-md backdrop-blur-sm border border-slate-200/50 h-[450px] flex flex-col animate-fade-in-up">
            <style>
                {`@keyframes chart-draw { to { opacity: 1; } }`}
            </style>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">মাসিক খরচের চিত্র</h3>
            {chartData.length > 0 ? (
                <div className="flex-grow flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="relative w-48 h-48">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                            {chartData.map((data, index) => {
                                const slice = <DonutSlice key={data.category} percentage={data.percentage} radius={40} strokeWidth={15} color={COLORS[index % COLORS.length]} offset={cumulativeOffset} index={index}/>;
                                cumulativeOffset += data.percentage;
                                return slice;
                            })}
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-sm text-gray-500">মোট খরচ</span>
                        </div>
                    </div>
                    <div className="w-full md:w-auto flex-grow overflow-y-auto pr-2">
                        <ul className="space-y-2">
                            {chartData.map((data, index) => (
                                <li key={data.category} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                        <span className="text-gray-700">{data.category}</span>
                                    </div>
                                    <span className="font-semibold text-gray-800">{data.percentage.toFixed(1)}%</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ) : (
                <div className="flex-grow flex items-center justify-center">
                    <p className="text-gray-400">এই মাসে কোনো খরচের ডেটা নেই।</p>
                </div>
            )}
        </div>
    );
};