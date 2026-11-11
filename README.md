# Dorify — Site vitrine

Les formulaires exigent un CAPTCHA visuel PNG à six caractères. La réponse reste en mémoire serveur, expire après cinq minutes et chaque tentative consomme le code. Un code manquant, incorrect, expiré ou réutilisé bloque l’enregistrement et la notification email. Le renouvellement est limité à 60 codes par adresse de socket sur 15 minutes ; les envois restent limités à 10 tentatives. Le redémarrage du serveur invalide les codes en cours. Aucun service tiers ni clé externe n’est nécessaire.

Les captures de démonstration peuvent être reprises avec `node tools/capture-product.js` (Playwright de dori-web). `APP_URL`, `CAPTURE_USERNAME` et `CAPTURE_PASSWORD` permettent de choisir la démonstration. `PREPARE_ACTIVITY=true` ouvre jusqu’à trois guichets et appelle des tickets : utiliser uniquement sur une base de démonstration. Les rapports sont capturés sur une période historique renseignée ; les données sont synthétiques et signalées dans la galerie.

Projet indépendant : `D:\work\workspaces\dori\dori-site`.
Aucune dépendance d’exécution aux projets dori-api, dori-web et dori-agent. Les informations légales de la vitrine reprennent la configuration de développement de dori-web et distinguent les formulaires des données métier.

## Docker local

```powershell
docker compose -f compose.site.cloud.yaml up -d --build
docker compose -f compose.site.cloud.yaml ps
```

**Site : http://localhost:18090** — **Espace client : http://localhost:58080/login**.

Un serveur Node.js, sans dépendance npm de production, un réseau indépendant et le volume persistant `dorify-site-requests`. Pas de base PostgreSQL/Redis supplémentaire. Conteneur non-root, système de fichiers en lecture seule hors volume.

Le port est publié sur 127.0.0.1 pour la démonstration. Pour publier sur Internet : domaine, reverse proxy HTTPS, PUBLIC_URL et CLOUD_LOGIN_URL réelles. Aucun hébergement externe créé.

## Pages et présentation

Le site vitrine intègre désormais 24 pages statiques rendues côté serveur, couvrant l’ensemble des recommandations de l’audit SEO, SaaS et conversion :

- **Accueil (`/`)** : H1 axé sur les mots-clés métier (« Logiciel de gestion des files d’attente, des rendez-vous et de l’accueil visiteurs »), signature « Moins d’attente. Plus d’attention. », parcours en 5 étapes, présentation des modules, aperçu des secteurs, captures réelles avec zoom, sélecteur Cloud/INTRA et FAQ enrichie.
- **La solution (`/solution`)** : Parcours complet structuré autour des 3 profils (Usager, Opérateur guichet, Décideur/DSI) et schéma fonctionnel en 6 étapes.
- **Sommaire des fonctionnalités (`/fonctionnalites`)** : Catalogue complet et matrice de transparence technique (inclus nativement / selon hébergement / matériel standard / prestataire externe).
- **6 pages dédiées aux fonctionnalités** :
  - `/fonctionnalites/gestion-files-attente` : files, capacités, règles de priorité spontanés vs RDV.
  - `/fonctionnalites/prise-rendez-vous` : agenda de créneaux, pointage à l’arrivée, replanification.
  - `/fonctionnalites/poste-guichet-operateur` : cockpit opérateur web, appel suivant en 1 clic, qualification.
  - `/fonctionnalites/bornes-tickets-affichage` : borne tactile, tickets papier/QR et écran d’appel en salle.
  - `/fonctionnalites/suivi-mobile-file-attente` : suivi en direct sur smartphone sans application (QR code).
  - `/fonctionnalites/statistiques-supervision` : salle de contrôle (Control Room), rapports et exports CSV.
- **Grille tarifaire (`/tarifs`)** : Formules Starter (1 site), Pro (multi-guichets & RDV) et Réseau multi-sites, sans coût caché.
- **Démonstration (`/demo`) & Demande (`/demande-compte`)** : Présentation du déroulé de la démo en 30 min et formulaire en deux étapes avec validation temps réel.
- **Foire aux questions (`/faq`)** : Questions regroupées par thématiques avec balisage Schema.org `FAQPage`.
- **Hébergement & Déploiement** :
  - `/hebergement` : Comparatif approfondi Cloud vs INTRA (installation locale sur site / on-premise), résilience hors-ligne.
  - `/cloud` : Présentation du SaaS souverain hébergé en Union Européenne (France, ISO 27001).
  - `/installation-locale` : Présentation de Dorify INTRA (on-premise sur réseau local).
  - `/securite-rgpd` : Page de réassurance DSI/DPO (chiffrement TLS 1.3 / AES-256, audit 366 jours, zéro traceur).
- **Pages sectorielles** :
  - `/secteurs/mairies-collectivites` : Mairies, CCAS et collectivités (état civil, passeports, CNI).
  - `/secteurs/administrations-services-publics` : Préfectures, universités et organismes sociaux.
  - `/secteurs/reseaux-agences` : Agences bancaires, mutuelles et accueils multisites.
- **Pages corporate & légales** :
  - `/a-propos` : Identité de l’éditeur Dorify SAS, mission, histoire et principes directeurs.
  - `/contact` : Formulaire de contact général avec motifs qualifiés.
  - `/mentions-legales` : Informations juridiques complètes, éditeur Dorify SAS, capital, RCS, hébergeur.
  - `/confidentialite` : Politique de confidentialité conforme RGPD (bases légales, rétention, droits CNIL).

