
# Sheetforge

Sheetforge is a lightweight, LAN-first web app for managing **D&D 5e (2024) character sheets**.  
It's designed for in-person tables: run it on your machine, let players connect over the local network, and edit character sheets live with instant autosave.

Character sheets are stored as simple **JSON files on disk**, making the project transparent, portable, and easy to extend.



## Features

- **Full 2024 D&D character sheet support** (aligned with the updated PHB)
- **LAN-first**: players connect from phones, tablets, or laptops
- **Local JSON storage** - no database, no cloud, no accounts
- **Autosave on edit** (debounced, atomic file writes)
- **Schema-driven UI** (easy to extend or customize)
- Built with **Next.js, Tailwind CSS, and shadcn/ui**
- Open-source and hackable



## Philosophy

Sheetforge is intentionally:

- **Offline-friendly**
- **Simple**
- **Table-focused**
- **Non-commercial**

No logins. No subscriptions. No vendor lock-in.  
Your data stays on your machine.



## Project Structure

```text
data/
  characters/           # JSON character files (created at runtime)

app/
  page.tsx              # Welcome page (character list)
  c/[id]/page.tsx       # Character editor
  api/characters/       # API routes (list, create, update)

components/
  character/            # UI components for sheets

lib/
  character-schema.ts   # All D&D 2024 fields
  character-store.ts    # File read/write logic
  path-utils.ts         # Dotted-path helpers
```



## Getting Started

This project is a [Next.js](https://nextjs.org) app bootstrapped with
[`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

### 1. Install dependencies

```bash
npm install
# or
yarn
# or
pnpm install
# or
bun install
```

### 2. Run the development server

```bash
npm run dev
```

When the server starts, Next.js will print both a **local** and a **network** URL:

```
▲ Next.js
- Local:   http://localhost:3000
- Network: http://<your-local-ip>:3000
```

* Use the **Local** URL on the host machine.
* Use the **Network** URL on other devices connected to the same network
  (phones, tablets, laptops) to access the app.

### 3. Open the app

Open the printed URL in your browser.
You can start editing the app by modifying `app/page.tsx`. The page will auto-update as you edit.



### Learn More

To learn more about Next.js, take a look at the following resources:

* [Next.js Documentation](https://nextjs.org/docs)
* [Learn Next.js](https://nextjs.org/learn)

You can also check out the
[Next.js GitHub repository](https://github.com/vercel/next.js). 

## Character Storage

Each character is stored as a single JSON file in:

```text
data/characters/<uuid>.json
```

- Files are updated atomically
- Changes are saved immediately when fields are edited
- Safe to back up, version, or edit manually if needed

## Customization

You can easily:

- Add or remove fields via `lib/character-schema.ts`
- Change UI layout by swapping or extending components
- Add DM-only views, notes, or encounter tools
- Extend beyond character sheets (initiative, inventory, etc.)



## Security Notes

- Intended for **local/LAN use**
- No authentication by default
- Do **not** expose directly to the internet without adding auth



## Contributing

Contributions are welcome!

Good starting points:

- UI/UX improvements
- Validation and derived stats
- Better spell and attack editors
- Import/export tools
- Mobile polish

Please keep changes:

- Small
- Well-scoped
- Aligned with the "simple & local-first" philosophy



## License

MIT License  
Free to use, modify, and share.



## Why Sheetforge?

Because character sheets should be:

- Fast
- Local
- Yours

Happy rolling.
