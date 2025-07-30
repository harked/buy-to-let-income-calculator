
export interface CalculatorInputs {
  propertyValue: number;
  depositAmount: number;
  mortgageInterestRate: number;
  mortgageTerm: number;
  monthlyRentalIncome: number;
  monthlyRunningCosts: number;
}

export interface CalculationResults {
  loanAmount: number;
  ltv: number;
  monthlyMortgagePayment: number;
  totalMonthlyCosts: number;
  monthlyProfit: number;
  annualProfit: number;
  grossYield: number;
  netYield: number;
  roi: number;
}
