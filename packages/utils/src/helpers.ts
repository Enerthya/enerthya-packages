import { ChannelType, PermissionFlagsBits } from 'discord.js';

export function hasLink(text: string): boolean {
  return /https?:\/\/[^\s]+/.test(text);
}

export function hasInvite(text: string): boolean {
  return /discord\.(gg|io|me|li)|discordapp\.com\/invite\/.+/.test(text);
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function isHex(value: string): boolean {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value);
}

export function hourDiff(a: Date, b: Date): number {
  return Math.abs((a.getTime() - b.getTime()) / 3_600_000);
}

export function timeLeft(target: Date): string {
  const diff = target.getTime() - Date.now();

  if (diff <= 0) return 'now';

  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const mins = Math.floor((diff % 3_600_000) / 60_000);

  const parts: string[] = [];

  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (mins) parts.push(`${mins}m`);

  return parts.join(' ') || 'now';
}

export function formatTime(seconds: number): string {
  const days = Math.floor(seconds / 86_400);
  const hours = Math.floor((seconds % 86_400) / 3_600);
  const mins = Math.floor((seconds % 3_600) / 60);
  const secs = seconds % 60;

  const parts: string[] = [];

  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (mins) parts.push(`${mins}m`);
  parts.push(`${secs}s`);

  return parts.join(' ');
}

export function escapeMarkdown(text: string): string {
  return text.replace(/([*_~`|>\\])/g, '\\$1');
}

export function chunk(text: string, max = 2_000): string[] {
  if (text.length <= max) return [text];

  const result: string[] = [];
  let buf = '';

  for (const line of text.split('\n')) {
    const candidate = buf ? `${buf}\n${line}` : line;

    if (candidate.length > max) {
      result.push(buf);
      buf = line;
    } else {
      buf = candidate;
    }
  }

  if (buf) result.push(buf);

  return result;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const PERM_LABELS: Record<string, bigint> = {
  'Create Invite': PermissionFlagsBits.CreateInstantInvite,
  'Manage Roles': PermissionFlagsBits.ManageRoles,
  'Manage Channels': PermissionFlagsBits.ManageChannels,
  'Manage Server': PermissionFlagsBits.ManageGuild,
  'Kick Members': PermissionFlagsBits.KickMembers,
  'Ban Members': PermissionFlagsBits.BanMembers,
  Administrator: PermissionFlagsBits.Administrator,
  'Manage Messages': PermissionFlagsBits.ManageMessages,
  'Manage Nicknames': PermissionFlagsBits.ManageNicknames,
  'Read History': PermissionFlagsBits.ReadMessageHistory,
  '@everyone': PermissionFlagsBits.MentionEveryone,
  Connect: PermissionFlagsBits.Connect,
  Speak: PermissionFlagsBits.Speak,
  Mute: PermissionFlagsBits.MuteMembers,
  Deafen: PermissionFlagsBits.DeafenMembers,
  Move: PermissionFlagsBits.MoveMembers,
};

const PERM_BY_VALUE = new Map(Object.entries(PERM_LABELS).map(([k, v]) => [v, k]));

export function permissionLabel(flag: bigint): string {
  return PERM_BY_VALUE.get(flag) ?? 'Unknown';
}

export function permissionLabels(flags: bigint[]): string[] {
  return flags.map(permissionLabel);
}

const CHANNEL_LABELS: Record<number, string> = {
  [ChannelType.GuildText]: 'Text',
  [ChannelType.GuildVoice]: 'Voice',
  [ChannelType.GuildCategory]: 'Category',
  [ChannelType.GuildAnnouncement]: 'Announcement',
  [ChannelType.AnnouncementThread]: 'Announcement Thread',
  [ChannelType.PublicThread]: 'Public Thread',
  [ChannelType.PrivateThread]: 'Private Thread',
  [ChannelType.GuildStageVoice]: 'Stage',
  [ChannelType.GuildForum]: 'Forum',
};

export function channelLabel(type: number): string {
  return CHANNEL_LABELS[type] ?? 'Unknown';
}
