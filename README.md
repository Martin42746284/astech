# ASTECH

Site vitrine bilingue français/malgache et back-office pour ASTECH. Le site utilise Neon PostgreSQL pour les données et est prévu pour un déploiement serveur sur Vercel ; il ne fonctionne pas hors ligne.

## Développement local

Prérequis : Node.js 22.12 ou supérieur et npm.

```sh
npm install
cp .env.example .env
```

Remplacer les valeurs d’exemple dans `.env` par l’URL Neon et un secret de session long et aléatoire avant de démarrer l’application avec `npm run dev`. Exécuter d’abord [`database/schema.sql`](./database/schema.sql) dans le SQL Editor Neon. Ne jamais publier `.env` ni exposer ces secrets avec un préfixe `VITE_`.

## Configuration Neon et Vercel

1. Créer une base PostgreSQL Neon et copier son URL de connexion.
2. Exécuter [`database/schema.sql`](./database/schema.sql) dans le SQL Editor Neon pour créer les tables et le contenu initial.
3. Définir `DATABASE_URL` avec l’URL de connexion Neon et `SESSION_SECRET` avec une chaîne aléatoire longue et privée dans les variables d’environnement du projet Vercel.
4. Configurer ces variables pour les environnements Vercel utilisés, puis déployer.
5. Se connecter au back-office sur `/admin` avec le mot de passe initial `astech2026`, puis le remplacer immédiatement dans **Paramètres > Sécurité**.

Les données SQLite éventuellement présentes dans un ancien navigateur ne sont pas migrées automatiquement vers Neon.

## Commandes

```sh
npm run dev
npm run build
npm test
npm run lint
```

Les sauvegardes et restaurations complètes de la base se gèrent dans Neon. L’export CSV des demandes dans le back-office ne remplace pas une sauvegarde de la base.
