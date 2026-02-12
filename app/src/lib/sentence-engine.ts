import { supabase } from "./supabase";
import type { Message, MessageType } from "./types";

/** Get current time slot based on hour */
export function getCurrentTimeSlot(): MessageType {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 16) return "lunch";
  return "evening";
}

/** Check if this delivery should be silence (3% probability) */
export function shouldBeSilence(): boolean {
  return Math.random() < 0.03;
}

/** Check if this delivery should be a variation (5-10% probability) */
export function shouldBeVariation(): boolean {
  return Math.random() < 0.07;
}

/** Get recent message IDs delivered to user in last 7 days */
async function getRecentMessageIds(userId: string): Promise<number[]> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data } = await supabase
    .from("delivery_logs")
    .select("message_id")
    .eq("user_id", userId)
    .gte("delivered_at", sevenDaysAgo.toISOString())
    .not("message_id", "is", null);

  return data?.map((log) => log.message_id as number) ?? [];
}

/** Get today's delivered message IDs for dedup */
async function getTodayMessageIds(userId: string): Promise<number[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data } = await supabase
    .from("delivery_logs")
    .select("message_id")
    .eq("user_id", userId)
    .gte("delivered_at", today.toISOString())
    .not("message_id", "is", null);

  return data?.map((log) => log.message_id as number) ?? [];
}

/** Pick a sentence for the user */
export async function pickSentence(
  userId: string,
  language: string
): Promise<Message | null> {
  // Silence check
  if (shouldBeSilence()) {
    await supabase.from("delivery_logs").insert({
      user_id: userId,
      message_id: null,
      is_silence: true,
    });
    return null;
  }

  const timeSlot = shouldBeVariation() ? "variation" : getCurrentTimeSlot();

  // Get IDs to exclude
  const [recentIds, todayIds] = await Promise.all([
    getRecentMessageIds(userId),
    getTodayMessageIds(userId),
  ]);
  const excludeIds = [...new Set([...recentIds, ...todayIds])];

  // Query available messages
  let query = supabase
    .from("messages")
    .select("*")
    .eq("type", timeSlot)
    .eq("language", language);

  if (excludeIds.length > 0) {
    query = query.not("id", "in", `(${excludeIds.join(",")})`);
  }

  const { data: messages } = await query;

  if (!messages || messages.length === 0) {
    // Fallback: pick any message of this type (ignore dedup)
    const { data: fallback } = await supabase
      .from("messages")
      .select("*")
      .eq("type", timeSlot)
      .eq("language", language)
      .limit(1);

    if (!fallback || fallback.length === 0) return null;
    const picked = fallback[0] as Message;
    await logDelivery(userId, picked.id);
    return picked;
  }

  // Random pick
  const picked = messages[Math.floor(Math.random() * messages.length)] as Message;
  await logDelivery(userId, picked.id);
  return picked;
}

async function logDelivery(userId: string, messageId: number): Promise<void> {
  await supabase.from("delivery_logs").insert({
    user_id: userId,
    message_id: messageId,
    is_silence: false,
  });
}
