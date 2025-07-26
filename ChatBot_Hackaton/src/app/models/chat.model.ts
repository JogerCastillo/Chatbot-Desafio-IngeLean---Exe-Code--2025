export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

export interface ChatStats {
  totalMessages: number;
  totalConversations: number;
  avgResponseTime: number;
  faqHits: number;
  aiResponses: number;
}
