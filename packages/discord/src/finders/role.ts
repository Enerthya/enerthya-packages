import type { Guild, Role } from 'discord.js';
import type { RoleFinder } from './types.js';

export function findRole(guild: Guild): RoleFinder {
  const all = () => [...guild.roles.cache.values()];

  return {
    byName: (name: string) => all().find((r) => r.name.toLowerCase() === name.toLowerCase()),
    byId: (id: string) => guild.roles.cache.get(id),
    byFilter: (predicate) => all().find(predicate),
    byColor: (color: number) => all().find((r) => r.color === color),
    byHexColor: (hex: string) => all().find((r) => r.hexColor.toLowerCase() === hex.toLowerCase()),
    all,
  };
}
