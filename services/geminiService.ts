import { GoogleGenAI } from "@google/genai";

// Resume context used for system instruction
const RESUME_CONTEXT = `
Bạn là trợ lý AI (tên là DevBot) cho portfolio của lập trình viên tên là "Nguyễn Văn Dev".
Thông tin về Nguyễn Văn Dev:
- Kinh nghiệm: Hơn 2 năm làm việc chuyên nghiệp.
- Vị trí: Fullstack Developer (tập trung vào Frontend).
- Kỹ năng chính: React, TypeScript, Tailwind CSS, Node.js, Next.js, Git, CI/CD.
- Tính cách: Cầu tiến, tỉ mỉ, thích học công nghệ mới, giải quyết vấn đề tốt.
- Dự án nổi bật: Hệ thống E-commerce (React/Node), App quản lý công việc (Next.js), Dashboard Analytics.

Nhiệm vụ của bạn:
- Trả lời các câu hỏi của nhà tuyển dụng hoặc khách ghé thăm thay mặt cho tác giả.
- Giọng văn: Chuyên nghiệp, thân thiện, ngắn gọn và đi thẳng vào vấn đề.
- Nếu được hỏi về liên hệ, hãy hướng dẫn họ xuống phần "Liên hệ" hoặc gửi email về: contact@nguyenvandev.com.
- Luôn trả lời bằng tiếng Việt trừ khi người dùng hỏi bằng tiếng Anh.
`;

export const sendMessageToGemini = async (message: string, history: { role: string; parts: { text: string }[] }[]) => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key chưa được cấu hình.");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Using gemini-3-flash-preview for fast, responsive chat interactions
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(h => ({ role: h.role, parts: h.parts })), // Past context
        { role: 'user', parts: [{ text: message }] } // Current message
      ],
      config: {
        systemInstruction: RESUME_CONTEXT,
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster chat response
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};