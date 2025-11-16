import React, { useState, useCallback } from 'react';
import { getQuickAdvice, getMarketAnalysis, getDeepAnalysis } from '../services/geminiService';
import { GroundingChunk, Budget } from '../types';
import { ZapIcon } from './icons/ZapIcon';
import { SearchIcon } from './icons/SearchIcon';
import { BrainIcon } from './icons/BrainIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';


type AIMode = 'quick' | 'market' | 'deep';

interface GeminiPanelProps {
  transactionData: Omit<any, 'id'>[];
  budgetData: Budget[];
}

export const GeminiPanel: React.FC<GeminiPanelProps> = ({ transactionData, budgetData }) => {
    const [mode, setMode] = useState<AIMode>('quick');
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [groundingChunks, setGroundingChunks] = useState<GroundingChunk[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const modeConfig = {
        quick: {
            title: 'দ্রুত পরামর্শ',
            description: 'সাধারণ আর্থিক প্রশ্নের দ্রুত উত্তর পান।',
            icon: <ZapIcon className="w-5 h-5" />,
            handler: getQuickAdvice
        },
        market: {
            title: 'বাজার বিশ্লেষণ',
            description: 'সর্বশেষ তথ্যসহ বাজার প্রবণতা সম্পর্কে জানুন।',
            icon: <SearchIcon className="w-5 h-5" />,
            handler: getMarketAnalysis
        },
        deep: {
            title: 'গভীর বিশ্লেষণ',
            description: 'জটিল আর্থিক পরিস্থিতির জন্য বিস্তারিত বিশ্লেষণ।',
            icon: <BrainIcon className="w-5 h-5" />,
            handler: getDeepAnalysis
        }
    };
    
    const handleAnalyseSpending = useCallback(async () => {
      setMode('deep');
      const analysisPrompt = `আমার নিম্নলিখিত লেনদেন ডেটা বিশ্লেষণ করে আমাকে বাজেট উন্নত করার জন্য কিছু পরামর্শ দিন। আমার প্রধান খরচের খাতগুলো কী কী এবং আমি কোথায় সঞ্চয় করতে পারি? বিস্তারিতভাবে উত্তর দিন। ডেটা: ${JSON.stringify(transactionData)}`;
      setPrompt(analysisPrompt);
      await handleSubmit(analysisPrompt, 'deep');
    }, [transactionData]);

    const handleAnalyseBudget = useCallback(async () => {
        setMode('deep');
        const analysisPrompt = `আমার বাজেট এবং সাম্প্রতিক লেনদেন ডেটা বিশ্লেষণ করুন। আমি কি আমার বাজেট মেনে চলছি? কোথায় আমি বেশি খরচ করছি এবং কীভাবে উন্নতি করতে পারি? আমার উত্তর বাংলায় দিন। বাজেট: ${JSON.stringify(budgetData)}, লেনদেন: ${JSON.stringify(transactionData)}`;
        setPrompt(analysisPrompt);
        await handleSubmit(analysisPrompt, 'deep');
    }, [transactionData, budgetData]);


    const handleSubmit = async (currentPrompt: string, currentMode: AIMode) => {
        if (!currentPrompt.trim()) return;

        setIsLoading(true);
        setResponse('');
        setGroundingChunks([]);

        const { handler } = modeConfig[currentMode];
        const result = await handler(currentPrompt);

        setResponse(result.text);
        if (result.groundingChunks) {
            setGroundingChunks(result.groundingChunks);
        }
        setIsLoading(false);
    };
    
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSubmit(prompt, mode);
    }

    const ModeButton = ({ id, currentMode }: { id: AIMode, currentMode: AIMode }) => (
        <button
            onClick={() => setMode(id)}
            className={`flex-1 flex items-center justify-center gap-2 p-3 text-sm font-semibold rounded-lg transition-all duration-300 ${
                currentMode === id ? 'bg-cyan-600 text-white shadow-md' : 'bg-slate-200 hover:bg-slate-300 text-gray-600'
            }`}
        >
            {modeConfig[id].icon}
            {modeConfig[id].title}
        </button>
    );

    return (
        <div className="p-6 rounded-2xl bg-white shadow-md backdrop-blur-sm border border-slate-200/50 h-full flex flex-col min-h-[500px] lg:min-h-0">
            <h3 className="text-xl font-semibold text-gray-700">AI আর্থিক সহকারী</h3>
            <p className="text-sm text-gray-500 mb-4">{modeConfig[mode].description}</p>
            
            <div className="flex gap-2 mb-4 p-1 bg-slate-100 rounded-xl">
                <ModeButton id="quick" currentMode={mode} />
                <ModeButton id="market" currentMode={mode} />
                <ModeButton id="deep" currentMode={mode} />
            </div>

            <div className="flex-grow flex flex-col bg-slate-50 rounded-lg p-4 overflow-hidden mb-4 border border-slate-200">
                <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                        </div>
                    ) : response ? (
                        <div>
                          <pre className="text-gray-700 whitespace-pre-wrap font-sans text-sm leading-relaxed">{response}</pre>
                           {groundingChunks.length > 0 && (
                                <div className="mt-4 pt-3 border-t border-slate-200">
                                    <h4 className="text-sm font-semibold text-gray-500 mb-2">সূত্র:</h4>
                                    <ul className="space-y-1">
                                        {groundingChunks.map((chunk, index) => chunk.web && (
                                            <li key={index}>
                                                <a href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="text-cyan-600 text-xs hover:underline truncate block">
                                                    {chunk.web.title || chunk.web.uri}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-center text-gray-400">
                           <p>আপনার আর্থিক প্রশ্ন এখানে জিজ্ঞাসা করুন অথবা নিচের কোনো একটি বিশ্লেষণ শুরু করুন।</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-2 mb-4">
                 <button
                    onClick={handleAnalyseSpending}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold py-2.5 px-4 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                    <BrainIcon className="w-5 h-5" />
                    আমার খরচ বিশ্লেষণ করুন
                </button>
                <button
                    onClick={handleAnalyseBudget}
                    disabled={isLoading || budgetData.length === 0}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold py-2.5 px-4 rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                    <ChartBarIcon className="w-5 h-5" />
                    বাজেট বনাম খরচ বিশ্লেষণ
                </button>
            </div>


            <form onSubmit={handleFormSubmit} className="mt-auto">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="আপনার প্রশ্ন লিখুন..."
                    className="w-full bg-slate-100 border border-slate-300 rounded-lg p-3 text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition duration-300 resize-none h-24"
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading} className="w-full mt-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isLoading ? 'প্রসেস হচ্ছে...' : 'পাঠান'}
                </button>
            </form>
        </div>
    );
};