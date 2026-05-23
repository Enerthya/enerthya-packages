#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const TEMPLATE_DIR = join(__dirname, '..', 'template');

const config = {
  name: process.argv[2] || 'my-enerthya-bot',
};

const root = join(process.cwd(), config.name);

if (existsSync(root)) {
  console.error(`Directory "${config.name}" already exists.`);
  process.exit(1);
}

mkdirSync(root, { recursive: true });

const files: Record<string, string> = {
  'package.json': JSON.stringify(
    {
      name: config.name,
      version: '0.1.0',
      type: 'module',
      private: true,
      scripts: {
        dev: 'tsx watch src/index.ts',
        build: 'tsc',
        start: 'node dist/index.js',
      },
      dependencies: {
        '@enerthya/core': '^0.1.3',
        '@enerthya/utils': '^0.1.3',
        '@enerthya/discord': '^0.1.3',
        '@enerthya/discord-ui': '^0.1.3',
        'discord.js': '^14.16.0',
      },
      devDependencies: {
        typescript: '^5.9.3',
        tsx: '^4.19.0',
        '@types/node': '^22.16.4',
      },
    },
    null,
    2,
  ),
  'tsconfig.json': JSON.stringify(
    {
      compilerOptions: {
        target: 'ESNext',
        module: 'NodeNext',
        moduleResolution: 'NodeNext',
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        outDir: './dist',
        rootDir: './src',
        resolveJsonModule: true,
      },
      include: ['src'],
    },
    null,
    2,
  ),
  '.env.example': `# Discord
DISCORD_TOKEN=your_bot_token_here
DISCORD_PREFIX=!
DISCORD_GUILD_ID=your_guild_id_here

# Bot owners (comma-separated)
OWNERS=123456789012345678
`,
  'src/index.ts': `import { EnerthyaBuilder } from '@enerthya/core';
import { info } from '@enerthya/utils';

const builder = new EnerthyaBuilder({
  token: process.env.DISCORD_TOKEN ?? '',
  prefix: process.env.DISCORD_PREFIX ?? '!',
  guildId: process.env.DISCORD_GUILD_ID,
});

// --- Ping command ---
builder.command({
  name: 'ping',
  description: 'Check bot latency',
  slash: { enabled: true },
  execute: async (ctx) => {
    const latency = Date.now() - ctx.createdTimestamp;
    await ctx.reply(\`Pong! \\\`\${latency}ms\\\`\`);
  },
});

// Start
builder.start();

info('Bot is starting...');
`,
};

for (const [path, content] of Object.entries(files)) {
  const fullPath = join(root, path);
  const dir = dirname(fullPath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(fullPath, content, 'utf-8');
}

console.log(`
✨ Created "${config.name}" successfully!

  cd ${config.name}
  cp .env.example .env
  npm install
  npm run dev

Happy coding! 🚀
`);
