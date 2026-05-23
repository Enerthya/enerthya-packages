import {
  type Client,
  ChannelType,
  type GuildTextBasedChannel,
} from 'discord.js';

export function getChannelURLInfo(url: string): { channelId: string; guildId?: string } | null {
  const match = url.match(/discord\.com\/channels\/(\d+|@me)\/(\d+)/);
  if (!match) return null;
  return {
    guildId: match[1] === '@me' ? undefined : match[1],
    channelId: match[2],
  };
}

export function getMessageURLInfo(url: string): { guildId?: string; channelId: string; messageId: string } | null {
  const match = url.match(/discord\.com\/channels\/(\d+|@me)\/(\d+)\/(\d+)/);
  if (!match) return null;
  return {
    guildId: match[1] === '@me' ? undefined : match[1],
    channelId: match[2],
    messageId: match[3],
  };
}

export async function fetchMessageFromURL(
  client: Client,
  url: string,
): Promise<import('discord.js').Message | null> {
  const info = getMessageURLInfo(url);
  if (!info) return null;

  if (!info.guildId) return null;

  const guild = client.guilds.cache.get(info.guildId);
  if (!guild) return null;

  const channel = guild.channels.cache.get(info.channelId);
  if (!channel || !('messages' in channel)) return null;

  try {
    return await (channel as GuildTextBasedChannel).messages.fetch(info.messageId);
  } catch {
    return null;
  }
}
