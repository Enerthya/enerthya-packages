import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
  type Message,
  type InteractionReplyOptions,
} from 'discord.js';
import { createRow } from '@enerthya/discord';

export type ConfirmResult = 'confirm' | 'cancel' | 'timeout';

export interface ConfirmOptions {
  confirmLabel?: string;
  cancelLabel?: string;
  confirmStyle?: ButtonStyle;
  cancelStyle?: ButtonStyle;
  timeout?: number;
}

export async function confirm(
  message: Message<true>,
  userId: string,
  content: string | InteractionReplyOptions | EmbedBuilder,
  options: ConfirmOptions = {},
): Promise<ConfirmResult> {
  const confirmBtn = new ButtonBuilder()
    .setCustomId('cf_yes')
    .setLabel(options.confirmLabel ?? 'Confirm')
    .setStyle(options.confirmStyle ?? ButtonStyle.Success);

  const cancelBtn = new ButtonBuilder()
    .setCustomId('cf_no')
    .setLabel(options.cancelLabel ?? 'Cancel')
    .setStyle(options.cancelStyle ?? ButtonStyle.Danger);

  const row = createRow(confirmBtn, cancelBtn);

  const payload: any = { components: [row] };
  if (typeof content === 'string') payload.content = content;
  else if (content instanceof EmbedBuilder) payload.embeds = [content];
  else Object.assign(payload, content);

  const reply = await message.reply(payload);

  try {
    const interaction = await reply.awaitMessageComponent({
      componentType: ComponentType.Button,
      time: options.timeout ?? 30_000,
      filter: (i) => i.user.id === userId,
    });

    await interaction.deferUpdate();
    await reply.edit({ components: [] }).catch(() => {});

    return interaction.customId === 'cf_yes' ? 'confirm' : 'cancel';
  } catch {
    await reply.edit({ components: [] }).catch(() => {});
    return 'timeout';
  }
}
