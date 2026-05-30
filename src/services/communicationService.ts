/* ─── communicationService ───
 * Data-access layer for chats, messages, and announcements.
 * Includes a sendMessage function that appends to the in-memory mock store.
 */

import type { Message, Chat, Announcement } from '../types';
import * as mock from '../data/mock';
import { delay } from './delay';

export async function getChats(userId: string): Promise<Chat[]> {
  await delay(); return mock.getChatsByUser(userId);
}

export async function getMessages(chatId: string): Promise<Message[]> {
  await delay(); return mock.getMessagesByChat(chatId);
}

export async function sendMessage(chatId: string, senderId: string, senderName: string, text: string): Promise<Message> {
  await delay(200);
  const msg: Message = {
    id: `m${Date.now()}`,
    chatId,
    senderId,
    senderName,
    text,
    timestamp: new Date().toISOString(),
    read: false,
  };
  mock.messages.push(msg);
  return msg;
}

export async function getAnnouncements(): Promise<Announcement[]> {
  await delay(); return mock.announcements;
}
