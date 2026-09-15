# Re-audit — NEREID common safety capsule

**Disposition:** Continue as separate, uncrewed kit research. This package is
not a certified road, powered-lift, vessel, or pressure-hull design.

## Findings

- Interchangeable kits do not resolve common capsule mass, center-of-gravity,
  structural, or load-path conflicts. Weigh each kit/configuration and compare
  it with purpose-built and detachable-capsule baselines before asserting
  platform feasibility.
- The illustrative hover screen gives nominal thrust/weight about 1.36;
  losing one of eight equal lift units lowers it to about 1.19, below the
  selected 1.30 threshold. Treat that as a failed single-unit-loss screen. Do
  not describe a safe rotor-out recovery.
- The mode supervisor conflated pre-entry denial with an in-mode failure. Its
  revised abstract state model separates entry checks from active-mode fault
  reporting. A returned recovery-required state is not a recovery action and
  does not demonstrate ascent, landing, flotation, or safe egress.
- Fixed displacement and quadratic-drag assumptions are screening proxies;
  they cannot establish dynamic stability, leak response, or pressure-boundary
  integrity. Keep basin checks uncrewed.

## Next decisive tests

First run a weighed configuration/CoG/load-path budget per kit and single-fault
injection on the interface rig. Any later powered-lift work needs an
independent certification path and fault response evaluated in hardware in the
loop; no test here authorizes flight. A vessel claim requires measured
stability response rather than static buoyancy alone.

## Sources

- FAA powered-lift certification guidance:
  https://www.faa.gov/regulations_policies/advisory_circulars/index.cfm/go/document.information/documentID/1044836
- U.S. Coast Guard simplified stability methods:
  https://www.dco.uscg.mil/Our-Organization/Assistant-Commandant-for-Prevention-Policy-CG-5P/Office-of-Design-and-Engineering-Standards-CG-ENG/Naval-Architecture-Division-ENG-2/Simplified-Stability/
