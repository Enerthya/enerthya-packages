import {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  type ModalActionRowComponentBuilder,
  type ModalSubmitInteraction,
} from 'discord.js';

export function createModal(options: {
  customId: string;
  title: string;
  components: (TextInputBuilder | ActionRowBuilder<ModalActionRowComponentBuilder>)[];
}): ModalBuilder {
  const modal = new ModalBuilder()
    .setCustomId(options.customId)
    .setTitle(options.title);

  for (const component of options.components) {
    if (component instanceof TextInputBuilder) {
      modal.addComponents(
        new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(component),
      );
    } else {
      modal.addComponents(component);
    }
  }

  return modal;
}

export function createModalInput(options: {
  customId: string;
  label: string;
  style?: TextInputStyle;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  value?: string;
}): TextInputBuilder {
  const input = new TextInputBuilder()
    .setCustomId(options.customId)
    .setLabel(options.label)
    .setStyle(options.style ?? TextInputStyle.Short);

  if (options.placeholder) input.setPlaceholder(options.placeholder);
  if (options.required !== false) input.setRequired(true);
  if (options.minLength) input.setMinLength(options.minLength);
  if (options.maxLength) input.setMaxLength(options.maxLength);
  if (options.value) input.setValue(options.value);

  return input;
}

export function modalFieldsToRecord(
  interaction: ModalSubmitInteraction,
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const actionRow of interaction.components) {
    if (!('components' in actionRow)) continue;
    for (const component of actionRow.components) {
      if ('value' in component && component.type === 4) {
        result[component.customId] = component.value as string;
      }
    }
  }

  return result;
}
