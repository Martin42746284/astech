# Manuel d’utilisation — ASTECH

Ce manuel décrit le site vitrine et les fonctions prévues pour le back-office ASTECH. Il s’adresse à la personne qui met à jour le site et traite les demandes de devis.

> **Stockage :** toutes les données du site sont enregistrées dans Neon PostgreSQL et sont accessibles au serveur de l’application. Le site nécessite une connexion Internet et ne fonctionne pas hors ligne. Les anciennes données présentes dans le stockage SQLite d’un navigateur ne sont pas transférées automatiquement.

## 1. Accéder au site

Le site comprend les pages suivantes :

- **Accueil** (`/`) : présentation, services et réalisations à la une, témoignages et accès au contact.
- **Services** (`/services`) : catalogue des services ; chaque carte ouvre la fiche détaillée correspondante.
- **Réalisations** (`/realisations`) : galerie filtrable par catégorie ; chaque projet ouvre sa fiche.
- **À propos** (`/a-propos`) : histoire et engagements de l’entreprise.
- **FAQ** (`/faq`) : questions et réponses.
- **Contact / Demander un devis** (`/contact`) : coordonnées et formulaire.
- **Mentions légales** (`/mentions-legales`) : éditeur, coordonnées, informations légales et données personnelles.

La navigation principale est disponible dans l’en-tête. Sur téléphone, ouvrir le bouton **Menu** pour afficher les rubriques. Le pied de page contient également les coordonnées, les liens de navigation et les liens sociaux.

### Changer la langue

Utiliser les boutons **FR** et **MG** dans l’en-tête ou le pied de page. Le choix est mémorisé dans le navigateur utilisé. Les contenus traduits des services, projets, FAQ et textes de présentation sont administrés séparément dans les deux langues.

### Parcourir les réalisations

Dans **Réalisations**, choisir **Tous**, **Maison individuelle**, **Fondations**, **Rendu 3D** ou **Chantier en cours** pour filtrer les cartes. Sélectionner une carte pour afficher sa description, son lieu, son année et sa photo.

### Contacter ASTECH et envoyer une demande

Le formulaire de contact demande les informations nécessaires au traitement du projet :

- nom complet, téléphone, type de projet, message et consentement : obligatoires ;
- e-mail, localisation, budget et surface : facultatifs ;
- pièce jointe : facultative, image ou PDF, 3 Mo maximum.

Le formulaire vérifie les champs et signale les erreurs près de ceux-ci. Après envoi réussi, un message de confirmation s’affiche. Une attente d’une minute est appliquée entre deux envois depuis le même navigateur.

Il est aussi possible d’utiliser les liens de téléphone et WhatsApp. WhatsApp nécessite une connexion Internet et l’application ou le site WhatsApp.

## 2. Accéder au back-office

Ouvrir `/admin`. Saisir le mot de passe administrateur pour accéder à l’espace de gestion. Le back-office est conçu pour une seule entreprise et ne comporte pas de comptes ni de rôles utilisateurs.

Sur téléphone, toucher **Menu** pour ouvrir la navigation latérale. Choisir une rubrique pour l’ouvrir ; toucher le voile ou le bouton de fermeture pour refermer le menu.

À la première mise en service, remplacer le mot de passe initial par un mot de passe personnel robuste dans **Paramètres > Sécurité**. Ne pas communiquer le mot de passe et ne pas le conserver dans un document public.

## 3. Rubriques du back-office

### Tableau de bord

Le tableau de bord présente des indicateurs de visites, de clics WhatsApp, de demandes de devis et de projets, ainsi que les réalisations et demandes récentes. Certaines statistiques sont calculées sur les sept derniers jours. Les données visibles dépendent de la disponibilité et de la cohérence de la base de données configurée.

### Services

La rubrique **Services** permet d’ajouter, modifier ou supprimer les services affichés sur le site.

Pour ajouter ou modifier un service :

