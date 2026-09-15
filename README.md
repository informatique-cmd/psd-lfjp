📌 PSD-LFJP — Site du Plan Stratégique de Développement

## Administration et publication contrôlée

Le site public reste statique et son design existant est conservé. Les contenus administrables sont versionnés dans GitHub afin de permettre une validation avant toute publication :

1. Ouvrir `/admin` sur une Preview Vercel ou en environnement local.
2. Se connecter avec GitHub.
3. Modifier le contenu puis demander une Preview.
4. Une branche et une Pull Request sont créées dans GitHub.
5. Vercel construit automatiquement une Preview de cette Pull Request.
6. Fusionner uniquement après validation de la Preview.

La production ne lit jamais un brouillon non fusionné. Aucun service de base de données actif en permanence n'est nécessaire.

L’administration permet aussi de créer des pages personnalisées et des sous-pages dans [`src/content/pages.json`](./src/content/pages.json). Une page peut contenir les blocs `heading`, `paragraph`, `image`, `gallery`, `quote`, `list`, `button` et `divider`. Les routes déjà codées restent inchangées et continuent d’utiliser leur design spécialisé ; les nouvelles pages utilisent le gabarit public cohérent du site.

### Variables d'environnement

Copier `.env.example` vers `.env.local` pour le développement avec Vercel CLI, puis renseigner les identifiants d'une GitHub OAuth App. Ne jamais publier `GITHUB_CLIENT_SECRET` ni `ADMIN_SESSION_SECRET`.

Pour une Preview ou la production, configurer les mêmes variables dans les paramètres du projet Vercel et définir `APP_URL` sur l'URL correspondante.

### Tester localement

Installer les dépendances puis lancer le serveur Vercel local pour disposer des fonctions `/api` :

```bash
npm ci
npx vercel dev
```

Le site sera accessible à l'URL indiquée par Vercel, et l'administration à `/admin`. Pour tester uniquement l'interface sans OAuth, `npm run dev` reste disponible, mais la création de Pull Request nécessite les fonctions Vercel et leurs variables d'environnement.

📌 Présentation du projet

Ce dépôt contient le code source du site du Plan Stratégique de Développement (PSD) du Lycée Français Jacques Prévert de Saly (Sénégal).
Ce site présente de manière claire et accessible le plan stratégique de notre établissement pour les années à venir, ses objectifs pédagogiques, ses valeurs et ses axes de développement.

Le site est actuellement déployé à l’adresse :
🔗 https://psd-lfjp.netlify.app/

⸻

🧱 Technologies utilisées

Le site est construit avec :
	•	HTML5
	•	CSS3
	•	JavaScript (si applicable)
	•	Hébergé et servi comme site statique via Netlify  ￼

⸻

🚀 Démarrer le projet en local

Pour éditer ou développer ce site depuis ton poste :
	1.	Cloner le dépôt

git clone <URL_DU_DEPOT>


	2.	Ou ouvrir le dossier dans ton IDE
	3.	Tester localement
	•	Ouvrir simplement index.html dans un navigateur

Ce site est statique, il n’a pas de serveur backend. Tu peux donc le tester directement sans installation supplémentaire.

⸻

📄 Structure du projet

Organisée de manière simple :

/index.html
/assets/      → images, ressources visuelles
/css/         → styles CSS
/js/          → scripts JavaScript (optionnel)


⸻

📌 À propos du contenu

Le site présente :
	•	Le Plan Stratégique de Développement
	•	Les visions, missions et valeurs du LFJP
	•	Des sections explicatives
	•	Des ressources à télécharger ou consulter

Ce contenu vise à :
	•	Informer les familles, personnels et partenaires
	•	Valoriser les projets pédagogiques de l’établissement  ￼

⸻

🛠️ Modifier le site

Dans l’éditeur
	•	Ouvrir les fichiers .html, .css ou .js
	•	Adapter le contenu selon les besoins (textes, images, liens)
	•	Valider visuellement dans un navigateur

Bonnes pratiques
	•	Utiliser un éditeur moderne (VS Code, Sublime, etc.)
	•	Tester les modifications sur mobile et desktop
	•	Optimiser les images pour de meilleures performances

⸻

📦 Déploiement

Le site est automatiquement déployé sur Netlify à chaque mise à jour du dépôt.
Pour republier après modification :
	1.	Commit & push des changements sur la branche principale
	2.	Netlify reconstruit et déploie le site automatiquement  ￼

⸻

📌 Métadonnées Open Graph

Pour que les partages (mails, messageries, réseaux sociaux) affichent un aperçu pertinent, assure-toi que les balises suivantes sont définies dans <head> :

<meta property="og:title" content="PSD – Plan Stratégique de Développement LFJP" />
<meta property="og:description" content="Découvrez la vision, les missions et les axes stratégiques du Lycée Français Jacques Prévert de Saly" />
<meta property="og:image" content="https://psd-lfjp.netlify.app/preview.png" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />


⸻

🧾 Licence et mentions

Tous les contenus (textes et visuels) sont publiés par le Lycée Français Jacques Prévert.
Pour toute question sur l’usage, les données ou la mise à jour du site, contacter l’administration de l’établissement  ￼.
