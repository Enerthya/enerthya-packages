import { ChannelType, type GuildBasedChannel, type Guild, type CategoryChannel } from 'discord.js';
import type { ChannelFinder } from './types.js';

function filterByType(channels: GuildBasedChannel[], type?: ChannelType): GuildBasedChannel[] {
  return type ? channels.filter((c) => c.type === type) : channels;
}

export function findChannel(guild: Guild, type?: ChannelType): ChannelFinder {
  const all = () => filterByType([...guild.channels.cache.values()], type);

  return {
    byName: (name: string) => all().find((c) => c.name.toLowerCase() === name.toLowerCase()),
    byId: (id: string) => guild.channels.cache.get(id),
    byFilter: (predicate) => all().find(predicate),
    all,
    inCategoryId: (id: string) => {
      const filtered = () => all().filter((c) => c.parentId === id);
      return { ...findChannel(guild, type), all: filtered, byName: (n) => filtered().find((c) => c.name.toLowerCase() === n.toLowerCase()), byId: (id) => guild.channels.cache.get(id), byFilter: (p) => filtered().find(p) };
    },
    inCategoryName: (name: string) => {
      const category = guild.channels.cache.find(
        (c): c is CategoryChannel => c.type === ChannelType.GuildCategory && c.name.toLowerCase() === name.toLowerCase(),
      );
      if (!category) {
        const empty = () => [] as GuildBasedChannel[];
        return { ...findChannel(guild, type), all: empty, byName: () => undefined, byId: () => undefined, byFilter: () => undefined };
      }
      const filtered = () => all().filter((c) => c.parentId === category.id);
      return { ...findChannel(guild, type), all: filtered, byName: (n) => filtered().find((c) => c.name.toLowerCase() === n.toLowerCase()), byId: (id) => guild.channels.cache.get(id), byFilter: (p) => filtered().find(p) };
    },
  };
}
