export type EvidenceLabel = "Sourced" | "Computed" | "Inferred" | "Proposed" | "Unresolved";

export type KnowledgeBridge = {
  id: string;
  from: string;
  to: string;
  bridge: string;
  mechanism: string;
  evidence: EvidenceLabel;
  confidence: number;
  source: string;
  sourceUrl: string;
};

export type CandidateRoute = {
  id: string;
  title: string;
  summary: string;
  mechanism: string;
  tradeoff: string;
  nextTest: string;
  status: EvidenceLabel;
  fit: number;
};

export const domainOptions = [
  "Marine biology",
  "Circular chemistry",
  "Control systems",
  "Human factors",
  "Distributed manufacturing",
  "Ecology",
  "Materials science",
  "Energy systems",
];

export const studioTemplates = [
  { label: "Repairable water systems", prompt: "How might a small coastal workshop make low-cost desalination filters easier to repair?", domains: ["Marine biology", "Distributed manufacturing"] },
  { label: "Cooler homes", prompt: "How might we reduce household cooling energy without sacrificing thermal comfort?", domains: ["Ecology", "Control systems"] },
  { label: "Local material loops", prompt: "How might a neighbourhood turn difficult plastic waste into useful manufacturing feedstock?", domains: ["Circular chemistry", "Distributed manufacturing"] },
];

export const knowledgeBridges: KnowledgeBridge[] = [
  {
    id: "gill-counterflow",
    from: "Marine biology",
    to: "Process engineering",
    bridge: "Gill counterflow → lamellar contactor",
    mechanism: "Keep exchange gradients alive across many thin channels instead of asking one large chamber to do all the work.",
    evidence: "Sourced",
    confidence: 82,
    source: "Nature-inspired engineering literature",
    sourceUrl: "https://doi.org/10.1038/nature09070",
  },
  {
    id: "repair-cassettes",
    from: "Distributed manufacturing",
    to: "Maintenance design",
    bridge: "Printer constraints → replaceable cassettes",
    mechanism: "Localise the hard-to-service function in a standard module so the rest of the system stays useful during repair.",
    evidence: "Inferred",
    confidence: 74,
    source: "Design hypothesis from the target constraint",
    sourceUrl: "https://github.com/minagayid/innovator/tree/main/inventions",
  },
  {
    id: "evidence-gate",
    from: "Technology readiness",
    to: "Research governance",
    bridge: "TRL gates → reversible experiments",
    mechanism: "Tie every attractive route to one observable exit criterion and one negative control before increasing scope.",
    evidence: "Sourced",
    confidence: 91,
    source: "NASA Technology Readiness Levels",
    sourceUrl: "https://www.nasa.gov/directorates/somd/space-communications-navigation-program/technology-readiness-levels/",
  },
];

export const candidateRoutes: CandidateRoute[] = [
  {
    id: "cassette-contactor",
    title: "Cassette-loop contactor",
    summary: "A small, serviceable water-treatment cassette that borrows the geometry of gill lamellae.",
    mechanism: "Thin counterflow layers keep the gradient distributed while a dry-side cassette makes the fouling surface replaceable.",
    tradeoff: "More interfaces and seals may increase failure modes; the baseline must match pressure drop and energy.",
    nextTest: "Run a matched coupon against a monolithic contactor with the same flow, area, and energy boundary.",
    status: "Proposed",
    fit: 86,
  },
  {
    id: "community-service-loop",
    title: "Community service loop",
    summary: "A repair workflow that turns filter changes into logged local evidence instead of silent maintenance debt.",
    mechanism: "Use a simple state machine: inspect → isolate → swap → verify → publish the run record.",
    tradeoff: "The workflow is only useful if people can complete it without a network or specialist tools.",
    nextTest: "Observe five repair attempts using paper instructions and record time-to-recovery plus error modes.",
    status: "Inferred",
    fit: 78,
  },
  {
    id: "biological-analogy",
    title: "Biological analogy only",
    summary: "Keep the gill analogy as a search lens, not a claim that biological performance transfers automatically.",
    mechanism: "Search for the relational pattern—distributed exchange under constrained energy—then discard surface details.",
    tradeoff: "Analogy can widen the search while still producing a physically incoherent design.",
    nextTest: "Write a falsifiable comparison table before any prototype funding or safety language.",
    status: "Unresolved",
    fit: 63,
  },
];

export const evidenceLedger = [
  { label: "Sourced", count: 3, copy: "External work or official definition is linked.", tone: "sourced" },
  { label: "Computed", count: 0, copy: "A calculation or model output is reproducible.", tone: "computed" },
  { label: "Inferred", count: 2, copy: "A transparent bridge follows from the inputs.", tone: "inferred" },
  { label: "Proposed", count: 4, copy: "A candidate mechanism still needs a test.", tone: "proposed" },
  { label: "Unresolved", count: 5, copy: "The missing evidence is visible on purpose.", tone: "unresolved" },
] as const;

export const archiveImages = [
  ["11_neuroforge-neuroregenerative-research-twin.png", "NeuroForge", "research twin"],
  ["02_tidegill-carbon-cycle.png", "TIDEGILL", "carbon-cycle contactor"],
  ["08_mycoclean-contained-plastic-recovery.png", "MYCO-CLEAN", "contained recovery"],
] as const;
