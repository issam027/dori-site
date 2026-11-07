export const escapeHtml = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
const e = escapeHtml;

const drawings = {
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  users: '<circle cx="9" cy="7" r="4"/><path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2m6 0v-2a4 4 0 0 0-3-4M16 3a4 4 0 0 1 0 8"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18m-12 5h3"/>',
  screen: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4m-6-10h4l2-4 2 7 2-3h2"/>',
  phone: '<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 18h4"/>',
  chart: '<path d="M3 3v18h18M7 14l4-5 4 3 5-7"/>',
  cloud: '<path d="M20 16.5A4.5 4.5 0 0 0 18 8a6 6 0 0 0-11.5 1A4 4 0 0 0 7 17h12"/>',
  server: '<rect x="3" y="3" width="18" height="7" rx="2"/><rect x="3" y="14" width="18" height="7" rx="2"/><path d="M7 6.5h.01M7 17.5h.01M11 6.5h6m-6 11h6"/>',
  shield: '<path d="m12 3-9 4v5c0 5 9 9 9 9s9-4 9-9V7l-9-4Z"/><path d="m8 12 3 3 5-6"/>',
  ticket: '<path d="M4 5h16v5a2 2 0 0 0 0 4v5H4v-5a2 2 0 0 0 0-4V5Zm10 0v3m0 3v2m0 3v3"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 5 9 8 9-8"/>',
  login: '<path d="M14 3h6v18h-6M3 12h12m-4-4 4 4-4 4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  building: '<path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-3M9 9h1m-1 4h1m-1 4h1"/>',
  zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'
};

const icon = n => '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (drawings[n] || drawings.grid) + '</svg>';
const link = (url, t, cls = 'button primary') => '<a class="' + cls + '" href="' + url + '">' + t + icon('arrow') + '</a>';
const eye = t => '<p class="eyebrow">' + t + '</p>';
const checks = items => '<ul class="check-list">' + items.map(t => '<li>' + icon('check') + t + '</li>').join('') + '</ul>';
const intro = (tag, title, p) => '<section class="container page-intro">' + eye(tag) + '<h1>' + title + '</h1><p class="lede">' + p + '</p></section>';
const heading = (tag, title, p = '') => '<div class="section-heading">' + eye(tag) + '<h2>' + title + '</h2>' + (p ? '<p>' + p + '</p>' : '') + '</div>';

function breadcrumbs(items) {
  return '<nav class="container" aria-label="Fil d’Ariane"><ol class="breadcrumbs"><li><a href="/">Accueil</a></li>' +
    items.map(([url, label], i) => i === items.length - 1 ?
      '<li aria-current="page"><span aria-hidden="true">/</span> <span>' + e(label) + '</span></li>' :
      '<li><span aria-hidden="true">/</span> <a href="' + url + '">' + e(label) + '</a></li>').join('') +
    '</ol></nav>';
}

const titles = {
  '/': ['Dorify — Logiciel de gestion des files d’attente, rendez-vous et accueil visiteurs', 'Solution complète de gestion de l’accueil physique : files d’attente, rendez-vous, cockpit guichet, bornes tactiles, suivi mobile et pilotage. Mode Cloud souverain ou INTRA sur site.'],
  '/solution': ['Solution de gestion de l’accueil physique : usagers, guichets et pilotage | Dorify', 'Découvrez le parcours complet Dorify pour visiteurs, opérateurs et administrateurs : de l’arrivée sur borne tactile à l’appel au guichet et la supervision temps réel.'],
  '/fonctionnalites': ['Fonctionnalités du logiciel de gestion d’accueil et files d’attente | Dorify', 'Catalogue complet des modules Dorify : files d’attente, rendez-vous en ligne, cockpit guichet opérateur, bornes tactiles, écrans d’appel, suivi mobile et rapports.'],
  '/fonctionnalites/gestion-files-attente': ['Gestion des files d’attente et règles de priorité | Dorify', 'Organisez vos flux d’usagers : files dédiées par démarche, règles de priorité spontanés vs rendez-vous, tolérance de retard et temps d’attente estimé en direct.'],
  '/fonctionnalites/prise-rendez-vous': ['Prise et gestion des rendez-vous d’accueil physique | Dorify', 'Synchronisez l’accueil sur rendez-vous et sans rendez-vous : créneaux configurables, pointage à l’arrivée, replanification et réduction des rendez-vous non honorés.'],
  '/fonctionnalites/poste-guichet-operateur': ['Cockpit opérateur et gestion des postes guichets | Dorify', 'Poste de travail unifié pour agents d’accueil : appel du visiteur suivant, rappel, qualification du service rendu, enregistrement direct et historique de session.'],
  '/fonctionnalites/bornes-tickets-affichage': ['Bornes tactiles d’accueil, tickets et affichage dynamique en salle | Dorify', 'Orientation immédiate dès l’entrée : borne tactile interactive, ticket papier ou QR code, et écran de salle d’attente avec rappel visuel et sonore.'],
  '/fonctionnalites/suivi-mobile-file-attente': ['Suivi mobile de file d’attente sur smartphone sans application | Dorify', 'Permettez à vos visiteurs de suivre leur avancée en direct sur leur smartphone via QR code : position dans la file, attente estimée et notification d’appel.'],
  '/fonctionnalites/statistiques-supervision': ['Supervision en temps réel et rapports statistiques d’accueil | Dorify', 'Pilotez votre accueil factuellement : salle de contrôle en direct (Control Room), indicateurs de charge, temps d’attente moyens et exports statistiques CSV.'],
  '/tarifs': ['Tarifs du logiciel de file d’attente et gestion d’accueil | Dorify', 'Découvrez nos formules d’abonnement transparentes Starter, Pro et Réseau pour collectivités et entreprises. Sans coût caché, matériel standard compatible.'],
  '/faq': ['Foire aux questions : files d’attente, bornes et rendez-vous | Dorify', 'Toutes les réponses sur le fonctionnement de Dorify : matériel compatible, différences Cloud vs INTRA local, sécurité des données RGPD, tarifs et mise en service.'],
  '/demo': ['Demander une démonstration personnalisée du logiciel | Dorify', 'Planifiez une visite guidée de 30 minutes de Dorify avec un expert : découvrez la borne, le suivi mobile, le cockpit guichet et la salle de contrôle.'],
  '/demande-compte': ['Demander un compte ou une démonstration | Dorify', 'Présentez votre organisation pour tester Dorify, planifier une démonstration sur mesure ou préparer votre déploiement Cloud ou INTRA.'],
  '/contact': ['Contactez l’équipe Dorify — Échangeons sur votre projet d’accueil | Dorify', 'Une question commerciale, technique ou un besoin d’accompagnement ? Échangez directement avec l’équipe éditrice de Dorify.'],
  '/hebergement': ['Hébergement Cloud ou installation locale on-premise INTRA | Dorify', 'Choisissez le mode d’hébergement adapté à vos contraintes : Cloud SaaS hébergé en France ou installation locale INTRA sur votre infrastructure avec résilience hors-ligne.'],
  '/cloud': ['Dorify Cloud — Logiciel de gestion d’accueil en mode SaaS souverain | Dorify', 'Votre solution d’accueil 100 % hébergée en Union Européenne : haute disponibilité, sauvegardes automatiques, mises à jour continues et zéro maintenance sur site.'],
  '/installation-locale': ['Dorify INTRA — Logiciel de file d’attente on-premise sur site | Dorify', 'Installation locale sur votre serveur : souveraineté complète de vos données métier, isolation réseau et continuité totale de l’accueil en cas de coupure Internet.'],
  '/securite-rgpd': ['Sécurité, souveraineté des données et conformité RGPD | Dorify', 'Engagement de sécurité et conformité pour DSI et DPO : chiffrement TLS 1.3 / AES-256, journal d’audit 366 jours, contrôle RBAC strict, zéro cookie tiers.'],
  '/secteurs/mairies-collectivites': ['Gestion des files d’attente et rendez-vous pour Mairies & Collectivités | Dorify', 'Modernisez l’accueil de votre collectivité : état civil, passeports, CNI, CCAS et démarches scolaires. Gestion conjointe des rendez-vous et flux spontanés.'],
  '/secteurs/administrations-services-publics': ['Gestion de l’accueil pour les administrations et services publics | Dorify', 'Fluidifiez l’accueil en préfecture, université et organismes sociaux : gestion des pointes d’affluence, respect de la confidentialité et accessibilité universelle.'],
  '/secteurs/reseaux-agences': ['Solution d’accueil et gestion de files pour réseaux d’agences multisites | Dorify', 'Standardisez l’accueil sur l’ensemble de vos points de contact : gestion de portefeuille multisite unifiée, indicateurs consolidés et affectation des équipes.'],
  '/a-propos': ['À propos de Dorify — Notre mission et notre équipe | Dorify', 'Découvrez l’entreprise éditrice de Dorify, nos engagements pour un accueil plus humain et les valeurs qui guident le développement de notre logiciel.'],
  '/mentions-legales': ['Mentions légales | Dorify', 'Informations légales, identification de l’éditeur Dorify SAS, directeur de la publication et hébergement du site vitrine.'],
  '/confidentialite': ['Politique de confidentialité et protection des données (RGPD) | Dorify', 'Transparence totale sur le traitement de vos données personnelles sur le site vitrine Dorify : finalités, base légale, durées de conservation et droits CNIL.']
};

export const pages = Object.fromEntries(Object.entries(titles).map(([k, [title, description]]) => [k, { title, description }]));

const brand = () => '<a class="brand" href="/" aria-label="Dorify — Accueil"><span class="brand-mark" aria-hidden="true">D<i></i></span><span class="brand-text"><span>DORIFY</span><small>L’accueil, simplement.</small></span></a>';

function header(route, c) {
  const navItems = [
    ['/solution', 'La solution'],
    ['/fonctionnalites', 'Fonctionnalités'],
    ['/secteurs/mairies-collectivites', 'Secteurs'],
    ['/hebergement', 'Cloud & Intra'],
    ['/tarifs', 'Tarifs'],
    ['/a-propos', 'À propos']
  ];
  return '<a class="skip-link" href="#main">Aller au contenu</a><header class="site-header"><div class="container header-inner">' +
    brand() +
    '<button class="menu-toggle" aria-controls="main-nav" aria-expanded="false" aria-label="Ouvrir le menu"><span></span><span></span><span></span></button>' +
    '<nav id="main-nav" aria-label="Navigation principale">' +
    navItems.map(([u, t]) => '<a href="' + u + '"' + (route === u || (u.includes('secteur') && route.startsWith('/secteurs')) || (u.includes('fonctionnalites') && route.startsWith('/fonctionnalites')) ? ' aria-current="page"' : '') + '>' + t + '</a>').join('') +
    '</nav>' +
    '<div class="header-actions">' +
    '<a class="client-link" href="' + e(c.cloudLogin) + '">' + icon('login') + 'Espace client</a>' +
    link('/demo', 'Demander une démo', 'button primary small') +
    '</div></div></header>';
}

