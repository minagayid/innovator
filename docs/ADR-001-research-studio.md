# ADR-001: Make the research studio the product front door

**Status:** Accepted
**Date:** 2026-09-22
**Deciders:** Innovator product direction

## Context

The repository already contains eleven bounded invention programmes, reusable research skills, validation scripts, and a persistence-backed application shell. The current front door is a gallery-first demo: it helps people browse an invention, but it does not yet make the cross-domain reasoning that produces a candidate invention visible or inspectable.

The product needs a small, credible first loop that helps a person move from a problem to a testable research route. It must distinguish evidence from inference and proposal, keep prior-art-like results informational, and avoid implying that a generated analogy is a validated discovery.

## Decision

Make the Research Studio the default landing view. It implements four visible gates:

1. **Frame** — capture a concrete problem or tension in the user's own words.
2. **Bridge** — map a source field to a target field and show the mechanism being transferred.
3. **Challenge** — expose trade-offs, uncertainties, and red-team questions.
4. **Test** — end each candidate with one decisive next experiment and one boundary.

The first release uses deterministic, inspectable studio data and links to the repository's research archive. The existing disclosure, project persistence, gallery, workspace, and manufacturing flows remain available as the surrounding product surface.

## Options considered

### Gallery-first expansion

**Pros:** lowest implementation cost; preserves the existing demo narrative.
**Cons:** keeps the core innovation method implicit; risks presenting a catalogue of ideas without showing how they were challenged.

### Chat-first invention assistant

**Pros:** familiar interaction; easy to add provider-backed generation later.
**Cons:** hides evidence provenance and makes it hard to distinguish a fluent answer from a defensible hypothesis.

### Research Studio with visible gates — selected

**Pros:** gives the product a memorable point of view; supports deterministic demos; makes evidence, uncertainty, and next tests first-class; can later route into live search and model-assisted generation.
**Cons:** requires more opinionated UI and a stronger data contract than a chat box.

## Research grounding

- Swanson's literature-based discovery work describes how independently published fragments can be logically related without being retrieved and interpreted together. The Studio therefore stores a visible bridge rather than presenting an unexplained “insight”: [Undiscovered Public Knowledge](https://doi.org/10.1086/601720).
- Design-by-analogy research treats a source-domain solution as a way to generate target-domain candidates, not as proof that the surface details transfer. The Studio shows the mechanism and its trade-off separately: [Data-Driven Design-by-Analogy](https://arxiv.org/abs/2106.01592).
- NASA's Technology Readiness Level definitions separate speculative concepts, analytical proof-of-concept, laboratory validation, relevant-environment demonstrations, and operations. The Studio borrows the idea of explicit exit criteria without claiming that its UI is a certification system: [NASA Technology Readiness Levels](https://www.nasa.gov/directorates/somd/space-communications-navigation-program/technology-readiness-levels/).

## Consequences

- The product's primary value is now a repeatable reasoning loop, not a static idea feed.
- Candidate routes can be stored later as structured records with evidence labels, source links, objections, and test gates.
- Live literature and patent connectors remain future work; deterministic examples must never be described as a global systematic review.
- The existing InventionHub label remains in compatibility tests and historical documentation, while the user-facing product is Innovator.

## Acceptance checks

- A new visitor can identify the four gates without reading documentation.
- Every displayed bridge shows a source or explicitly labels itself as inferred/proposed/unresolved.
- Every candidate route has a mechanism, a trade-off, and a next decisive test.
- The production build, repository tests, lint, and static companion build pass.