1. Ouvrir **Services**, puis toucher **Ajouter** ou **Modifier**.
2. Renseigner les titres, résumés, descriptions, étapes et livrables en français et en malgache.
3. Choisir une icône et régler l’ordre d’affichage.
4. Indiquer si le service est visible sur le site.
5. Enregistrer.

Les champs marqués d’un astérisque sont obligatoires. L’ordre numérique détermine l’ordre de présentation.

### Réalisations

La rubrique **Réalisations** permet de gérer les projets présentés dans la galerie.

Pour ajouter ou modifier une réalisation :

1. Saisir le titre en français et, si disponible, en malgache.
2. Choisir une catégorie : maison individuelle, fondations, rendu 3D ou chantier en cours.
3. Compléter le lieu, l’année et les descriptions dans les deux langues.
4. Sélectionner une photo. Le traitement prévu redimensionne l’image (maximum 1 600 pixels) et la convertit en WebP pour limiter son poids.
5. Enregistrer. L’option **Afficher sur l’accueil** détermine si le projet fait partie des réalisations mises en avant.

La suppression d’un projet est définitive. Vérifier le contenu avant de confirmer.

### Demandes de devis

La rubrique **Demandes de devis** est prévue pour consulter et traiter les demandes reçues :

- utiliser les filtres de statut ou la recherche par nom, téléphone ou localisation ;
- ouvrir une demande pour lire les coordonnées, le type de projet, le message et la pièce jointe ;
- modifier son statut : **Nouvelle**, **En cours**, **Traitée** ou **Archivée** ;
- ajouter des notes internes ;
- exporter les demandes filtrées au format CSV ;
- supprimer une demande après confirmation.

Sur téléphone, les demandes apparaissent sous forme de cartes ; sur grand écran, elles sont présentées en tableau. Les pièces jointes peuvent contenir des données personnelles : les télécharger et les conserver uniquement si nécessaire, et limiter leur accès aux personnes autorisées.

### FAQ

Ajouter, modifier ou supprimer des questions. Renseigner les questions et réponses en français et en malgache, puis régler l’ordre d’affichage. Les FAQ sont montrées sur la page publique **FAQ**.

### Témoignages

Ajouter ou modifier le nom, le rôle ou la ville, le texte en français et en malgache, la note et la visibilité. Seuls les témoignages actifs sont destinés à apparaître sur le site.

### Paramètres

Les paramètres sont organisés en onglets :

- **Entreprise** : nom commercial, téléphones, WhatsApp, e-mail, adresse, horaires, Facebook et nombre de projets affiché sur l’accueil.
- **Textes** : présentation de l’entreprise en français et en malgache.
- **Légal** : STAT, NIF, RCS et directeur de publication, repris dans les mentions légales.
- **Sécurité** : changement du mot de passe administrateur.
- **Sauvegarde** : instructions pour sauvegarder la base Neon.

Après toute modification d’un onglet, utiliser son bouton d’enregistrement avant de changer de rubrique.

## 4. Sauvegarder et restaurer les données

Les données sont conservées dans Neon. Dans **Paramètres > Sauvegarde**, suivre les consignes pour ouvrir la console Neon et créer une branche de sauvegarde ou utiliser les outils d’export/restauration disponibles pour le projet et son offre.

L’export CSV des demandes ne contient que les demandes correspondant au filtre courant : ce n’est pas une sauvegarde complète. Après une restauration Neon, vérifier les services, projets, paramètres et demandes dans le site.

## 5. Confidentialité et bonnes pratiques

- Garder les coordonnées et les textes publics à jour dans **Paramètres**.
- Vérifier les traductions FR/MG avant publication.
- Sauvegarder régulièrement et tester périodiquement la restauration sur une copie.
- Limiter l’accès au back-office et changer le mot de passe initial.
- Ne pas ajouter dans les descriptions ou notes des données personnelles qui ne sont pas nécessaires.
- Les mentions légales indiquent que les données du formulaire servent à répondre aux demandes et mentionnent une conservation maximale de 24 mois. Appliquer la politique de conservation réelle de l’entreprise et supprimer les demandes lorsqu’elles ne doivent plus être gardées.

## 6. Informations techniques et mise en service