function footer(c) {
  return '<footer class="site-footer"><div class="container footer-main">' +
    '<div>' + brand() + '<p>Moins d’attente.<br>Plus de place pour l’humain.</p><p class="product-footnote">Logiciel français de gestion des files d’attente, rendez-vous et accueil physique. Déploiement souverain Cloud UE ou INTRA on-premise.</p></div>' +
    '<div><h2>Produit & Solution</h2>' +
    '<a href="/solution">La solution</a>' +
    '<a href="/fonctionnalites">Sommaire fonctionnalités</a>' +
    '<a href="/fonctionnalites/gestion-files-attente">Files d’attente</a>' +
    '<a href="/fonctionnalites/prise-rendez-vous">Prise de rendez-vous</a>' +
    '<a href="/fonctionnalites/poste-guichet-operateur">Cockpit guichet</a>' +
    '<a href="/fonctionnalites/bornes-tickets-affichage">Bornes & affichage</a>' +
    '<a href="/fonctionnalites/suivi-mobile-file-attente">Suivi mobile</a>' +
    '<a href="/fonctionnalites/statistiques-supervision">Supervision & rapports</a>' +
    '</div>' +
    '<div><h2>Déploiement & Secteurs</h2>' +
    '<a href="/secteurs/mairies-collectivites">Mairies & Collectivités</a>' +
    '<a href="/secteurs/administrations-services-publics">Administrations publiques</a>' +
    '<a href="/secteurs/reseaux-agences">Réseaux d’agences</a>' +
    '<a href="/hebergement">Comparatif Cloud vs INTRA</a>' +
    '<a href="/cloud">Dorify Cloud (SaaS)</a>' +
    '<a href="/installation-locale">Dorify INTRA (Sur site)</a>' +
    '<a href="/securite-rgpd">Sécurité & RGPD</a>' +
    '<a href="/tarifs">Grille des tarifs</a>' +
    '</div>' +
    '<div class="footer-client"><h2>Échanger & Accès</h2>' +
    '<a href="/demo">Demander une démo</a>' +
    '<a href="/contact">Nous contacter</a>' +
    '<a href="/faq">Foire aux questions</a>' +
    '<a href="/a-propos">À propos de l’éditeur</a>' +
    '<p>Retrouvez votre espace Dorify Cloud :</p>' +
    '<a href="' + e(c.cloudLogin) + '">Accéder à mon espace ' + icon('arrow') + '</a>' +
    '<small>Installation INTRA : utilisez l’adresse fournie par votre administrateur réseau.</small>' +
    '<a href="' + e(new URL('/admin/site-requests', c.cloudLogin).href) + '" class="discrete-admin" rel="nofollow" aria-hidden="true" tabindex="-1">Administration</a>' +
    '</div></div>' +
    '<div class="container footer-bottom"><span>© ' + new Date().getUTCFullYear() + ' Dorify SAS. Tous droits réservés.</span>' +
    '<div><a href="/mentions-legales">Mentions légales</a><a href="/confidentialite">Confidentialité & RGPD</a><span>Conçu pour mieux accueillir.</span></div></div></footer>';
}

function cta() {
  return '<section class="container cta-section"><div>' + eye('ORGANISATION SIMPLIFIÉE & RELATION HUMAINE') +
    '<h2>Votre prochain visiteur<br>mérite un meilleur accueil.</h2>' +
    '<p>Modernisez vos files d’attente et vos rendez-vous. Échangeons sur votre contexte, vos équipes et vos établissements.</p></div>' +
    '<div class="cta-actions">' +
    link('/demo', 'Demander une démonstration de 30 min', 'button mint') +
    link('/contact', 'Échanger sur votre projet d’accueil', 'text-link light') +
    '</div><span class="cta-orbit" aria-hidden="true"></span></section>';
}

const featureData = [
  ['files', 'ticket', 'Gestion des files d’attente', 'Organisez les passages, les priorités et les capacités de chaque file.', ['Files et capacités de guichets', 'Horaires et jours d’ouverture', 'Règles de priorité et estimation d’attente'], '/fonctionnalites/gestion-files-attente'],
  ['rendez-vous', 'calendar', 'Prise et gestion des rendez-vous', 'Réservez les créneaux et synchronisez l’arrivée de vos visiteurs.', ['Créneaux et capacités configurables', 'Replanification et annulation', 'Pointage à l’arrivée'], '/fonctionnalites/prise-rendez-vous'],
  ['operateurs', 'grid', 'Cockpit opérateur guichet', 'Appelez, rappelez et terminez un passage depuis un poste unifié.', ['Sessions par guichet et par file', 'Appel suivant, rappel, servi ou absent', 'Enregistrement rapide et historique'], '/fonctionnalites/poste-guichet-operateur'],
  ['experiences', 'screen', 'Bornes, tickets & affichage', 'Guidez les arrivées et rendez les appels visibles en salle d’attente.', ['Parcours avec ou sans rendez-vous', 'Ticket imprimable et QR de suivi', 'Affichage dédié aux appels'], '/fonctionnalites/bornes-tickets-affichage'],
  ['suivi', 'phone', 'Suivi mobile de l’attente', 'Donnez à vos visiteurs un repère en temps réel sur smartphone sans app.', ['Lien individuel de suivi par QR code', 'Position et attente estimée en direct', 'Guichet indiqué lors de l’appel'], '/fonctionnalites/suivi-mobile-file-attente'],
  ['pilotage', 'chart', 'Supervision & rapports statistiques', 'Suivez la charge en direct, analysez l’activité et ajustez vos ressources.', ['Salle de contrôle temps réel (Control Room)', 'Volumes, durées et évolution par file', 'Filtres de période et export CSV'], '/fonctionnalites/statistiques-supervision']
];

function product() {
  return '<div class="product-scene"><div class="scene-top"><span class="live-dot"></span> UNE JOURNÉE PLUS SEREINE<span>AVEC DORIFY</span></div>' +
    '<div class="mini-app"><aside class="mini-sidebar"><span class="mini-brand">D</span>' +
    ['grid', 'users', 'calendar', 'chart'].map((i, n) => '<span class="mini-item ' + (!n ? 'active' : '') + '">' + icon(i) + '</span>').join('') +
    '<span class="mini-sidebar-bottom">' + icon('shield') + '</span></aside>' +
    '<div class="mini-content"><div class="mini-top"><span>Maison des services au public</span><span class="avatar">AL</span></div>' +
    '<div class="mini-heading"><div><small>MON ESPACE DE TRAVAIL</small><h3>Bonjour, Alex.</h3></div><span class="status"><i></i> En service</span></div>' +
    '<div class="mini-metrics"><div><span>En attente</span><b>12<small>visiteurs</small></b></div><div><span>Attente estimée</span><b>8<small>minutes</small></b></div><div><span>Guichets ouverts</span><b>3<small>sur 4</small></b></div></div>' +
    '<div class="mini-queue-head"><b>Votre file d’accueil</b><span>Aujourd’hui</span></div>' +
    '<div class="mini-row"><span class="ticket-number">A024</span><span><b>Accueil & orientation</b><small>Sur rendez-vous</small></span><span class="queue-pill">À appeler</span></div>' +
    '<div class="mini-row"><span class="ticket-number pale">A025</span><span><b>Démarches administratives</b><small>Sans rendez-vous</small></span><span class="row-time">En attente</span></div>' +
    '<div class="mini-call"><span>' + icon('users') + 'Guichet 02 · Session ouverte</span><span>Appeler le suivant ' + icon('arrow') + '</span></div>' +
    '</div></div>' +
    '<div class="floating-ticket"><span class="ticket-icon">' + icon('ticket') + '</span><div><small>VOTRE TICKET</small><strong>A024 <span>→ Guichet 02</span></strong><p>C’est à vous. Nous vous attendons.</p></div><span class="ticket-check">' + icon('check') + '</span></div>' +
    '<p class="illustration-note">Aperçu illustratif de l’interface opérateur · données fictives</p></div>';
}

const shots = [
  ['supervision', 'Supervision', 'Salle de contrôle en direct. Au bon moment.', 'Une vue opérationnelle du site pour repérer la charge des files, les temps d’attente et les guichets ouverts.', 'Capture de la supervision Dorify avec indicateurs de files et guichets.'],
  ['rapports', 'Rapports', 'Comprendre aujourd’hui. Dimensionner demain.', 'Volumes, temps de traitement, taux d’absence et évolution de l’activité pour éclairer vos décisions.', 'Capture des rapports Dorify avec volumes et courbes d’activité.'],
  ['borne', 'Borne d’accueil', 'Un premier contact tactile simple et guidé.', 'Avec ou sans rendez-vous, le visiteur sélectionne sa démarche en quelques secondes dès son arrivée.', 'Capture de la borne Dorify proposant une arrivée avec ou sans rendez-vous.']
];

function showcase() {
  return '<div class="showcase" data-showcase><div class="showcase-tabs" role="tablist" aria-label="Aperçus de l’application">' +
    shots.map(([id, t], i) => '<button id="tab-' + id + '" role="tab" aria-selected="' + (!i) + '" aria-controls="panel-' + id + '" tabindex="' + (i ? -1 : 0) + '" data-tab="' + id + '">' + icon(['screen', 'chart', 'ticket'][i]) + t + '</button>').join('') +
    '</div>' +
    shots.map(([id,, t, p, alt], i) => '<div id="panel-' + id + '" role="tabpanel" aria-labelledby="tab-' + id + '"' + (i ? ' hidden' : '') + '><div class="showcase-caption"><div><h3>' + t + '</h3><p>' + p + '</p></div><span class="capture-label">CAPTURE DE L’APPLICATION</span></div><button class="screenshot-button" data-zoom="/assets/' + id + '.png" data-caption="' + alt + '" aria-label="Agrandir : ' + alt + '"><img src="/assets/' + id + '.png" width="1440" height="1000" loading="lazy" alt="' + alt + '"><span>Voir en grand ' + icon('plus') + '</span></button></div>').join('') +
    '<p class="screenshot-note">Aperçus réels de l’environnement de démonstration Dorify. Données de consultation.</p></div>';
}

const questions = [
  ['Dorify fonctionne-t-il avec et sans rendez-vous ?', 'Oui. Les arrivées spontanées et les rendez-vous sont pris en charge dans le même environnement unifié. Vous pouvez configurer des files mixtes ou dédiées, avec des règles de priorité équilibrées et une prise en compte de la tolérance de retard.'],
  ['Faut-il installer un serveur chez nous ?', 'Pas avec l’offre Dorify Cloud : vous accédez à l’ensemble des interfaces depuis un simple navigateur web sécurisé. Si vos contraintes de sécurité ou de réseau exigent une étanchéité totale, le mode INTRA permet d’installer l’application et sa base de données sur vos propres serveurs.'],
  ['Que se passe-t-il si Internet est coupé en INTRA ?', 'En mode INTRA (installation locale on-premise), l’accueil continue normalement : bornes, guichets, écrans d’appel et base de données continuent de fonctionner sur votre réseau local. Seuls les services nécessitant un relais vers l’extérieur (comme le suivi mobile public sur smartphone) sont suspendus jusqu’au rétablissement de la liaison.'],
  ['Peut-on gérer plusieurs sites ou établissements ?', 'Oui. Dorify intègre une vue portefeuille multi-sites. Chaque utilisateur est affecté aux sites et aux files correspondant à son périmètre, tandis que les responsables disposent d’une supervision globale consolidée.'],
  ['Quel matériel faut-il prévoir pour déployer Dorify ?', 'Dorify ne vous enferme dans aucun matériel propriétaire. Vous pouvez utiliser n’importe quelle tablette ou borne tactile standard pour l’entrée, un écran TV HDMI standard avec mini-PC pour la salle d’attente, des postes informatiques ordinaires pour les opérateurs, et une imprimante thermique standard (ESC/POS ou pilote bureautique) si vous souhaitez des tickets papier.'],
  ['Ma demande ouvre-t-elle immédiatement un compte ?', 'Non. Afin d’adapter la solution à vos contraintes de déploiement (nombre de guichets, volumétrie, Cloud ou INTRA), chaque demande fait l’objet d’un échange préalable et d’une démonstration personnalisée avec notre équipe avant ouverture des accès.']
];

function faq(limit = questions.length) {
  return '<div class="faq-list">' +
    questions.slice(0, limit).map(([q, a]) => '<details><summary>' + q + '<span>' + icon('plus') + '</span></summary><p>' + a + '</p></details>').join('') +
    '</div>';
}

function chooser() {
  return '<div class="hosting-preview"><div>' +
    '<div class="segmented" role="group" aria-label="Choisir le mode d’hébergement">' +
    '<button type="button" data-hosting="cloud" aria-pressed="true">' + icon('cloud') + 'Dorify Cloud</button>' +
    '<button type="button" data-hosting="intra" aria-pressed="false">' + icon('server') + 'Dorify Intra</button>' +
    '</div>' +
    '<div data-hosting-panel="cloud"><h3>Votre accueil, sans serveur chez vous.</h3><p>Votre application et vos données sont hébergées dans un Cloud souverain en France / Union Européenne. Vos équipes et vos bornes se connectent simplement depuis leur navigateur.</p>' +
    checks(['Zéro serveur métier à administrer sur site', 'Sauvegardes automatiques quotidiennes et haute disponibilité', 'Mises à jour continues et portefeuille multi-sites']) +
    '</div>' +
    '<div data-hosting-panel="intra" hidden><h3>Votre infrastructure. Votre accueil local.</h3><p>L’application et la base métier PostgreSQL sont installées sur site (on-premise). L’accueil local continue de fonctionner même en cas de coupure Internet.</p>' +
    checks(['Souveraineté totale : base et données hébergées chez vous', 'Fonctionnement autonome garanti sur réseau local', 'Agent sortant pour supervision et relais sécurisés']) +
    '</div>' +
    link('/hebergement', 'Comparer en détail les deux modes', 'text-link') +
    '</div><div class="hosting-visual"><span class="connection-label">UNE MÊME EXPÉRIENCE DORIFY</span>' +
    '<div class="hosting-node"><span>' + icon('screen') + '</span><b>Vos équipes & guichets</b><small>Navigateur web / Réseau</small></div>' +
    '<div class="connection-line"><i></i><i></i><i></i></div>' +
    '<div class="hosting-node accent"><span data-hosting-icon>' + icon('cloud') + '</span><b data-hosting-title>Dorify Cloud</b><small data-hosting-subtitle>Application & données hébergées</small></div>' +
    '<p class="hosting-caption">Le mode d’hébergement adapté à vos exigences techniques.</p></div></div>';
}

