# Emails des demandes Dorify

Le formulaire persiste le JSON avant de planifier les emails. La confirmation
au demandeur et la notification commerciale sont independantes, avec versions
HTML et texte, reference, recapitulatif et signature Dorify.

Configuration serveur : EMAIL_PROVIDER=resend, RESEND_API_KEY, EMAIL_FROM=noreply@dorify.fr,
EMAIL_SALES_TO=ijoober@gmail.com. Le domaine dorify.fr doit etre verifie chez Resend.
Le mode disabled est le defaut sans configuration ; aucune cle dans le navigateur.

La cle locale est dans .env.oracle.local (ignore par Git et Docker). Pour le Docker local :
docker compose --env-file .env.oracle.local -f compose.site.cloud.yaml up -d --build
Pour Oracle : .\deploy-oracle.ps1 ; le script transmet le fichier prive et complete
les valeurs manquantes du .env distant. Les valeurs distantes non vides sont conservees.

mail/provider.js definit le contrat send(message,{idempotencyKey}) et l'adaptateur Resend.
Pour changer de fournisseur, ajouter un adaptateur et sa selection dans la factory ;
le formulaire, les modeles et la file ne dependent pas de Resend.

Les nouvelles demandes portent emailNotificationVersion=1. Les anciennes ne sont
pas notifiees retroactivement. Les etats et les messages figes sont dans
<fichier-demande>.mail.json, dans le meme volume prive. accepted signifie accepte
par le fournisseur, pas necessairement remis en boite de reception.
Les erreurs reseau, 408, 429 et 5xx sont reessayees (8 tentatives maximum,
delai exponentiel, plafond 1h). Les erreurs definitives restent failed.
La cle d'idempotence distingue reference et destinataire ; aucune reprise au-dela
de 23h pour respecter la fenetre de deduplication de 24h de Resend. Ne pas effacer
les etats pour forcer un renvoi. La retention supprime demande et etat associe.

Un seul conteneur site doit traiter ce volume. Aucune suppression ou remise a zero
BDD n'est necessaire. Les envois sont asynchrones : une panne mail n'annule jamais
une demande recue. Les logs contiennent reference/type/code uniquement, sans cle
ni contenu personnel. Le fournisseur assure le suivi de livraison ; aucun webhook
de statut n'est configure a ce stade.

Documentation : https://resend.com/docs/send-with-nodejs
https://resend.com/docs/dashboard/emails/idempotency-keys