Cette section s’adresse à la personne qui installe, déploie ou maintient le projet. L’utilisation quotidienne du site et du back-office ne la nécessite pas.

### 6.1 Outils et commandes

Prérequis : Node.js 22.12 ou supérieur (recommandé), npm, un compte Neon et un compte Vercel.

```sh
npm install        # installer les dépendances
npm run dev        # serveur de développement → http://localhost:8080
npm run build      # build de production (sortie Vercel dans .vercel/output)
npm test           # tests (Vitest)
npm run lint       # contrôle du code (ESLint)
```

En développement, l’application s’ouvre sur `http://localhost:8080`. Les modifications de code sont rechargées automatiquement. Après avoir modifié une fonction serveur (`src/lib/data.functions.ts`), si une page affiche « Invalid server function ID », redémarrer le serveur (Ctrl+C puis `npm run dev`).

Ces commandes sont destinées à la personne en charge de l’installation, pas à l’utilisation quotidienne du site.

### 6.2 Variables d’environnement

Deux variables sont indispensables. Elles sont lues par le serveur uniquement :

| Variable         | Rôle                                                             |
| ---------------- | ---------------------------------------------------------------- |
| `DATABASE_URL`   | URL de connexion PostgreSQL Neon, avec `sslmode=require`         |
| `SESSION_SECRET` | chaîne longue et aléatoire qui signe la session d’administration |

- **En développement** : fichier `.env` à la racine du projet (ignoré par git ; `.env.example` donne le modèle).
- **En production** : les mêmes variables, à renseigner dans les réglages Vercel **pour chaque environnement** (Production et Preview).

Elles ne doivent jamais être publiées dans le navigateur, dans le dépôt ou dans ce manuel : aucun préfixe `VITE_`, qui rendrait la valeur visible côté client. Vérifier l’ignorance du fichier avec `git check-ignore .env` (le chemin doit s’afficher).

Si `SESSION_SECRET` change, tous les administrateurs sont déconnectés ; l’utilisation continue du site n’est pas affectée.

### 6.3 Vérifier la liaison à la base Neon

État vérifié le 27 octobre 2026 : connexion opérationnelle, schéma appliqué (tables `settings`, `services`, `projects`, `faqs`, `testimonials`, `quotes`, `visits`, `whatsapp_clicks`), 19 paramètres d’entreprise et le mot de passe administrateur initial déjà présents dans la base.

Procédure de vérification, à répéter après un changement de configuration :

1. `npm run dev` puis ouvrir `http://localhost:8080` : l’accueil s’affiche.
2. Ouvrir `/admin` et se connecter : le tableau de bord affiche les compteurs (visites, devis, projets).
3. Modifier puis réenregistrer un élément dans **Paramètres**, recharger la page : la modification est conservée.
4. Envoyer une demande d’essai depuis `/contact`, la retrouver dans **Demandes de devis**, puis la supprimer.

Si une étape échoue, voir la section 7 (Dépannage).

**Réseau.** Le pilote Neon rejoint le serveur en HTTPS. Sur un réseau sans IPv6 (Wi-Fi domestique, certains réseaux d’entreprise), Node peut échouer avec `fetch failed / ETIMEDOUT` : le module `src/lib/neon.server.ts` bascule alors sur une connexion IPv4 séquentielle. Si cette erreur réapparaît, c’est que ce correctif a été retiré ou neutralisé.

### 6.4 Déploiement sur Vercel

1. Créer la base Neon et exécuter `database/schema.sql` dans le SQL Editor (voir 6.3 pour l’état attendu).
2. Connecter le dépôt à Vercel : le build exécute `npm run build` avec le preset `vercel`.
3. Renseigner `DATABASE_URL` et `SESSION_SECRET` dans **Settings → Environment Variables**, pour Production et Preview.
4. Déployer, puis suivre **Logs** en temps réel en cas d’erreur.
5. Contrôler la production avec la procédure de la section 6.3 (accueil, connexion admin, envoi d’un devis).

