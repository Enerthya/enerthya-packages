import { ActionRowBuilder, type AnyComponentBuilder } from 'discord.js';

type ComponentOrNull = AnyComponentBuilder | null | undefined | false;

export function createRow(...components: ComponentOrNull[]): ActionRowBuilder<AnyComponentBuilder> {
  return new ActionRowBuilder<AnyComponentBuilder>().addComponents(
    components.filter((c): c is AnyComponentBuilder => Boolean(c)),
  );
}

export function createComponents(...items: (string | AnyComponentBuilder)[]): ActionRowBuilder<AnyComponentBuilder>[] {
  const rows: ActionRowBuilder<AnyComponentBuilder>[] = [];
  let current: AnyComponentBuilder[] = [];

  for (const item of items) {
    if (typeof item === 'string') {
      if (current.length > 0) {
        rows.push(new ActionRowBuilder<AnyComponentBuilder>().addComponents(current));
        current = [];
      }
    } else {
      current.push(item);
      if (current.length === 5) {
        rows.push(new ActionRowBuilder<AnyComponentBuilder>().addComponents(current));
        current = [];
      }
    }
  }

  if (current.length > 0) {
    rows.push(new ActionRowBuilder<AnyComponentBuilder>().addComponents(current));
  }

  return rows;
}
