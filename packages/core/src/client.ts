import {
  Client,
  GatewayIntentBits,
  Partials,
} from 'discord.js';

export type EnerthyaOptions = {
  prefix?: string;
  intents?: GatewayIntentBits[];
  partials?: Partials[];
};

const DEFAULT_INTENTS: GatewayIntentBits[] = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildModeration,
  GatewayIntentBits.GuildEmojisAndStickers,
  GatewayIntentBits.GuildIntegrations,
  GatewayIntentBits.GuildWebhooks,
  GatewayIntentBits.GuildInvites,
  GatewayIntentBits.GuildVoiceStates,
  GatewayIntentBits.GuildPresences,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.GuildMessageReactions,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildScheduledEvents,
];

const DEFAULT_PARTIALS: Partials[] = [
  Partials.Channel,
  Partials.Message,
  Partials.User,
  Partials.GuildMember,
  Partials.Reaction,
];

export class EnerthyaClient extends Client {
  public readonly prefix: string;

  constructor(options: EnerthyaOptions = {}) {
    super({
      intents: options.intents ?? DEFAULT_INTENTS,
      partials: options.partials ?? DEFAULT_PARTIALS,
    });

    this.prefix = options.prefix ?? '!';
  }
}
