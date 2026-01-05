import { GoogleGenAI } from "@google/genai";
import { Transaction, BankAccount, Category } from "../types";

export async function getFinancialAdvice(
  transactions: Transaction[],
  accounts: BankAccount[],
  categories: Category[]
): Promise<string> {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    return "尚未設定 AI API Key，無法提供分析。請確保 GitHub Secrets 已設定 API_KEY。";
  }

  // 初始化 Google GenAI
  const ai = new GoogleGenAI({ apiKey });

  // 彙整財務摘要數據
  const summary = transactions.reduce((acc, curr) => {
    const cat = categories.find(c => c.id === curr.categoryId)?.name || '其他';
    if (curr.type === 'INCOME') {
      acc.income += curr.amount;
    } else {
      acc.expense += curr.amount;
      acc.byCategory[cat] = (acc.byCategory[cat] || 0) + curr.amount;
    }
    return acc;
  }, { income: 0, expense: 0, byCategory: {} as Record<string, number> });

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  const prompt = `
    你是一位專業的個人理財顧問。請根據以下使用者的財務數據提供 3 個精確、專業且具備行動力的理財建議。
    請使用「繁體中文」並以 Markdown 格式輸出。

    數據摘要：
    - 目前總資產：NT$ ${totalBalance.toLocaleString()}
    - 本期總收入：NT$ ${summary.income.toLocaleString()}
    - 本期總支出：NT$ ${summary.expense.toLocaleString()}
    
    支出前三大分類：
    ${Object.entries(summary.byCategory)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([cat, amt]) => `- ${cat}: NT$ ${amt.toLocaleString()}`)
      .join('\n')}

    請分析其收支平衡，給予資產配置或節流建議。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    return response.text || "AI 生成內容失敗。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 服務存取錯誤，請稍後再試。";
  }
}