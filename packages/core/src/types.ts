import {
  ApplicationCommandOptionData,
  PermissionResolvable,
  ClientEvents,
  Interaction,
  CacheType,
} from 'discord.js';
import { CommandContext } from './context.js';

export type CommandHandler = (ctx: CommandContext) => unknown;

export type MenuType = 'USER' | 'MESSAGE';

export interface CommandDeclaration {
  name: string;
  description: string;
  aliases?: string[];
  category?: string;
  cooldown?: number;
  premium?: boolean;
  permissions?: {
    user?: PermissionResolvable[];
    bot?: PermissionResolvable[];
  };
  prefix?: {
    enabled: boolean;
    usage?: string;
    minArgs?: number;
  };
  slash?: {
    enabled: boolean;
    ephemeral?: boolean;
    options?: ApplicationCommandOptionData[];
  };
  execute: CommandHandler;
}

export interface MenuDeclaration {
  name: string;
  type: MenuType;
  cooldown?: number;
  permissions?: {
    user?: PermissionResolvable[];
    bot?: PermissionResolvable[];
  };
  execute: CommandHandler;
}

export interface EventDeclaration {
  name: string;
  event: keyof ClientEvents;
  once?: boolean;
  execute: (client: import('./client.js').EnerthyaClient, ...args: unknown[]) => unknown;
}

export interface ComponentDeclaration {
  id: string;
  type:
    | 'BUTTON'
    | 'STRING_SELECT'
    | 'USER_SELECT'
    | 'ROLE_SELECT'
    | 'CHANNEL_SELECT'
    | 'MENTIONABLE_SELECT'
    | 'MODAL';
  cache?: boolean;
  parse?: (params: Record<string, string>) => Record<string, unknown>;
  execute: (interaction: Interaction<CacheType>, params: Record<string, unknown>) => unknown;
}

export interface BuilderConfig {
  token: string;
  prefix?: string;
  owners?: string[];
  mongoUri?: string;
  guildId?: string;
}
