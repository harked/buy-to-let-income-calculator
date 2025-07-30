
import React from 'react';
import { CalculatorInputs } from '../types';
import { PoundIcon, PercentIcon, CalendarIcon } from './IconComponents';

interface CalculatorFormProps {
  inputs: CalculatorInputs;
  onInputChange: (field: keyof CalculatorInputs, value: number) => void;
}

const InputField: React.FC<{
  id: keyof CalculatorInputs;
  label: string;
  value: number;
  onChange: (value: number) => void;
  icon: React.ReactNode;
  step?: number;
  min?: number;
}> = ({ id, label, value, onChange, icon, step = 1, min = 0 }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        {icon}
      </div>
      <input
        type="number"
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
        placeholder="0"
        step={step}
        min={min}
      />
    </div>
  </div>
);

const CalculatorForm: React.FC<CalculatorFormProps> = ({ inputs, onInputChange }) => {
  const handleInputChange = (field: keyof CalculatorInputs) => (value: number) => {
    onInputChange(field, value);
  };
  
  const depositPercentage = inputs.propertyValue > 0 ? (inputs.depositAmount / inputs.propertyValue) * 100 : 0;
  
  const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const percentage = parseFloat(e.target.value) || 0;
      const newDepositAmount = (inputs.propertyValue * percentage) / 100;
      onInputChange('depositAmount', Math.round(newDepositAmount));
  }

  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      <h2 className="text-2xl font-semibold text-slate-800 border-b pb-3 mb-6">Investment Details</h2>
      
      <InputField
        id="propertyValue"
        label="Property Value"
        value={inputs.propertyValue}
        onChange={handleInputChange('propertyValue')}
        icon={<PoundIcon />}
        step={1000}
      />

      <div>
        <label htmlFor="depositPercentage" className="block text-sm font-medium text-slate-700 mb-1">Deposit Percentage</label>
         <div className="relative">
             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                 <PercentIcon />
             </div>
             <input
                type="range"
                id="depositPercentage"
                min="0"
                max="100"
                value={depositPercentage}
                onChange={handlePercentageChange}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer mt-4"
             />
        </div>
        <div className="flex justify-between text-sm text-slate-500 mt-1">
            <span>0%</span>
            <span>{depositPercentage.toFixed(1)}%</span>
            <span>100%</span>
        </div>
      </div>
      
      <InputField
        id="depositAmount"
        label="Deposit Amount"
        value={inputs.depositAmount}
        onChange={handleInputChange('depositAmount')}
        icon={<PoundIcon />}
        step={1000}
      />
      
      <InputField
        id="mortgageInterestRate"
        label="Mortgage Interest Rate"
        value={inputs.mortgageInterestRate}
        onChange={handleInputChange('mortgageInterestRate')}
        icon={<PercentIcon />}
        step={0.01}
      />
      
      <InputField
        id="mortgageTerm"
        label="Mortgage Term (Years)"
        value={inputs.mortgageTerm}
        onChange={handleInputChange('mortgageTerm')}
        icon={<CalendarIcon />}
      />

      <h2 className="text-2xl font-semibold text-slate-800 border-b pb-3 pt-4 mb-6">Income & Costs</h2>

      <InputField
        id="monthlyRentalIncome"
        label="Monthly Rental Income"
        value={inputs.monthlyRentalIncome}
        onChange={handleInputChange('monthlyRentalIncome')}
        icon={<PoundIcon />}
        step={50}
      />
      
      <InputField
        id="monthlyRunningCosts"
        label="Monthly Running Costs"
        value={inputs.monthlyRunningCosts}
        onChange={handleInputChange('monthlyRunningCosts')}
        icon={<PoundIcon />}
        step={10}
      />
      
    </form>
  );
};

export default CalculatorForm;
