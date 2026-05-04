ja ijm# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # start dev server (http://localhost:3000)
npm run build      # SSR build
npm run generate   # static site build
npm run preview    # preview production build
```

## Architecture

Single-page Nuxt 4 portfolio site. Everything renders from `app/app.vue`, which composes full-page sections in order: Nav → Hero → (ChapterDivider + Section) × 5 → Footer.

**Section layout** (in render order):
1. HeroSection
2. AboutSection
3. ProjectsSection — project data is hardcoded inline in the component's `<script setup>`
4. SkillsSection
5. EventsSection — reads from `app/data/events.ts` (the only external data file)
6. ContactSection

**Scroll animations:** `useReveal` composable (`app/composables/useReveal.ts`) uses IntersectionObserver to toggle the `.on` class on any element with class `reveal`. Called once in `app.vue`; applies site-wide.

**Styling:** No CSS framework. Global tokens defined as CSS custom properties in `app/assets/css/main.css` (colors, font stacks). Component styles use `<style scoped>` and reference those tokens via `var(--token)`. Key tokens: `--accent` (red), `--display` (Playfair Display), `--body` (Syne), `--mono` (JetBrains Mono).

**Data:** Only `app/data/events.ts` is a shared data file. Project data lives directly in `ProjectsSection.vue`. There is no backend, API, or database.
