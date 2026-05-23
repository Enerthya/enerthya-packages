import type { EnerthyaClient } from '@enerthya/core';
import { AuditLogEvent, Events, type Guild, type GuildMember, type Role, type TextChannel, type User, type VoiceChannel, type VoiceState } from 'discord.js';

declare module 'discord.js' {
  interface ClientEvents {
    extendedRoleCreate: [role: Role, executor: User | null];
    extendedRoleDelete: [role: Role, executor: User | null];
    extendedRoleUpdate: [oldRole: Role, newRole: Role, executor: User | null];
    extendedChannelDelete: [channel: TextChannel, executor: User | null];
    guildMemberConnect: [member: GuildMember, channel: VoiceChannel, oldChannel: VoiceChannel | null];
    guildMemberDisconnect: [member: GuildMember, channel: VoiceChannel, newChannel: VoiceChannel | null];
    guildMemberMoved: [member: GuildMember, executor: User | null, oldChannel: VoiceChannel, newChannel: VoiceChannel];
    guildMemberTimeoutAdd: [member: GuildMember, executor: User | null, expireAt: Date | null, reason: string | null];
    guildMemberTimeoutRemove: [member: GuildMember, executor: User | null];
    userBanAdd: [user: User, executor: User | null, reason: string | null, guild: Guild];
    userBanRemove: [user: User, executor: User | null, guild: Guild];
    userKick: [user: User, executor: User | null, reason: string | null, guild: Guild];
  }
}

async function fetchAuditLogExecutor(guild: Guild, event: AuditLogEvent, targetId: string): Promise<User | null> {
  try {
    const entry = await guild.fetchAuditLogs({ limit: 1, type: event }).catch(() => null);
    const log = entry?.entries.find((e) => e.targetId === targetId);
    return (log?.executor as User | null) ?? null;
  } catch {
    return null;
  }
}

function isVoiceChannel(c: unknown): c is VoiceChannel {
  return typeof c === 'object' && c !== null && 'type' in c && (c as any).type === 2;
}

export function initDiscordEvents(client: EnerthyaClient): void {
  // Role events
  client.on(Events.GuildRoleCreate, async (role) => {
    const executor = await fetchAuditLogExecutor(role.guild, AuditLogEvent.RoleCreate, role.id);
    client.emit('extendedRoleCreate' as any, role, executor);
  });

  client.on(Events.GuildRoleDelete, async (role) => {
    const executor = await fetchAuditLogExecutor(role.guild, AuditLogEvent.RoleDelete, role.id);
    client.emit('extendedRoleDelete' as any, role, executor);
  });

  client.on(Events.GuildRoleUpdate, async (oldRole, newRole) => {
    const executor = await fetchAuditLogExecutor(newRole.guild, AuditLogEvent.RoleUpdate, newRole.id);
    client.emit('extendedRoleUpdate' as any, oldRole, newRole, executor);
  });

  // Channel events
  client.on(Events.ChannelDelete, async (channel) => {
    if (!channel.isTextBased() || !('guild' in channel) || !channel.guild) return;
    const executor = await fetchAuditLogExecutor(channel.guild, AuditLogEvent.ChannelDelete, channel.id);
    client.emit('extendedChannelDelete' as any, channel, executor);
  });

  // Voice state events
  const voiceStates = new Map<string, VoiceState | null>();

  client.on(Events.VoiceStateUpdate, (oldState, newState) => {
    const member = newState.member;
    if (!member) return;

    const oldChannel = oldState.channel;
    const newChannel = newState.channel;

    if (!oldChannel && newChannel && isVoiceChannel(newChannel)) {
      client.emit('guildMemberConnect' as any, member, newChannel, null);
    } else if (oldChannel && !newChannel && isVoiceChannel(oldChannel)) {
      client.emit('guildMemberDisconnect' as any, member, oldChannel, null);
    } else if (oldChannel && newChannel && oldChannel.id !== newChannel.id && isVoiceChannel(oldChannel) && isVoiceChannel(newChannel)) {
      client.emit('guildMemberMoved' as any, member, null, oldChannel, newChannel);
    }
  });

  // Timeout events
  client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
    const oldTimeout = oldMember.communicationDisabledUntilTimestamp;
    const newTimeout = newMember.communicationDisabledUntilTimestamp;

    if (!oldTimeout && newTimeout) {
      const executor = await fetchAuditLogExecutor(newMember.guild, AuditLogEvent.MemberUpdate, newMember.id);
      client.emit('guildMemberTimeoutAdd' as any, newMember, executor, newMember.communicationDisabledUntil, null);
    } else if (oldTimeout && !newTimeout) {
      const executor = await fetchAuditLogExecutor(newMember.guild, AuditLogEvent.MemberUpdate, newMember.id);
      client.emit('guildMemberTimeoutRemove' as any, newMember, executor);
    }
  });

  // Ban/Unban events
  client.on(Events.GuildBanAdd, async (ban) => {
    const executor = await fetchAuditLogExecutor(ban.guild, AuditLogEvent.MemberBanAdd, ban.user.id);
    client.emit('userBanAdd' as any, ban.user, executor, ban.reason, ban.guild);
  });

  client.on(Events.GuildBanRemove, async (ban) => {
    const executor = await fetchAuditLogExecutor(ban.guild, AuditLogEvent.MemberBanRemove, ban.user.id);
    client.emit('userBanRemove' as any, ban.user, executor, ban.guild);
  });

  // Kick events (via guildAuditLogEntryCreate in v14)
  client.on(Events.GuildAuditLogEntryCreate, (entry, guild) => {
    if (entry.action === AuditLogEvent.MemberKick) {
      const executor = entry.executor;
      client.emit('userKick' as any, entry.target as User, executor, entry.reason, guild);
    }
  });
}
