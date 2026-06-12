export type QuestionType = "single" | "multi" | "text";

export interface Question {
  id: string;
  section: string;
  label: string;
  type: QuestionType;
  options?: string[];
  /** If true, an "Other (specify)" free-text option is appended. */
  allowOther?: boolean;
  /** Whether the question can be left blank (participant may skip). */
  optional?: boolean;
  /** Reminder shown to the enumerator only, not part of the question text. */
  researcherNote?: string;
}

export const SECTIONS = [
  "Section A: Demographic Information",
  "Section B: Maternal Healthcare Access",
  "Section C: Technology Awareness",
  "Section D: Preparedness",
];

export const QUESTIONS: Question[] = [
  // Section A
  {
    id: "age",
    section: SECTIONS[0],
    label: "Age",
    type: "single",
    options: ["18–24", "25–34", "35–44", "45+"],
  },
  {
    id: "education",
    section: SECTIONS[0],
    label: "Education Level",
    type: "single",
    options: ["No formal education", "Primary", "Secondary", "University"],
  },
  {
    id: "occupation",
    section: SECTIONS[0],
    label: "Occupation",
    type: "single",
    options: ["Employed", "Self-employed", "Unemployed", "Student"],
  },
  {
    id: "district",
    section: SECTIONS[0],
    label: "District",
    type: "single",
    options: ["Nyarugenge", "Gasabo", "Kicukiro"],
  },
  {
    id: "pregnancy_months",
    section: SECTIONS[0],
    label: "How many months pregnant are you?",
    type: "single",
    options: ["1–3", "4–6", "7–9"],
  },

  // Section B
  {
    id: "anc_attended",
    section: SECTIONS[1],
    label: "Have you attended antenatal care (ANC)?",
    type: "single",
    options: ["Yes", "No"],
  },
  {
    id: "anc_visits",
    section: SECTIONS[1],
    label: "How many ANC visits have you completed?",
    type: "single",
    options: ["1", "2", "3", "4 or more"],
    optional: true,
  },
  {
    id: "distance_health_center",
    section: SECTIONS[1],
    label: "How far is the nearest health center from your home?",
    type: "single",
    options: ["Less than 1 km", "1–5 km", "More than 5 km"],
  },
  {
    id: "travel_time_health_center",
    section: SECTIONS[1],
    label: "How long does it take you to reach the nearest health center?",
    type: "single",
    options: ["Less than 15 min", "15–30 min", "More than 30 min"],
  },

  // Section C
  {
    id: "owns_phone",
    section: SECTIONS[2],
    label: "Do you own a mobile phone?",
    type: "single",
    options: ["Yes", "No"],
  },
  {
    id: "heard_wearable",
    section: SECTIONS[2],
    label: "Have you heard about wearable health monitoring devices?",
    type: "single",
    options: ["Yes", "No"],
  },
  {
    id: "willing_to_use",
    section: SECTIONS[2],
    label:
      "Would you be willing to use a maternal health monitoring band that tracks your health and sends alerts to a clinic?",
    type: "single",
    options: ["Yes", "No", "Not sure"],
  },
  {
    id: "barriers",
    section: SECTIONS[2],
    label: "What would stop you from using such a device?",
    type: "multi",
    options: [
      "Cost",
      "Lack of information",
      "I am not comfortable using technology",
      "Husband/family decision",
      "Lack of trust in device",
    ],
    allowOther: true,
    optional: true,
  },

  // Section D
  {
    id: "prevent_complications",
    section: SECTIONS[3],
    label: "Do you think a monitoring band could help prevent complications?",
    type: "single",
    options: ["Yes", "No", "Not sure"],
    researcherNote:
      "If the participant becomes distressed by this question, pause and follow the distress support protocol.",
  },
  {
    id: "allow_chw_alerts",
    section: SECTIONS[3],
    label:
      "Would you allow a community health worker to receive alerts about your health?",
    type: "single",
    options: ["Yes", "No"],
  },
  {
    id: "additional_comments",
    section: SECTIONS[3],
    label: "Any additional comments about maternal healthcare challenges?",
    type: "text",
    optional: true,
  },
];
