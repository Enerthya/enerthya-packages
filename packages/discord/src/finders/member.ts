import type { Guild, GuildMember } from 'discord.js';
import type { MemberFinder } from './types.js';

export function findMember(guild: Guild): MemberFinder {
  const all = () => [...guild.members.cache.values()];

  return {
    byName: (name: string) => all().find((m) => m.user.username.toLowerCase() === name.toLowerCase()),
    byId: (id: string) => guild.members.cache.get(id),
    byFilter: (predicate) => all().find(predicate),
    byUsername: (name: string) => all().find((m) => m.user.username.toLowerCase() === name.toLowerCase()),
    byDisplayName: (name: string) => all().find((m) => m.displayName.toLowerCase() === name.toLowerCase()),
    byNickname: (name: string) => all().find((m) => m.nickname?.toLowerCase() === name.toLowerCase()),
    all,
  };
}
