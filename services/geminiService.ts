
import { GoogleGenAI } from "@google/genai";
import { CalculatorInputs, CalculationResults } from "../types";

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
};

export const getInvestmentAnalysis = async (inputs: CalculatorInputs, results: CalculationResults): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    You are an expert UK property investment analyst. Based on the following figures for a buy-to-let property, provide a concise analysis for a potential investor.
    Keep your analysis to a maximum of 150 words.

    Key Financials:
    - Property Value: ${formatCurrency(inputs.propertyValue)}
    - Deposit: ${formatCurrency(inputs.depositAmount)}
    - Monthly Rental Income: ${formatCurrency(inputs.monthlyRentalIncome)}
    - Total Monthly Costs (including interest-only mortgage): ${formatCurrency(results.totalMonthlyCosts)}
    - Calculated Monthly Profit: ${formatCurrency(results.monthlyProfit)}
    - Calculated Return on Investment (ROI): ${results.roi.toFixed(2)}%
    - Net Yield: ${results.netYield.toFixed(2)}%

    Your analysis should be a single, easy-to-read paragraph. Do not use markdown, lists, or bullet points. Your tone should be professional but encouraging. Address the following:
    1. A brief summary of the investment's profitability and cash flow position.
    2. One key potential risk to be aware of (e.g., interest rate changes, void periods).
    3. One actionable suggestion for how the investor could potentially improve their return or mitigate risk.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate analysis from AI service.");
  }
};
