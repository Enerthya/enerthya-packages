import type { Client, ApplicationCommand } from 'discord.js';
import type { CommandFinder } from './types.js';

export function findCommand(client: Client): CommandFinder {
  const all = () => [...client.application!.commands.cache.values()];

  return {
    byName: (name: string) => all().find((c) => c.name.toLowerCase() === name.toLowerCase()),
    byId: (id: string) => client.application!.commands.cache.get(id),
    byFilter: (predicate) => all().find(predicate),
    all,
  };
}
