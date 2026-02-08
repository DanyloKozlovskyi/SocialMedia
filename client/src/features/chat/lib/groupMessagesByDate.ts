import { Message } from "@entities/chat";

export type ChatListItem = Message | { type: "date-separator"; date: string };

export function groupMessagesByDate(messages: Message[]): ChatListItem[] {
  if (!messages || messages.length === 0) {
    return [];
  }

  const items: ChatListItem[] = [];
  let lastDate: string | null = null;

  messages.forEach((message) => {
    const messageDate = new Date(message.createdAt).toDateString();
    if (messageDate !== lastDate) {
      items.push({ type: "date-separator", date: message.createdAt });
      lastDate = messageDate;
    }
    items.push(message);
  });

  return items;
}
