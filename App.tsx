
import React, { useState, useCallback, useMemo } from 'react';
import { CalculatorInputs, CalculationResults } from './types';
import CalculatorForm from './components/CalculatorForm';
import ResultsDisplay from './components/ResultsDisplay';
import { getInvestmentAnalysis } from './services/geminiService';
import { HouseIcon } from './components/IconComponents';

const App: React.FC = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    propertyValue: 300000,
    depositAmount: 75000,
    mortgageInterestRate: 5.5,
    mortgageTerm: 25,
    monthlyRentalIncome: 1500,
    monthlyRunningCosts: 250,
  });

  const [aiInsight, setAiInsight] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string>('');

  const results = useMemo<CalculationResults>(() => {
    const {
      propertyValue,
      depositAmount,
      mortgageInterestRate,
      monthlyRentalIncome,
      monthlyRunningCosts,
    } = inputs;

    if (propertyValue <= 0 || depositAmount <= 0) {
      return {
        loanAmount: 0, ltv: 0, monthlyMortgagePayment: 0, totalMonthlyCosts: 0,
        monthlyProfit: 0, annualProfit: 0, grossYield: 0, netYield: 0, roi: 0,
      };
    }

    const loanAmount = propertyValue - depositAmount;
    const ltv = (loanAmount / propertyValue) * 100;
    const monthlyMortgagePayment = (loanAmount * (mortgageInterestRate / 100)) / 12;
    const totalMonthlyCosts = monthlyMortgagePayment + monthlyRunningCosts;
    const monthlyProfit = monthlyRentalIncome - totalMonthlyCosts;
    const annualProfit = monthlyProfit * 12;
    const annualRentalIncome = monthlyRentalIncome * 12;

    const grossYield = (annualRentalIncome / propertyValue) * 100;
    const netYield = (annualProfit / propertyValue) * 100;
    const roi = (annualProfit / depositAmount) * 100;

    return {
      loanAmount,
      ltv,
      monthlyMortgagePayment,
      totalMonthlyCosts,
      monthlyProfit,
      annualProfit,
      grossYield,
      netYield,
      roi,
    };
  }, [inputs]);

  const handleInputChange = useCallback((field: keyof CalculatorInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    // Reset AI insight if inputs change
    setAiInsight('');
    setAiError('');
  }, []);

  const handleAiAnalysis = async () => {
    setIsAiLoading(true);
    setAiInsight('');
    setAiError('');
    try {
      const insight = await getInvestmentAnalysis(inputs, results);
      setAiInsight(insight);
    } catch (error) {
      console.error(error);
      setAiError('Failed to get AI insight. Please check your API key and try again.');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <header className="text-center mb-8">
            <div className="flex items-center justify-center gap-3">
              <HouseIcon className="w-10 h-10 text-blue-600" />
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Buy-to-Let Income Calculator</h1>
            </div>
            <p className="mt-2 text-lg text-slate-600">Estimate your rental income and investment return with AI-powered analysis.</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg border border-slate-200 h-fit">
            <CalculatorForm inputs={inputs} onInputChange={handleInputChange} />
          </div>
          <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
            <ResultsDisplay 
              results={results}
              inputs={inputs} 
              onAiAnalysis={handleAiAnalysis}
              aiInsight={aiInsight}
              isAiLoading={isAiLoading}
              aiError={aiError}
            />
          </div>
        </main>
        
        <footer className="text-center mt-12 text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Buy-to-Let Income Calculator. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
