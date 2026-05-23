import { ButtonBuilder, ButtonStyle, ActionRowBuilder, type AnyComponentBuilder } from 'discord.js';

export function createLinkButton(options: { label: string; url: string; emoji?: string }): ButtonBuilder {
  const button = new ButtonBuilder()
    .setLabel(options.label)
    .setStyle(ButtonStyle.Link)
    .setURL(options.url);

  if (options.emoji) button.setEmoji(options.emoji);
  return button;
}

export function createButton(options: {
  customId: string;
  label: string;
  style?: ButtonStyle;
  emoji?: string;
  disabled?: boolean;
}): ButtonBuilder {
  const button = new ButtonBuilder()
    .setCustomId(options.customId)
    .setLabel(options.label)
    .setStyle(options.style ?? ButtonStyle.Primary);

  if (options.emoji) button.setEmoji(options.emoji);
  if (options.disabled) button.setDisabled(true);
  return button;
}

export function wrapButtons(
  buttons: ButtonBuilder[],
  maxPerRow = 5,
): ActionRowBuilder<AnyComponentBuilder>[] {
  const rows: ActionRowBuilder<AnyComponentBuilder>[] = [];

  for (let i = 0; i < buttons.length; i += maxPerRow) {
    rows.push(
      new ActionRowBuilder<AnyComponentBuilder>().addComponents(buttons.slice(i, i + maxPerRow)),
    );
  }

  return rows;
}
