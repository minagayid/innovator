#!/usr/bin/env python3
"""Reproducible, idealized feasibility calculations for the invention design dossier.

These are accounting checks, not performance predictions or reactor/vehicle design tools.
All constants and planning values are stated in the final report.
"""
from math import sqrt
from pathlib import Path

# Exact or source-listed constants used for transparent accounting.
c = 299_792_458.0  # m/s, defined exact SI value
co2_molar_mass = 44.0095e-3  # kg/mol, NIST WebBook
carbon_molar_mass = 12.0107e-3  # kg/mol, NIST WebBook
oxygen_molar_mass = 31.9988e-3  # kg/mol, NIST WebBook
# Derived approximate standard Gibbs energy needed to reverse CO2 formation at 298 K.
# Used only as an ideal lower thermodynamic bound.
delta_g_co2_split = 394.37e3  # J/mol

# Planning basis for the terrestrial concept; explicitly a design target, not a measured result.
thermal_power = 1_000e6  # W thermal
power_cycle_efficiency = 0.45
auxiliary_fraction_of_gross = 0.10
buffer_duration_h = 2.0

# CO2 throughput ledger for one tonne of captured CO2.
co2_mass = 1_000.0  # kg
co2_moles = co2_mass / co2_molar_mass
carbon_mass = co2_moles * carbon_molar_mass
o2_mass = co2_moles * oxygen_molar_mass
min_split_energy_j = co2_moles * delta_g_co2_split

# Relativistic kinetic-energy lower bound for an ideal dry payload.
payload_mass = 1e-3  # kg, 1 gram
velocities_fraction_c = [0.10, 0.20, 0.50, 0.90]

# Shallow-water pressure increment at a bounded demonstrator depth.
rho_water = 1000.0  # kg/m^3 nominal freshwater design check
g = 9.80665  # m/s^2 conventional standard gravity
depth_m = 3.0

lines = []
lines.append('# Quantitative Feasibility Checks')
lines.append('')
lines.append('## Terrestrial fusion-energy concept — proposed planning basis')
gross_electric = thermal_power * power_cycle_efficiency
auxiliary = gross_electric * auxiliary_fraction_of_gross
net_electric = gross_electric - auxiliary
thermal_buffer_j = thermal_power * buffer_duration_h * 3600
lines.append(f'- Thermal source planning point: {thermal_power/1e9:.2f} GW_th.')
lines.append(f'- Gross electric output at assumed {power_cycle_efficiency:.0%} conversion: {gross_electric/1e6:.0f} MW_e.')
lines.append(f'- Auxiliary allowance at {auxiliary_fraction_of_gross:.0%} of gross: {auxiliary/1e6:.0f} MW_e.')
lines.append(f'- Net planning output: {net_electric/1e6:.0f} MW_e.')
lines.append(f'- Two-hour full-thermal-output buffer: {thermal_buffer_j/1e12:.2f} TJ.')
lines.append('')
lines.append('## CO2 to elemental carbon + oxygen — ideal lower bound')
lines.append(f'- One metric tonne CO2: {co2_moles:,.0f} mol.')
lines.append(f'- Theoretical carbon product: {carbon_mass:.1f} kg.')
lines.append(f'- Theoretical oxygen coproduct: {o2_mass:.1f} kg.')
lines.append(f'- Ideal reversible minimum energy for CO2 -> C + O2: {min_split_energy_j/1e9:.2f} GJ = {min_split_energy_j/3.6e9:.2f} MWh per tonne CO2.')
lines.append('- Actual system energy must be higher after capture, overpotential, compression, separations, heat loss, and product finishing.')
lines.append('')
lines.append('## Directed-energy interstellar probe — kinetic-energy lower bound')
for beta in velocities_fraction_c:
    gamma = 1.0 / sqrt(1.0 - beta**2)
    energy = (gamma - 1.0) * payload_mass * c**2
    lines.append(f'- 1 g dry payload at {beta:.0%} c: gamma={gamma:.6f}; ideal kinetic energy={energy:.3e} J = {energy/3.6e9:.1f} MWh.')
lines.append('- These values exclude beam/driver losses, sail mass, shielding, trajectory correction, communications, deceleration, and energy used to create the vehicle.')
lines.append('')
lines.append('## Shallow submersion demonstrator — static pressure increment')
delta_p = rho_water * g * depth_m
lines.append(f'- At {depth_m:.1f} m freshwater depth, hydrostatic pressure increment: {delta_p/1e3:.1f} kPa.')
lines.append('- This does not determine hull thickness; buckling, fatigue, penetrations, impact, corrosion, and safety factors govern the actual pressure-hull design.')

output = Path('/home/ubuntu/interstellar_inventions/quantitative_checks.md')
output.write_text('\n'.join(lines) + '\n', encoding='utf-8')
print(output)
