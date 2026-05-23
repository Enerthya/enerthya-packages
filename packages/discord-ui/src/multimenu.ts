import {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
  type Message,
} from 'discord.js';

export interface MultiMenuItem {
  label: string;
  description?: string;
  emoji?: string;
  value: string;
  embed?: EmbedBuilder;
}

export interface MultiMenuOptions {
  items: MultiMenuItem[];
  placeholder?: string;
  title?: string;
  description?: string;
  timeout?: number;
}

export async function multimenu(
  message: Message<true>,
  userId: string,
  options: MultiMenuOptions,
): Promise<string | null> {
  const embed = new EmbedBuilder()
    .setTitle(options.title ?? 'Select an option')
    .setDescription(options.description ?? 'Choose from the list below')
    .setColor(0x238636);

  const select = new StringSelectMenuBuilder()
    .setCustomId('mm_select')
    .setPlaceholder(options.placeholder ?? 'Make a selection')
    .setOptions(
      options.items.map((item) => ({
        label: item.label,
        description: item.description,
        emoji: item.emoji ? { name: item.emoji } : undefined,
        value: item.value,
      })),
    );

  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);
  const reply = await message.reply({ embeds: [embed], components: [row] });

  try {
    const interaction = await reply.awaitMessageComponent({
      componentType: ComponentType.StringSelect,
      time: options.timeout ?? 60_000,
      filter: (i) => i.user.id === userId,
    });

    await interaction.deferUpdate();
    await reply.edit({ components: [] }).catch(() => {});

    return interaction.values[0];
  } catch {
    await reply.edit({ components: [] }).catch(() => {});
    return null;
  }
}