function home() {
  return '<section class="hero container"><div class="hero-copy">' +
    '<div class="hero-eyebrow"><span class="live-dot"></span> MOINS D’ATTENTE. PLUS D’ATTENTION.</div>' +
    '<h1>Logiciel de gestion des files d’attente, des rendez-vous et de l’accueil visiteurs</h1>' +
    '<p>Réunissez l’accueil spontané et les rendez-vous dans un cockpit unique. Donnez des repères en temps réel à vos usagers sur borne, écran et mobile, et offrez une organisation sereine à vos agents de guichet.</p>' +
    '<div class="hero-actions">' +
    link('/demo', 'Demander une démonstration', 'button primary') +
    '<a class="button secondary" href="#parcours">' + icon('screen') + 'Découvrir le parcours</a>' +
    '</div>' +
    '<div class="hero-reassurance">' +
    '<span>' + icon('check') + 'Mode Cloud SaaS ou INTRA sur site (On-premise)</span>' +
    '<span>' + icon('check') + 'Conforme RGPD & zéro traceur</span>' +
    '<span>' + icon('check') + 'Pensé pour le multi-guichets et multi-sites</span>' +
    '</div></div>' +
    product() +
    '</section>' +

    '<section id="parcours" class="container section">' +
    heading('LE PARCOURS DORIFY EN 5 ÉTAPES', 'De l’arrivée de l’usager au pilotage de votre accueil.', 'Un flux clair et continu pour supprimer les points de friction et valoriser le temps de vos équipes.') +
    '<div class="steps-flow">' +
    [
      ['1', 'zap', 'Configuration des services', 'Définissez vos files, guichets, créneaux de RDV et règles de priorité selon vos horaires et compétences.'],
      ['2', 'ticket', 'Accueil & émission ticket', 'L’usager sélectionne sa démarche sur borne tactile ou pointe son rendez-vous pour recevoir son ticket papier ou numérique.'],
      ['3', 'phone', 'Attente informée & mobile', 'L’usager suit sa position et l’attente estimée sur les écrans de salle ou en direct sur son smartphone via QR code sans application.'],
      ['4', 'users', 'Appel au guichet', 'L’agent appelle le visiteur suivant depuis son cockpit unifié en un clic, effectue un rappel ou valide le service rendu.'],
      ['5', 'chart', 'Supervision & analyse', 'Pilotez la charge en direct depuis la salle de contrôle et analysez les statistiques de fréquentation pour dimensionner vos équipes.']
    ].map(([num, ic, t, p]) => '<article class="step-card"><span class="step-badge">' + num + '</span><h3>' + t + '</h3><p>' + p + '</p><span class="step-meta">' + icon(ic) + 'Étape ' + num + '</span></article>').join('') +
    '</div>' +
    link('/solution', 'Comprendre le fonctionnement complet de la solution', 'text-link') +
    '</section>' +

    '<section class="section section-soft"><div class="container">' +
    heading('DES FONCTIONNALITÉS CONÇUES POUR LE TERRAIN', 'Tout ce qu’il faut pour un accueil fluide et moderne.', 'Chaque module a été éprouvé pour répondre aux exigences réelles des établissements recevant du public.') +
    '<div class="support-grid">' +
    featureData.map(([id, i, t, p,, url]) => '<article>' + icon(i) + '<h3>' + t + '</h3><p>' + p + '</p><a href="' + url + '" class="text-link mt-14">Découvrir ce module ' + icon('arrow') + '</a></article>').join('') +
    '</div>' +
    '<div class="mt-35">' + link('/fonctionnalites', 'Explorer l’ensemble des fonctionnalités et prérequis', 'button secondary') + '</div>' +
    '</div></section>' +

    '<section class="container section">' +
    heading('DES SOLUTIONS ADAPTÉES À VOTRE SECTEUR', 'Un accueil public et professionnel sur mesure.', 'Que vous gériez une mairie, un établissement public ou un réseau d’agences, Dorify s’adapte à vos spécificités.') +
    '<div class="sector-grid">' +
    [
      ['building', 'Mairies & Collectivités', 'Gérez conjointement les rendez-vous CNI/passeports et les flux spontanés d’état civil ou de CCAS dans le respect de vos administrés.', '/secteurs/mairies-collectivites'],
      ['shield', 'Administrations publiques', 'Régulez les pointes d’affluence en préfecture, université et services sociaux tout en garantissant la confidentialité et l’accessibilité.', '/secteurs/administrations-services-publics'],
      ['grid', 'Réseaux d’agences', 'Standardisez la qualité d’accueil de vos agences bancaires, mutuelles et points de contact grâce à la console multi-sites unifiée.', '/secteurs/reseaux-agences']
    ].map(([ic, t, p, url]) => '<article class="sector-card"><div class="sector-icon">' + icon(ic) + '</div><h3>' + t + '</h3><p>' + p + '</p><a href="' + url + '" class="button secondary small">Voir la solution sectorielle ' + icon('arrow') + '</a></article>').join('') +
    '</div>' +
    '</section>' +

    '<section id="apercu" class="section section-soft"><div class="container">' +
    heading('DORIFY EN IMAGES RÉELLES', 'Une interface épurée.<br>Des usages pensés pour les équipes.', 'Découvrez les écrans réels de supervision, des rapports statistiques et de la borne tactile.') +
    showcase() +
    '</div></section>' +

    '<section class="container section">' +
    heading('LE CHOIX DE L’HÉBERGEMENT', 'Dans le cloud souverain. Ou sur votre infrastructure (On-premise).') +
    chooser() +
    '</section>' +

    '<section class="container section faq-section">' +
    heading('LES QUESTIONS ESSENTIELLES', 'Tout savoir sur le déploiement de Dorify.', 'Retrouvez les réponses aux interrogations courantes de nos clients.') +
    faq(4) +
    '<div class="faq-all-link"><a href="/faq" class="text-link">Consulter toutes les questions de la FAQ ' + icon('arrow') + '</a></div>' +
    '</section>' +
    cta();
}

function solution() {
  return breadcrumbs([['/solution', 'La solution']]) +
    intro('LA SOLUTION DORIFY', 'Un accueil organisé pour les usagers.<br><span>Un cockpit serein pour les équipes.</span>', 'Découvrez le fonctionnement complet de Dorify : une plateforme unifiée qui articule le parcours du visiteur, le poste de l’opérateur au guichet et la salle de contrôle des responsables.') +
    '<section class="container solution-editorial"><div class="editorial-statement"><span class="large-quote">«</span><h2>L’organisation de l’accueil<br>doit servir la relation humaine.</h2><p>Le rendez-vous, l’arrivée, l’attente, l’orientation et l’appel au guichet constituent les maillons d’une même chaîne. Dorify relie ces étapes en temps réel pour apporter des repères clairs à chacun et supprimer les tensions d’attente.</p></div>' +
    '<div class="editorial-points">' +
    [
      ['clock', 'Rendre l’attente transparente et supportable', 'Un numéro de ticket, un rang précis dans la file et une estimation du délai transmise sur écran et sur smartphone via QR code.'],
      ['users', 'Libérer l’attention et la charge des agents', 'Un cockpit opérateur web épuré pour appeler le suivant en un clic, qualifier la démarche ou notifier un retard sans changer d’écran.'],
      ['chart', 'Piloter l’activité avec des données objectives', 'Une salle de contrôle en temps réel et des rapports d’activité périodiques pour adapter vos plannings de guichets à la fréquentation réelle.']
    ].map(([i, t, p]) => '<article><span class="feature-icon">' + icon(i) + '</span><div><h3>' + t + '</h3><p>' + p + '</p></div></article>').join('') +
    '</div></section>' +

    '<section class="section section-soft"><div class="container">' +
    heading('UNE EXPÉRIENCE ÉTUDIÉE POUR TROIS PROFILS D’UTILISATEURS', 'Chaque profil dispose d’une interface dédiée à sa mission.') +
    '<div class="role-grid">' +
    [
      ['Pour l’usager / visiteur', 'Prise de rendez-vous en ligne ou accueil spontané. À l’arrivée, orientation sur borne tactile ergonomique, ticket papier ou numérique, écran dynamique en salle et suivi mobile temps réel sur smartphone sans application.'],
      ['Pour l’opérateur / agent au guichet', 'Cockpit unifié accessible depuis tout navigateur : visualisation des files affectées, appel du visiteur suivant, rappel, qualification du service rendu, enregistrement direct d’un arrivant et historique de session.'],
      ['Pour le responsable / DSI', 'Supervision globale en salle de contrôle (Control Room), alertes de charge, rapports statistiques avec exports CSV, gestion fine des permissions RBAC et choix du mode d’hébergement (Cloud souverain ou INTRA sur site).']
    ].map(([t, p], n) => '<article><span>0' + (n + 1) + '</span><h3>' + t + '</h3><p>' + p + '</p></article>').join('') +
    '</div></div></section>' +

    '<section class="container section">' +
    heading('LE SCHÉMA FONCTIONNEL COMPLET', 'Le cycle complet d’un passage d’accueil dans Dorify.') +
    '<div class="steps-flow">' +
    [
      ['1', 'zap', '1. Ouverture du service', 'L’administrateur active les files et les agents ouvrent leur session sur leur guichet.'],
      ['2', 'ticket', '2. Arrivée & orientation', 'L’usager choisit son motif sur la borne ou valide son rendez-vous programmé.'],
      ['3', 'phone', '3. Attente guidée', 'L’usager consulte son rang et son temps estimé sur écran de salle ou sur son smartphone.'],
      ['4', 'screen', '4. Appel au guichet', 'L’agent déclenche l’appel : affichage immédiat du ticket et signal sonore en salle.'],
      ['5', 'users', '5. Service & prise en charge', 'L’usager est accueilli. L’agent valide le service rendu ou note une absence.'],
      ['6', 'chart', '6. Clôture & analyse', 'Les durées réelles d’attente et de traitement viennent alimenter les rapports décisionnels.']
    ].map(([num, ic, t, p]) => '<article class="step-card"><span class="step-badge">' + num + '</span><h3>' + t + '</h3><p>' + p + '</p><span class="step-meta">' + icon(ic) + 'Étape ' + num + '</span></article>').join('') +
    '</div>' +
    '<div class="mt-35">' + link('/fonctionnalites', 'Consulter le détail de chaque fonctionnalité', 'button primary') + '</div>' +
    '</section>' +
    cta();
}

