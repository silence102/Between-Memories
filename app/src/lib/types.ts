export type MessageType = "morning" | "lunch" | "evening" | "variation";

export interface Message {
  id: number;
  text: string;
  type: MessageType;
  language: string;
  created_at: string;
}

export interface UserMemory {
  id: number;
  user_id: string;
  text: string;
  created_at: string;
}

export interface DeliveryLog {
  id: number;
  user_id: string;
  message_id: number | null;
  delivered_at: string;
  is_silence: boolean;
}

export interface UserProfile {
  id: string;
  language: string;
  timezone: string;
  subscription_status: string;
  created_at: string;
}
