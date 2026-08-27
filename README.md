# 🏝️ OlympYeu

**L'application web de l'olympiade entre amis de l'Île d'Yeu.**
Classement en direct, podium, équipes, programme de la journée et « La Légende » (le palmarès de toutes les éditions).

L'appli se consulte sur téléphone par tous les participants. Elle **lit** les données dans **un simple Google Sheet** que l'organisateur remplit à la main (même depuis son téléphone le jour J). L'appli ne modifie **jamais** le Sheet : elle l'affiche, c'est tout.

- ✅ 100 % gratuit, aucun serveur, aucune clé secrète, aucun abonnement.
- ✅ Hébergée sur **GitHub Pages** (mise en ligne automatique à chaque modification).
- ✅ Fonctionne même avec un mauvais réseau (elle garde en mémoire la dernière version vue).
- ✅ Tout en français, pensée pour le téléphone d'abord.

> 💡 **Tant que le Google Sheet n'est pas branché, l'appli affiche des données de démonstration (édition 2025)** pour que tu voies immédiatement à quoi elle ressemble.

---

## 🧭 Table des matières

1. [Comment ça marche (en 30 secondes)](#-comment-ça-marche-en-30-secondes)
2. [Guide pas-à-pas pour tout mettre en ligne](#-guide-pas-à-pas-pour-tout-mettre-en-ligne)
   - [Étape 1 — Récupérer le projet sur GitHub](#étape-1--récupérer-le-projet-sur-github)
   - [Étape 2 — Créer le Google Sheet](#étape-2--créer-le-google-sheet)
   - [Étape 3 — Partager le Sheet en lecture](#étape-3--partager-le-sheet-en-lecture)
   - [Étape 4 — Coller le SHEET_ID dans l'appli](#étape-4--coller-le-sheet_id-dans-lappli)
   - [Étape 5 — Activer GitHub Pages](#étape-5--activer-github-pages)
3. [Le détail de chaque onglet du Sheet](#-le-détail-de-chaque-onglet-du-sheet)
4. [Saisir et corriger les scores le jour J (depuis le téléphone)](#-saisir-et-corriger-les-scores-le-jour-j-depuis-le-téléphone)
5. [Pour les développeurs](#-pour-les-développeurs)
6. [Questions fréquentes](#-questions-fréquentes)

---

## 🪄 Comment ça marche (en 30 secondes)

```
   ┌────────────────────┐      lecture seule      ┌──────────────────────┐
   │   Google Sheet     │  ───────────────────▶   │   Application web     │
   │ (rempli à la main) │   (toutes les 45 s)     │  (GitHub Pages)       │
   └────────────────────┘                         └──────────────────────┘
        L'organisateur                                 Les participants
        remplit les scores                             regardent le classement
```

L'organisateur = simplement la personne qui a les droits pour modifier le Google Sheet. **Aucun mot de passe, aucune connexion dans l'appli.**

---

## 🚀 Guide pas-à-pas pour tout mettre en ligne

> Tu n'as **pas besoin de savoir coder**. Suis les étapes dans l'ordre. Compte 15–20 minutes la première fois.

### Étape 1 — Récupérer le projet sur GitHub

1. Crée un compte gratuit sur [github.com](https://github.com) si tu n'en as pas.
2. Récupère ce projet dans **ton** compte :
   - Soit tu cliques sur **« Fork »** (en haut à droite de la page du projet) pour en faire une copie chez toi ;
   - Soit tu crées un nouveau dépôt (« repository ») et tu y déposes ces fichiers.
3. **Note bien le nom de ton dépôt.** Exemple : si ton dépôt s'appelle `olympiades`, l'adresse du site sera `https://TON-PSEUDO.github.io/olympiades/`.

> ⚠️ **Important — le nom du dépôt.** Le projet est réglé pour un dépôt nommé **`olympiades`**.
> Si tu choisis **un autre nom**, ouvre le fichier `vite.config.ts` et remplace `'/olympiades/'` par `'/le-nom-de-ton-depot/'` (garde bien les deux barres obliques `/`).

### Étape 2 — Créer le Google Sheet

1. Va sur [sheets.google.com](https://sheets.google.com) et crée un **nouveau classeur vide**.
2. En bas, crée **7 onglets** avec **exactement** ces noms (respecte les majuscules) :

   `Config` · `Equipes` · `Participants` · `Epreuves` · `Scores` · `Matchs` · `Legende`

   > Pour renommer un onglet : double-clic sur son nom en bas de l'écran.

3. Le plus simple : ouvre les fichiers du dossier **`modele-google-sheet/`** de ce projet (un fichier `.csv` par onglet). Ouvre chaque `.csv`, copie tout, et **colle dans l'onglet correspondant** du Google Sheet (colle dans la cellule **A1**).
   - `modele-google-sheet/Config.csv` → onglet `Config`
   - `modele-google-sheet/Equipes.csv` → onglet `Equipes`
   - `modele-google-sheet/Participants.csv` → onglet `Participants`
   - `modele-google-sheet/Epreuves.csv` → onglet `Epreuves`
   - `modele-google-sheet/Scores.csv` → onglet `Scores`
   - `modele-google-sheet/Matchs.csv` → onglet `Matchs`
   - `modele-google-sheet/Legende.csv` → onglet `Legende`

   > 💡 Astuce : dans Google Sheets, **Fichier → Importer → Importer un fichier**, choisis le `.csv`, puis « Insérer dans la feuille actuelle ». Fais-le une fois par onglet.

4. La **première ligne de chaque onglet contient les titres de colonnes** (les « entêtes »). **Ne les supprime pas** et **ne les renomme pas** : l'appli s'en sert pour lire les données.

Le [détail de chaque onglet est décrit plus bas](#-le-détail-de-chaque-onglet-du-sheet).

### Étape 3 — Partager le Sheet en lecture

Pour que l'appli puisse lire le Sheet, il doit être **public en lecture** :

1. En haut à droite du Sheet, clique sur **« Partager »**.
2. Dans « Accès général », choisis **« Tout utilisateur disposant du lien »**.
3. Vérifie que le rôle à droite est bien **« Lecteur »** (surtout **pas** « Éditeur » : on ne veut pas que n'importe qui modifie !).
4. Clique sur **« OK / Terminé »**.

> 🔒 Rassure-toi : « Lecteur » signifie juste que les gens peuvent **voir** le contenu. Toi seul (et ceux à qui tu donnes le rôle « Éditeur ») pouvez le **modifier**.

### Étape 4 — Coller le SHEET_ID dans l'appli

Le `SHEET_ID` est l'identifiant unique de ton Google Sheet. On le trouve dans son adresse (URL) :

```
https://docs.google.com/spreadsheets/d/  1AbCdEfGhIjKlMnOpQrStUvWxYz1234567890  /edit#gid=0
                                        └────────────── SHEET_ID ──────────────┘
```

C'est la longue suite de lettres et chiffres **entre `/d/` et `/edit`**.

1. Copie ce `SHEET_ID`.
2. Dans le projet, ouvre le fichier **`src/config.ts`**.
3. Colle ton identifiant entre les guillemets de la ligne :

   ```ts
   export const SHEET_ID = 'COLLE_TON_IDENTIFIANT_ICI'
   ```

4. Enregistre le fichier. Sur GitHub, tu peux éditer ce fichier directement dans le navigateur (bouton crayon ✏️) puis **« Commit changes »**.

> ✅ Dès que ce fichier est enregistré sur GitHub, le site se reconstruit tout seul avec **tes** données (voir étape suivante).

### Étape 5 — Activer GitHub Pages

1. Sur la page de ton dépôt GitHub, va dans **Settings** (Paramètres) → **Pages** (menu de gauche).
2. Dans **« Build and deployment » → « Source »**, choisis **« GitHub Actions »**.
3. C'est tout ! À chaque modification poussée sur la branche **`main`**, le site se reconstruit et se publie automatiquement (grâce au fichier `.github/workflows/deploy.yml` déjà inclus).
4. Après une minute ou deux, ton appli est en ligne à l'adresse :

   ```
   https://TON-PSEUDO.github.io/NOM-DE-TON-DEPOT/
   ```

   Tu peux suivre l'avancement dans l'onglet **« Actions »** du dépôt (une pastille verte ✅ = c'est publié).

> 📱 **Astuce téléphone :** ouvre cette adresse sur ton téléphone, puis « Ajouter à l'écran d'accueil ». L'appli s'ouvrira comme une vraie application.

---

## 📋 Le détail de chaque onglet du Sheet

> Règle d'or : **garde la première ligne (les titres de colonnes) telle quelle.** Les lignes suivantes sont tes données.
> L'appli est **tolérante** : si une colonne facultative est vide ou absente, elle continue de fonctionner.

> 📅 **Plusieurs éditions dans un seul document.** Tous les onglets (sauf `Legende`) ont une colonne **`annee`** en première position. Tu ajoutes autant d'éditions que tu veux dans le même Sheet : un **sélecteur d'année** apparaît en haut de l'appli et filtre tous les écrans. `Legende` reste **global** (le palmarès de toutes les années).

### Onglet `Config` — les infos générales, par édition
Trois colonnes : `annee`, `cle`, `valeur`. Une info par ligne.
- **Ligne globale** = `annee` **vide** (vaut pour toutes les éditions).
- **Ligne d'édition** = `annee` renseignée (ex. `2025`).

| annee | cle | valeur (exemple) |
|-------|-----|------------------|
| *(vide)* | `annee_defaut` | 2025 |
| *(vide)* | `prochaine_edition` | samedi 14 août 2027 |
| *(vide)* | `prochaine_date_iso` | 2027-08-14 |
| *(vide)* | `prochaine_note` | Préparez-vous à écrire la suite 💪 |
| 2025 | `nom_edition` | OlympYeu 2025 |
| 2025 | `date` | samedi 16 août 2025 |
| 2025 | `lieu` | Île d'Yeu |
| 2025 | `theme` | Cinéma & BD |
| 2025 | `couleur_primaire` | #0EA5E9 |
| 2025 | `message_accueil` | Que la fête commence ! |

- `annee_defaut` *(global)* : l'édition affichée au premier lancement (sinon la plus récente).
- ⏳ **Compte à rebours** : `prochaine_date_iso` au format **`AAAA-MM-JJ`** affiche un compteur J‑H‑M‑S (Accueil + La Légende). Sans cette clé, pas de compteur.

### Onglet `Equipes` — les équipes de chaque édition
| annee | nom | theme | emoji | couleur | points_total | rang | note |
|-------|-----|-------|-------|---------|--------------|------|------|
| 2025 | Astérix & Obélix | Égypte | 🛡️ | #06D6A0 | *(vide)* | 1 | 🏆 Vainqueur de la finale |

- `nom` : sert de référence dans les autres onglets — écris-le **toujours pareil**.
- `theme` / `emoji` / `couleur` (hex `#` + 6 caractères, via [htmlcolorcodes.com](https://htmlcolorcodes.com/fr/)).
- `points_total` *(facultatif)* : total imposé. **Si vide**, l'appli **additionne les `Scores`**.
- `rang` *(facultatif)* : classement imposé (1 = champion). **Si rempli**, il fixe l'ordre du podium — même si une autre équipe a plus de points (finale décisive). **Si vide**, l'ordre suit le total.
- `note` *(facultatif)* : petit badge affiché sous l'équipe (ex. « 🏆 Vainqueur de la finale »).

### Onglet `Participants` — qui est dans quelle équipe
| annee | nom | equipe |
|-------|-----|--------|
| 2025 | Augustin | Top Yeu |

- `equipe` doit correspondre **exactement** à un `nom` d'équipe de la **même année**.

### Onglet `Epreuves` — le programme de chaque édition
| annee | ordre | nom | horaire | duree | lieu | format | regles | systeme_points |
|-------|-------|-----|---------|-------|------|--------|--------|----------------|
| 2025 | 1 | Volley Ball | 10h00 - 11h00 | 1h | Plage | Tous ensemble | … | Match en 10 pts… |

- `ordre` : un nombre, sert à **trier** les épreuves. Le reste est du texte libre.

### Onglet `Scores` — le cœur du jour J ⭐
C'est **ce que tu remplis au fil de la journée**.

| annee | epreuve | equipe | points | classement |
|-------|---------|--------|--------|-----------|
| 2025 | Volley Ball | Top Yeu | 45 | 1 |

- `epreuve` = un `nom` de `Epreuves`, `equipe` = un `nom` de `Equipes` (même année).
- `points` : points gagnés **sur cette épreuve**. `classement` *(facultatif)* : rang sur l'épreuve.

> 🧮 **Le total d'une équipe** = sa colonne `points_total` si remplie, **sinon la somme de ses `Scores`**. L'ordre du classement suit la colonne `rang` si elle est remplie, sinon le total.

### Onglet `Matchs` *(facultatif)* — les confrontations / poules
Utile pour les sports en duel (foot, spike ball, baby-foot…).

| annee | epreuve | equipeA | equipeB | horaire | terrain | scoreA | scoreB | statut |
|-------|---------|---------|---------|---------|---------|--------|--------|--------|
| 2025 | Football 3x3 | Top Yeu | E.T. | 14h50 | Terrain de foot | 0 | 1 | terminé |

- `statut` : `à venir`, `en cours` ou `terminé` (colore l'affichage).
- Si tu ne veux pas gérer les matchs, **laisse cet onglet quasi vide** (juste la ligne de titres) : l'appli fonctionnera très bien sans.

### Onglet `Legende` — le palmarès de toutes les éditions 🏆
| annee | champion | emoji | note | photo |
|-------|----------|-------|------|-------|
| 2018 | Yeullow | 🏄 | | legende/2018.jpg |
| 2021 | | 😷 | Annulée — Covid | |

- Une ligne par année.
- Pour une année **annulée**, laisse `champion` vide et écris la raison dans `note` (l'appli l'affiche en grisé).
- Le **numéro du prochain « chapitre »** affiché dans l'appli est calculé automatiquement à partir du nombre d'éditions **réellement disputées** (les années avec une `note` ne comptent pas).
- `photo` *(facultatif)* : la **photo de l'équipe championne**. Deux options :
  1. **Dans le dépôt (recommandé)** : dépose l'image dans le dossier **`public/legende/`** de ton projet GitHub (glisser-déposer directement sur github.com : ouvre le dossier `public/legende/`, bouton **« Add file → Upload files »**), puis écris son chemin dans la colonne : `legende/2018.jpg`.
  2. **Une URL complète** : colle une adresse `https://…` d'une image publique.
  - Sans photo, l'emoji de l'année s'affiche à la place. Astuce : des images **carrées** (~400×400 px) et légères rendent le mieux.

---

## 📱 Saisir et corriger les scores le jour J (depuis le téléphone)

1. Installe l'appli **Google Sheets** sur ton téléphone et ouvre **ton** classeur.
2. Va sur l'onglet **`Scores`**.
3. Après chaque épreuve, ajoute (ou corrige) une ligne : `epreuve`, `equipe`, `points`, et éventuellement `classement`.
   - Tu peux préparer à l'avance toutes les lignes (une par équipe et par épreuve) avec `points` vides, et juste **remplir les points** au fur et à mesure. C'est le plus rapide.
4. **C'est tout.** L'appli des participants se met à jour **toute seule toutes les 45 secondes**. Ils peuvent aussi appuyer sur **« Rafraîchir »** en haut de l'écran.

> ✍️ **Corriger une erreur** : modifie simplement la cellule dans le Sheet. La correction apparaîtra dans l'appli au rafraîchissement suivant.
>
> 📶 **Mauvais réseau sur l'île ?** Pas de panique : l'appli garde en mémoire la dernière version vue et l'affiche (badge « Hors ligne ») au lieu d'une page blanche. Elle se remettra à jour dès que le réseau revient.

---

## 👩‍💻 Pour les développeurs

Application **Vite + React + TypeScript + TailwindCSS**, routing par **HashRouter** (compatible GitHub Pages), sans aucun backend.

```bash
npm install      # installer les dépendances
npm run dev      # lancer en local (http://localhost:5173)
npm run build    # construire la version de production (dossier dist/)
npm run preview  # prévisualiser la version construite
```

### Structure du projet
```
src/
├── config.ts              ← LE fichier où coller le SHEET_ID
├── types.ts               ← types des données (1 par onglet)
├── data/
│   ├── gviz.ts            ← parseur robuste de la réponse Google (gviz/JSONP)
│   ├── mappers.ts         ← conversion lignes brutes → objets typés (tolérant)
│   ├── transform.ts       ← calculs (classement général, agrégations…)
│   ├── fallback.ts        ← données de démonstration (édition 2025)
│   └── DataContext.tsx    ← fetch + cache localStorage + rafraîchissement 45 s
├── components/            ← composants réutilisables (Podium, BottomNav…)
├── pages/                 ← 1 fichier par écran (Accueil, Classement, …)
└── lib/utils.ts           ← utilitaires (couleurs, dates…)
```

### Comment les données sont lues
L'appli appelle, pour chaque onglet, l'endpoint public **gviz** de Google Sheets :
```
https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:json&sheet={NOM_ONGLET}&headers=1
```
La réponse est du JSONP (`google.visualization.Query.setResponse({...})`) : `src/data/gviz.ts` retire l'enveloppe puis fait un `JSON.parse`, gère les cellules vides, les nombres et les dates. **Aucune clé API n'est nécessaire** : il suffit que le Sheet soit partagé en lecture.

### Personnaliser
- **Nom du dépôt** → `base` dans `vite.config.ts`.
- **Couleurs / police** → `tailwind.config.js`.
- **Intervalle de rafraîchissement** → `REFRESH_INTERVAL_MS` dans `src/config.ts`.

---

## ❓ Questions fréquentes

**L'appli affiche « Démo », pas mes données.**
→ Le `SHEET_ID` n'est pas (ou mal) renseigné dans `src/config.ts`. Vérifie l'étape 4.

**Ça affiche « Le Google Sheet semble vide ou inaccessible ».**
→ Vérifie que le Sheet est partagé en **« Tout utilisateur disposant du lien : Lecteur »** (étape 3) et que les onglets portent les bons noms.

**J'ai renommé mon dépôt / le site affiche une page blanche.**
→ Mets à jour `base` dans `vite.config.ts` avec `'/nom-exact-du-depot/'`, puis pousse la modif.

**Un onglet est vide, est-ce grave ?**
→ Non. L'appli se dégrade proprement : elle affiche un message « rien à afficher » à cet endroit, sans planter.

**Est-ce que quelqu'un peut casser les données depuis l'appli ?**
→ Non. L'appli est en **lecture seule**. Les données ne peuvent être modifiées que dans le Google Sheet, par ceux qui ont les droits d'édition.

---

Fait avec ☀️ pour l'Île d'Yeu. Bonne olympiade !

<!-- redeploy: 2026-08-27T14:45:03Z -->

<!-- redeploy: 2026-08-27T14:56:57Z -->
