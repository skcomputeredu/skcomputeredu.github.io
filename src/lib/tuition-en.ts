import type { Band } from "@/lib/tuition";

export const subjectEn: Record<string, { name: string; focus: string; bands: Band[] }> = {
  hindi: {
    name: "Hindi",
    focus: "Reading, grammar and writing in your own words.",
    bands: [
      {
        title: "Class 1–5",
        points: [
          "From the alphabet to a sentence, with clear handwriting",
          "A short story from a picture",
          "Noun, pronoun and punctuation, at the start",
          "The meaning of a lesson in simple words",
        ],
      },
      {
        title: "Class 6–8",
        points: [
          "The sense of prose and poetry",
          "Letters, paragraphs and notices",
          "Grammar: compounds, sentences and word classes",
          "Lesson questions in the student's own words",
        ],
      },
      {
        title: "Class 9–10",
        points: [
          "Questions in the board pattern",
          "The shape of an essay and a formal letter",
          "How to begin an explanation",
          "The rhythm of past papers",
        ],
      },
      {
        title: "Class 11–12",
        points: [
          "Class 11–12 Hindi is board writing: long answers, poetry and prose, so the paper is written in your own words",
          "An outline for a long answer",
          "The language of poetry and prose",
          "Less repetition in writing",
          "Practice an unseen passage so the first paragraph of the paper can be written alone",
        ],
      },
    ],
  },
  english: {
    name: "English",
    focus: "Speak, read and write sentences with less fear.",
    bands: [
      {
        title: "Class 1–5",
        points: [
          "Sounds and easy words",
          "Speak and write short sentences",
          "Pictures and stories",
          "Clear letters in the copy",
        ],
      },
      {
        title: "Class 6–8",
        points: [
          "Tenses and parts of speech with useful examples",
          "A paragraph and a diary",
          "How to read an unseen passage",
          "Spoken lines for everyday situations",
        ],
      },
      {
        title: "Class 9–10",
        points: [
          "Formats for a letter, an article and a story",
          "The grammar topics that appear in the paper",
          "Literature answers in points",
          "Practice writing against the clock",
        ],
      },
      {
        title: "Class 11–12",
        points: [
          "Reader and writing as per the board",
          "How a long answer starts and ends",
          "Notice, report or speech — whatever is in the syllabus",
          "A separate drill for weak grammar",
        ],
      },
    ],
  },
  maths: {
    name: "Mathematics",
    focus: "Solve by showing the steps. Method, not rote.",
    bands: [
      {
        title: "Class 1–5",
        points: [
          "Numbers, addition, subtraction and tables without fear",
          "Multiplication, division and simple fractions",
          "Measure, time and money problems",
          "A habit of catching a small mistake",
        ],
      },
      {
        title: "Class 6–8",
        points: [
          "Integers, fractions and decimals",
          "Ratio, percentage and simple algebra",
          "Lines, angles and area",
          "Turn a word problem into an equation",
        ],
      },
      {
        title: "Class 9–10",
        points: [
          "Board chapters in order",
          "A theorem's statement and figure",
          "The base of trigonometry and statistics",
          "Past questions and timed practice",
        ],
      },
      {
        title: "Class 11–12",
        points: [
          "In class 11–12, relations and functions come first so calculus stays clear",
          "Understand the condition before memorising a formula",
          "Calculus or commerce maths — whichever paper you sit",
          "A mixed practice every week",
          "Board mathematics: relations, functions, trigonometry, limits, differentiation and integration",
          "Matrices, determinants, vectors and three-dimensional geometry, in board order",
          "Mixed probability questions, and one paper-style practice every week",
        ],
      },
    ],
  },
  science: {
    name: "Science",
    focus: "The event before the definition. Then the diagram and the words.",
    bands: [
      {
        title: "Class 1–5",
        points: [
          "Things around us: water, air, plants, the body",
          "Tell what you see and draw it",
          "Safety: electricity, the road, food",
          "Small experiments that fit in class",
        ],
      },
      {
        title: "Class 6–8",
        points: [
          "Separate habits for physics, chemistry and biology",
          "Diagrams with labels",
          "Definitions in short sentences",
          "Mistakes of units and measurement",
        ],
      },
      {
        title: "Class 9–10",
        points: [
          "Numericals with the steps shown",
          "Balancing a chemical equation",
          "Biology drawings and processes",
          "One-mark questions and long questions",
        ],
      },
      {
        title: "Class 11–12",
        points: [
          "Physics, chemistry or biology — whichever batch is running",
          "The outline of a derivation",
          "Make the lab manual's language simpler",
          "Practice in the board pattern",
          "Physics and chemistry questions in steps: formula, values, unit, then the answer",
          "Physics that matters: motion, force, work and energy, electricity and light — formula first, then the number",
          "Chemistry that matters: the mole, chemical bonding and carbon compounds — write a balanced equation",
          "A mathematics formula is used again inside a physics or chemistry question",
        ],
      },
    ],
  },
  sst: {
    name: "Social Science",
    focus: "History, geography and civic life through maps and causes, not only a story.",
    bands: [
      {
        title: "Class 1–5",
        points: [
          "Family, neighbourhood and festivals",
          "Direction and a first map",
          "Rules and living together",
          "Short answers in your own words",
        ],
      },
      {
        title: "Class 6–8",
        points: [
          "A timeline for history",
          "Geography: climate, resources, maps",
          "Rights and duties in civics",
          "Dates and names in a separate copy",
        ],
      },
      {
        title: "Class 9–10",
        points: [
          "Cause and effect in a chapter",
          "Separate practice for map work",
          "Source-based questions",
          "The shape of a three-mark and a five-mark answer",
        ],
      },
      {
        title: "Class 11–12",
        points: [
          "History, geography or political science — ask which batch is open",
          "Introduction and conclusion in a long answer",
          "A short but sure list of dates",
          "Writing practice from past papers",
        ],
      },
    ],
  },
};
