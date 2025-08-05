import { supabase } from "./supabaseClient";
import { nanoid } from "nanoid";

export async function createForward(messageId: string, senderId: string | null = null) {
  const uniqueCode = nanoid(8);

  const { data, error } = await supabase
    .from("forwards")
    .insert({
      message_id: messageId,
      sender_id: senderId,
      unique_code: uniqueCode,
    })
    .select()
    .single();

  if (error) throw error;
  return uniqueCode;
}