HTML rendu côté serveur sur chaque URL, CSS et JavaScript natifs. SEO : balises Title et meta descriptions uniques et optimisées, canonical absolu, Open Graph, Twitter Cards, données structurées Schema.org (`Organization`, `SoftwareApplication`, `BreadcrumbList`, `FAQPage`), sitemap.xml exhaustif et robots.txt sécurisé (`Disallow: /api/` et `/internal/`).
Ni CDN, ni police distante, ni traqueur.
Couleurs reprises de Dorify : bleu nuit #102a43, turquoise #087477, menthe #c5f4ef.
Le cockpit illustré sur l’accueil utilise des données fictives signalées. Les captures réelles de supervision, rapports et borne proviennent de la démonstration, sans l’annonce de test. Pas de faux client, témoignage ou chiffre commercial.

## Configuration

Copier `.env.example` en `.env`, adapter puis recréer le conteneur :

```powershell
Copy-Item .env.example .env
docker compose -f compose.site.cloud.yaml up -d --force-recreate
```

| Variable | Rôle |
|---|---|
| SITE_PORT | Port local, 18090 par défaut. |
| PUBLIC_URL | Origine exacte du site (http://localhost:18090 par défaut), utilisée pour valider l’origine des formulaires. |
| CLOUD_LOGIN_URL | Lien de connexion de l’espace client. |
| LEGAL_EMAIL | Contact l?gal, distinct du contact commercial. |
| LEGAL_DEMO | Signale les coordonn?es de d?veloppement reprises de dori-web. |
| CONTACT_EMAIL | Contact affiché si renseigné. Ne configure pas un service d’envoi. |
| LEGAL_NAME, LEGAL_ADDRESS, LEGAL_REGISTRATION | Identité réelle de l’éditeur, à compléter avant publication publique. |
| HOSTING_PROVIDER | Informations de l’hébergeur réel. |
| REQUEST_RETENTION_DAYS | Conservation de 1 à 365 jours, 90 par défaut. |
| DATA_DIR | Stockage, /app/data dans Docker. |

Les coordonnées de l’entreprise et la rédaction juridique finale doivent être complétées avec les informations réelles avant publication publique. Les coordonnées actuelles proviennent du développement de dori-web (DEV-LOCAL), avec LEGAL_DEMO=true. Remplacer les coordonnées par celles de l’éditeur réel et passer LEGAL_DEMO=false avant publication publique.

## Demandes de compte, démo et contact

`POST /api/requests` enregistre un fichier JSON privé par demande dans le volume Docker, avec référence UUID, date, accord et statut **pending**.

**Aucun compte Dorify n’est créé automatiquement. Les emails de confirmation et de notification commerciale sont envoyés uniquement si le fournisseur email est configuré (voir MAIL.md).**
L’équipe doit consulter les demandes, qualifier le besoin et créer les accès dans l’application concernée. La confirmation affichée ne vaut pas approbation.

Consulter/exporter, depuis le poste administrateur :

```powershell
docker compose -f compose.site.cloud.yaml exec -T site node tools/export-requests.js
docker compose -f compose.site.cloud.yaml exec -T site node tools/export-requests.js --csv
```

Pas de liste publique de demandes. L’outil exige l’accès à Docker. L’export CSV protège les champs interprétables comme formules. Les exports/sauvegardes restent sous la responsabilité de l’exploitant, notamment leur conservation.

Purge au démarrage puis chaque heure, après la durée configurée. Si le conteneur est arrêté, elle reprend à son redémarrage.
`docker compose -f compose.site.cloud.yaml down` conserve le volume. Ne pas utiliser `--volumes` si les demandes doivent être gardées.

## Protections

Validation serveur, accord obligatoire, honeypot, limite du corps à 16 Kio et 10 tentatives par IP de socket sur 15 minutes. Pas de donnée de demande dans les logs.
La limitation est en mémoire par processus ; X-Forwarded-For n’est pas considéré comme fiable. Derrière un proxy, ajouter la limitation par visiteur au niveau du proxy, sinon ses visiteurs peuvent partager un quota.
Pas de réessai automatique après délai réseau : une demande peut déjà être enregistrée.

Contrat de l’API indépendante : `docs/openapi.json`. Aucun appel ni transfert de formulaire vers dori-api.

## Vérification et développement

Node.js 22.19+ recommandé, Node.js 24 dans Docker. Pas de npm install nécessaire pour démarrer ou tester.

```powershell
npm test
npm start
```

Le serveur local démarre sur localhost:18090. Utiliser un autre PORT si Docker occupe déjà ce port.

```powershell
node tools/browser-check.js
```

Le contrôle navigateur utilise Playwright local ou celui du projet voisin dori-web, et Chrome.
Pour un checkout autonome, installer Playwright uniquement pour la QA avec `npm install --no-save --package-lock=false playwright`. PLAYWRIGHT_MODULE peut désigner une installation existante.

Les tests API et le test navigateur d’envoi utilisent des stockages temporaires isolés, sans fausse demande dans le volume déployé.
Captures ordinateur/mobile : `artifacts/screenshots/` (ignorées par Git et Docker).

## Exploitation

```powershell
docker compose -f compose.site.cloud.yaml logs --tail=100 site
docker compose -f compose.site.cloud.yaml restart site
docker compose -f compose.site.cloud.yaml down
```

Le lien Espace client ouvre le Dorify Cloud. Les clients INTRA utilisent leur propre adresse d’installation.

