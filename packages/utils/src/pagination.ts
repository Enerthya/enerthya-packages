import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
  Interaction,
  Message,
  TextBasedChannel,
  type TextChannel,
  type NewsChannel,
  type ThreadChannel,
} from 'discord.js';

type SendableChannel = TextChannel | NewsChannel | ThreadChannel;

export interface Page {
  embeds: EmbedBuilder[];
  content?: string;
}

export interface PaginationOptions {
  pages: Page[];
  timeout?: number;
  filter?: (i: Interaction) => boolean;
}

const PREV_ID = 'page_prev';
const NEXT_ID = 'page_next';
const STOP_ID = 'page_stop';

export class Pagination {
  private readonly pages: Page[];
  private readonly timeout: number;
  private readonly filter?: (i: Interaction) => boolean;
  private index = 0;
  private message?: Message<boolean>;
  private channel: TextBasedChannel;
  private userId: string;

  constructor(channel: TextBasedChannel, userId: string, options: PaginationOptions) {
    this.channel = channel;
    this.userId = userId;
    this.pages = options.pages;
    this.timeout = options.timeout ?? 60_000;
    this.filter = options.filter;
  }

  private buildRow(): ActionRowBuilder<ButtonBuilder> {
    const prev = new ButtonBuilder()
      .setCustomId(PREV_ID)
      .setEmoji('◀')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(this.index === 0);

    const stop = new ButtonBuilder()
      .setCustomId(STOP_ID)
      .setEmoji('⏹')
      .setStyle(ButtonStyle.Danger);

    const next = new ButtonBuilder()
      .setCustomId(NEXT_ID)
      .setEmoji('▶')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(this.index >= this.pages.length - 1);

    return new ActionRowBuilder<ButtonBuilder>().addComponents(prev, stop, next);
  }

  private currentPage(): Page {
    return this.pages[this.index];
  }

  private async render(): Promise<void> {
    const page = this.currentPage();
    const row = this.buildRow();

    const payload = {
      embeds: page.embeds,
      content: page.content,
      components: [row],
    };

    if (this.message) {
      await this.message.edit(payload);
    } else if ('send' in this.channel) {
      this.message = await (this.channel as SendableChannel).send(payload);
    }
  }

  async start(): Promise<Message<boolean>> {
    if (this.pages.length <= 1) {
      const page = this.currentPage();
      if ('send' in this.channel) {
        this.message = await (this.channel as SendableChannel).send({
          embeds: page.embeds,
          content: page.content,
        });
      }
      return this.message!;
    }

    await this.render();

    const collector = this.message!.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: this.timeout,
      filter: (i) => {
        if (i.user.id !== this.userId) return false;
        if (this.filter && !this.filter(i)) return false;
        return true;
      },
    });

    collector.on('collect', async (i) => {
      await i.deferUpdate();

      switch (i.customId) {
        case PREV_ID:
          if (this.index > 0) this.index--;
          break;
        case NEXT_ID:
          if (this.index < this.pages.length - 1) this.index++;
          break;
        case STOP_ID:
          collector.stop('stopped');
          await this.message?.edit({ components: [] });
          return;
      }

      await this.render();
    });

    collector.on('end', async () => {
      if (this.message) {
        await this.message.edit({ components: [] }).catch(() => {});
      }
    });

    return this.message!;
  }
}
