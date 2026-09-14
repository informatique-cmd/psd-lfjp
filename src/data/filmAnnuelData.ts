export type FilmPhase =
  | "Mieux se connaître"
  | "Plonger dans le monde professionnel"
  | "Finaliser les projets";

export interface FilmAction {
  title: string;
  period: string;
  description: string;
  actors: string;
  phase: FilmPhase;
}

export interface FilmAnnuelLevel {
  level: string;
  subtitle: string;
  actions: FilmAction[];
}

export const filmAnnuelData: Record<string, FilmAnnuelLevel> = {
  "3e": {
    level: "3e",
    subtitle:
      "Naviguez parmi les actions clés pour préparer l'orientation des élèves de 3e.",
    actions: [
      {
        title: "Atelier forces et centres d'intérêt",
        period: "Septembre",
        description:
          "Séances animées par la PRIO pour identifier les talents personnels et poser les bases du projet d'orientation.",
        actors: "Élèves, PRIO, professeurs principaux",
        phase: "Mieux se connaître",
      },
      {
        title: "Stage d'observation en entreprise",
        period: "Décembre",
        description:
          "Immersion d'une semaine pour découvrir la réalité d'un métier et préparer le rapport de stage.",
        actors: "Élèves, familles, tuteurs de stage",
        phase: "Plonger dans le monde professionnel",
      },
      {
        title: "Atelier rapport de stage",
        period: "Janvier",
        description:
          "Accompagnement méthodologique pour structurer le rapport, valoriser les compétences et préparer l'oral.",
        actors: "Professeurs de français, professeurs principaux",
        phase: "Finaliser les projets",
      },
      {
        title: "Forum des métiers",
        period: "Février",
        description:
          "Rencontres avec des professionnels et des anciens élèves pour questionner les parcours de formation.",
        actors: "Parents, alumni, équipe pédagogique",
        phase: "Plonger dans le monde professionnel",
      },
      {
        title: "Découverte des lycées et filières",
        period: "Mars",
        description:
          "Présentation des voies générale, technologique et professionnelle afin d'éclairer les choix d'affectation.",
        actors: "PRIO, proviseur adjoint, professeurs",
        phase: "Finaliser les projets",
      },
      {
        title: "Entretien d'orientation personnalisé",
        period: "Mai",
        description:
          "Bilan individualisé pour valider les intentions et préparer les voeux d'affectation sur la plateforme nationale.",
        actors: "Élèves, PRIO, familles",
        phase: "Finaliser les projets",
      },
    ],
  },
  "2nde": {
    level: "2nde",
    subtitle:
      "Naviguez parmi les actions clés pour préparer l'orientation des élèves de 2nde.",
    actions: [
      {
        title: "Séminaire de rentrée : mieux se connaître",
        period: "Septembre",
        description:
          "Ateliers d'introspection et de connaissance de soi pour clarifier valeurs, intérêts et modes d'apprentissage.",
        actors: "Professeurs principaux, PRIO",
        phase: "Mieux se connaître",
      },
      {
        title: "Parcours Avenir - modules Onisep",
        period: "Octobre",
        description:
          "Exploration guidée de l'abonnement Onisep et prise en main des outils d'aide au choix.",
        actors: "CDI, PRIO",
        phase: "Plonger dans le monde professionnel",
      },
      {
        title: "Journées d'immersion au lycée",
        period: "Novembre",
        description:
          "Découverte des spécialités et options via observations de cours et échanges avec les enseignants.",
        actors: "Équipe pédagogique, élèves ambassadeurs",
        phase: "Plonger dans le monde professionnel",
      },
      {
        title: "Salon des études post-bac",
        period: "Janvier",
        description:
          "Participation à un salon régional pour repérer les voies de formation et poser des questions ciblées.",
        actors: "Élèves, familles, PRIO",
        phase: "Plonger dans le monde professionnel",
      },
      {
        title: "Choix des enseignements de spécialité",
        period: "Mars",
        description:
          "Accompagnement collectif et individuel pour élaborer la combinaison de spécialités cohérente avec le projet.",
        actors: "Professeurs principaux, PRIO",
        phase: "Finaliser les projets",
      },
      {
        title: "Conseil de classe et entretiens",
        period: "Juin",
        description:
          "Entretiens personnalisés pour valider les choix et préparer l'entrée en classe de 1ère.",
        actors: "Chefs d'établissement, PRIO, familles",
        phase: "Finaliser les projets",
      },
    ],
  },
  "1ere": {
    level: "1ère",
    subtitle:
      "Naviguez parmi les actions clés pour préparer l'orientation des élèves de 1ère.",
    actions: [
      {
        title: "Bilan des spécialités",
        period: "Septembre",
        description:
          "Analyse des résultats de 1ère pour ajuster les méthodes de travail et conforter le projet post-bac.",
        actors: "Professeurs principaux, PRIO",
        phase: "Mieux se connaître",
      },
      {
        title: "Parcoursup - découverte anticipée",
        period: "Octobre",
        description:
          "Prise en main de la plateforme Parcoursup et identification des attendus des formations.",
        actors: "PRIO, équipe de direction",
        phase: "Plonger dans le monde professionnel",
      },
      {
        title: "Entretiens métiers avec les alumni",
        period: "Novembre",
        description:
          "Rencontres thématiques permettant d'explorer des trajectoires inspirantes et de questionner les parcours.",
        actors: "Alumni, élèves, PRIO",
        phase: "Plonger dans le monde professionnel",
      },
      {
        title: "Mini-stage dans l'enseignement supérieur",
        period: "Janvier",
        description:
          "Immersions dans des établissements partenaires pour vivre une journée de cours et affiner le projet.",
        actors: "Universités partenaires, élèves, familles",
        phase: "Plonger dans le monde professionnel",
      },
      {
        title: "Construction du dossier post-bac",
        period: "Mars",
        description:
          "Ateliers méthodologiques pour rédiger CV, lettres de motivation et préparer les épreuves orales.",
        actors: "Professeurs de lettres, PRIO",
        phase: "Finaliser les projets",
      },
      {
        title: "Conseil d'orientation approfondi",
        period: "Mai",
        description:
          "Entretien tripartite pour valider la stratégie Parcoursup et choisir les spécialités conservées en Terminale.",
        actors: "Élèves, familles, PRIO",
        phase: "Finaliser les projets",
      },
    ],
  },
  terminale: {
    level: "Terminale",
    subtitle:
      "Naviguez parmi les actions clés pour préparer l'orientation des élèves de Terminale.",
    actions: [
      {
        title: "Lancement Parcoursup",
        period: "Septembre",
        description:
          "Présentation du calendrier, des attendus et des stratégies de candidatures pour réussir son orientation.",
        actors: "PRIO, proviseur, élèves, familles",
        phase: "Finaliser les projets",
      },
      {
        title: "Coaching projet professionnel",
        period: "Octobre",
        description:
          "Accompagnement individualisé pour aligner ambitions, compétences et voies d'études réalistes.",
        actors: "PRIO, coachs externes",
        phase: "Mieux se connaître",
      },
      {
        title: "Préparation aux oraux et concours",
        period: "Décembre",
        description:
          "Simulations d'entretiens, pitchs et épreuves orales animées par des professionnels.",
        actors: "Professeurs, intervenants professionnels",
        phase: "Finaliser les projets",
      },
      {
        title: "Rencontres écoles et universités",
        period: "Janvier",
        description:
          "Conférences et stands d'établissements supérieurs pour préciser les choix et poser des questions pointues.",
        actors: "Universités partenaires, PRIO",
        phase: "Plonger dans le monde professionnel",
      },
      {
        title: "Finalisation des voeux Parcoursup",
        period: "Mars",
        description:
          "Ateliers de vérification des dossiers, rédaction des projets de formation motivés et saisie des voeux.",
        actors: "Élèves, PRIO, professeurs référents",
        phase: "Finaliser les projets",
      },
      {
        title: "Suivi des admissions",
        period: "Mai-Juillet",
        description:
          "Accompagnement personnalisé pendant la phase d'admission pour sécuriser une place et préparer la transition.",
        actors: "PRIO, CPE, familles",
        phase: "Finaliser les projets",
      },
    ],
  },
};
