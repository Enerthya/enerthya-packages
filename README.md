<p align="center">
  <img src="https://raw.githubusercontent.com/Enerthya/enerthya-packages/main/assets/banner.svg" alt="Enerthya Banner" width="100%">
</p>

<p align="center">
  <a href="https://github.com/Enerthya/enerthya-packages">
    <img src="https://img.shields.io/badge/github-Enerthya/enerthya--packages-238636?style=flat&logo=github" alt="GitHub">
  </a>
  <img src="https://img.shields.io/badge/license-MIT-238636?style=flat" alt="MIT License">
  <img src="https://img.shields.io/badge/node-%3E%3D20.12-238636?style=flat&logo=node.js" alt="Node">
  <img src="https://img.shields.io/badge/typescript-5.9-238636?style=flat&logo=typescript" alt="TypeScript">
</p>

Monorepo for the Enerthya Discord bot framework — modular, type-safe, and built for scale.

## Packages

| Package | Description |
|---------|-------------|
| [`@enerthya/all`](packages/all) | Bundle package — install everything with a single dependency |
| [`@enerthya/core`](packages/core) | Application framework — client, builder, registry, command context |
| [`@enerthya/utils`](packages/utils) | General-purpose utilities — logging, cooldowns, formatting helpers |

## Getting Started

```bash
npm install
npm run build
npm run test
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Build all packages |
| `npm run check` | Type-check all packages |
| `npm run lint` | Lint with ESLint |
| `npm run format` | Format with Prettier |
| `npm run test` | Run tests with Vitest |

## License

[MIT](LICENSE)
