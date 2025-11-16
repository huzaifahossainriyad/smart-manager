import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="bg-white/80 backdrop-blur-sm p-4 sticky top-0 z-10 border-b border-slate-200/80">
            <div className="container mx-auto">
                <h1 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500">
                    স্মার্ট বাজেট ম্যানেজার
                </h1>
            </div>
        </header>
    );
};