function featuresSummary() {
  return breadcrumbs([['/fonctionnalites', 'Fonctionnalités']]) +
    intro('LES FONCTIONNALITÉS', 'Tout ce qu’il faut pour<br><span>moderniser votre accueil.</span>', 'Dorify rassemble l’ensemble des modules indispensables à la gestion des files d’attente, des rendez-vous et du pilotage au sein d’une architecture robuste et sécurisée.') +
    '<section class="container section feature-details">' +
    featureData.map(([id, i, t, p, list, url], n) =>
      '<article id="' + id + '"><div><span class="detail-number">0' + (n + 1) + '</span><span class="feature-icon">' + icon(i) + '</span></div>' +
      '<div><h2>' + t + '</h2><p>' + p + '</p><div class="mt-16"><a href="' + url + '" class="button secondary small">Page détaillée du module ' + icon('arrow') + '</a></div></div>' +
      checks(list) +
      '</article>'
    ).join('') +
    '</section>' +

    '<section class="section section-soft"><div class="container">' +
    heading('L’APPLICATION EN IMAGES RÉELLES', 'Explorez les interfaces réelles de Dorify.') +
    showcase() +
    '</div></section>' +

    '<section class="container section">' +
    heading('MATRICE DE TRANSPARENCE TECHNIQUE', 'Ce qui est inclus, ce qui dépend du matériel et des options.', 'Chez Dorify, nous privilégions la clarté : pas de promesses irréalistes ni de coûts cachés.') +
    '<div class="table-scroll"><table class="transparency-table"><caption>Périmètre fonctionnel et prérequis techniques</caption><thead><tr><th scope="col">Composant fonctionnel</th><th scope="col">Inclus nativement</th><th scope="col">Mode Cloud</th><th scope="col">Mode INTRA</th><th scope="col">Matériel standard requis</th><th scope="col">Intégration externe</th></tr></thead><tbody>' +
    [
      ['Moteur de files & priorités', '<span class="badge badge-native">Oui</span>', 'Hébergé UE', 'Local', 'Aucun', 'Natif'],
      ['Prise de rendez-vous & créneaux', '<span class="badge badge-native">Oui</span>', 'Hébergé UE', 'Local', 'Navigateur web', 'Natif'],
      ['Cockpit opérateur guichet', '<span class="badge badge-native">Oui</span>', 'Web', 'Web local', 'PC / Tablette agent', 'Natif'],
      ['Borne tactile usager', '<span class="badge badge-native">Oui</span>', 'Web sécurisé', 'Web local', 'Tablette ou borne standard', 'Imprimante optionnelle'],
      ['Affichage d’appel en salle', '<span class="badge badge-native">Oui</span>', 'Web temps réel', 'Web temps réel', 'Écran TV / Moniteur HDMI', 'Natif'],
      ['Suivi mobile temps réel', '<span class="badge badge-native">Oui</span>', 'Direct smartphone', 'Via relais sortant', 'Smartphone usager', 'Accès web mobile'],
      ['Notifications SMS & emails', '<span class="badge badge-optional">Option</span>', 'Passerelle Cloud', 'Relais Cloud/Local', 'Aucun', 'Fournisseur SMS/mail requis'],
      ['Salle de contrôle & rapports CSV', '<span class="badge badge-native">Oui</span>', 'Hébergé UE', 'Local', 'Navigateur web', 'Export CSV natif']
    ].map(r => '<tr>' + r.map((c, idx) => idx ? '<td>' + c + '</td>' : '<th scope="row">' + c + '</th>').join('') + '</tr>').join('') +
    '</tbody></table></div>' +
    '</section>' +
    cta();
}

function featureQueues() {
  return breadcrumbs([['/fonctionnalites', 'Fonctionnalités'], ['/fonctionnalites/gestion-files-attente', 'Gestion des files d’attente']]) +
    intro('MODULE FONCTIONNEL', 'Gestion des files d’attente<br><span>et règles de priorité.</span>', 'Organisez les flux d’usagers selon vos spécialités d’accueil, vos créneaux horaires et vos compétences d’agents.') +
    '<section class="container feature-split"><div>' +
    heading('LE PROBLÈME DU TERRAIN', 'En finir avec les files désordonnées et le stress de l’attente.') +
    '<p>Sans régulation claire, les usagers s’entassent à l’accueil, l’ordre d’arrivée est source de contestation permanente et les agents au guichet subissent une pression visuelle constante qui nuit à la qualité de l’écoute.</p>' +
    '<p>Dorify permet de découper votre accueil en files spécialisées, chacune dotée de ses propres règles d’affectation, de quotas horaires et d’estimations de délai réévaluées en direct.</p>' +
    '</div><img src="/assets/gestion-files.png" width="1440" height="1000" alt="Interface de paramétrage des files d’attente dans Dorify" loading="lazy"></section>' +
    '<section class="container section"><div class="feature-specs-grid">' +
    '<div class="feature-spec-item"><b>' + icon('ticket') + 'Règles de priorité</b><p>Pondération paramétrable entre arrivées spontanées et rendez-vous pour éviter l’attente excessive des démarches rapides.</p></div>' +
    '<div class="feature-spec-item"><b>' + icon('clock') + 'Horaires & capacités</b><p>Définition précise des jours et plages d’ouverture par file, pauses programmées et limitation du nombre de tickets quotidiens.</p></div>' +
    '<div class="feature-spec-item"><b>' + icon('shield') + 'Rôles & permissions RBAC</b><p>Attribution des droits : seuls les opérateurs affectés à une file peuvent en appeler les usagers.</p></div>' +
    '<div class="feature-spec-item"><b>' + icon('users') + 'Multi-langues natif</b><p>Interface disponible en français, anglais, arabe standard (RTL) et arabe tunisien selon la configuration de votre établissement.</p></div>' +
    '</div>' +
    '<div class="mt-35">' + link('/demo', 'Voir la gestion des files en démo', 'button primary') + '</div></section>' +
    cta();
}

function featureAppointments() {
  return breadcrumbs([['/fonctionnalites', 'Fonctionnalités'], ['/fonctionnalites/prise-rendez-vous', 'Prise et gestion des rendez-vous']]) +
    intro('MODULE FONCTIONNEL', 'Prise et gestion des rendez-vous<br><span>d’accueil physique.</span>', 'Fluidifiez la fréquentation de vos accueils en lissant l’affluence sur des créneaux réservés.') +
    '<section class="container feature-split reverse"><img src="/assets/rendez-vous.png" width="1440" height="1000" alt="Agenda et gestion des rendez-vous dans Dorify" loading="lazy"><div>' +
    heading('LE PROBLÈME DU TERRAIN', 'Éviter les pics d’affluence ingérables et les créneaux perdus.') +
    '<p>Les arrivées imprévisibles provoquent des engorgements aux heures de pointe suivis de périodes de sous-activité. Les rendez-vous pris sans synchronisation avec l’accueil physique créent des conflits entre usagers avec et sans rendez-vous.</p>' +
    '<p>Dorify synchronise votre agenda de rendez-vous et vos files spontanées au sein du même moteur de passage, avec pointage automatique de l’usager dès son arrivée sur la borne.</p>' +
    '</div></section>' +
    '<section class="container section"><div class="feature-specs-grid">' +
    '<div class="feature-spec-item"><b>' + icon('calendar') + 'Créneaux modulables</b><p>Capacité par créneau, durée par type de démarche et plages réservées aux démarches complexes.</p></div>' +
    '<div class="feature-spec-item"><b>' + icon('check') + 'Pointage automatique</b><p>L’usager saisit son numéro de téléphone ou sa référence de convocation sur la borne pour s’insérer automatiquement dans la file.</p></div>' +
    '<div class="feature-spec-item"><b>' + icon('clock') + 'Tolérance de retard</b><p>Règles configurables en cas d’arrivée tardive pour ne pas pénaliser les usagers suivants tout en maintenant l’accueil si possible.</p></div>' +
    '<div class="feature-spec-item"><b>' + icon('mail') + 'Notifications de rappel</b><p>Confirmation et rappels transmis si vous associez une passerelle d’envoi de SMS ou d’emails à votre instance.</p></div>' +
    '</div>' +
    '<div class="mt-35">' + link('/demo', 'Découvrir la gestion des rendez-vous', 'button primary') + '</div></section>' +
    cta();
}

function featureDesks() {
  return breadcrumbs([['/fonctionnalites', 'Fonctionnalités'], ['/fonctionnalites/poste-guichet-operateur', 'Cockpit guichet opérateur']]) +
    intro('MODULE FONCTIONNEL', 'Cockpit opérateur guichet :<br><span>la simplicité au service de l’agent.</span>', 'Un poste de travail web unifié et réactif qui permet à l’agent de se concentrer sur l’usager.') +
    '<section class="container feature-split"><div>' +
    heading('LE PROBLÈME DU TERRAIN', 'Des logiciels d’accueil trop complexes qui ralentissent les passages.') +
    '<p>Des interfaces surchargées, des fenêtres multiples et des lenteurs de synchronisation font perdre de précieuses minutes entre chaque visiteur et augmentent le stress des agents d’accueil.</p>' +
    '<p>Le cockpit Dorify est conçu pour une prise en main en moins de 10 minutes : un bouton clair pour appeler le visiteur suivant, la vue de la file d’attente, le rappel sonore et la qualification rapide de la visite.</p>' +
    '</div><img src="/assets/cockpit-guichet.png" width="1440" height="1000" alt="Cockpit opérateur au guichet dans Dorify" loading="lazy"></section>' +
    '<section class="container section"><div class="feature-specs-grid">' +
    '<div class="feature-spec-item"><b>' + icon('users') + 'Appel en un clic</b><p>Bouton d’appel du prochain ticket par file ou sur l’ensemble des compétences attribuées à l’agent.</p></div>' +
    '<div class="feature-spec-item"><b>' + icon('arrow') + 'Rappel & réaffectation</b><p>Possibilité de relancer un appel si l’usager tarde à se présenter, ou de le réaffecter vers une autre file spécialisée.</p></div>' +
    '<div class="feature-spec-item"><b>' + icon('ticket') + 'Enregistrement direct</b><p>L’agent peut inscrire directement un usager qui s’est présenté sans passer par la borne tactile d’accueil.</p></div>' +
    '<div class="feature-spec-item"><b>' + icon('shield') + 'Sécurité & session</b><p>Authentification sécurisée par identifiant/mot de passe et fermeture automatique de session lors des pauses.</p></div>' +
    '</div>' +
    '<div class="mt-35">' + link('/demo', 'Tester le cockpit guichet en démo', 'button primary') + '</div></section>' +
    cta();
}

function featureKiosks() {
  return breadcrumbs([['/fonctionnalites', 'Fonctionnalités'], ['/fonctionnalites/bornes-tickets-affichage', 'Bornes, tickets & affichage']]) +
    intro('MODULE FONCTIONNEL', 'Bornes tactiles d’accueil,<br><span>tickets et affichage en salle.</span>', 'Orientez les usagers dès le hall d’entrée et rendez les appels parfaitement visibles en salle.') +
    '<section class="container feature-split reverse"><img src="/assets/ecran-affichage.png" width="1440" height="1000" alt="Écran d’affichage dynamique en salle d’attente Dorify" loading="lazy"><div>' +
    heading('LE PROBLÈME DU TERRAIN', 'Des halls d’entrée saturés et des appels inaudibles en salle.') +
    '<p>Lorsque les visiteurs ne savent pas où s’adresser dès leur arrivée, ils monopolisent le premier guichet pour de simples renseignements. En salle d’attente, des appels uniquement vocaux créent des malentendus et des rendez-vous manqués.</p>' +
    '<p>Dorify associe une borne tactile claire pour la délivrance du ticket et un écran d’affichage dynamique en salle d’attente avec signal visuel et sonore lors de chaque appel.</p>' +
    '</div></section>' +
    '<section class="container section"><div class="feature-specs-grid">' +
    '<div class="feature-spec-item"><b>' + icon('screen') + 'Borne tactile standard</b><p>Compatible avec toute tablette (iPad, Android, Windows) ou totem tactile sans logiciel propriétaire.</p></div>' +
    '<div class="feature-spec-item"><b>' + icon('ticket') + 'Ticket papier ou QR</b><p>Impression sur imprimante thermique standard (ESC/POS ou pilote bureautique) ou affichage d’un QR code sur l’écran.</p></div>' +
    '<div class="feature-spec-item"><b>' + icon('zap') + 'Écran d’appel dynamique</b><p>Affichage temps réel du ticket et du numéro de guichet sur n’importe quel téléviseur relié en HDMI.</p></div>' +
    '<div class="feature-spec-item"><b>' + icon('users') + 'Accessibilité</b><p>Contrastes soignés, typographie lisible de loin et signal sonore pour les personnes malentendantes ou distraites.</p></div>' +
    '</div>' +
    '<div class="mt-35">' + link('/demo', 'Découvrir la borne et l’affichage', 'button primary') + '</div></section>' +
    cta();
}

