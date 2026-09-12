# Model Specification: MEL-SHIELD illustrative areal-mass accounting

## Target and decision

For a declared coupon area and layer stack, does the model compute areal mass and total mass consistently? A pass verifies accounting only. It says nothing about radiation attenuation.

## Variables and units

For each layer (i), thickness (t_i) is in metres and density \(\rho_i\) in kilograms per cubic metre. The areal mass is

\[
m_A=\sum_i t_i\rho_i \quad [\mathrm{kg/m^2}],
\qquad M=A m_A \quad [\mathrm{kg}].
\]

The model reports a thickness sensitivity at 0.5x, 1x and 2x. These are mathematical perturbations, not design recommendations.

## Stack

The placeholder stack contains outer skin, melanin composite, hydrogen-rich layer and optional neutron-management layer. No attenuation coefficient is assigned.

## Controls and pass conditions

- all thicknesses and densities must be non-negative;
- areal mass must be the sum of layer contributions;
- doubling every thickness must double areal mass;
- a zero-area coupon must have zero total mass;
- the model must not emit a shielding-performance claim.

## Proof gap

Attenuation, buildup, secondary radiation, dose equivalent, thermal response, mechanical integrity, moisture and aging require calibrated measurements or a validated radiation-transport model with declared spectrum and geometry.

