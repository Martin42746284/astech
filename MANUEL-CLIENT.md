# Manuel d’utilisation — Site ASTECH (édition client)

Ce manuel s’adresse à la personne qui met à jour le site ASTECH et traite les demandes de devis reçues. Il décrit uniquement ce que vous faites depuis votre navigateur : aucune compétence technique n’est nécessaire. La mise en technique du site (serveur, base de données, déploiement) relève du développeur.

> **Le site est en ligne.** Toute modification est visible par vos clients quelques secondes après enregistrement. Vous avez seulement besoin d’une connexion Internet et d’un navigateur (Chrome, Edge, Firefox ou Safari), sur ordinateur, tablette ou téléphone.

## 1. Aller au back-office

1. Ouvrez l’adresse du back-office dans votre navigateur : **`votre-domaine/admin`** (le lien exact vous a été communiqué lors de la mise en service).
2. Saisissez votre mot de passe dans le champ, puis cliquez sur **Se connecter**.
   - Mot de passe erroné : le message **« Mot de passe incorrect. »** s’affiche sous le champ. Vérifiez les majuscules/minuscules puis réessayez.
   - Au premier usage, le mot de passe est `astech2026` (communiqué par le développeur). **Changez-le immédiatement** (section 9, onglet **Sécurité**).

Votre session reste ouverte **8 heures**. Au-delà, le site vous redemande le mot de passe : rien n’est perdu, reconnectez-vous simplement. Pour fermer votre session sur un poste partagé, cliquez sur **Se déconnecter**, tout en bas de la barre de gauche.

### Se repérer dans l’espace

Une barre à gauche liste les rubriques, dans cet ordre :

| Rubrique              | Ce que vous y gérez                                 |
| --------------------- | --------------------------------------------------- |
| **Tableau de bord**   | Vue d’ensemble de l’activité                        |
| **Services**          | Les prestations affichées sur le site               |
| **Réalisations**      | Les projets de la galerie et de l’accueil           |
| **Galerie**           | Les photos (Galerie, accueil, À propos)             |
| **Demandes de devis** | Les demandes reçues via le formulaire               |
| **FAQ**               | Les questions et réponses                           |
| **Témoignages**       | Les avis clients affichés                           |
| **Paramètres**        | Coordonnées, textes, mentions légales, mot de passe |

En bas de cette barre : le lien **Voir le site** (ouvre le site public dans un nouvel onglet) et le bouton **Se déconnecter**.

Sur téléphone ou tablette, la barre est remplacée par le bouton **Menu** (en haut à gauche, à côté du titre _ASTECH Admin_) ; touchez-le pour ouvrir les rubriques, puis le voile sombre pour refermer.

> Le back-office est toujours en **français**, quel que soit le choix de langue du site public.

## 2. Le tableau de bord

En arrivant, vous voyez :

- **4 indicateurs** : _Demandes de devis_ (total), _Clics WhatsApp (7 j)_, _Visites (7 j)_, _Projets publiés_ ;
- **Évolution des visites (7 derniers jours)** : un graphique journalier ;
- **Répartition des demandes** : le classement des types de projets demandés ;
- **Réalisations récentes** et **Dernières demandes** (les 5 dernières), avec le lien **Voir tout →** de chaque encart.

Les statistiques se rafraîchissent automatiquement **toutes les 60 secondes**. Une pastille rouge sur la rubrique **Demandes de devis** signale le nombre de demandes encore au statut **Nouvelle**.

Un message du type _« Pas encore de visites. »_ ou _« Aucune demande. »_ est normal tant que le site vient d’être mis en ligne.

## 3. Ajouter ou modifier un service

Rubrique **Services** — ces contenus apparaissent sur la page **Services** du site et, pour les premiers, sur l’accueil.

