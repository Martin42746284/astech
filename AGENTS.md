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
- Data lives in an offline SQLite database (sql.js/WASM) persisted in IndexedDB via `src/lib/db.ts`; no server/cloud backend, because the client wants 100% offline use on one office PC.
- Back office under `/admin` is protected by a single password stored in the `settings` table; no user/role management (single company).
- Content is bilingual: DB columns use `_fr` / `_mg` suffixes, UI strings live in `src/lib/i18n.tsx`.
