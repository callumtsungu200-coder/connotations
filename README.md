# Quartets

An unlimited word-grouping puzzle game, inspired by the "find four groups of four" genre. Built with React and TypeScript, it runs entirely in the browser: no backend, accounts or external APIs.

Sixteen words, four hidden categories, four mistakes allowed. When you finish, a fresh puzzle is dealt straight away, so you can keep playing for as long as you like.

## Features

**Gameplay**

- A 4×4 grid of words. Select four and submit.
- Correct groups collapse into a coloured row. Colours go from yellow (straightforward) to purple (tricky).
- Four mistakes maximum, with a **"One away…"** hint when three of your four words belong together.
- Repeating a guess you already made doesn't cost a mistake.
- Shuffle the board, deselect words one at a time, or deselect all at once.
- Win and loss screens with a colour grid of your guesses. After a loss, every answer is revealed on the board one group at a time and listed in the result dialog.
- **Copy result** puts a shareable emoji grid on your clipboard.

**Unlimited play**

- 50 original, hand-checked puzzles.
- A new puzzle after every game. Puzzles you haven't seen come first. Once you've seen them all, the next one is picked from the least recently played half, so nothing repeats soon after you played it.
- **Replay** lets you play the same puzzle again. Replays don't count towards your statistics.
- If you close the tab mid-game, you pick up where you left off.

**Statistics** (stored in `localStorage`)

- Games played, won and lost, and win percentage
- Current and longest winning streak
- Average mistakes per game
- Best performance (fewest mistakes in a win) and a chart of wins by mistakes made
- Reset statistics, with a confirmation step

**Design**

- A minimal, responsive layout that works from 320 px phones up to desktop.
- Light and dark themes. It follows your system setting until you pick one, then remembers your choice. The saved theme is applied before first paint, so the page doesn't flash.
- Smooth selection, a staggered "hop" on submit, a shake on wrong guesses, tiles that glide into place on shuffle (FLIP animation), and solved rows that pop in.
- Long words shrink to fit their tile and wrap at a soft hyphen on narrow screens instead of getting too small to read.
- Respects `prefers-reduced-motion`. Tiles are real buttons with `aria-pressed`, dialogs close with <kbd>Esc</kbd>, and focus returns to where it was.

## Getting started

Requires Node.js 20 or newer.

```bash
npm install
npm run dev        # start the dev server at http://localhost:5173
```

| Script              | What it does                                   |
| ------------------- | ---------------------------------------------- |
| `npm run dev`       | Start the Vite dev server with hot reload      |
| `npm run build`     | Type-check, then build to `dist/`              |
| `npm run preview`   | Serve the production build locally             |
| `npm test`          | Run the full test suite once                   |
| `npm run test:watch`| Run tests in watch mode                        |
| `npm run typecheck` | Type-check only                                |
| `npm run validate-puzzles` | Run only the puzzle-collection checks   |

## Project structure

```
src/
├── App.tsx                 # Layout, header, controls, modals, toasts
├── App.test.tsx            # End-to-end gameplay tests (React Testing Library)
├── styles.css              # Theme tokens, layout, animations
├── useTheme.ts             # Light/dark mode with persistence
├── components/
│   ├── Board.tsx           # Word grid with FLIP shuffle animation
│   ├── SolvedGroup.tsx     # Coloured solved/revealed category row
│   ├── Modal.tsx           # Accessible dialog
│   ├── HelpContent.tsx     # How to play
│   ├── ResultContent.tsx   # Win/loss summary, answers, share
│   ├── StatsPanel.tsx      # Statistics grid, distribution, reset
│   └── Icons.tsx
├── data/
│   ├── puzzles.ts          # The puzzle collection
│   └── puzzles.test.ts     # Structural validation of every puzzle
└── game/
    ├── types.ts            # Puzzle and game-state types
    ├── logic.ts            # Pure game rules (selection, guessing, win/loss)
    ├── useGame.ts          # React hook: game flow, timings, persistence
    ├── stats.ts            # Statistics maths and storage
    ├── picker.ts           # Next-puzzle selection and play history
    └── storage.ts          # Safe localStorage wrapper
```

The game rules in `logic.ts` are pure functions with no React or browser dependencies. That makes them easy to unit test and to reuse.

## Adding puzzles

Puzzles live in [`src/data/puzzles.ts`](src/data/puzzles.ts). List the groups from easiest to trickiest:

```ts
puzzle(
  'p051',
  ['Breakfast foods', 'PANCAKE', 'WAFFLE', 'OMELETTE', 'CEREAL'], // yellow
  ['Card games', 'POKER', 'BRIDGE', 'RUMMY', 'SNAP'],             // green
  ['Things with keys', 'PIANO', 'LOCK', 'MAP', 'KEYBOARD'],       // blue
  ['___fly', 'BUTTER', 'DRAGON', 'FIRE', 'HORSE'],                // purple
),
```

`npm run validate-puzzles` checks every puzzle automatically:

- unique puzzle ids
- exactly four groups, one at each difficulty level
- four words per group and sixteen distinct words per puzzle
- distinct category names
- uppercase words of at most 12 characters, so they fit on a phone-sized tile
- no two puzzles with the same set of words

The tests can't check meaning, so check that by hand: **each puzzle must have exactly one valid grouping.** Red herrings (a word that seems to fit two groups) are encouraged, as long as the other group already has four unambiguous members. For example, in puzzle `p008`, TANGO and FOXTROT are both NATO alphabet words, but they also have to complete the dance group, so the NATO group can only be HOTEL, VICTOR, OSCAR and JULIET.

## Deploying to Netlify

[`netlify.toml`](netlify.toml) is already set up (build command, publish directory, Node version, SPA fallback and long-lived caching for hashed assets).

**From the Netlify UI:** push this repository to GitHub. In Netlify, choose **Add new site → Import an existing project**, then pick the repository. The build settings are filled in automatically from `netlify.toml`.

**From the CLI:**

```bash
npm run build
npx netlify-cli deploy --prod --dir=dist
```

The build output in `dist/` is fully static, so any static host works too (GitHub Pages, Vercel, Cloudflare Pages, S3).

## Data and privacy

Everything is stored in your browser's `localStorage` under keys prefixed `quartets:`:

| Key                  | Contents                                   |
| -------------------- | ------------------------------------------ |
| `quartets:stats`     | Your statistics                            |
| `quartets:progress`  | The game in progress                       |
| `quartets:history`   | Recently played puzzle ids                 |
| `quartets:theme`     | Your light/dark preference                 |
| `quartets:seen-help` | Whether the how-to-play guide has been shown |

Nothing is sent anywhere. If storage is unavailable (for example, in some private browsing modes), the game still works but nothing is saved between visits.

## Tech stack

- [React 19](https://react.dev) and TypeScript (strict mode)
- [Vite](https://vite.dev) for development and builds
- [Vitest](https://vitest.dev), [Testing Library](https://testing-library.com) and jsdom for tests
- Plain CSS with custom properties. No UI framework and no runtime dependencies besides React.

## License

[MIT](LICENSE)