function featureMobile() {
  return breadcrumbs([['/fonctionnalites', 'Fonctionnalités'], ['/fonctionnalites/suivi-mobile-file-attente', 'Suivi mobile de l’attente']]) +
    intro('MODULE FONCTIONNEL', 'Suivi mobile de la file d’attente<br><span>sur smartphone sans application.</span>', 'Offrez la liberté d’attendre sereinement à proximité sans rester enfermé en salle d’attente.') +
    '<section class="container feature-split"><div>' +
    heading('LE PROBLÈME DU TERRAIN', 'L’anxiété de l’attente passive dans une salle bondée.') +
    '<p>Être assis sans savoir combien de personnes attendent devant soi ni combien de temps cela prendra est la première cause d’irritation des usagers. Obliger les visiteurs à télécharger une application mobile lourde crée un refus d’usage immédiat.</p>' +
    '<p>Avec Dorify, un simple scan du QR code imprimé sur le ticket ou affiché sur la borne ouvre une page web mobile sécurisée. L’usager suit sa position et le guichet assigné en temps réel, sans aucune installation.</p>' +
    '</div><img src="/assets/borne.png" width="1440" height="1000" alt="Impression et flash du QR code de suivi sur la borne Dorify" loading="lazy"></section>' +
    '<section class="container section"><div class="feature-specs-grid">' +
    '<div class="feature-spec-item"><b>' + icon('phone') + 'Zéro application à installer</b><p>Fonctionne instantanément dans le navigateur de n’importe quel smartphone (iOS, Android).</p></div>' +
    '<div class="feature-spec-item"><b>' + icon('clock') + 'Position & délai en direct</b><p>Mise à jour en temps réel : nombre de personnes restantes et estimation du délai d’attente.</p></div>' +
    '<div class="feature-spec-item"><b>' + icon('shield') + 'Respect de la vie privée</b><p>Jeton anonymisé opaque : aucune géolocalisation imposée et aucun traqueur publicitaire déposé.</p></div>' +
    '<div class="feature-spec-item"><b>' + icon('zap') + 'Notification lors de l’appel</b><p>Le smartphone de l’usager s’actualise et affiche en grand le guichet qui l’attend dès que l’agent clique sur appeler.</p></div>' +
    '</div>' +
    '<div class="mt-35">' + link('/demo', 'Voir le suivi mobile en démonstration', 'button primary') + '</div></section>' +
    cta();
}

function featureStats() {
  return breadcrumbs([['/fonctionnalites', 'Fonctionnalités'], ['/fonctionnalites/statistiques-supervision', 'Supervision et statistiques']]) +
    intro('MODULE FONCTIONNEL', 'Supervision temps réel<br><span>et rapports statistiques décisionnels.</span>', 'Pilotez l’accueil avec des données fiables et dimensionnez vos effectifs sur des faits constatés.') +
    '<section class="container feature-split reverse"><img src="/assets/supervision.png" width="1440" height="1000" alt="Salle de contrôle en direct (Control Room) dans Dorify" loading="lazy"><div>' +
    heading('LE PROBLÈME DU TERRAIN', 'Naviguer à vue sans indicateurs objectifs d’affluence.') +
    '<p>Combien de personnes ont été reçues aujourd’hui ? Quel est le temps moyen d’attente par démarche ? Quelles plages horaires concentrent les retards ? Sans chiffres, il est impossible de justifier ses effectifs ou d’adapter ses plannings.</p>' +
    '<p>Dorify intègre une salle de contrôle en temps réel pour réagir immédiatement aux surcharges, ainsi que des rapports statistiques détaillés exportables en CSV pour vos comités de direction.</p>' +
    '</div></section>' +
    '<section class="container section"><div class="feature-specs-grid">' +
    '<div class="feature-spec-item"><b>' + icon('screen') + 'Salle de contrôle (Control Room)</b><p>Vision instantanée du site : guichets ouverts, nombre de visiteurs en attente et alertes de surcharge.</p></div>' +
    '<div class="feature-spec-item"><b>' + icon('chart') + 'Rapports périodiques</b><p>Analyse par jour, semaine ou mois : volumes accueillis, temps d’attente moyens, temps de traitement et taux d’absence.</p></div>' +
    '<div class="feature-spec-item"><b>' + icon('arrow') + 'Export CSV natif</b><p>Exportation en un clic de l’ensemble des données pour traitement dans Excel ou vos outils de Business Intelligence.</p></div>' +
    '<div class="feature-spec-item"><b>' + icon('shield') + 'Données conformes RGPD</b><p>Statistiques agrégées sans diffusion de données personnelles identifiantes d’usagers.</p></div>' +
    '</div>' +
    '<div class="mt-35">' + link('/demo', 'Consulter les rapports en démo', 'button primary') + '</div></section>' +
    cta();
}

function pricing() {
  return breadcrumbs([['/tarifs', 'Tarifs']]) +
    intro('GRILLE TARIFAIRE', 'Des tarifs clairs et prévisibles.<br><span>Sans coût caché.</span>', 'Choisissez la formule adaptée à votre organisation. Mises à jour continues, formation initiale et support inclus. Compatibilité garantie avec votre matériel standard.') +
    '<section class="container pricing-grid">' +
    '<article class="pricing-card">' +
    '<h3>Formule Starter</h3>' +
    '<p class="pricing-desc">Idéal pour une mairie de proximité, un accueil unique ou un centre de santé.</p>' +
    '<div class="price-tag"><span class="price-val">Sur devis</span><span class="price-term">/ site / an</span></div>' +
    checks([
      '1 site d’accueil physique',
      'Jusqu’à 4 guichets actifs simultanés',
      'Files d’attente illimitées',
      'Borne tactile & écran de salle inclus',
      'Cockpit opérateur web',
      'Mises à jour & support par email'
    ]) +
    link('/demo?formule=starter', 'Demander un devis Starter', 'button secondary') +
    '</article>' +

    '<article class="pricing-card featured">' +
    '<span class="popular-badge">Recommandé</span>' +
    '<h3>Formule Pro</h3>' +
    '<p class="pricing-desc">Pour les collectivités moyennes, services administratifs et accueils fréquentés.</p>' +
    '<div class="price-tag"><span class="price-val">Sur devis</span><span class="price-term">/ site / an</span></div>' +
    checks([
      '1 site d’accueil physique',
      'Jusqu’à 15 guichets actifs simultanés',
      'Gestion conjointe RDV & flux spontanés',
      'Suivi mobile smartphone par QR code',
      'Salle de contrôle & rapports statistiques complets',
      'Exports CSV & support prioritaire'
    ]) +
    link('/demo?formule=pro', 'Demander un devis Pro', 'button primary') +
    '</article>' +

    '<article class="pricing-card">' +
    '<h3>Réseau & Multi-sites</h3>' +
    '<p class="pricing-desc">Pour métropoles, départements, grandes administrations et réseaux d’agences.</p>' +
    '<div class="price-tag"><span class="price-val">Sur mesure</span><span class="price-term">selon votre parc</span></div>' +
    checks([
      'Nombre de sites illimité',
      'Nombre de guichets sur mesure',
      'Déploiement Cloud UE ou INTRA on-premise',
      'Portefeuille multi-sites consolidé',
      'Rôles RBAC avancés & gestion d’équipes',
      'Chef de projet dédié & SLA garanti'
    ]) +
    link('/demo?formule=reseau', 'Échanger sur votre projet réseau', 'button secondary') +
    '</article>' +
    '</section>' +

    '<section class="container section">' +
    heading('NOTRE ENGAGEMENT DE TRANSPARENCE', 'Pourquoi choisir Dorify en toute confiance ?') +
    '<div class="support-grid">' +
    [
      ['shield', 'Zéro matériel captif', 'Dorify s’installe sur vos postes et tablettes standard. Vous ne payez pas de matériel propriétaire surévalué.'],
      ['cloud', 'Évolutivité garantie', 'Commencez sur un site pilote et déployez l’ensemble de vos agences ou mairies annexes en quelques clics.'],
      ['check', 'Accompagnement humain', 'Nos équipes vous forment et paramètrent avec vous vos premières files d’attente pour un démarrage serein.']
    ].map(([i, t, p]) => '<article>' + icon(i) + '<h3>' + t + '</h3><p>' + p + '</p></article>').join('') +
    '</div></section>' +
    cta();
}

function faqPage() {
  return breadcrumbs([['/faq', 'FAQ']]) +
    intro('FOIRE AUX QUESTIONS', 'Toutes les réponses<br><span>sur Dorify.</span>', 'Fonctionnement, matériel compatible, différences Cloud vs INTRA, tarification et sécurité : tout est expliqué simplement.') +
    '<section class="container section">' +
    faq(questions.length) +
    '<div class="mt-50 text-center">' +
    '<p class="mb-20">Vous avez une question spécifique qui ne figure pas ici ?</p>' +
    link('/contact', 'Poser votre question à notre équipe', 'button secondary') +
    '</div></section>' +
    cta();
}

function sectorCollectivites() {
  return breadcrumbs([['/secteurs/mairies-collectivites', 'Mairies & Collectivités']]) +
    intro('SOLUTIONS SECTORIELLES', 'Gestion des files d’attente<br><span>pour Mairies & Collectivités.</span>', 'Modernisez l’accueil de vos administrés en mairie, CCAS et maisons de services au public.') +
    '<section class="container feature-split"><div>' +
    heading('DES DÉMARCHES VARIÉES, UNE ATTENTE APAISÉE', 'Conjuguer rendez-vous CNI/passeports et accueil spontané d’état civil.') +
    '<p>Les services municipaux font face à une double exigence : honorer des rendez-vous obligatoires (titres d’identité biométriques) tout en maintenant un accès sans rendez-vous pour les démarches citoyennes du quotidien (état civil, attestations, inscriptions scolaires).</p>' +
    '<p>Dorify permet d’accueillir chaque administré avec bienveillance, de réduire l’attente ressentie grâce au suivi sur smartphone et de valoriser le professionnalisme de vos agents.</p>' +
    '</div><img src="/assets/multi-site.png" width="1440" height="1000" alt="Gestion des services et guichets municipaux dans Dorify" loading="lazy"></section>' +
    '<section class="container section"><div class="feature-specs-grid">' +
    '<div class="feature-spec-item"><b>' + icon('calendar') + 'Titres d’identité (CNI / Passeports)</b><p>Pointage immédiat des rendez-vous pour respecter la cadence des créneaux de recueil des empreintes.</p></div>' +
    '<div class="feature-spec-item"><b>' + icon('users') + 'Accueil spontané état civil</b><p>Délivrance de tickets pour les démarches sans rendez-vous avec règles de priorité équitables.</p></div>' +
    '<div class="feature-spec-item"><b>' + icon('phone') + 'Liberté pour l’administré</b><p>Possibilité d’attendre à l’extérieur grâce au suivi mobile par QR code sans télécharger d’application.</p></div>' +
    '<div class="feature-spec-item"><b>' + icon('shield') + 'Souveraineté des données</b><p>Hébergement souverain Cloud UE ou installation locale INTRA garantissant la conformité RGPD.</p></div>' +
    '</div>' +
    '<div class="mt-35">' + link('/demo', 'Planifier une démo pour votre collectivité', 'button primary') + '</div></section>' +
    cta();
}

function sectorAdministrations() {
  return breadcrumbs([['/secteurs/administrations-services-publics', 'Administrations publiques']]) +
    intro('SOLUTIONS SECTORIELLES', 'Gestion de l’accueil pour<br><span>les administrations publiques.</span>', 'Régulez les pointes d’affluence en préfecture, université et services d’accueil social.') +
    '<section class="container feature-split reverse"><img src="/assets/supervision.png" width="1440" height="1000" alt="Supervision des flux d’accueil administratif dans Dorify" loading="lazy"><div>' +
    heading('GÉRER LA CHARGE EN TOUTE SÉRÉNITÉ', 'Égalité de traitement, sécurité et confidentialité.') +
    '<p>Les grands accueils administratifs gèrent des volumes quotidiens importants avec de fortes variations saisonnières. La clarté des appels et le respect scrupuleux de l’ordre de passage sont indispensables pour maintenir un climat serein.</p>' +
    '<p>Dorify apporte aux agents des outils réactifs de prise en charge et fournit à la direction une salle de contrôle en temps réel pour réallouer des guichets en cas de pic d’affluence.</p>' +
    '</div></section>' +
    '<section class="container section"><div class="feature-specs-grid">' +
    '<div class="feature-spec-item"><b>' + icon('screen') + 'Orientation claire dès l’entrée</b><p>Bornes tactiles multilingues pour orienter chaque public vers le bon service sans créer d’embouteillage.</p></div>' +
    '<div class="feature-spec-item"><b>' + icon('chart') + 'Salle de contrôle en direct</b><p>Visualisation en direct du nombre d’usagers en attente et des délais pour mobiliser des renforts.</p></div>' +
    '<div class="feature-spec-item"><b>' + icon('shield') + 'Traçabilité & audit 366 jours</b><p>Historique complet des passages et des actions opérateurs conforme aux exigences des marchés publics.</p></div>' +
    '<div class="feature-spec-item"><b>' + icon('server') + 'Déploiement on-premise possible</b><p>Option INTRA hermétique sur votre propre réseau pour les sites soumis à des protocoles de sécurité stricts.</p></div>' +
    '</div>' +
    '<div class="mt-35">' + link('/demo', 'Demander une démonstration administration', 'button primary') + '</div></section>' +
    cta();
}

