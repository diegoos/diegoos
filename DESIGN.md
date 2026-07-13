---
version: alpha
name: Diego Oliveira
description:
  Personal brand landing for a fullstack software engineer — late-night terminal
  aesthetic with electric accent.
colors:
  primary: '#e8eaed'
  secondary: '#9aa0a8'
  tertiary: '#2b4ff8'
  neutral: '#24272a'
  surface: '#24272a'
  on-surface: '#e8eaed'
  surface-hover: '#2e3136'
  accent-muted: 'color-mix(in srgb, #2b4ff8 18%, transparent)'
typography:
  display:
    fontFamily: Noto Sans
    fontSize: 5.5rem
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: -0.03em
  body-md:
    fontFamily: Noto Sans
    fontSize: 1.125rem
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: 0
  label-sm:
    fontFamily: Noto Sans
    fontSize: 0.875rem
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.04em
rounded:
  sm: 4px
  md: 8px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 32px
  xl: 64px
  page-inline: clamp(1.5rem, 5vw, 4rem)
  page-block: clamp(2rem, 8vh, 6rem)
components:
  page:
    backgroundColor: '{colors.neutral}'
    textColor: '{colors.on-surface}'
  link-social:
    backgroundColor: 'transparent'
    textColor: '{colors.secondary}'
    rounded: '{rounded.md}'
    size: 44px
  link-social-hover:
    backgroundColor: '{colors.surface-hover}'
    textColor: '{colors.primary}'
---

# diegoos design system

## Overview

A single-viewport personal brand page for engineers and hiring peers. The voice
is confident, technical, and restrained — a charcoal workshop at night, not a
SaaS landing. The name is the hero signal; one supporting sentence and three
social links complete the composition. No project cards, no employer line, no
feature grid.

## Colors

Committed dark palette: charcoal field with a single electric accent.

- **Primary (#e8eaed):** Off-white for the name and primary reading text. Soft
  enough to reduce glare on dark backgrounds.
- **Secondary (#9aa0a8):** Muted slate for the greeting, bio, and default social
  icon color.
- **Tertiary (#2b4ff8):** Electric blue — the sole accent for links, focus
  rings, and hover states. Never used as a background flood.
- **Neutral (#24272a):** Page field. Anchors the entire viewport.
- **Surface-hover (#2e3136):** Slightly lifted charcoal for social link hover
  backgrounds.

Atmosphere uses subtle grain and an interactive systems grid. The grid is
invisible by default; under a fine pointer it reveals locally in tertiary blue
tones via a radial mask that follows the cursor. Never purple glow, never a
static accent wash behind the copy.

## Typography

Single family, weight-driven hierarchy:

- **Noto Sans:** Loaded via Astro Fonts API (Google provider, self-hosted at
  build). Display name at 700, greeting/labels at 500, body at 400. Wide glyph
  coverage without a second typeface.

Body copy max width 62ch. Line-height bumped slightly for light-on-dark.

## Layout

Single-viewport editorial manifesto. Content block is horizontally and
vertically centered within `min-height: 100dvh`, capped at `max-width: 62ch`,
with left-aligned text. Generous inline padding via fluid `clamp()`. Social
links sit below the bio, left-aligned with the copy — the only interactive group
on the page.

Hero budget: greeting, name, one bio sentence, social row. Nothing else in the
first viewport.

## Elevation & Depth

Flat by design. Hierarchy comes from type scale, color contrast, and motion —
not shadows. Depth comes from grain and the pointer-revealed grid (tertiary blue
lines only, no cell dots). The grid drifts slowly so it feels alive while
revealed; decorative only — content stays fully readable without it. Disabled
for `prefers-reduced-motion` and coarse pointers. Social hover uses a tonal
surface lift, not drop shadow.

## Shapes

Minimal corner radius: 8px on interactive targets. No cards, no bordered
containers. Social links are square touch targets with rounded corners only
where hover background appears.

## Components

**Social links:** 44×44px minimum touch targets. Default state: secondary color
icon on transparent background. Hover: primary color icon on surface-hover
background. Focus: tertiary accent outline with primary icon color.

**Text reveal:** Hero lines enter with staggered blur-rise (transitions-dev
texts-reveal). Three lines: greeting, name, bio. Respects
`prefers-reduced-motion`.

**Systems grid:** Full-bleed CSS grid always visible at low opacity. Under a
fine pointer, a radial focus layer slightly boosts line opacity without changing
reveal size. After 0.3s idle, several random orthogonal walks leave the pointer
along grid lines, draw past the focus edge, and dissipate (repeats every 1s
while still idle). Decorative only; `pointer-events: none`. Energy disabled for
`prefers-reduced-motion` and coarse pointers; base grid remains.

## Do's and Don'ts

- Do keep the name as the dominant visual signal
- Do use tertiary accent only for interaction, focus, and the grid reveal
- Do maintain WCAG AA contrast on all text and icons
- Do keep the grid subtle — atmosphere, not distraction
- Don't gate readable content behind the pointer reveal
- Don't add project cards, stats, or employer mentions
- Don't use purple gradients, cream backgrounds, or glassmorphism
- Don't bold every line — hierarchy via size and weight, not uniform emphasis
- Don't add a dark/light theme toggle — this page is dark by identity