1. Cliquez sur **Ajouter** (en haut à droite), ou sur l’icône crayon d’un service pour le **Modifier**.
2. Remplissez la fiche :
   - **Titre (FR)** : obligatoire (marqué `*`) ;
   - **Titre (MG)**, **Résumé (FR/MG)**, **Description (FR/MG)** : facultatifs, mais le malgache est à prévoir pour un site réellement bilingue ;
   - **Étapes (FR) – une par ligne** et **Livrables (FR) – un par ligne** : saisissez chaque étape ou livrable sur sa propre ligne ;
   - **Icône** : choisissez le pictogramme dans la liste (`Home`, `HardHat`, `Wrench`, `FileSearch`, `DraftingCompass`, `FileCheck`, `Truck`, `Shovel`, `Users`, `Building2`) ;
   - **Ordre d'affichage** : le plus petit numéro s’affiche en premier ;
   - **Visible sur le site** : décochez pour masquer un service sans le supprimer.
3. Cliquez sur **Enregistrer**. Le message **« Enregistré »** confirme ; la fenêtre se referme.

En cas d’oubli, le message **« Titre (FR) » est obligatoire** vous indique le champ à compléter. Un identifiant d’adresse (« slug ») est créé automatiquement à partir du titre français : rien à saisir.

Pour supprimer : icône corbeille, puis confirmez **« Supprimer définitivement cet élément ? »** — l’opération est **définitive**. Préférez le retrait (**Visible sur le site**) si vous souhaitez conserver le contenu.

## 4. Ajouter ou modifier une réalisation

Rubrique **Réalisations** — ces projets alimentent la galerie filtrable du site et les réalisations mises en avant sur l’accueil.

1. Cliquez sur **Ajouter** ou sur le crayon d’un projet.
2. Renseignez :
   - **Titre (FR)** (obligatoire) et **Titre (MG)** ;
   - **Catégorie** (obligatoire) : `Maison individuelle`, `Fondations`, `Rendu 3D` ou `Chantier en cours` ;
   - **Lieu** et **Année** ;
   - **Description (FR)** et **Description (MG)** ;
   - **Photo** (obligatoire) : choisissez une image. Elle est **redimensionnée et optimisée automatiquement** (1600 px maximum, format WebP) : vous n’avez rien à préparer, mais une photo nette reste conseillée ;
   - **Afficher sur l'accueil** : cochez pour mettre le projet en avant sur la page d’accueil.
3. Cliquez sur **Enregistrer**.

Les messages **« Titre (FR) » est obligatoire**, **« Catégorie » est obligatoire** et **« Photo » est obligatoire** indiquent ce qui manque. La suppression demande confirmation et est **définitive**.

Les projets les plus récents apparaissent en premier dans la liste comme sur le site.

## 5. Importer des photos dans la galerie

Rubrique **Galerie** — les photos importées apparaissent sur la page **Galerie** du site, sur l’**accueil** (les huit dernières) et sur la page **À propos** (les quatre dernières). L’import de vidéos est temporairement désactivé ; les vidéos déjà publiées restent visibles.

1. Cliquez sur **Importer plusieurs photos**.
2. Dans la fenêtre de sélection, choisissez une ou plusieurs images. Sur ordinateur, maintenez **Ctrl** (Windows) ou **⌘ Commande** (Mac) pour sélectionner plusieurs fichiers ; sur téléphone, sélectionnez plusieurs photos si l’application de fichiers le permet.
3. Confirmez la sélection. Chaque photo est redimensionnée (1 600 pixels maximum) et convertie en WebP, puis ajoutée séparément à la galerie. Les photos importées sont publiées automatiquement.
4. Pendant l’import, une fenêtre **« Importation en cours »** bloque les actions dans le site. Attendez sa fermeture avant de naviguer ou de commencer une autre opération. Ne fermez pas et ne rechargez pas l’onglet pendant ce traitement.

Un message confirme le nombre de photos ajoutées. Si un fichier échoue, le message précise le fichier concerné et combien de photos ont déjà été ajoutées ; relancez alors l’import uniquement pour les photos restantes.