function sectorAgences() {
  return breadcrumbs([['/secteurs/reseaux-agences', 'Réseaux d’agences']]) +
    intro('SOLUTIONS SECTORIELLES', 'Solution d’accueil pour<br><span>réseaux d’agences multisites.</span>', 'Standardisez la qualité d’accueil de vos agences bancaires, mutuelles et points de contact.') +
    '<section class="container feature-split"><div>' +
    heading('PILOTER UN PARC D’AGENCES DE MANIÈRE CONSOLIDÉE', 'Une expérience client homogène et des statistiques comparatives.') +
    '<p>Dans un réseau d’agences commerciales ou de mutuelles, offrir une expérience d’accueil moderne et sans friction est un facteur déterminant de fidélisation et de satisfaction client.</p>' +
    '<p>Dorify permet de superviser l’ensemble de vos points de vente depuis une console unique, tout en donnant à chaque directeur d’agence l’autonomie de paramétrage nécessaire à son implantation.</p>' +
    '</div><img src="/assets/multi-site.png" width="1440" height="1000" alt="Gestion multisite et portefeuille d’agences dans Dorify" loading="lazy"></section>' +
    '<section class="container section"><div class="feature-specs-grid">' +
    '<div class="feature-spec-item"><b>' + icon('grid') + 'Console multi-sites</b><p>Basculez d’une agence à l’autre en un clic avec des permissions adaptées à chaque responsable local.</p></div>' +
    '<div class="feature-spec-item"><b>' + icon('chart') + 'Statistiques comparatives</b><p>Comparez les temps d’attente et les volumétries de vos agences pour harmoniser vos pratiques.</p></div>' +
    '<div class="feature-spec-item"><b>' + icon('phone') + 'Image de marque soignée</b><p>Un parcours visiteur moderne sur smartphone sans application qui valorise l’image de votre enseigne.</p></div>' +
    '<div class="feature-spec-item"><b>' + icon('zap') + 'Déploiement express</b><p>Activation en mode Cloud SaaS en moins de 48 heures sans intervention technique lourde sur site.</p></div>' +
    '</div>' +
    '<div class="mt-35">' + link('/demo', 'Échanger sur votre déploiement réseau', 'button primary') + '</div></section>' +
    cta();
}

function hosting() {
  return breadcrumbs([['/hebergement', 'Cloud & Intra']]) +
    intro('HÉBERGEMENT & INFRASTRUCTURE', 'Cloud souverain ou installation locale<br><span>INTRA sur site (On-premise).</span>', 'Une solution logicielle identique, deux architectures adaptées à vos contraintes de sécurité, d’exploitation et de réseau.') +
    '<section class="container hosting-cards">' +
    [
      ['cloud', 'CLOUD (SaaS)', 'Concentrez-vous<br>sur votre accueil.', 'Application et données hébergées dans un Cloud souverain en France / Union Européenne. Aucun serveur métier à administrer dans votre établissement.', ['Accès immédiat depuis tout navigateur web', 'Sauvegardes automatiques quotidiennes', 'Mises à jour continues et haute disponibilité', 'Idéal pour déploiement rapide et multi-sites'], 'Choisir le Cloud souverain', '/cloud'],
      ['server', 'INTRA (On-premise)', 'Gardez l’accueil<br>sur votre infrastructure.', 'Application et base de données PostgreSQL installées sur vos propres serveurs. Résilience totale aux coupures réseau externes.', ['Données métier et base hébergées chez vous', 'Fonctionnement local garanti sans Internet', 'Agent sécurisé à flux sortants uniquement', 'Idéal pour sites sensibles et réseaux fermés'], 'Découvrir le mode INTRA sur site', '/installation-locale']
    ].map(([i, t, h, p, list, a, u], n) => '<article class="' + (n ? 'intra-card' : '') + '"><span class="hosting-card-icon">' + icon(i) + '</span>' + eye('DORIFY ' + t) + '<h2>' + h + '</h2><p>' + p + '</p>' + checks(list) + '<div class="mt-20"><a href="' + u + '" class="' + (n ? 'button secondary' : 'button primary') + '">' + a + ' ' + icon('arrow') + '</a></div></article>').join('') +
    '</section>' +

    '<section class="container section">' +
    heading('CHOISIR EN CONNAISSANCE DE CAUSE', 'Comparatif technique approfondi.') +
    '<div class="table-scroll"><table class="comparison"><caption>Comparatif détaillé entre Dorify Cloud et Dorify INTRA (On-premise)</caption><thead><tr><th scope="col">Critère d’évaluation</th><th scope="col">Dorify Cloud (SaaS)</th><th scope="col">Dorify INTRA (Sur site / On-premise)</th></tr></thead><tbody>' +
    [
      ['Emplacement de la base de données', 'Hébergement souverain UE (France)', 'Sur votre serveur local / infrastructure propre'],
      ['Serveur matériel requis sur site', 'Aucun serveur requis (zéro maintenance)', 'Serveur local (Linux ou Windows Server avec Docker)'],
      ['Accès des agents et guichets', 'Via Internet (HTTPS / TLS 1.3)', 'Via votre réseau local d’établissement (LAN)'],
      ['Comportement en cas de coupure Internet', 'Accès suspendu jusqu’au retour de la liaison', 'L’accueil local continue normalement (bornes, guichets, écrans)'],
      ['Suivi mobile usager sur smartphone', 'Direct et instantané via QR code', 'Relaie les projections vers le Cloud si liaison active'],
      ['Mises à jour logicielles', 'Automatiques et transparentes', 'Planifiées par votre équipe informatique (Docker compose)'],
      ['Supervision & alertes', 'Intégrée en direct', 'Remontée sécurisée vers la console Cloud via l’agent'],
      ['Conformité RGPD & souveraineté', 'Hébergement certifié ISO 27001 en UE', 'Souveraineté totale des données sur votre infrastructure']
    ].map(r => '<tr>' + r.map((v, i) => i ? '<td>' + v + '</td>' : '<th scope="row">' + v + '</th>').join('') + '</tr>').join('') +
    '</tbody></table></div>' +
    '<aside class="hosting-note">' + icon('shield') + '<div><h3>Local ne signifie pas entièrement déconnecté.</h3><p>En mode INTRA, toute la gestion métier reste locale et autonome. L’agent assure les échanges sortants sécurisés nécessaires à la supervision, aux annonces et aux relais de notifications. En cas de coupure réseau externe, vos bornes et vos guichets continuent de fonctionner sans interruption.</p></div></aside>' +
    '</section>' +
    cta();
}

function cloudPage() {
  return breadcrumbs([['/hebergement', 'Hébergement'], ['/cloud', 'Dorify Cloud']]) +
    intro('HÉBERGEMENT SAAS', 'Dorify Cloud :<br><span>la solution clé en main hébergée en France.</span>', 'Déployez un accueil moderne sans contrainte d’infrastructure ni charge d’administration pour vos équipes informatiques.') +
    '<section class="container feature-split"><div>' +
    heading('ZÉRO SERVEUR À GÉRER', 'Une disponibilité maximale et des mises à jour transparentes.') +
    '<p>Dorify Cloud est hébergé sur une infrastructure souveraine certifiée ISO/IEC 27001 et conforme RGPD située en France / Union Européenne.</p>' +
    '<p>Vos équipes d’accueil, vos bornes et vos écrans accèdent à la plateforme depuis un navigateur web standard par connexion chiffrée HTTPS (TLS 1.3). Vous bénéficiez des dernières fonctionnalités sans aucune opération de maintenance manuelle.</p>' +
    '</div><img src="/assets/supervision.png" width="1440" height="1000" alt="Supervision du Cloud Dorify" loading="lazy"></section>' +
    '<section class="container section"><div class="feature-specs-grid">' +
    '<div class="feature-spec-item"><b>' + icon('shield') + 'Hébergement souverain UE</b><p>Données stockées exclusivement au sein de l’Union Européenne sans transfert hors UE.</p></div>' +
    '<div class="feature-spec-item"><b>' + icon('zap') + 'Sauvegardes automatisées</b><p>Sauvegardes quotidiennes chiffrées et plan de reprise d’activité pour une continuité garantie.</p></div>' +
    '<div class="feature-spec-item"><b>' + icon('check') + 'Haute disponibilité 99,9 %</b><p>Architecture conteneurisée résiliente conçue pour encaisser les fortes pointes d’affluence.</p></div>' +
    '<div class="feature-spec-item"><b>' + icon('arrow') + 'Déploiement en 48 heures</b><p>Création de votre instance et paramétrage immédiat de vos premiers guichets.</p></div>' +
    '</div>' +
    '<div class="mt-35">' + link('/demo', 'Demander une démonstration Cloud', 'button primary') + '</div></section>' +
    cta();
}

function intraPage() {
  return breadcrumbs([['/hebergement', 'Hébergement'], ['/installation-locale', 'Dorify INTRA']]) +
    intro('INSTALLATION LOCALE ON-PREMISE', 'Dorify INTRA :<br><span>l’accueil souverain sur votre infrastructure.</span>', 'Conservez l’intégralité de vos données d’accueil sur vos propres serveurs avec une résilience totale.') +
    '<section class="container feature-split reverse"><img src="/assets/parc-intra.png" width="1440" height="1000" alt="Gestion du parc INTRA et des installations sur site" loading="lazy"><div>' +
    heading('RÉSILIENCE TOTALE HORS-LIGNE', 'Votre accueil ne s’arrête jamais, même sans Internet.') +
    '<p>Pour les collectivités soucieuses de souveraineté numérique, les établissements hospitaliers ou les sites sensibles soumis à des contraintes d’isolation réseau, Dorify INTRA déploie l’application et sa base PostgreSQL directement sur vos serveurs locaux.</p>' +
    '<p>En cas de coupure de votre liaison Internet extérieure, l’ensemble de vos guichets, bornes tactiles et écrans de salle continuent de fonctionner à 100 % sur votre réseau local (LAN).</p>' +
    '</div></section>' +
    '<section class="container section"><div class="feature-specs-grid">' +
    '<div class="feature-spec-item"><b>' + icon('server') + 'Conteneurs Docker légers</b><p>Déploiement simple par Docker Compose sur Linux (Debian, Ubuntu, RHEL) ou Windows Server.</p></div>' +
    '<div class="feature-spec-item"><b>' + icon('lock') + 'Base PostgreSQL hermétique</b><p>Les données nominatives des passages et rendez-vous restent stockées sur votre disque dur local.</p></div>' +
    '<div class="feature-spec-item"><b>' + icon('shield') + 'Flux sortants uniquement</b><p>L’agent Dorify ne requiert aucune ouverture de port entrant dans votre pare-feu d’établissement.</p></div>' +
    '<div class="feature-spec-item"><b>' + icon('zap') + 'Autonomie réseau complète</b><p>Continuité de service garantie pour vos administrés et usagers en toutes circonstances.</p></div>' +
    '</div>' +
    '<div class="mt-35">' + link('/demo', 'Étudier un déploiement INTRA sur site', 'button primary') + '</div></section>' +
    cta();
}

