# AGENTS.md

## Working Principles
- Treat this repository as a small personal content site, not an application platform.
- Preserve the Vue 3 + Vite + Vue Router + Vite SSG stack.
- Keep the output statically deployable. Do not add a backend, runtime SSR server, or full blog framework.
- Prefer pnpm, TypeScript, and small dependencies with clear purpose.
- Treat repo files as UTF-8 unless proven otherwise.
- When reading Chinese text in the terminal, use UTF-8-safe reads such as `Get-Content -Encoding utf8`.

## Content Rules
- Published posts live as Markdown in `src/content/posts`.
- Content pages such as About live as Markdown in `src/content/pages`.
- Parse Markdown content at build time through `plugins/content.ts` and the `virtual:content` module.
- Keep post frontmatter simple and explicit: title, date, summary, tags, draft.
- Keep content page frontmatter simple and explicit: title, summary.
- Draft posts must not appear in lists, generated routes, feeds, or sitemap output.
- Use Vue route pages for interactive or mixed pages; Markdown content pages are content sources, not a replacement for route-level Vue composition.

## Design Direction
- Maintain the restrained, minimal reading experience.
- Favor responsive typography, spacing, borders, and subtle hierarchy over decorative effects.
- Keep light and dark themes consistent through CSS tokens.
- Put shared visual rules in `src/styles/`; avoid one-off component styles unless the style is truly local.
- Keep style files split by responsibility: `base.css` for resets and element defaults, `layout.css` for shell/header/footer, `components.css` for reusable UI pieces, `page-headings.css` for page title/summary patterns, `article.css` for post header/meta/TOC/back-link, `pages.css` for route-level variants, and `prose.css` for Markdown typography.
- Prefer explicit semantic classes for page text roles such as `page-title`, `page-summary`, `article-meta`, `article-title`, and `article-summary`; avoid broad structural selectors like `.page-intro h1` for reusable page systems.
- Route colors, backgrounds, borders, shadows, radii, and layout widths through CSS tokens before adding new values.
- Avoid theme-specific selectors outside `src/styles/tokens.css`, except for library integration cases such as Shiki.
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
