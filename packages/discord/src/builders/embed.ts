import {
  EmbedBuilder,
  type APIEmbed,
  type APIEmbedField,
  type ColorResolvable,
  type EmbedData,
  type Guild,
  type GuildMember,
  type User,
} from 'discord.js';
import { EmbedLimit } from '../constants.js';

export interface EmbedPlusData extends Partial<EmbedData> {
  extends?: EmbedPlusData[];
}

export interface EmbedAssetData {
  url: string;
  proxyURL?: string;
  height?: number;
  width?: number;
}

type EmbedAssetInput = string | { url: string; proxyURL?: string; height?: number; width?: number };

export class EmbedPlusBuilder extends EmbedBuilder {
  constructor(data?: EmbedPlusData) {
    super(data);
    if (data?.extends) {
      for (const ext of data.extends) {
        this.update(ext);
      }
    }
  }

  update(data: Partial<EmbedData>): this {
    if (data.color !== undefined) this.setColor(data.color);
    if (data.title) this.setTitle(data.title);
    if (data.description) this.setDescription(data.description);
    if (data.url) this.setURL(data.url);
    if (data.timestamp) this.setTimestamp(new Date(data.timestamp).getTime());
    if (data.author) {
      this.setAuthor({ name: data.author.name, iconURL: data.author.iconURL, url: data.author.url });
    }
    if (data.footer) {
      this.setFooter({ text: data.footer.text, iconURL: data.footer.iconURL });
    }
    if (data.thumbnail) {
      this.setThumbnail(data.thumbnail.url);
    }
    if (data.image) {
      this.setImage(data.image.url);
    }
    if (data.fields) {
      this.spliceFields(0, this.data.fields?.length ?? 0, ...data.fields as APIEmbedField[]);
    }
    return this;
  }

  setColor(color: ColorResolvable | null): this {
    if (color === null) return this;
    return super.setColor(color);
  }

  hasField(name: string): boolean {
    return this.data.fields?.some((f) => f.name === name) ?? false;
  }

  toJSON(): APIEmbed {
    return super.toJSON();
  }
}

export function createEmbed(data?: EmbedPlusData): EmbedPlusBuilder {
  return new EmbedPlusBuilder(data);
}

export function createEmbedAuthor(
  source: User | GuildMember | Guild,
  options?: { name?: string; url?: string },
): { name: string; iconURL?: string; url?: string } {
  const name = options?.name ?? ('displayName' in source ? source.displayName : source.name);
  const iconURL = 'displayAvatarURL' in source
    ? source.displayAvatarURL()
    : source.iconURL() ?? undefined;

  return { name, iconURL, url: options?.url };
}

export function createEmbedFooter(
  text: string,
  iconURL?: string,
): { text: string; iconURL?: string } {
  return { text: text.slice(0, EmbedLimit.Footer), iconURL };
}

export function createEmbedAsset(source: EmbedAssetInput): EmbedAssetData {
  if (typeof source === 'string') return { url: source };
  return source;
}
