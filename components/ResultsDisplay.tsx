
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CalculationResults, CalculatorInputs } from '../types';
import { SparkleIcon, WarningIcon } from './IconComponents';

interface ResultsDisplayProps {
  results: CalculationResults;
  inputs: CalculatorInputs;
  onAiAnalysis: () => void;
  aiInsight: string;
  isAiLoading: boolean;
  aiError: string;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatPercent = (value: number) => {
  return `${value.toFixed(2)}%`;
};

const ResultCard: React.FC<{ title: string; value: string; className?: string; isPrimary?: boolean }> = ({ title, value, className = '', isPrimary = false }) => (
  <div className={`p-4 rounded-lg ${isPrimary ? 'bg-blue-100' : 'bg-slate-100'} ${className}`}>
    <p className="text-sm text-slate-600">{title}</p>
    <p className={`font-bold ${isPrimary ? 'text-blue-700 text-2xl' : 'text-slate-800 text-xl'}`}>{value}</p>
  </div>
);

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, inputs, onAiAnalysis, aiInsight, isAiLoading, aiError }) => {
  const { monthlyRentalIncome } = inputs;
  const { monthlyMortgagePayment, monthlyProfit, roi, grossYield, netYield } = results;

  const chartData = [
    { name: 'Mortgage', value: monthlyMortgagePayment > 0 ? monthlyMortgagePayment : 0 },
    { name: 'Running Costs', value: inputs.monthlyRunningCosts > 0 ? inputs.monthlyRunningCosts : 0 },
    { name: 'Profit', value: monthlyProfit > 0 ? monthlyProfit : 0 },
  ];
  const COLORS = ['#8884d8', '#ffc658', '#4ade80'];
  const totalMonthlyOutgoings = monthlyMortgagePayment + inputs.monthlyRunningCosts;
  const coverage = monthlyRentalIncome > 0 ? (totalMonthlyOutgoings / monthlyRentalIncome) * 100 : 0;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-800 border-b pb-3">Investment Summary</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ResultCard title="Monthly Profit" value={formatCurrency(monthlyProfit)} isPrimary={true} className={monthlyProfit < 0 ? 'bg-red-100' : ''} />
        <ResultCard title="Annual Profit" value={formatCurrency(results.annualProfit)} className={results.annualProfit < 0 ? 'bg-red-100' : ''}/>
        <ResultCard title="Return on Investment (ROI)" value={formatPercent(roi)} className={roi < 0 ? 'bg-red-100' : ''}/>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-700 mb-3">Key Metrics</h3>
          <ul className="space-y-2 text-slate-600">
            <li className="flex justify-between"><span>Gross Rental Yield:</span> <span className="font-medium text-slate-800">{formatPercent(grossYield)}</span></li>
            <li className="flex justify-between"><span>Net Rental Yield:</span> <span className="font-medium text-slate-800">{formatPercent(netYield)}</span></li>
            <li className="flex justify-between border-t mt-2 pt-2"><span>Monthly Mortgage:</span> <span className="font-medium text-slate-800">{formatCurrency(monthlyMortgagePayment)}</span></li>
            <li className="flex justify-between"><span>Loan to Value (LTV):</span> <span className="font-medium text-slate-800">{formatPercent(results.ltv)}</span></li>
            <li className="flex justify-between"><span>Total Loan Amount:</span> <span className="font-medium text-slate-800">{formatCurrency(results.loanAmount)}</span></li>
          </ul>
        </div>
        <div>
           <h3 className="text-lg font-semibold text-slate-700 mb-3">Monthly Income Breakdown</h3>
           {monthlyRentalIncome > 0 ? (
            <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} fill="#8884d8">
                    {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend iconSize={10} />
                </PieChart>
            </ResponsiveContainer>
            ) : <p className="text-slate-500 text-center pt-10">Enter rental income to see breakdown.</p>}
        </div>
      </div>

      <div className="pt-4">
         <h3 className="text-lg font-semibold text-slate-700 mb-3">AI Analysis</h3>
         <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
            {!aiInsight && !isAiLoading && !aiError && (
                 <div className="text-center text-slate-500">
                    <p>Get an AI-powered analysis of this investment's potential.</p>
                 </div>
            )}
            {aiError && (
                <div className="flex items-center gap-3 text-red-600">
                    <WarningIcon className="w-6 h-6 flex-shrink-0" />
                    <p>{aiError}</p>
                </div>
            )}
            {isAiLoading && (
                <div className="flex items-center justify-center gap-3 text-slate-600 animate-pulse">
                    <SparkleIcon className="w-5 h-5" />
                    <p>Analyzing your investment...</p>
                </div>
            )}
            {aiInsight && (
                 <div className="text-slate-700 leading-relaxed">{aiInsight}</div>
            )}

            <button
                onClick={onAiAnalysis}
                disabled={isAiLoading || results.roi === 0}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
                {isAiLoading ? (
                    'Thinking...'
                ) : (
                    <>
                        <SparkleIcon className="w-5 h-5" />
                        {aiInsight ? 'Re-analyze with AI' : 'Get AI Insight'}
                    </>
                )}
            </button>
         </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
