# GlassReveal — Selective-Transparency Mobile Device

**Evidence class:** proposed consumer-electronics integration with bounded optical tests. This document is not a product release, battery-safety design, RF/SAR assessment, drop qualification, fabrication drawing, freedom-to-operate opinion, or commercial claim.

## Claim boundary

GlassReveal is **not a fully transparent phone**. Batteries, silicon, cameras, speakers, RF modules, structural spines, and thermal spreaders remain opaque at handset-relevant performance. The retained invention hypothesis is narrower: a conventional high-contrast front display and an **intentional rear reveal zone** can create a credible glass-volume aesthetic without compromising the primary display, thermal path, or serviceability.

> The visual mechanism is selective transparency: a genuinely clear glass perimeter and a user-triggered rear optical laminate disclose a designed opaque service cassette. It does not claim see-through computation or transparent energy storage.

## Proposed Rev-A architecture

| Subsystem | Proposed Rev-A configuration | Explicit non-claim |
|---|---|---|
| Front interaction surface | Conventional opaque OLED, touch stack and chemically strengthened cover glass. | No transparent primary display. |
| Rear reveal surface | Strengthened rear glass, patterned transparent electrode edge bus, normally scattering PDLC/PSLC reveal film, optical adhesive and a protected cassette view zone. | No claim that the active film is a structural element. |
| Clear perimeter | Bare or minimally coated cover-glass windows outside RF-sensitive and high-stress zones. | No claim of transparent main antenna or transparent frame. |
| Service cassette | Opaque battery, logic, camera and thermal modules arranged behind a printed/shielded visual grammar; mechanically removable after rear-glass service. | No transparent battery, SoC, camera or spreader. |
| Structural/RF/thermal spine | Conventional narrow metal/composite spine, dedicated antenna apertures, graphite/vapour-chamber class thermal hardware. | No claim that glass replaces the structural or thermal path. |

The proposed optical state is a **rear-only reveal**. In private/default mode, the laminate scatters or masks the cassette; in reveal mode, it enters its clearer state for a bounded time window. The front display remains architecturally independent. This avoids making handset readability contingent on transparent-OLED contrast, a known system-level difficulty for transparent displays [1].

## First falsifiable mechanism

Let the designated rear reveal zone occupy area fraction \(a_r\) and have clear-state transmittance \(T_r\), while the clear perimeter occupies \(a_p\) at \(T_p\). A visual-envelope proxy is:

\[
T_{\mathrm{visual}} = a_r T_r + a_p T_p.
\]

This proxy is not a whole-device transparency rating because the cassette is deliberately opaque. The mechanism passes only if the reveal zone produces a repeatable, legible component-reveal effect without unacceptable haze, colour shift, leakage in the private state, optical non-uniformity, thickness penalty, heat sensitivity, or interference with baseline phone functions.

| Case | Intended condition | Discriminating outcome |
|---|---|---|
| Baseline | Rear glass over a fixed printed cassette graphic. | Establishes static appearance, mass and baseline thermal/RF measurements. |
| Candidate | Rear PDLC/PSLC reveal laminate over a designed cassette. | Provides the target change in visual reveal while remaining within declared optical and usability bounds. |
| Negative control | Over-dense electrode / adhesive / film stack or a deliberately non-uniform optical sample. | Shows haze/non-uniformity or private-state leakage large enough to reject the stack. |

## Test article and acceptance gates

The first article is an instrumented **rear-laminate mule** on a non-radio-transmitting, mechanically safe handset-shaped carrier. It may use a representative dummy cassette rather than a live lithium-ion cell. It must not be presented as a consumer device.

| Gate | Measurement | Pass/reframe criterion |
|---|---|---|
| Optical reveal | Visible transmission, haze, colour shift, viewing-angle uniformity and subjective reveal legibility. | Candidate must beat the printed-glass baseline on intentional reveal while retaining a clearly defined private/default state. |
| Switch behaviour | Optical state change, energy per state transition / hold, temperature response and cycle drift. | If the required duty or degradation is incompatible with the intended visual feature, retain a static clear window instead. |
| Stack integration | Thickness, edge sealing, adhesion, scratch/abrasion behaviour and representative thermal soak. | If the laminate cannot survive handset-relevant integration, move the reveal module to a replaceable rear insert. |
| Functional isolation | Compare baseline versus candidate RF, thermal, camera flare and magnetic/sensor behaviour using a later integrated mule. | If degradation is material, keep the reveal patch outside affected zones or abandon active reveal. |
| Serviceability | Removal/replacement study for rear glass and cassette. | If optical failure requires destructive chassis replacement, reframe as a premium non-repairable aesthetic module, not a repair-led feature. |

## Manufacturing and qualification sequence

The credible sequence is: optical coupon; full rear cover laminate; dummy-cassette mule; non-transmitting integration mule; then only a separately qualified engineering-validation handset. Every active-layer supplier must qualify film optical uniformity, edge-bus resistance, adhesive compatibility, sealing, and lot-to-lot colour variation. The phone integrator must retain a conventional battery and radio safety process; the visual laminate must never become a safety-critical enclosure boundary.

## Proof-gap ledger

| A passing result would support | It would not establish | Next required evidence |
|---|---|---|
| A controlled rear reveal effect in a bounded optical stack. | A transparent handset, a shippable phone, RF/SAR performance, drop survival, battery safety, consumer demand or legal novelty. | Instrumented rear-cover mule with optical and thermal cycling. |
| Stable reveal behaviour on coupons. | Full-device lamination yield or repair economics. | Process-capability study and representative rear-cover rework trial. |
| No degradation in a limited integration comparison. | Regulatory or carrier compliance. | Formal device-level RF, EMC, safety and reliability programme. |

## References

[1] [Halder et al., “Dual-sided transparent display enabled by polymer stabilized liquid crystals for augmented reality,” *Nature Communications* (2024).](https://pmc.ncbi.nlm.nih.gov/articles/PMC11555209/)

[2] [Agarwal et al., “A Comprehensive Review on Polymer-Dispersed Liquid Crystals: Mechanisms, Materials, and Applications,” *ACS Materials Au* (2024).](https://pmc.ncbi.nlm.nih.gov/articles/PMC11718547/)
