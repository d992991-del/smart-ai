
import { GoogleGenAI } from "@google/genai";
import { Transaction, BankAccount, Category } from "../types";

// Safety check for API Key
const apiKey = process.env.API_KEY;

export async function getFinancialAdvice(
  transactions: Transaction[],
  accounts: BankAccount[],
  categories: Category[]
): Promise<string> {
  if (!apiKey) {
    return "尚未設定 AI API Key，無法提供分析。請於展示模式下查看範例功能。";
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const summary = transactions.reduce((acc, curr) => {
    const cat = categories.find(c => c.id === curr.categoryId)?.name || '未知';
    if (curr.type === 'INCOME') acc.income += curr.amount;
    else acc.expense += curr.amount;
    acc.byCategory[cat] = (acc.byCategory[cat] || 0) + curr.amount;
    return acc;
  }, { income: 0, expense: 0, byCategory: {} as Record<string, number> });

  const prompt = `
    你是一位專業的個人理財顧問。請根據以下使用者的財務數據提供具體建議：
    總資產：NT$ ${accounts.reduce((sum, a) => sum + a.balance, 0).toLocaleString()}
    本月收入：NT$ ${summary.income.toLocaleString()}
    本月支出：NT$ ${summary.expense.toLocaleString()}
    
    支出分類：
    ${Object.entries(summary.byCategory).map(([k,v]) => `- ${k}: NT$ ${v.toLocaleString()}`).join('\n')}

    請使用繁體中文 Markdown 格式，提供 3 個精確的理財改善方向。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    return response.text || "AI 暫時無法回應。";
  } catch (error) {
    return "AI 服務存取錯誤，請確認 API Key 是否有效。";
  }
}
