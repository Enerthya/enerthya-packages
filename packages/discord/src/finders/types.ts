export interface FinderResult<T> {
  byName(name: string): T | undefined;
  byId(id: string): T | undefined;
  byFilter(predicate: (item: T) => boolean): T | undefined;
  all(): T[];
}

export interface ChannelFinder extends FinderResult<import('discord.js').GuildBasedChannel> {
  inCategoryId(id: string): ChannelFinder;
  inCategoryName(name: string): ChannelFinder;
}

export interface RoleFinder extends FinderResult<import('discord.js').Role> {
  byColor(color: number): import('discord.js').Role | undefined;
  byHexColor(hex: string): import('discord.js').Role | undefined;
}

export interface MemberFinder extends FinderResult<import('discord.js').GuildMember> {
  byUsername(name: string): import('discord.js').GuildMember | undefined;
  byDisplayName(name: string): import('discord.js').GuildMember | undefined;
  byNickname(name: string): import('discord.js').GuildMember | undefined;
}

export interface EmojiFinder extends FinderResult<import('discord.js').GuildEmoji> {}

export interface CommandFinder extends FinderResult<import('discord.js').ApplicationCommand> {}

export interface MessageFinder extends FinderResult<import('discord.js').Message> {
  byContent(content: string): { equals(): MessageFinder; includes(): MessageFinder };
}