Les photos apparaissent dans la grille de la page **Galerie**. Le visiteur peut cliquer sur une photo pour l’ouvrir dans la visionneuse plein écran, puis utiliser les flèches **←** / **→** pour changer de photo ou la croix / touche **Échap** pour fermer. Pendant le chargement de la galerie, un indicateur s’affiche ; si aucune photo n’a encore été publiée, un message indique que la galerie sera bientôt disponible.

Pour supprimer un média, cliquez sur l’icône de corbeille de sa ligne ou de sa carte. Un toast de confirmation propose **Annuler** ou **Supprimer** ; la suppression est définitive. Le toast reste affiché 10 secondes.

## 6. Traiter les demandes de devis

Rubrique **Demandes de devis** : c’est ici que arrivent les demandes envoyées depuis la page **Contact / Demander un devis** du site.

### Lire et qualifier une demande

- Filtrez avec les boutons **Toutes**, **Nouvelle**, **En cours**, **Traitée**, **Archivée** ;
- cherchez un client avec le champ **Rechercher…** (nom, téléphone ou localisation) ;
- cliquez sur l’icône **Voir** pour ouvrir le détail : téléphone, e-mail, type, localisation, budget, surface, date de réception, message complet, et la **Pièce jointe** éventuelle (aperçu image, ou lien **Télécharger …** pour un PDF).

### Changer le statut

Dans le détail de la demande, les 4 boutons **Nouvelle**, **En cours**, **Traitée**, **Archivée** appliquent immédiatement le nouveau statut (le bouton actif est mis en évidence) ; dans la liste, la colonne **Statut** permet aussi de changer depuis la liste déroulante.

- **Nouvelle** : à traiter (pastille rouge du tableau de bord) ;
- **En cours** : vous êtes en échange avec le client ;
- **Traitée** : demande close ;
- **Archivée** : mise de côté, conservée dans l’historique.

### Ajouter des notes internes

Dans le détail, la zone **Notes internes** sert au suivi (relance, devis envoyé, rendez-vous…). Cliquez sur **Enregistrer les notes** : le message **« Notes enregistrées »** confirme. Ces notes sont visibles dans l’export CSV, jamais sur le site public.

### Exporter et supprimer

