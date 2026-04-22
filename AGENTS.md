# AGENTS.md

## Working Principles
- Treat this repository as a small personal content site, not an application platform.
- Preserve the Vue 3 + Vite + Vue Router + Vite SSG stack.
- Keep the output statically deployable. Do not add a backend, runtime SSR server, or full blog framework.
- Prefer pnpm, TypeScript, and small dependencies with clear purpose.
- Treat repo files as UTF-8 unless proven otherwise.
- When reading Chinese text in the terminal, use UTF-8-safe reads such as `Get-Content -Encoding utf8`.

## Content Rules
- Published content lives as Markdown in `src/content/posts`.
- Parse content at build time through the existing Vite plugin path.
- Keep frontmatter simple and explicit: title, date, summary, tags, draft.
- Draft posts must not appear in lists, generated routes, feeds, or sitemap output.

## Design Direction
- Maintain the restrained, minimal reading experience.
- Favor responsive typography, spacing, borders, and subtle hierarchy over decorative effects.
- Keep light and dark themes consistent through CSS tokens.
- Avoid heavy UI libraries and avoid turning the site into a dashboard or docs theme.

## Code Shape
- Keep rendering components small and content logic out of page components.
- Reuse existing helpers for slugs, site metadata, post lookup, tags, dates, SEO, feeds, and static routes.
- Put shared types in `src/lib/types.ts`; avoid duplicating content contracts.
- Keep build-time code in `plugins/` or Vite config, and browser-facing code under `src/`.

## Change Discipline
- Do not introduce unrelated features while touching content, routing, SEO, or styling.
- Run `pnpm lint` and `pnpm build` after meaningful changes.
- If adding a dependency, explain why it is worth the extra weight.
- When changing site metadata, update `src/config/site.json` rather than scattering constants.
