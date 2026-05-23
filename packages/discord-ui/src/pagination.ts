import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
  type Interaction,
  type Message,
} from 'discord.js';

export interface Page {
  embeds: EmbedBuilder[];
  content?: string;
}

export interface PaginationOptions {
  pages: Page[];
  timeout?: number;
  filter?: (i: Interaction) => boolean;
}

const PREV = 'ep_prev';
const NEXT = 'ep_next';
const STOP = 'ep_stop';

export class Pagination {
  private readonly pages: Page[];
  private readonly timeout: number;
  private readonly filter?: (i: Interaction) => boolean;
  private index = 0;
  private message?: Message<true>;
  private readonly channelId: string;
  private readonly guildId: string;
  private readonly userId: string;

  constructor(channelId: string, guildId: string, userId: string, options: PaginationOptions) {
    this.channelId = channelId;
    this.guildId = guildId;
    this.userId = userId;
    this.pages = options.pages;
    this.timeout = options.timeout ?? 60_000;
    this.filter = options.filter;
  }

  private buildRow(): ActionRowBuilder<ButtonBuilder> {
    return new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(PREV)
        .setEmoji('◀')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(this.index === 0),
      new ButtonBuilder()
        .setCustomId(STOP)
        .setEmoji('⏹')
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId(NEXT)
        .setEmoji('▶')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(this.index >= this.pages.length - 1),
    );
  }

  private async render(): Promise<void> {
    const page = this.pages[this.index];
    const payload = { embeds: page.embeds, content: page.content, components: [this.buildRow()] };

    if (this.message) {
      await this.message.edit(payload).catch(() => {});
    }
  }

  async start(message: Message<true>): Promise<Message<true>> {
    this.message = message;

    if (this.pages.length <= 1) return message;

    await this.render();

    const collector = message.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: this.timeout,
      filter: (i) => {
        if (i.user.id !== this.userId) return false;
        return this.filter ? this.filter(i) : true;
      },
    });

    collector.on('collect', async (i) => {
      await i.deferUpdate();

      if (i.customId === PREV && this.index > 0) this.index--;
      else if (i.customId === NEXT && this.index < this.pages.length - 1) this.index++;
      else if (i.customId === STOP) {
        collector.stop('stopped');
        await message.edit({ components: [] }).catch(() => {});
        return;
      }

      await this.render();
    });

    collector.on('end', async () => {
      await message.edit({ components: [] }).catch(() => {});
    });

    return message;
  }

  currentIndex(): number {
    return this.index;
  }

  totalPages(): number {
    return this.pages.length;
  }
}
