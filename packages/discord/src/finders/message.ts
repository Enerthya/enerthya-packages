import type { Message, TextBasedChannel } from 'discord.js';
import type { MessageFinder } from './types.js';

export function findMessage(channel: TextBasedChannel): MessageFinder {
  const all = () => [...channel.messages.cache.values()];

  return {
    byName: () => undefined, // messages don't have names
    byId: (id: string) => channel.messages.cache.get(id),
    byFilter: (predicate) => all().find(predicate),
    byContent: (content: string) => ({
      equals: () => {
        const filtered = () => all().filter((m) => m.content === content);
        return { ...findMessage(channel), all: filtered };
      },
      includes: () => {
        const filtered = () => all().filter((m) => m.content.includes(content));
        return { ...findMessage(channel), all: filtered };
      },
    }),
    all,
  };
}
