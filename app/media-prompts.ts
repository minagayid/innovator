import type { StructuredDisclosure } from "./api/disclosure/input";

export type InventionMediaPrompts = {
  conceptImage: string;
  prototypeVideo: string;
  validationDiagram: string;
};

function boundedList(items: string[]): string {
  return items.slice(0, 8).join(", ") || "the proposed system components";
}

export function buildInventionMediaPrompts(disclosure: Pick<StructuredDisclosure, "title" | "problem" | "solution" | "technicalField" | "components">): InventionMediaPrompts {
  const components = boundedList(disclosure.components);
  return {
    conceptImage: `Create a technically grounded concept visualization for “${disclosure.title}” in the ${disclosure.technicalField} field. Show ${components} operating in a realistic context. Communicate the proposed mechanism—${disclosure.solution}—with a clear focal structure, useful negative space, and no invented measurements, certification marks, performance claims, or unreadable labels. This is an unvalidated research concept, not a product photograph.`,
    prototypeVideo: `Create a short invention demonstrator for “${disclosure.title}”. Start by showing the problem: ${disclosure.problem} . Then show the proposed mechanism: ${disclosure.solution} . Use one continuous, physically plausible sequence with clear cause and effect, visible system state changes, and a final view of what must be measured. Do not imply proven performance, safety, patentability, or manufacturing readiness.`,
    validationDiagram: `Draw a structured validation diagram for “${disclosure.title}”. Include the problem baseline, proposed mechanism, components (${components}), measurable inputs and outputs, assumptions, negative controls, and the first falsifiable test. Keep relationships and labels explicit. Mark unknowns as unresolved; do not present hypotheses as established results.`,
  };
}
