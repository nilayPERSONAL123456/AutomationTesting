# CatalystRight — Design System

CatalystRight's visual language is inspired by **Linear**, **Vercel**, **Datadog**,
**Retool**, **Palantir**, and Oracle's modern **Redwood** language — with a clear bias
toward calm, dense enterprise interfaces rather than consumer AI aesthetics.

## 1. Principles

1. **Calm density** — information-first, no decorative gradients or oversized hero sections.
2. **Predictable hierarchy** — neutral surface palette; color reserved for state and action.
3. **Command over chat** — the app reads as an execution console, not a conversation.
4. **Evidence over claims** — every AI assertion is accompanied by captured evidence.

## 2. Palette (Dark — default)

| Token                   | Hex       | Role                            |
| ----------------------- | --------- | ------------------------------- |
| `--bg`                  | `#07080A` | App background                  |
| `--surface`             | `#0D0F13` | Card background                 |
| `--surface-2`           | `#12151B` | Elevated panel                  |
| `--surface-3`           | `#181C24` | Popover / modal                 |
| `--border`              | `#1E222C` | Default border                  |
| `--border-strong`       | `#2A2F3A` | Hovered / focused border        |
| `--fg`                  | `#E6E8EC` | Primary text                    |
| `--fg-muted`            | `#9BA1AC` | Secondary text                  |
| `--fg-subtle`           | `#636874` | Tertiary text / icons           |
| `--accent`              | `#7C5CFF` | Primary (CatalystRight violet)  |
| `--accent-2`            | `#22D3EE` | Secondary (cyan)                |
| `--success`             | `#10B981` | Passed / healthy                |
| `--warning`             | `#F59E0B` | Retrying / attention            |
| `--danger`              | `#EF4444` | Failed                          |
| `--info`                | `#3B82F6` | Informational                   |

## 3. Typography

- **Sans**: Inter (variable), tracking `-0.01em` on headings.
- **Mono**: JetBrains Mono — used for IDs, logs, JSON, code.
- Scale: `11/12/13/14/16/20/24/32`. Default body `13px/20px`.

## 4. Spacing & Radius

- 4px base grid. Dense list rows 32px, cards padded `16` or `20`.
- Radii: `4` (inputs), `8` (cards), `12` (panels), `999` (pills).

## 5. Motion

- 120–220ms ease-out for all state changes.
- Only animate **state transitions** (node activation, timeline progression). Never animate layout for decoration.
- Framer Motion `layoutId` used for run-card → run-detail transitions.

## 6. Component Patterns

### 6.1 App Shell
Fixed left sidebar (240px) + top command bar (52px). Main content scrolls; shell does not.

### 6.2 Status Pill
```
[●] Running    accent    with subtle pulse
[✓] Passed     success
[!] Retrying   warning
[✕] Failed     danger
[ ] Pending    subtle
```

### 6.3 Execution Node (React Flow)
- 240×88 card with status stripe (left 3px), title, sub-label, timing.
- Edges color-coded by dependency type (`data`, `approval`, `validation`).

### 6.4 Live Log Line
Monospace, columns: timestamp (muted) · level pill · message · optional screenshot thumb.

### 6.5 Evidence Card
16:10 screenshot · overlay with step name, transaction ID, timestamp · click to open lightbox.

## 7. Accessibility

- All interactive elements keyboard reachable; focus ring uses `--accent` at 2px.
- Contrast ratio ≥ 4.5:1 for text on surfaces.
- Status conveyed by both color and icon/text (never color alone).

## 8. Don'ts

- No full-width gradient banners.
- No chat bubbles. No "Ask me anything" hero.
- No emoji icons. Use Lucide icon set, stroke 1.5.
- No toy shadows. Use hairline borders + one elevation layer.