- **Export CSV** (en haut à droite) : télécharge la **liste filtrée** dans un fichier `demandes-devis-AAAA-MM-JJ.csv`, ouvrable dans Excel. Le nom du fichier suit le filtre actif : sélectionnez d’abord le statut voulu. Cet export n’est **pas** une sauvegarde complète des données.
- **Supprimer** : demande confirmation **« Supprimer cette demande (droit à l'effacement) ? »**, puis **« Demande supprimée »**. Utilisez ce bouton pour répondre à une demande d’effacement d’un client : la suppression est **définitive**.

> **Vie privée.** Les demandes contiennent des coordonnées personnelles et des documents joints. Ne les conservez que le temps nécessaire au traitement, ne les partagez pas hors des personnes habilitées, et supprimez-les lorsqu’elles ne doivent plus être gardées.

Sur téléphone, les demandes sont présentées en fiches plutôt qu’en tableau, avec les mêmes boutons.

## 7. Gérer la FAQ

Rubrique **FAQ** — les questions apparaissent sur la page **FAQ** du site.

1. **Ajouter** ou modifier une fiche ;
2. **Question (FR)** et **Réponse (FR)** sont obligatoires ; **Question (MG)** et **Réponse (MG)** complètent la version malgache ;
3. **Ordre** : chiffre croissant pour afficher en premier ;
4. **Enregistrer**.

Il n’existe pas de case « visible » : **toutes les FAQ enregistrées sont publiées**. Pour retirer une question du site, supprimez-la (définitif) ou conservez-la si elle peut servir à nouveau.

## 8. Gérer les témoignages

Rubrique **Témoignages** — les avis actifs s’affichent sur la page d’accueil.

Champs : **Nom** (obligatoire), **Qualité / ville**, **Texte (FR)** (obligatoire), **Texte (MG)**, **Note (1 à 5)**, et **Visible sur le site**.

Seuls les témoignages **visibles** sont publiés : décochez la case pour mettre un avis en attente sans le supprimer. La note s’affiche en étoiles (★) sur le site.

## 9. Les paramètres du site

Rubrique **Paramètres**, avec 5 onglets. Pour **Entreprise**, **Textes** et **Légal**, cliquez toujours sur **Enregistrer les modifications** avant de changer d’onglet : le message **« Modifications enregistrées »** confirme, sinon vos saisies sont perdues.

| Onglet          | Contenu                                                                                                                                                   | Où c’est affiché                                    |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| **Entreprise**  | Nom commercial, Téléphone 1 et 2, Numéro WhatsApp (format `261…`), E-mail, Adresse, Horaires (FR/MG), Lien Facebook, Nombre de projets réalisés (accueil) | En-tête, pied de page, page Contact, liens WhatsApp |
| **Textes**      | Notre histoire (FR) et (MG)                                                                                                                               | Page **À propos**                                   |
| **Légal**       | STAT, NIF, RCS, Directeur de la publication                                                                                                               | Page **Mentions légales**                           |
| **Sécurité**    | Changement du mot de passe du back-office                                                                                                                 | —                                                   |
| **Sauvegardes** | Consignes de sauvegarde de la base de données                                                                                                             | —                                                   |

> Le numéro WhatsApp doit être saisi **sans `+` ni espaces**, par exemple `261340000000`. Les champs **Horaires** et les autres textes existent en deux versions : saisissez les deux pour que le site reste cohérent en français et en malgache.

### Changer le mot de passe (onglet Sécurité)

1. Saisissez le **Mot de passe actuel** ;
2. tapez le **Nouveau mot de passe** puis la confirmation (**8 caractères minimum**) ;
3. cliquez sur **Modifier**.

Messages possibles : **« Le nouveau mot de passe doit contenir au moins 8 caractères. »**, **« Les nouveaux mots de passe ne correspondent pas. »**, **« Le mot de passe actuel est incorrect. »**, et **« Mot de passe modifié »** en cas de succès.

Conservez ce mot de passe en lieu sûr : personne d’autre ne peut le récupérer pour vous (voir section 12).

### Sauvegarder les données (onglet Sauvegardes)

Les données ne sont pas dans votre navigateur mais dans la base en ligne (Neon). Suivez les 3 étapes affichées dans l’onglet :

1. Ouvrir la console Neon et sélectionner le projet ASTECH et sa branche de production ;
2. créer une branche de sauvegarde ou utiliser l’export/restauration proposé par Neon ;
3. **avant de restaurer, vérifier le projet et la branche ciblés** : une restauration peut remplacer des données de production.

Le bouton **Ouvrir la console Neon** mène directement à la console. Si cette manipulation dépasse votre périmètre, demandez au développeur de programmer une sauvegarde régulière.

## 10. Vérifier votre modification sur le site

1. Après un enregistrement, cliquez sur **Voir le site** (barre de gauche) ;
2. ouvrez la page concernée : **Accueil** `/`, **Services**, **Réalisations**, **Galerie**, **FAQ**, **À propos**, **Contact**, **Mentions légales** ;
3. vérifiez les **deux langues** : les boutons **FR** / **MG** se trouvent dans l’en-tête et le pied de page.

Points de vigilance :

- Le site met parfois **une trentaine de secondes** à refléter une modification (services et paramètres sont mis en cache) : rechargez la page si besoin ;
- si une version **malgache** n’a pas été saisie, le site affiche automatiquement le **texte français** : c’est normal, complétez le champ (MG) pour corriger ;
- vérifiez l’orthographe des coordonnées après toute modification des **Paramètres** : elles apparaissent sur tout le site.

## 11. Publier un contenu, en résumé

| Objectif                              | Rubrique                    | Geste exact                                             |
| ------------------------------------- | --------------------------- | ------------------------------------------------------- |
| Ajouter une prestation                | **Services**                | **Ajouter** → _Titre (FR)_ → **Enregistrer**            |
| Masquer sans supprimer                | **Services / Témoignages**  | Décocher **Visible sur le site**                        |
| Publier un chantier                   | **Réalisations**            | **Ajouter** → titre, catégorie, photo → **Enregistrer** |
| Mettre un projet en avant             | **Réalisations**            | Cocher **Afficher sur l'accueil**                       |
| Publier une ou plusieurs photos       | **Galerie**                 | **Importer plusieurs photos** → sélectionner → attendre la fin |
| Supprimer un média                    | **Galerie**                 | Corbeille → **Supprimer** dans le toast de confirmation |
| Suivre une demande                    | **Demandes de devis**       | **Voir** → choisir le statut, ajouter des notes         |
| Répondre à un droit à l’effacement    | **Demandes de devis**       | Filtrer, puis **Supprimer**                             |
| Changer un tarif affiché / un horaire | **Paramètres → Entreprise** | Modifier → **Enregistrer les modifications**            |
| Publier un avis client                | **Témoignages**             | **Ajouter** → **Enregistrer**                           |
| Sécuriser l’accès                     | **Paramètres → Sécurité**   | Ancien + nouveau mot de passe → **Modifier**            |

## 12. Dépannage courant

| Ce que vous observez                                                             | Ce qu’il faut faire                                                                                                                                                                  |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **« Mot de passe incorrect. »**                                                  | Vérifiez le clavier (majuscules, verrouillage numérique). Si le mot de passe est perdu, demandez sa réinitialisation au développeur : personne d’autre ne peut le récupérer.         |
| La session se referme au bout d’un moment                                        | Normal : la session dure 8 heures. Reconnectez-vous, rien n’est perdu.                                                                                                               |
| Un message **« Enregistré »** n’apparaît pas                                     | Vérifiez les champs signalés (**« … est obligatoire »**) puis réessayez. Si un message **« Erreur : … »** s’affiche, réessayez ; si l’erreur revient, transmettez-la au développeur. |
| La modification ne se voit pas sur le site                                       | Attendez une trentaine de secondes et rechargez la page ; vérifiez la langue affichée (FR/MG) et la rubrique concernée.                                                              |
| **« Merci de patienter une minute avant un nouvel envoi. »** (formulaire public) | Une minute d’attente est imposée entre deux envois depuis le même navigateur.                                                                                                        |
| Le formulaire refuse la pièce jointe                                             | Images ou PDF uniquement, **3 Mo maximum**.                                                                                                                                          |
| Une page affiche _« This page didn't load »_ ou une erreur 500                   | Rechargez la page ; si cela persiste, signalez-le au développeur en indiquant la page concernée et l’heure.                                                                          |
| Vous êtes sur un téléphone et ne voyez pas les rubriques                         | Touchez le bouton **Menu** en haut à gauche.                                                                                                                                         |
| Une donnée semble perdue                                                         | Ne paniquez pas : contactez le développeur avant toute restauration ; une restauration peut remplacer des données plus récentes.                                                     |

## 13. Bonnes pratiques

- Changez le mot de passe initial dès la première connexion, et ne le communiquez à personne ; utilisez un mot de passe unique, d’au moins 8 caractères.814417
- Vérifiez les traductions **FR** et **MG** avant publication : un texte malgache oublié laisse apparaître le français.
- Pour une réalisation, complétez le **titre français** : il est obligatoire et sert aussi à créer l’adresse de la page.
- Pendant un import de photos, attendez la fin du traitement avant de naviguer ou de fermer l’onglet.
- La suppression d’une photo de la galerie est définitive ; vérifiez le média avant de confirmer.
- Ne placez ni dans les descriptions ni dans les notes internes de données personnelles qui ne sont pas nécessaires.
- Traitez les demandes **Nouvelle** dans la journée : elles portent la pastille rouge du tableau de bord.
- Faites une sauvegarde (onglet **Sauvegardes**) avant toute modification importante : ajout en masse, restauration, changement de mot de passe.

---

**Besoin d’aide ?** Pour tout sujet technique (site inaccessible, message d’erreur persistant, sauvegarde, récupération de mot de passe), contactez le développeur du site en lui indiquant la page concernée, l’heure et le message affiché.
