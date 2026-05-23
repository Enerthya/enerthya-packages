import {
  StringSelectMenuBuilder,
  UserSelectMenuBuilder,
  RoleSelectMenuBuilder,
  ChannelSelectMenuBuilder,
  MentionableSelectMenuBuilder,
} from 'discord.js';

interface SelectOption {
  label: string;
  value: string;
  description?: string;
  emoji?: string | { name: string; id?: string };
  default?: boolean;
}

export function createStringSelect(options: {
  customId: string;
  placeholder?: string;
  options: SelectOption[];
  minValues?: number;
  maxValues?: number;
  disabled?: boolean;
}): StringSelectMenuBuilder {
  const select = new StringSelectMenuBuilder()
    .setCustomId(options.customId)
    .setOptions(options.options);

  if (options.placeholder) select.setPlaceholder(options.placeholder);
  if (options.minValues) select.setMinValues(options.minValues);
  if (options.maxValues) select.setMaxValues(options.maxValues);
  if (options.disabled) select.setDisabled(true);

  return select;
}

export function createUserSelect(options: {
  customId: string;
  placeholder?: string;
  minValues?: number;
  maxValues?: number;
}): UserSelectMenuBuilder {
  const select = new UserSelectMenuBuilder().setCustomId(options.customId);
  if (options.placeholder) select.setPlaceholder(options.placeholder);
  if (options.minValues) select.setMinValues(options.minValues);
  if (options.maxValues) select.setMaxValues(options.maxValues);
  return select;
}

export function createRoleSelect(options: {
  customId: string;
  placeholder?: string;
  minValues?: number;
  maxValues?: number;
}): RoleSelectMenuBuilder {
  const select = new RoleSelectMenuBuilder().setCustomId(options.customId);
  if (options.placeholder) select.setPlaceholder(options.placeholder);
  if (options.minValues) select.setMinValues(options.minValues);
  if (options.maxValues) select.setMaxValues(options.maxValues);
  return select;
}

export function createChannelSelect(options: {
  customId: string;
  placeholder?: string;
  minValues?: number;
  maxValues?: number;
}): ChannelSelectMenuBuilder {
  const select = new ChannelSelectMenuBuilder().setCustomId(options.customId);
  if (options.placeholder) select.setPlaceholder(options.placeholder);
  if (options.minValues) select.setMinValues(options.minValues);
  if (options.maxValues) select.setMaxValues(options.maxValues);
  return select;
}

export function createMentionableSelect(options: {
  customId: string;
  placeholder?: string;
  minValues?: number;
  maxValues?: number;
}): MentionableSelectMenuBuilder {
  const select = new MentionableSelectMenuBuilder().setCustomId(options.customId);
  if (options.placeholder) select.setPlaceholder(options.placeholder);
  if (options.minValues) select.setMinValues(options.minValues);
  if (options.maxValues) select.setMaxValues(options.maxValues);
  return select;
}
