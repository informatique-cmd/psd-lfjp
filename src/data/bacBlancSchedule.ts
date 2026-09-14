export interface SupportDetail {
  names: string[];
  mission: string;
  presence?: string;
}

export interface RoomAssignment {
  room: string;
  examTitle: string;
  examTime: string;
  leadExaminer: string;
  surveillanceTeam: string[];
  supportTeam?: SupportDetail;
  notes?: string;
}

export interface ExamDaySchedule {
  date: string;
  label: string;
  focus: string;
  note?: string;
  rooms: RoomAssignment[];
}

export const bacBlancSchedule: ExamDaySchedule[] = [
  {
    date: "2024-12-10",
    label: "Mardi 10 décembre 2024",
    focus: "Philosophie – Bac blanc",
    note:
      "Toutes les salles concernées partagent le même créneau de philosophie du bac blanc. Les équipes de surveillance et de support sont coordonnées pour assurer l'installation, la distribution des copies et la gestion des imprévus.",
    rooms: [
      {
        room: "S12",
        examTitle: "Philosophie",
        examTime: "08h00 – 12h00",
        leadExaminer: "GOMIS A.",
        surveillanceTeam: ["NDIAYE L.", "SAMB R."],
        supportTeam: {
          names: ["DIOP N."],
          mission: "Accueil des candidats et distribution des copies au démarrage de l'épreuve.",
          presence: "Présence requise dès 07h30 pour préparer la salle.",
        },
      },
      {
        room: "S13",
        examTitle: "Philosophie",
        examTime: "08h00 – 12h00",
        leadExaminer: "MOURAIN DIOP F.",
        surveillanceTeam: ["DIALLO P.", "FALL C."],
        supportTeam: {
          names: ["NDAO K.", "SARR T."],
          mission: "Gestion des flux d'entrée, assistance aux surveillants et collecte des copies en fin d'épreuve.",
        },
      },
      {
        room: "S14",
        examTitle: "Philosophie",
        examTime: "08h00 – 12h00",
        leadExaminer: "MICHON G. M.",
        surveillanceTeam: ["BAH I.", "DIOUF Y."],
        supportTeam: {
          names: ["FRAYON A.", "GIBUS A."],
          mission:
            "Couverture support dédiée à la salle 14 : installation du matériel, sécurisation des sujets et accompagnement des besoins logistiques en continu.",
          presence: "Astuce logistique : passage toutes les 30 minutes pour vérifier l'état des copies et des feuilles de brouillon.",
        },
        notes:
          "Ce binôme assure la relève sur la salle 14 afin de garantir la présence d'un support opérationnel pendant toute la durée de l'épreuve.",
      },
      {
        room: "S15",
        examTitle: "Philosophie",
        examTime: "08h00 – 12h00",
        leadExaminer: "DRAMÉ C.",
        surveillanceTeam: ["SY A.", "GAYE B."],
        supportTeam: {
          names: ["SOW J."],
          mission: "Remise en état de la salle et accompagnement des candidats lors des pauses sanitaires.",
        },
      },
    ],
  },
];