function securityPage() {
  return breadcrumbs([['/securite-rgpd', 'Sécurité & RGPD']]) +
    intro('SÉCURITÉ & CONFORMITÉ', 'Sécurité des données, traçabilité<br><span>et conformité RGPD.</span>', 'Conçu dès le premier jour pour répondre aux exigences les plus strictes des DSI et des Délégués à la Protection des Données (DPO).') +
    '<section class="container feature-split"><div>' +
    heading('LA CONFIDENTIALITÉ PAR DÉFAUT (PRIVACY BY DESIGN)', 'Minimisation stricte des données et isolation étanche.') +
    '<p>L’accueil du public implique le traitement de données personnelles sensibles (motifs de visite, rendez-vous d’état civil ou d’action sociale). Dorify applique scrupuleusement les principes du RGPD : minimisation des données collectées, durées de rétention paramétrables et chiffrement systématique.</p>' +
    '<p>Le site vitrine et l’application Dorify n’utilisent aucun traceur commercial, aucun cookie publicitaire et ne revendent aucune donnée à des tiers.</p>' +
    '</div><img src="/assets/audit-securite.png" width="1440" height="1000" alt="Journal d’audit et de traçabilité dans Dorify" loading="lazy"></section>' +
    '<section class="container section"><div class="feature-specs-grid">' +
    '<div class="feature-spec-item"><b>' + icon('lock') + 'Chiffrement de bout en bout</b><p>Chiffrement en transit via TLS 1.3 et chiffrement au repos des bases de données en AES-256.</p></div>' +
    '<div class="feature-spec-item"><b>' + icon('shield') + 'Journal d’audit de 366 jours</b><p>Traçabilité complète des actions d’authentification, d’administration et de passages pour vos audits internes.</p></div>' +
    '<div class="feature-spec-item"><b>' + icon('users') + 'Contrôle d’accès RBAC strict</b><p>Habilitations fines par profil (Administrateur, Manager, Opérateur, Compte technique borne/écran).</p></div>' +
    '<div class="feature-spec-item"><b>' + icon('clock') + 'Purge automatique paramétrable</b><p>Suppression automatique des données d’accueil après la durée de rétention choisie par l’établissement.</p></div>' +
    '</div>' +
    '<div class="mt-35">' + link('/demo', 'Échanger avec notre référent sécurité', 'button primary') + '</div></section>' +
    cta();
}

function about() {
  return breadcrumbs([['/a-propos', 'À propos']]) +
    intro('À PROPOS DE DORIFY', 'Derrière chaque ticket d’attente,<br><span>il y a une personne.</span>', 'Un usager qui a besoin d’être orienté. Un agent qui veut exercer son métier sereinement. Une équipe qui a besoin de visibilité.') +
    '<section class="container about-story"><div class="about-art" aria-hidden="true"><span class="story-orbit one"></span><span class="story-orbit two"></span><span class="story-person">' + icon('users') + '</span><span class="story-tag tag-one">Un repère pour chacun</span><span class="story-tag tag-two">Une équipe qui accueille</span></div>' +
    '<div>' + heading('NOTRE CONVICTION FONDATRICE', 'L’organisation doit libérer l’attention humaine.') +
    '<p>Dorify est né d’un constat partagé dans des dizaines de services publics et d’accueils physiques : lorsque l’ordre de passage est flou et l’attente incertaine, l’agacement s’installe des deux côtés du guichet. Les agents d’accueil épuisent leur énergie à réguler la foule plutôt qu’à traiter les situations humaines.</p>' +
    '<p>Nous éditons une solution logicielle indépendante, sobre et rigoureuse, pensée pour remettre de l’ordre et de la sérénité dans les halls d’accueil. Dorify rassemble les files d’attente, les rendez-vous, les guichets et le pilotage dans une même plateforme facile à prendre en main.</p>' +
    '</div></section>' +

    '<section class="section section-soft"><div class="container">' +
    heading('LES PRINCIPES QUI GUIDENT NOTRE LOGICIEL', 'Simplicité. Souveraineté. Transparence.') +
    '<div class="role-grid">' +
    [
      ['Simplicité d’usage', 'Pas de formation interminable : un agent maîtrise son cockpit en quelques minutes, et un usager prend son ticket en 3 clics sur la borne.'],
      ['Souveraineté & Choix', 'Nous vous laissons la liberté totale : Cloud souverain en France ou installation sur vos propres serveurs en mode INTRA.'],
      ['Transparence technique', 'Pas de matériel propriétaire captif, pas de fausses promesses sur des fonctions non validées, et une conformité RGPD sans compromis.']
    ].map(([t, p], n) => '<article><span>0' + (n + 1) + '</span><h3>' + t + '</h3><p>' + p + '</p></article>').join('') +
    '</div></div></section>' +
    cta();
}

function field(n, t, type, extra = '') {
  return '<label class="form-field" for="' + n + '"><span>' + t + '</span><input id="' + n + '" name="' + n + '" type="' + type + '" ' + extra + ' aria-describedby="error-' + n + '"><small class="field-error" id="error-' + n + '"></small></label>';
}

function form(c, mode = 'demo') {
  const isContact = mode === 'contact';
  const tagText = isContact ? 'PRENONS CONTACT' : 'DÉMONSTRATION DU LOGICIEL';
  const pageTitle = isContact ? 'Contactez l’équipe Dorify.<br><span>Parlons de votre accueil.</span>' : 'Demandez une démonstration<br><span>personnalisée de Dorify.</span>';
  const pageLede = isContact ?
    'Une question commerciale, technique ou un besoin d’accompagnement ? Échangez directement avec notre équipe.' :
    'Découvrez en 30 minutes comment Dorify organise vos files d’attente, vos rendez-vous et vos guichets lors d’une visite guidée avec un expert produit.';

  return breadcrumbs(isContact ? [['/contact', 'Contact']] : [['/demo', 'Démonstration']]) +
    '<section class="container request-layout"><div class="request-intro">' + eye(tagText) +
    '<h1>' + pageTitle + '</h1><p class="lede">' + pageLede + '</p>' +
    '<div class="request-steps">' +
    [
      ['1. Échange sur votre contexte', 'Quelques minutes pour comprendre le nombre de vos guichets, vos démarches et vos enjeux.'],
      ['2. Démonstration personnalisée', 'Visite guidée du parcours visiteur (borne + mobile), du cockpit agent et de la salle de contrôle.'],
      ['3. Proposition & faisabilité technique', 'Recommandation du mode de déploiement (Cloud ou INTRA sur site) et chiffrage transparent.']
    ].map(([t, p], n) => '<div><span>0' + (n + 1) + '</span><p><b>' + t + '</b><small>' + p + '</small></p></div>').join('') +
    '</div>' +
    '<p class="request-note">' + icon('shield') + 'Pas de création automatique de compte.<br>Votre demande est examinée par notre équipe afin de vous apporter une réponse personnalisée sous 24h ouvrées.</p>' +
    (c.contactEmail ? '<p class="direct-email-note">Vous préférez écrire directement ? <a class="text-link" href="mailto:' + e(c.contactEmail) + '">' + e(c.contactEmail) + '</a></p>' : '') +
    '</div>' +

    '<div class="form-card"><form id="request-form" novalidate>' +
    '<div class="form-progress"><span class="active" data-step-indicator="1">1 <b>Votre projet</b></span><i></i><span data-step-indicator="2">2 <b>Vos coordonnées</b></span></div>' +

    '<div class="form-step" data-form-step="1">' +
    '<h2>Précisons votre projet.</h2><p>Sélectionnez l’option qui vous correspond.</p>' +
    '<fieldset><legend>Objet de votre demande</legend><div class="topic-options">' +
    [
      ['demo', 'Demander une démonstration personnalisée', 'Explorer le logiciel en direct avec un expert produit', 'screen'],
      ['account', 'Demander un devis ou l’ouverture d’un compte', 'Préparer votre déploiement Cloud ou INTRA sur site', 'users'],
      ['contact', 'Échanger ou poser une question générale', 'Obtenir des précisions sur le fonctionnement ou la sécurité', 'mail']
    ].map(([v, t, p, i]) => '<label class="radio-card"><input type="radio" name="topic" value="' + v + '"' + (v === (isContact ? 'contact' : 'demo') ? ' checked' : '') + '><span class="radio-icon">' + icon(i) + '</span><span><b>' + t + '</b><small>' + p + '</small></span><span class="radio-dot"></span></label>').join('') +
    '</div><small class="field-error" id="error-topic"></small></fieldset>' +

    '<div class="form-grid">' +
    '<label class="form-field" for="hosting"><span>Mode d’hébergement pressenti</span><select id="hosting" name="hosting"><option value="undecided">À définir ensemble lors de la démo</option><option value="cloud">Dorify Cloud (SaaS clé en main)</option><option value="intra">Dorify INTRA (Installation locale on-premise)</option></select><small class="field-error" id="error-hosting"></small></label>' +
    '<label class="form-field" for="sites"><span>Nombre de sites d’accueil</span><select id="sites" name="sites"><option value="1">1 site d’accueil</option><option value="2-5">2 à 5 sites</option><option value="6-20">6 à 20 sites</option><option value="21+">Plus de 20 sites</option><option value="undecided">À définir</option></select><small class="field-error" id="error-sites"></small></label>' +
    '</div>' +

    '<p class="product-footnote">Un <strong>site</strong> est un lieu physique d’accueil (mairie, agence, préfecture). Une <strong>file</strong> organise l’attente pour un service spécifique de ce lieu. Exemple : 2 sites avec 3 files chacun représentent 2 sites et 6 files au total.</p>' +

    '<div class="form-grid">' +
    '<label class="form-field" for="queues"><span>Nombre total de files souhaitées</span><input type="number" id="queues" name="queues" min="1" max="1000000" step="1" placeholder="Ex: 4" aria-describedby="error-queues"><small>Tous sites confondus. Laissez vide si non déterminé.</small><small class="field-error" id="error-queues"></small></label>' +
    '<label class="form-field" for="peoplePerDay"><span>Personnes accueillies par jour (estimation)</span><input type="number" id="peoplePerDay" name="peoplePerDay" min="1" max="1000000" step="1" placeholder="Ex: 150" aria-describedby="error-peoplePerDay"><small>Estimation globale, sans engagement.</small><small class="field-error" id="error-peoplePerDay"></small></label>' +
    '</div>' +

    '<button class="button primary form-next" type="button">Continuer ' + icon('arrow') + '</button></div>' +

    '<div class="form-step" data-form-step="2" hidden>' +
    '<h2>Comment vous recontacter ?</h2><p>Ces coordonnées permettront à notre équipe de vous répondre.</p>' +
    '<div class="form-grid">' +
    field('name', 'Votre nom & prénom *', 'text', 'required maxlength="100" autocomplete="name" placeholder="Ex: Alex Martin"') +
    field('organization', 'Votre organisation ou collectivité *', 'text', 'required maxlength="160" autocomplete="organization" placeholder="Ex: Mairie de…, Agence de…"') +
    '</div>' +
    field('email', 'Email professionnel *', 'email', 'required maxlength="254" autocomplete="email" placeholder="nom@collectivite.fr"') +
    field('phone', 'Téléphone de contact <small>(facultatif)</small>', 'tel', 'maxlength="40" autocomplete="tel" placeholder="+33 1 23 45 67 89"') +
    '<label class="form-field" for="message"><span>Précisions sur votre besoin <small>(facultatif)</small></span><textarea id="message" name="message" rows="4" maxlength="3000" placeholder="Décrivez votre organisation actuelle, vos équipements ou vos délais de mise en œuvre…" aria-describedby="error-message"></textarea><small class="field-error" id="error-message"></small></label>' +
    '<div class="form-honeypot" aria-hidden="true"><label for="website">Ne pas remplir ce champ</label><input id="website" name="website" tabindex="-1" autocomplete="off"></div>' +
    '<label class="consent"><input name="consent" type="checkbox" required aria-describedby="error-consent"><span>J’accepte que les informations saisies soient traitées par Dorify pour répondre à ma demande de démonstration ou de contact. <a href="/confidentialite" target="_blank" rel="noopener">Consulter notre politique de confidentialité</a>.</span></label><small class="field-error" id="error-consent"></small>' +
    '<div class="form-actions"><button type="button" class="button back-button">Retour</button><button class="button primary" type="submit"><span data-submit-label>Envoyer ma demande</span>' + icon('arrow') + '</button></div>' +
    '</div>' +

    '<div class="form-feedback" role="status" aria-live="polite" tabindex="-1"></div>' +
    '<p class="form-security">' + icon('shield') + 'Vos coordonnées sont confidentielles et utilisées uniquement pour traiter votre demande.</p>' +
    '<noscript><p>Activez JavaScript pour envoyer ce formulaire' + (c.contactEmail ? ', ou écrivez à ' + e(c.contactEmail) : '') + '.</p></noscript>' +
    '</form>' +

    '<div id="request-success" class="request-success" hidden tabindex="-1"><span>' + icon('check') + '</span>' + eye('MERCI POUR VOTRE DEMANDE') +
    '<h2>Votre demande est<br>parfaitement enregistrée.</h2>' +
    '<p>Notre équipe examine votre projet et vous recontactera sous 24h ouvrées pour convenir d’un créneau de démonstration ou vous transmettre les éléments demandés.</p>' +
    '<div class="request-reference">' +
    '<p class="req-ref-line">Référence de votre demande : <b id="request-reference" class="req-ref-val"></b></p>' +
    '<p class="req-uuid-val">Identifiant technique (UUID) : <code id="request-id"></code></p>' +
    '</div>' +
    '<p>Un email de confirmation reprenant cette référence vous a été transmis. Conservez-la pour nos échanges.</p>' +
    link('/fonctionnalites', 'Continuer à découvrir Dorify', 'button secondary') +
    '</div></div></section>';
}

