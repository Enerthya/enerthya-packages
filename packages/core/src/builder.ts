import {
  ApplicationCommandOptionType,
  AutocompleteInteraction,
  ModalSubmitInteraction,
  REST,
  Routes,
} from 'discord.js';
import { EnerthyaClient } from './client.js';
import { Registry } from './registry.js';
import { CommandContext } from './context.js';
import type {
  AutocompleteDeclaration,
  BuilderConfig,
  CommandDeclaration,
  MiddlewareFn,
  ModalDeclaration,
} from './types.js';

export class EnerthyaBuilder {
  private readonly config: BuilderConfig;
  private readonly registry = new Registry();
  private readonly middlewares: MiddlewareFn[] = [];
  private readonly autocompletes: Map<string, AutocompleteDeclaration> = new Map();
  private readonly modals: Map<string, ModalDeclaration> = new Map();
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

  use(mw: MiddlewareFn): this {
    this.middlewares.push(mw);
    return this;
  }

  autocomplete(decl: AutocompleteDeclaration): this {
    this.autocompletes.set(decl.name, decl);
    return this;
  }

  modal(decl: ModalDeclaration): this {
    this.modals.set(decl.customId, decl);
    return this;
  }

  build(): EnerthyaClient {
    this.client = new EnerthyaClient({ prefix: this.config.prefix });

    this.attachEvents();
    this.attachPrefixHandler();
    this.attachAutocompleteHandler();
    this.attachModalHandler();

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

  private async runMiddleware(ctx: CommandContext, execute: () => unknown): Promise<unknown> {
    let index = -1;

    const next = async (): Promise<unknown> => {
      index++;
      if (index < this.middlewares.length) {
        return this.middlewares[index](ctx, next);
      }
      return execute();
    };

    return next();
  }

  private attachEvents(): void {
    if (!this.client) return;

    for (const evt of this.registry.events.items) {
      const handler = (...args: unknown[]) => {
        try {
          return evt.execute(this.client!, ...args);
        } catch (err) {
          console.error(`[Event] ${evt.event}:`, err);
        }
      };

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

      const args = message.content.slice(this.client!.prefix.length).split(/ +/).filter(Boolean);
      const commandName = args.shift()?.toLowerCase();
      if (!commandName) return;

      const decl = this.registry.commands.get(commandName);
      if (!decl) return;

      const ctx = new CommandContext(message, args);

      Promise.resolve(this.runMiddleware(ctx, () => decl.execute(ctx))).catch((err: unknown) => {
        console.error(`[Prefix] ${commandName}:`, err);
        ctx.reply('An error occurred while executing this command.').catch(() => {});
      });
    });
  }

  private attachAutocompleteHandler(): void {
    if (!this.client) return;

    this.client.on('interactionCreate', (interaction) => {
      if (!interaction.isAutocomplete()) return;
      const decl = this.autocompletes.get(interaction.commandName);
      if (!decl) return;

      Promise.resolve(decl.execute(interaction as AutocompleteInteraction)).catch((err: unknown) => {
        console.error(`[Autocomplete] ${interaction.commandName}:`, err);
      });
    });
  }

  private attachModalHandler(): void {
    if (!this.client) return;

    this.client.on('interactionCreate', (interaction) => {
      if (!interaction.isModalSubmit()) return;

      for (const [, decl] of this.modals) {
        if (decl.customId === interaction.customId) {
          Promise.resolve(decl.execute(interaction as ModalSubmitInteraction)).catch((err: unknown) => {
            console.error(`[Modal] ${interaction.customId}:`, err);
          });
          return;
        }
      }
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
  const options: any[] = cmd.slash?.options ?? [];

  if (cmd.subcommands && cmd.subcommands.length > 0) {
    const groups = new Map<string, any[]>();

    for (const sub of cmd.subcommands) {
      if (sub.group) {
        if (!groups.has(sub.group)) {
          groups.set(sub.group, []);
        }
        groups.get(sub.group)!.push({
          type: ApplicationCommandOptionType.Subcommand,
          name: sub.name,
          description: sub.description,
          options: sub.options ?? [],
        });
      } else {
        options.push({
          type: ApplicationCommandOptionType.Subcommand,
          name: sub.name,
          description: sub.description,
          options: sub.options ?? [],
        });
      }
    }

    for (const [groupName, subcommands] of groups) {
      options.push({
        type: ApplicationCommandOptionType.SubcommandGroup,
        name: groupName,
        description: `${groupName} subcommands`,
        options: subcommands,
      });
    }
  }

  return {
    name: cmd.name,
    description: cmd.description,
    options,
  };
}
