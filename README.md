# NaadGen

NaadGen is a web-based Indian classical music composition tool. It lets you compose melodies in a chosen *Raga* and *Taal*, hear them played back in real time, and save and share your work.

*Naad* (नाद) is the Sanskrit word for sound or tone. NaadGen is short for *Naad Generator*.

Currently deployed at **[naadgen.vercel.app](https://naadgen.vercel.app)**

---

## Flow

- **Select a Raga** -- The available svaras update automatically to reflect the raga's vikrit (altered) and varjya (omitted) notes.
- **Select a Taal** -- The matra bar highlights talis and khalis to indicate where you are in the cycle.
- **Build a composition** -- Click svaras to add them one by one. Each note is placed on the composition grid aligned to the taal's matra count. Notes can be clicked to open the edit panel, where you can change their svara, octave, or split a single matra into multiple grace notes.
- **Playback** -- Plays notes using real sine-wave synthesis, attack/release envelopes and tali/khali indications. Supports tempo, volume, note duration, base frequency, and loop controls.
- **Sections** -- Organise your bandish into named sections (e.g. Aalap, Sthayi, Antara, Taan, Jhala).
- **Selection tools** -- Select a range of notes to duplicate, delete, or move to another section.
- **Save & Load** -- Export a composition and re-import it from a local file or a direct URL. Compositions can also be shared via a `?load=<url>` query parameter.

---

<!-- ## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [SvelteKit](https://kit.svelte.dev/) 2.x with Svelte 5 |
| Language | TypeScript |
| Styling | [Tailwind CSS](https://tailwindcss.com/) v4 (via `@tailwindcss/vite`) |
| Build tool | [Vite](https://vitejs.dev/) 6 |
| Audio | Web Audio API (no external library) |
| Package manager | pnpm |

--- -->

## Running Locally

```bash
# Install dependencies
pnpm install

# Start the dev server
pnpm dev --host

# Type-check
pnpm check

# Build & preview
pnpm build && pnpm preview
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Currently added Ragas & Taals

<details>
<summary>Ragas (16)</summary>

Asavari, Bhairav, Bhairavi, Bihag, Bhopali, Durga, Jayjavanti, Kafi, Khamaj, Marwa, Miya ki Malhar, Purvi, Tilang, Todi, Yaman, Bilawal

</details>

<details>
<summary>Taals (8)</summary>

| Taal | Matras |
|---|---|
| Teentaal | 16 |
| Deepchandi | 14 |
| Ektaal | 12 |
| Doguna Dadra | 12 |
| Jhaptaal | 10 |
| Keherva | 8 |
| Rupak | 7 |
| Dadra | 6 |

</details>
