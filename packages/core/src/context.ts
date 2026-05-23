import {
  ChatInputCommandInteraction,
  ContextMenuCommandInteraction,
  EmbedBuilder,
  Guild,
  GuildMember,
  InteractionReplyOptions,
  Message,
  MessagePayload,
  User,
} from 'discord.js';

export type Source = Message | ChatInputCommandInteraction | ContextMenuCommandInteraction;
export type ReplyContent = string | InteractionReplyOptions | MessagePayload | EmbedBuilder;

export class CommandContext {
  public readonly type: 'message' | 'slash' | 'menu';
  public readonly args: string[];
  public readonly guild: Guild | null;
  public readonly user: User;
  public readonly member: GuildMember | null;
  public readonly channel: any;

  private readonly source: Source;

  constructor(source: Source, args: string[] = []) {
    this.source = source;
    this.args = args;
    this.guild = source.guild;
    this.member = source.member as GuildMember | null;
    this.channel = source.channel;

    if (source instanceof Message) {
      this.type = 'message';
      this.user = source.author;
    } else {
      this.user = source.user;
      this.type = source.isChatInputCommand() ? 'slash' : 'menu';
    }
  }

  get isMessage(): boolean {
    return this.type === 'message';
  }

  get isSlash(): boolean {
    return this.type === 'slash';
  }

  async reply(content: ReplyContent): Promise<unknown> {
    if (content instanceof EmbedBuilder) {
      return this.reply({ embeds: [content] });
    }

    if (this.source instanceof Message) {
      const ch = this.source.channel;
      if (!ch || !('send' in ch)) return undefined;
      return (ch as any).send(content as string | MessagePayload | InteractionReplyOptions);
    }

    if (this.source.deferred || this.source.replied) {
      return this.source.editReply(content as any);
    }

    return this.source.reply(content as any);
  }

  async defer(ephemeral = false): Promise<void> {
    if (!(this.source instanceof Message)) {
      await this.source.deferReply({ ephemeral });
    }
  }

  async edit(content: ReplyContent): Promise<unknown> {
    if (content instanceof EmbedBuilder) {
      return this.edit({ embeds: [content] });
    }

    if (this.source instanceof Message) {
      return this.source.edit(content as string);
    }

    return this.source.editReply(content as any);
  }

  async delete(): Promise<void> {
    if (this.source instanceof Message && this.source.deletable) {
      await this.source.delete();
    }
  }

  option(name: string): string | number | boolean | undefined {
    if (!('options' in this.source)) return undefined;
    return this.source.options.get(name)?.value;
  }
}
