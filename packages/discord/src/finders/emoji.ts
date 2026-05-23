import type { Guild, GuildEmoji } from 'discord.js';
import type { EmojiFinder } from './types.js';

export function findEmoji(guild: Guild): EmojiFinder {
  const all = () => [...guild.emojis.cache.values()];

  return {
    byName: (name: string) => all().find((e) => e.name?.toLowerCase() === name.toLowerCase()),
    byId: (id: string) => guild.emojis.cache.get(id),
    byFilter: (predicate) => all().find(predicate),
    all,
  };
}
