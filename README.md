# Dorify — Site vitrine

Projet indépendant : `D:\work\workspaces\dori\dori-site`.
Aucune dépendance d’exécution aux projets dori-api, dori-web et dori-agent. Les informations légales de la vitrine reprennent la configuration de développement de dori-web et distinguent les formulaires des données métier.

## Docker local

```powershell
docker compose -f compose.site.yaml up -d --build
docker compose -f compose.site.yaml ps
```

**Site : http://localhost:18090** — **Espace client : http://localhost:58080/login**.

Un serveur Node.js, sans dépendance npm de production, un réseau indépendant et le volume persistant `dorify-site-requests`. Pas de base PostgreSQL/Redis supplémentaire. Conteneur non-root, système de fichiers en lecture seule hors volume.

Le port est publié sur 127.0.0.1 pour la démonstration. Pour publier sur Internet : domaine, reverse proxy HTTPS, PUBLIC_URL et CLOUD_LOGIN_URL réelles. Aucun hébergement externe créé.

## Pages et présentation

Accueil, solution, fonctionnalités, Cloud & INTRA, à propos, contact, demande de compte/démo, confidentialité, mentions légales et 404.
Navigation mobile, galerie à onglets au clavier, agrandissement des captures, choix d’hébergement interactif, FAQ, formulaire en deux étapes et confirmation avec référence.

HTML rendu côté serveur sur chaque URL, CSS et JavaScript natifs. SEO : titres, descriptions, canonical, Open Graph, sitemap et robots.txt.
Ni CDN, ni police distante, ni traqueur.
Couleurs reprises de Dorify : bleu nuit #102a43, turquoise #087477, menthe #c5f4ef.
Le cockpit illustré sur l’accueil utilise des données fictives signalées. Les captures réelles de supervision, rapports et borne proviennent de la démonstration, sans l’annonce de test. Pas de faux client, témoignage ou chiffre commercial.

## Configuration

Copier `.env.example` en `.env`, adapter puis recréer le conteneur :

```powershell
Copy-Item .env.example .env
docker compose -f compose.site.yaml up -d --force-recreate
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

**Aucun compte Dorify n’est créé automatiquement. Aucun email ni alerte interne n’est envoyé.**
L’équipe doit consulter les demandes, qualifier le besoin et créer les accès dans l’application concernée. La confirmation affichée ne vaut pas approbation.

Consulter/exporter, depuis le poste administrateur :

```powershell
docker compose -f compose.site.yaml exec -T site node tools/export-requests.js
docker compose -f compose.site.yaml exec -T site node tools/export-requests.js --csv
```

Pas de liste publique de demandes. L’outil exige l’accès à Docker. L’export CSV protège les champs interprétables comme formules. Les exports/sauvegardes restent sous la responsabilité de l’exploitant, notamment leur conservation.

Purge au démarrage puis chaque heure, après la durée configurée. Si le conteneur est arrêté, elle reprend à son redémarrage.
`docker compose -f compose.site.yaml down` conserve le volume. Ne pas utiliser `--volumes` si les demandes doivent être gardées.

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
docker compose -f compose.site.yaml logs --tail=100 site
docker compose -f compose.site.yaml restart site
docker compose -f compose.site.yaml down
```

Le lien Espace client ouvre le Dorify Cloud. Les clients INTRA utilisent leur propre adresse d’installation.

