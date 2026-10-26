<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture
- Persistent data lives in Neon PostgreSQL and is accessed only from server functions in `src/lib/data.functions.ts` via the server-only client in `src/lib/neon.server.ts`. Do not add browser-side database access or SQLite/IndexedDB persistence.
- The app is deployed on Vercel. Configure `DATABASE_URL` and `SESSION_SECRET` as server-side Vercel environment variables; never expose them as `VITE_*`.
- Back office under `/admin` is protected by one password stored in the Neon `settings` table and an HTTP-only server session; there is no user/role management.
- `database/schema.sql` initializes the Neon tables and sample content. Full database backups/restores are managed through Neon, not browser storage.
- Content is bilingual: DB columns use `_fr` / `_mg` suffixes, UI strings live in `src/lib/i18n.tsx`.