> **Projet relié à Lovable** : ne jamais réécrire l’historique git déjà poussé (pas de force push, rebase, amend ni squash). Chaque commit poussé sur la branche connectée se synchronise avec l’éditeur Lovable : laisser la branche dans un état fonctionnel.

### 6.5 Liste de mise en service

Avant une utilisation en production, mener à bien cette liste :

1. Exécuter `database/schema.sql` dans le SQL Editor du projet Neon (ou vérifier son état, section 6.3).
2. Configurer `DATABASE_URL` et `SESSION_SECRET` dans Vercel, pour chaque environnement.
3. Changer le mot de passe administrateur initial à l’aide de **Paramètres > Sécurité** (8 caractères minimum).
4. Effectuer un test de soumission de devis et de gestion depuis le back-office (section 6.3).
5. Définir et vérifier une procédure régulière de sauvegarde et de restauration dans Neon (section 4).

## 7. Dépannage

| Symptôme                                                                                          | Cause probable                                                                                      | Que faire                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| « The database is temporarily unavailable. Try again in a moment. » sur le site ou le back-office | Base injoignable ou mauvaise `DATABASE_URL`                                                         | Vérifier `DATABASE_URL` (`.env` en dev, Vercel en prod), démarrer l’instance Neon dans sa console, recharger la page.                                        |
| « The database is not initialized. The app owner should apply database/schema.sql. »              | Schéma absent de la base                                                                            | Exécuter `database/schema.sql` dans le SQL Editor Neon (les tables existantes sont conservées : `IF NOT EXISTS`).                                            |
| « DATABASE_URL is not set » dans le journal du serveur                                            | Variable manquante                                                                                  | La créer selon la section 6.2, puis redémarrer le serveur ou redéployer.                                                                                     |
| « SESSION_SECRET is not set » ; `/admin` inaccessible                                             | Variable manquante                                                                                  | Créer une valeur longue et aléatoire (section 6.2).                                                                                                          |
| Page « This page didn’t load » (erreur 500)                                                       | Erreur serveur non rattrapée                                                                        | Lire le terminal en développement, les logs Vercel en production, puis corriger la cause indiquée.                                                           |
| HTTP 403 « Forbidden » sur une fonction serveur appelée hors du site                              | Protection anti-CSRF : l’en-tête `Origin` ou `Referer` doit être du même domaine                    | Naviguer depuis le site. Un appel externe (script, `curl`) doit envoyer `Origin: https://votre-domaine`.                                                     |
| Connexion admin acceptée, puis mot de passe redemandé aussitôt                                    | Cookie `Secure` refusé par le navigateur en HTTP sur une adresse IP                                 | En développement, passer par `http://localhost:8080` ; en production, vérifier qu’HTTPS est bien actif.                                                      |
| Administrateur déconnecté en cours de journée                                                     | La session admin dure 8 heures maximum                                                              | Se reconnecter.                                                                                                                                              |
| Mot de passe admin oublié                                                                         | Aucune réinitialisation par e-mail prévue                                                           | Dans le SQL Editor Neon : `update settings set value = 'NOUVEAU_MOT_DE_PASSE' where key = 'admin_password';` puis le changer dans **Paramètres > Sécurité**. |
| « Invalid server function ID »                                                                    | Serveur de dev dépassé après modification d’une fonction serveur                                    | Redémarrer `npm run dev`.                                                                                                                                    |
| Modifications non visibles sur le site                                                            | Cache navigateur de 30 s (services et réglages)                                                     | Recharger la page ; vérifier aussi la langue FR/MG sélectionnée.                                                                                             |
| Le formulaire de devis refuse un envoi                                                            | Une minute d’attente entre deux envois, champ obligatoire manquant, pièce jointe trop lourde (3 Mo) | Corriger les champs signalés et réessayer après une minute.                                                                                                  |
| `fetch failed / ETIMEDOUT` vers Neon dans le journal                                              | Réseau sans IPv6 (voir 6.3)                                                                         | Vérifier que le correctif de `src/lib/neon.server.ts` est toujours présent.                                                                                  |
