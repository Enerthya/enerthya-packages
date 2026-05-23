export const InvisibleChar = '\u200b';

export const EmbedLimit = {
  Title: 256,
  Description: 4096,
  FieldName: 256,
  FieldValue: 1024,
  Fields: 25,
  Footer: 2048,
  AuthorName: 256,
  Total: 6000,
} as const;

export const Separator = {
  Default: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
  Large: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
  Small: '━━━━━━━━━━━━━━━━━━━',
  Hidden: InvisibleChar,
  Double: '═══════════════════════════════════════════════════════════',
} as const;
