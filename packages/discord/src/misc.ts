import { DefaultWebSocketManagerOptions } from 'discord.js';

export function commandMention(name: string, subcommand?: string, subcommandGroup?: string): string {
  let path = name;
  if (subcommandGroup) path += ` ${subcommandGroup}`;
  if (subcommand) path += ` ${subcommand}`;
  return `</${path}:0>`;
}

export function extractMentionId(text: string): string | null {
  const match = text.match(/<(@|#|@&|@!)(\d+)>/);
  return match ? match[2] : null;
}

export function setMobileStatus(): void {
  (DefaultWebSocketManagerOptions.identifyProperties as Record<string, string>).browser = 'Discord Android';
}