function publisher(c) {
  const email = c.legalEmail || c.contactEmail;
  return '<section id="publisher"><h2>Identification de l’éditeur du site</h2>' +
    (c.legalDemo ? '<p class="legal-demo-note">Environnement de démonstration : coordonnées de test actives.</p>' : '') +
    '<dl class="legal-identity">' +
    [
      ['Raison sociale', c.legalName],
      ['Forme juridique', 'Société par Actions Simplifiée (SAS) au capital de 10 000 €'],
      ['Siège social', c.legalAddress],
      ['Immatriculation', c.legalRegistration],
      ['Contact légal & DPO', email],
      ['Directeur de la publication', 'Direction générale de Dorify SAS']
    ].map(([label, value]) => '<div><dt>' + label + '</dt><dd>' + (label === 'Contact légal & DPO' && value ? '<a href="mailto:' + e(value) + '">' + e(value) + '</a>' : e(value || 'Non renseigné')) + '</dd></div>').join('') +
    '</dl></section>';
}

function legal(c, privacy) {
  const email = c.legalEmail || c.contactEmail;
  const contact = email ? '<a href="mailto:' + e(email) + '">' + e(email) + '</a>' : 'notre <a href="/contact">formulaire de contact</a>';

  if (privacy) {
    return breadcrumbs([['/confidentialite', 'Confidentialité & RGPD']]) +
      intro('CONFIDENTIALITÉ DU SITE', 'Protection des données personnelles<br><span>et conformité RGPD.</span>', 'Politique de confidentialité applicable au site vitrine Dorify et aux formulaires de contact et de démonstration.') +
      '<article class="container prose">' +
      publisher(c) +
      '<section><h2>1. Responsable du traitement et finalités</h2>' +
      '<p>Le responsable du traitement des données recueillies sur ce site est la société Dorify SAS. Les données collectées via nos formulaires de démonstration et de contact sont traitées pour les finalités suivantes :</p>' +
      '<ul><li>Traitement et qualification de vos demandes d’information, devis ou démonstration logicielle.</li><li>Prise de contact commercial et organisation des sessions de présentation personnalisée.</li><li>Gestion de la relation précontractuelle et suivi des échanges.</li></ul>' +
      '<p><strong>Base légale :</strong> ces traitements reposent sur l’exécution de mesures précontractuelles prises à votre demande (art. 6.1.b du RGPD) ainsi que sur votre consentement exprès recueilli lors de la soumission du formulaire (art. 6.1.a du RGPD).</p>' +
      '</section>' +

      '<section><h2>2. Données collectées</h2>' +
      '<p>Nous collectons les données strictement nécessaires au traitement de votre demande : votre nom et prénom, votre organisation ou collectivité, votre adresse email professionnelle, votre numéro de téléphone (facultatif), votre message libre (facultatif), vos choix d’hébergement et de volumétrie prévisionnelle, ainsi que les métadonnées techniques de sécurité (date, heure et référence de la demande).</p>' +
      '<p>L’envoi de ce formulaire ne crée pas de compte utilisateur dans l’application métier Dorify et ne transfère aucune donnée vers les bases de production d’autres établissements.</p>' +
      '</section>' +

      '<section><h2>3. Durée de conservation et purge automatique</h2>' +
      '<p>Les demandes reçues via le site vitrine sont conservées pendant une durée maximale de <strong>' + c.retention + ' jours</strong> dans un stockage local privé et chiffré, après quoi elles sont automatiquement et définitivement purgées par un cycle horaire autonome.</p>' +
      '</section>' +

      '<section><h2>4. Destinataires et sous-traitance d’hébergement</h2>' +
      '<p>Les données sont exclusivement destinées aux collaborateurs habilités de Dorify SAS chargés du suivi commercial et technique. Elles ne font l’objet d’aucune cession, location ou commercialisation auprès de tiers.</p>' +
      '<p>L’infrastructure du site vitrine est hébergée par ' + e(c.hostingProvider || 'un prestataire Cloud souverain situé dans l’Union Européenne') + ', garantissant la localisation des données sur le territoire européen.</p>' +
      '</section>' +

      '<section><h2>5. Vos droits et contact DPO</h2>' +
      '<p>Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez d’un droit d’accès, de rectification, d’effacement, de limitation du traitement, d’opposition et de portabilité de vos données personnelles.</p>' +
      '<p>Pour exercer vos droits ou pour toute question relative à la gestion de vos données, vous pouvez contacter notre Délégué à la Protection des Données (DPO) à l’adresse : ' + contact + ' en indiquant la référence de votre demande.</p>' +
      '<p>Si vous estimez que vos droits ne sont pas respectés, vous pouvez adresser une réclamation auprès de la CNIL (Commission Nationale de l’Informatique et des Libertés — <a href="https://www.cnil.fr" target="_blank" rel="noopener">cnil.fr</a>).</p>' +
      '</section>' +

      '<section><h2>6. Cookies et traceurs tiers</h2>' +
      '<p>Ce site vitrine respecte strictement votre vie privée : il ne dépose <strong>aucun cookie publicitaire</strong>, aucun cookie de profilage et ne charge aucun outil d’analyse tiers invasif. Seules des sessions techniques strictement nécessaires au fonctionnement du serveur peuvent être mobilisées.</p>' +
      '</section>' +
      '<p class="product-footnote">Dernière mise à jour : 7 novembre 2026. Version conforme RGPD 2.0.</p>' +
      '</article>';
  }

  return breadcrumbs([['/mentions-legales', 'Mentions légales']]) +
    intro('INFORMATIONS LÉGALES', 'Mentions légales.','Mentions légales obligatoires relatives à l’édition et à l’hébergement du site vitrine Dorify.') +
    '<article class="container prose">' +
    publisher(c) +
    '<section><h2>Hébergement du site</h2><p>' + e(c.hostingProvider || 'Oracle Cloud Infrastructure (Régions UE Marseille / Paris, conforme RGPD, ISO/IEC 27001)') + '</p></section>' +
    '<section><h2>Objet du site et conditions d’utilisation</h2><p>Le site vitrine dorify.fr a pour objet la présentation commerciale et technique du logiciel Dorify, de ses fonctionnalités et de ses modes d’hébergement Cloud et INTRA. Il permet d’effectuer des demandes d’échange, de devis et de démonstration.</p><p>Une demande transmise via ce site ne constitue en aucun cas un engagement contractuel ni une ouverture immédiate de compte. Les conditions de service, les engagements de niveau de service (SLA) et les modalités financières font l’objet d’un contrat formel conclu entre Dorify SAS et l’organisme client.</p></section>' +
    '<section><h2>Propriété intellectuelle</h2><p>L’ensemble des contenus (textes, logos, marques, captures d’écran, icônes, illustrations et architecture logicielle) présents sur ce site est la propriété exclusive de Dorify SAS ou fait l’objet d’une autorisation légale d’utilisation. Toute reproduction, représentation, modification ou diffusion totale ou partielle est interdite sans autorisation écrite préalable.</p></section>' +
    '<section><h2>Captures d’écran et données illustratives</h2><p>Les captures d’écran et représentations graphiques présentées sur ce site sont issues d’environnements de test et de démonstration. Les noms, chiffres et données affichés sont fictifs et ne constituent pas des engagements de performance commerciale.</p></section>' +
    '<section><h2>Contact</h2><p>Pour toute question juridique ou administrative : ' + contact + '.</p></section>' +
    '</article>';
}

function renderSchema(route, meta, c) {
  const schemas = [];

  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Dorify',
    url: c.publicUrl,
    logo: c.publicUrl + '/assets/favicon.svg',
    description: 'Éditeur du logiciel de gestion des files d’attente, rendez-vous et accueil physique Dorify',
    contactPoint: {
      '@type': 'ContactPoint',
      email: c.contactEmail || 'contact@dorify.fr',
      contactType: 'customer service',
      availableLanguage: ['French', 'English', 'Arabic']
    }
  });

  if (route === '/' || route === '/solution' || route.startsWith('/fonctionnalites')) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Dorify',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'All web browsers, Linux, Windows',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'EUR',
        description: 'Démonstration personnalisée gratuite et devis sur mesure'
      },
      description: meta.description
    });
  }

  if (route === '/faq' || route === '/') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: questions.map(([q, a]) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: a
        }
      }))
    });
  }

  return schemas.map(s => '<script type="application/ld+json">' + JSON.stringify(s) + '</script>').join('');
}

export function renderPage(route, c) {
  const meta = pages[route] || { title: 'Page introuvable | Dorify', description: 'Retrouvez Dorify depuis notre page d’accueil.' };
  let body = '';

  if (route === '/') body = home();
  else if (route === '/solution') body = solution();
  else if (route === '/fonctionnalites') body = featuresSummary();
  else if (route === '/fonctionnalites/gestion-files-attente') body = featureQueues();
  else if (route === '/fonctionnalites/prise-rendez-vous') body = featureAppointments();
  else if (route === '/fonctionnalites/poste-guichet-operateur') body = featureDesks();
  else if (route === '/fonctionnalites/bornes-tickets-affichage') body = featureKiosks();
  else if (route === '/fonctionnalites/suivi-mobile-file-attente') body = featureMobile();
  else if (route === '/fonctionnalites/statistiques-supervision') body = featureStats();
  else if (route === '/tarifs') body = pricing();
  else if (route === '/faq') body = faqPage();
  else if (route === '/demo' || route === '/demande-compte') body = form(c, 'demo');
  else if (route === '/contact') body = form(c, 'contact');
  else if (route === '/hebergement') body = hosting();
  else if (route === '/cloud') body = cloudPage();
  else if (route === '/installation-locale') body = intraPage();
  else if (route === '/securite-rgpd') body = securityPage();
  else if (route === '/secteurs/mairies-collectivites') body = sectorCollectivites();
  else if (route === '/secteurs/administrations-services-publics') body = sectorAdministrations();
  else if (route === '/secteurs/reseaux-agences') body = sectorAgences();
  else if (route === '/a-propos') body = about();
  else if (['/confidentialite', '/mentions-legales'].includes(route)) body = legal(c, route === '/confidentialite');
  else {
    body = intro('ERREUR 404', 'Cette page a pris<br>une autre direction.', 'Retrouvez le logiciel d’accueil Dorify depuis notre page d’accueil.') +
      '<div class="container error-cta">' + link('/', 'Retourner à l’accueil') + '</div>';
  }

  const canonicalUrl = e(c.publicUrl + (pages[route] ? route : '/'));
  const schemaJson = renderSchema(route, meta, c);

  return '<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#102a43">' +
    '<title>' + e(meta.title) + '</title>' +
    '<meta name="description" content="' + e(meta.description) + '">' +
    '<link rel="canonical" href="' + canonicalUrl + '">' +
    '<meta property="og:type" content="website">' +
    '<meta property="og:locale" content="fr_FR">' +
    '<meta property="og:site_name" content="Dorify">' +
    '<meta property="og:title" content="' + e(meta.title) + '">' +
    '<meta property="og:description" content="' + e(meta.description) + '">' +
    '<meta property="og:url" content="' + canonicalUrl + '">' +
    '<meta property="og:image" content="' + e(c.publicUrl) + '/assets/social.svg">' +
    '<meta name="twitter:card" content="summary_large_image">' +
    '<meta name="twitter:title" content="' + e(meta.title) + '">' +
    '<meta name="twitter:description" content="' + e(meta.description) + '">' +
    '<meta name="twitter:image" content="' + e(c.publicUrl) + '/assets/social.svg">' +
    '<link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">' +
    '<link rel="stylesheet" href="/assets/site.css">' +
    '<script src="/assets/site.js" defer></script>' +
    schemaJson +
    '</head><body>' +
    header(route, c) +
    '<main id="main">' + body + '</main>' +
    footer(c) +
    '<dialog id="image-dialog" aria-labelledby="image-dialog-title"><div class="dialog-top"><h2 id="image-dialog-title">Aperçu de Dorify</h2><button type="button" data-close-dialog aria-label="Fermer l’aperçu">×</button></div><img alt="" width="1440" height="1000"></dialog>' +
    '</body></html>';
}
