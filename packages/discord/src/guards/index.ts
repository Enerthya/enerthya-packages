import {
  ButtonBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  UserSelectMenuBuilder,
  RoleSelectMenuBuilder,
  ChannelSelectMenuBuilder,
  MentionableSelectMenuBuilder,
  type AnyComponentBuilder,
} from 'discord.js';

export function isButtonBuilder(value: unknown): value is ButtonBuilder {
  return value instanceof ButtonBuilder;
}

export function isEmbedBuilder(value: unknown): value is EmbedBuilder {
  return value instanceof EmbedBuilder;
}

export function isActionRowBuilder(value: unknown): value is ActionRowBuilder<AnyComponentBuilder> {
  return value instanceof ActionRowBuilder;
}

export function isStringSelectMenuBuilder(value: unknown): value is StringSelectMenuBuilder {
  return value instanceof StringSelectMenuBuilder;
}

export function isAnySelectMenuBuilder(
  value: unknown,
): value is StringSelectMenuBuilder | UserSelectMenuBuilder | RoleSelectMenuBuilder | ChannelSelectMenuBuilder | MentionableSelectMenuBuilder {
  return (
    value instanceof StringSelectMenuBuilder ||
    value instanceof UserSelectMenuBuilder ||
    value instanceof RoleSelectMenuBuilder ||
    value instanceof ChannelSelectMenuBuilder ||
    value instanceof MentionableSelectMenuBuilder
  );
}
