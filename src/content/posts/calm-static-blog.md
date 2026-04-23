---
title: Building a Calm Static Blog
date: 2026-04-20
summary: A few notes on keeping a personal site small, fast, and easy to change.
tags:
  - Vue
  - SSG
  - Notes
---

<!-- toc -->

A personal blog gets easier to maintain when the moving parts stay visible. Markdown files are enough
for most posts, and static output keeps deployment simple.

## Keep the Surface Small

The important tradeoff is choosing where complexity belongs. For this site, content parsing happens at
build time, while the runtime only has to hydrate a small Vue app.

## The Small Contract

```ts
export interface Post {
  title: string
  date: string
  summary: string
  slug: string
}
```

That leaves the writing experience almost boring, which is exactly the point.
