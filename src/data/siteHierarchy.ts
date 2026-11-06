export interface HierarchySubpage {
  path: string;
  name: string;
  description?: string;
  subpages?: HierarchySubpage[];
}

export interface HierarchyAxis {
  id: string;
  name: string;
  description: string;
  badge?: string;
  subpages: HierarchySubpage[];
}

export interface HierarchyPillar {
  id: string;
  name: string;
  path: string;
  badge: string;
  description: string;
  iconName: 'Home' | 'Sliders' | 'Heart' | 'ChartNoAxesCombined' | 'Target';
  subpages?: HierarchySubpage[];
  axes?: HierarchyAxis[];
}

export const SITE_PILLARS: HierarchyPillar[] = [
  {
    id: 'accueil',
    name: 'Accueil',
    path: '/',
    badge: 'Racine',
    description: 'Portail d’accueil, hero, chiffres clés, actualités, mots officiels et rubriques phares',
    iconName: 'Home',
  },
  {
    id: 'methode',
    name: 'Méthode',
    path: '/methode',
    badge: 'Pilier 1',
    description: 'Démarche participative, calendrier de concertation, comités et méthodologie du PSD',
    iconName: 'Sliders',
  },
  {
    id: 'vision',
    name: 'Vision, Missions & Valeurs',
    path: '/vision-missions-valeurs',
    badge: 'Pilier 2',
    description: 'Piliers éducatifs, missions prioritaires et valeurs fondamentales partagées du LFJP',
    iconName: 'Heart',
  },
  {
    id: 'diagnostic',
    name: 'Diagnostic',
    path: '/diagnostic',
    badge: 'Pilier 3',
    description: 'Enquête Climat Scolaire (ELCS), restauration scolaire, constats de l’établissement et indicateurs clés',
    iconName: 'ChartNoAxesCombined',
    subpages: [
      {
        path: '/elcs-analyse-complete',
        name: 'Analyse Complète ELCS',
        description: 'Résultats détaillés de l’enquête climat scolaire auprès des élèves, parents et personnels',
      },
    ],
  },
  {
    id: 'plan-strategique',
    name: 'Plan Stratégique',
    path: '/plan-strategique',
    badge: 'Pilier 4',
    description: 'Les 4 grands axes prioritaires, jalons temporels, budgets d’investissement et 40+ fiches projets',
    iconName: 'Target',
    axes: [
      {
        id: 'axe-1',
        name: 'Axe 1 : Bien-être, Cadre de vie & Infrastructures',
        description: 'Investissements, budgets prévisionnels, transport, cantine, climatisation, santé et épanouissement',
        badge: 'Axe 1',
        subpages: [
          {
            path: '/budget-cadre-vie-infrastructures',
            name: 'Budget d’amélioration & Financements (775M FCFA)',
            description: 'Tableau de bord financier, cash-flow 2026-2030, investissements et leviers ANEFE/écolages',
          },
          {
            path: '/transport-scolaire',
            name: 'Transport scolaire & Distribution territoriale',
            description: 'Données géographiques des familles (Saly, Ngaparou, Mbour), navettes et scénarios d’usage',
          },
          {
            path: '/climatisation-durable',
            name: 'Climatisation durable & Solaire',
            description: 'Déploiement thermique progressif des phases 1, 2 et 3 avec alimentation photovoltaïque',
          },
          {
            path: '/construction-cantine',
            name: 'Construction de la Cantine scolaire',
            description: 'Projet architectural moderne de restauration scolaire et espace de convivialité',
          },
          {
            path: '/couverture-terrain-sport',
            name: 'Couverture du terrain de sport',
            description: 'Protection solaire, confort thermique et réaménagement des installations sportives',
          },
          {
            path: '/plan-maintenance-strategique',
            name: 'Plan de Maintenance Stratégique',
            description: 'Entretien pluriannuel des bâtiments, sécurité, réseau électrique et espaces verts',
          },
          {
            path: '/politique-e3d',
            name: 'Politique E3D (Transition écologique)',
            description: 'Label Établissement en Démarche de Développement Durable, recyclage et énergie verte',
          },
          {
            path: '/parcours-sante',
            name: 'Parcours Santé & Prévention',
            description: 'Sensibilisation aux rythmes de vie, sommeil, nutrition et équilibre personnel',
          },
          {
            path: '/protocole-phare',
            name: 'Protocole pHARe (Lutte contre le harcèlement)',
            description: 'Dispositif institutionnel de prévention, écoute et traitement des situations de harcèlement',
          },
          {
            path: '/mediation-entre-pairs',
            name: 'Médiation entre pairs',
            description: 'Élèves ambassadeurs et médiateurs formés à la résolution pacifique des conflits',
          },
          {
            path: '/projet-eps',
            name: 'Projet EPS & Pratiques sportives',
            description: 'Développement des compétences motrices, esprit d’équipe et inclusion par le sport',
          },
          {
            path: '/savoir-rouler',
            name: 'Savoir Rouler à Vélo',
            description: 'Mobilité active, sécurité routière et autonomie des plus jeunes',
          },
          {
            path: '/savoir-nager',
            name: 'Dispositif Savoir Nager',
            description: 'Apprentissage de la natation et aisance aquatique en milieu sécurisé',
          },
          {
            path: '/parentalite-coeducation',
            name: 'Parentalité & Co-éducation',
            description: 'Ateliers parents, dialogue bienveillant et accompagnement de la scolarité',
          },
          {
            path: '/expression-participation',
            name: 'Expression & Participation des élèves',
            description: 'Conseil de la vie collégienne (CVC), conseil de la vie lycéenne (CVL) et délégués',
          },
        ],
      },
      {
        id: 'axe-2',
        name: 'Axe 2 : Langues, Interculturalité & Ouverture internationale',
        description: 'Sections internationales, plurilinguisme, mobilités AEFE et échanges culturels',
        badge: 'Axe 2',
        subpages: [
          {
            path: '/section-internationale-bfi',
            name: 'Section Internationale & BFI',
            description: 'Baccalauréat Français International, enseignement bilingue et ouverture anglophone',
          },
          {
            path: '/dnbi',
            name: 'DNBi – SIA Collège',
            description: 'Diplôme National du Brevet International et filière internationale collège',
          },
          {
            path: '/bfi',
            name: 'BFI – Lycée',
            description: 'Parcours d’excellence internationale au cycle terminal et reconnaissance mondiale',
          },
          {
            path: '/parcours-education-artistique-culturelle',
            name: 'Parcours d’Éducation Artistique et Culturelle (PEAC)',
            description: 'Pratiques artistiques, sorties culturelles et rencontres avec des créateurs',
          },
          {
            path: '/semaine-des-cultures',
            name: 'Semaine des cultures',
            description: 'Temps fort célébrant la diversité culturelle, les langues et les traditions',
          },
          {
            path: '/echanges-scolaires-adn-aefe',
            name: 'Échanges scolaires ADN-AEFE',
            description: 'Mobilité internationale individuelle et immersion dans les lycées français du monde',
          },
          {
            path: '/jumelages-partages-projets-collaboratifs',
            name: 'Jumelages et projets collaboratifs',
            description: 'Partenariats avec des établissements sénégalais et internationaux',
          },
          {
            path: '/voyages-scolaires-internationaux-sejours-locaux',
            name: 'Voyages scolaires internationaux & Séjours locaux',
            description: 'Classes découvertes régionales au Sénégal et voyages d’études internationaux',
          },
        ],
      },
      {
        id: 'axe-3',
        name: 'Axe 3 : Innovation, Numérique & Pédagogie active',
        description: 'Transition numérique, 1 PC par lycéen, intelligence artificielle, code et fablab',
        badge: 'Axe 3',
        subpages: [
          {
            path: '/classe-numerique',
            name: 'Classe numérique mobile',
            description: 'Flottes de tablettes et ordinateurs portables partagés pour les projets pédagogiques',
          },
          {
            path: '/pc-par-lyceen',
            name: 'Dispositif 1 PC par Lycéen',
            description: 'Équipement informatique individuel pour tous les élèves du lycée',
          },
          {
            path: '/curriculum-numerique-spiralaire',
            name: 'Curriculum numérique spiralaire',
            description: 'Acquisition progressive des compétences numériques de la maternelle à la terminale',
          },
          {
            path: '/introduction-au-code',
            name: 'Introduction au code & Algorithmique',
            description: 'Initiation à la programmation, pensée computationnelle et robotique éducative',
          },
          {
            path: '/module-ia',
            name: 'Module Intelligence Artificielle',
            description: 'Compréhension des technologies d’IA, éthique et usages raisonnés',
          },
          {
            path: '/education-numerique-citoyen',
            name: 'Éducation au numérique citoyen & Pix',
            description: 'Protection des données, e-réputation, lutte contre le cyberharcèlement et certification Pix',
          },
          {
            path: '/connectivite-2-0',
            name: 'Connectivité 2.0',
            description: 'Réseau très haut débit, couverture Wi-Fi sécurisée et serveurs modernes',
          },
          {
            path: '/laboratoire-numerique',
            name: 'Laboratoire numérique & Fablab',
            description: 'Espace dédié à l’expérimentation technologique, prototypage et création multimédia',
          },
          {
            path: '/profil-digital-lfjp',
            name: 'Profil digital du LFJP',
            description: 'Cartographie des équipements, outils pédagogiques et maturité numérique',
          },
          {
            path: '/mecenat-numerique',
            name: 'Mécénat numérique & Partenariats',
            description: 'Partenariats technologiques pour financer les équipements de pointe',
          },
        ],
      },
      {
        id: 'axe-4',
        name: 'Axe 4 : Façonner les réussites, Citoyenneté & Orientation',
        description: 'Excellence académique, persévérance, réussite citoyenne, examens et parcours avenir',
        badge: 'Axe 4',
        subpages: [
          {
            path: '/niveau-excellence-reussite-examens',
            name: 'Niveau d’excellence & Réussite aux examens',
            description: 'Objectifs de mention, suivi personnalisé et préparation aux épreuves du DNB et Bac',
          },
          {
            path: '/autonomie-perseverance',
            name: 'Autonomie & Persévérance',
            description: 'Méthodes de travail autonome, tutorat et accompagnement de l’effort',
          },
          {
            path: '/toutes-les-reussites',
            name: 'Valorisation de toutes les réussites',
            description: 'Reconnaissance des talents scolaires, sportifs, artistiques et humains',
          },
          {
            path: '/celebration-reussites-diplomes',
            name: 'Célébration des réussites & Diplômes',
            description: 'Cérémonies de remise des diplômes et temps forts de la communauté',
          },
          {
            path: '/valorisation-erreur-perseverance',
            name: 'Valorisation de l’erreur & Savoir rebondir',
            description: 'Pédagogie du rebond, bienveillance évaluative et confiance en soi',
          },
          {
            path: '/plan-strategique/reussite-citoyenne',
            name: 'Réussite citoyenne & Engagement',
            description: 'Formation de citoyens éclairés, responsables, engagés et solidaires',
          },
          {
            path: '/education-financiere-vie-autonome',
            name: 'Éducation financière & Vie autonome',
            description: 'Gestion budgétaire, vie quotidienne et préparation aux études supérieures',
          },
          {
            path: '/reseau-alumni-mentorat',
            name: 'Réseau Alumni & Mentorat',
            description: 'Réseau des anciens élèves, parrainage et conférences professionnelles',
          },
          {
            path: '/implication-des-familles',
            name: 'Implication des familles & Communauté',
            description: 'Co-éducation, rencontres parents-enseignants et association des parents',
          },
          {
            path: '/planification-bac-blanc',
            name: 'Planification du Bac Blanc',
            description: 'Organisation, épreuves, calendrier, salles et équipes de surveillance',
          },
          {
            path: '/parcours-avenir',
            name: 'Parcours Avenir & Orientation',
            description: 'Accompagnement de l’orientation de la 3e à la Terminale et projets professionnels',
            subpages: [
              { path: '/film-annuel/3e', name: 'Film annuel 3e – Découverte & Premier cycle' },
              { path: '/film-annuel/2nde', name: 'Film annuel 2nde – Détermination & Choix de spécialités' },
              { path: '/film-annuel/1ere', name: 'Film annuel 1ère – Approfondissement & Parcoursup' },
              { path: '/film-annuel/terminale', name: 'Film annuel Terminale – Finalisation & Enseignement supérieur' },
            ],
          },
        ],
      },
    ],
  },
];
