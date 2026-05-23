import {
  REST,
  Routes,
} from 'discord.js';
import { EnerthyaClient } from './client.js';
import { Registry } from './registry.js';
import { CommandContext } from './context.js';
import type { BuilderConfig, CommandDeclaration } from './types.js';

export class EnerthyaBuilder {
  private readonly config: BuilderConfig;
  private readonly registry = new Registry();
  private client?: EnerthyaClient;

  constructor(config: BuilderConfig) {
    this.config = config;
  }

  command(cmd: CommandDeclaration): this {
    this.registry.commands.add(cmd);
    return this;
  }

  commands(list: CommandDeclaration[]): this {
    for (const cmd of list) this.registry.commands.add(cmd);
    return this;
  }

  event(evt: import('./types.js').EventDeclaration): this {
    this.registry.events.add(evt);
    return this;
  }

  component(comp: import('./types.js').ComponentDeclaration): this {
    this.registry.components.add(comp);
    return this;
  }

  build(): EnerthyaClient {
    this.client = new EnerthyaClient({ prefix: this.config.prefix });

    this.attachEvents();
    this.attachPrefixHandler();

    return this.client;
  }

  async start(): Promise<EnerthyaClient> {
    const client = this.build();

    client.once('ready', async () => {
      await this.registerSlashCommands(client);
    });

    await client.login(this.config.token);

    return client;
  }

  private attachEvents(): void {
    if (!this.client) return;

    for (const evt of this.registry.events.items) {
      const handler = (...args: unknown[]) => evt.execute(this.client!, ...args);

      if (evt.once) {
        this.client.once(evt.event, handler as never);
      } else {
        this.client.on(evt.event, handler as never);
      }
    }
  }

  private attachPrefixHandler(): void {
    if (!this.client) return;

    this.client.on('messageCreate', (message) => {
      if (message.author.bot) return;
      if (!message.content.startsWith(this.client!.prefix)) return;

      const args = message.content.slice(this.client!.prefix.length).split(/ +/);
      const commandName = args.shift()?.toLowerCase();
      if (!commandName) return;

      const decl = this.registry.commands.get(commandName);
      if (!decl) return;

      const ctx = new CommandContext(message, args);
      Promise.resolve(decl.execute(ctx)).catch((err: unknown) => console.error(`[Prefix] ${commandName}:`, err));
    });
  }

  private async registerSlashCommands(client: EnerthyaClient): Promise<void> {
    const slashCommands = this.registry.commands.slashable().map(toSlashPayload);

    if (slashCommands.length === 0) return;

    const rest = new REST({ version: '10' }).setToken(this.config.token);

    try {
      const route = this.config.guildId
        ? Routes.applicationGuildCommands(client.user!.id, this.config.guildId)
        : Routes.applicationCommands(client.user!.id);

      await rest.put(route, { body: slashCommands });

      console.info(`Registered ${slashCommands.length} slash commands`);
    } catch (err) {
      console.error('Failed to register slash commands:', err instanceof Error ? err.message : err);
    }
  }
}

function toSlashPayload(cmd: CommandDeclaration) {
  return {
    name: cmd.name,
    description: cmd.description,
    options: cmd.slash?.options ?? [],
  };
}
