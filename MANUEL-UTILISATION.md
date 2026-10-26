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

## 6. Informations techniques pour la mise en service

Le dépôt contient des commandes de développement :

```sh
npm install
npm run dev
```

La commande `npm run build` produit le build de déploiement. Ces commandes sont destinées à la personne en charge de l’installation, pas à l’utilisation quotidienne du site.

Le serveur utilise directement le pilote officiel Neon. Il faut configurer `DATABASE_URL` (URL de connexion PostgreSQL Neon) et `SESSION_SECRET` (secret long et aléatoire pour signer la session d’administration) dans les variables d’environnement de Vercel. Elles ne doivent jamais être publiées dans le navigateur, dans le dépôt ou dans ce manuel. En développement, les placer dans un fichier `.env` local non commité.

Avant une utilisation en production, demander à la personne qui maintient le projet de :

1. exécuter `database/schema.sql` dans le SQL Editor du projet Neon ;
2. configurer `DATABASE_URL` et `SESSION_SECRET` dans Vercel ;
3. changer le mot de passe administrateur initial après la première connexion ;
4. effectuer un test de soumission de devis et de gestion depuis le back-office ;
5. définir et vérifier une procédure régulière de sauvegarde et de restauration dans Neon.
