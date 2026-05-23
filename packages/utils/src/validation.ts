export function isURL(text: string): boolean {
  try {
    new URL(text);
    return true;
  } catch {
    return false;
  }
}

export function isEmail(text: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
}

const SNOWFLAKE_REGEX = /^\d{17,19}$/;

export function isSnowflake(text: string): boolean {
  return SNOWFLAKE_REGEX.test(text);
}

export function sanitize(text: string): string {
  return text
    .replace(/@/g, '\u200B@')
    .replace(/@(everyone|here)/gi, '@\u200B$1')
    .replace(/`/g, '\u200B`')
    .replace(/\|\|/g, '\u200B||')
  ;
}

const HEX_REGEX = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

export function isHexColor(value: string): boolean {
  return HEX_REGEX.test(value);
}

export function isDiscordInvite(text: string): boolean {
  return /discord\.(gg|io|me|li)|discordapp\.com\/invite\/.+/.test(text);
}
