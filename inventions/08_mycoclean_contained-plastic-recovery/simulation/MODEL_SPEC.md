# Model Specification: MYCO-CLEAN illustrative mass balance

## Target and decision

For a declared input stream, does the accounting model conserve mass across capture, sorting, conversion, product recovery and residue routing? A pass verifies the implementation only. It does not validate a biological process.

## Variables and units

All masses are kilograms per day. For input (M), capture fraction (c), accepted-sort fraction (s), conversion fraction (x), and product-recovery fraction (r):

\[
M_{accepted}=Mcs,\qquad M_{product}=M_{accepted}xr,\\
M_{residue}=M-M_{product}.
\]

The model also reports an illustrative energy ledger (E=M_{accepted}e), where (e) is a placeholder kWh/kg accepted-feed parameter. This energy value is not a measured process intensity.

## Scenarios

The script evaluates three named scenarios with deliberately illustrative parameters: nominal, lower-recovery and upper-recovery. These scenarios are not a forecast or target specification.

## Controls and pass conditions

- all fractions must lie in ([0,1]);
- product mass must not exceed accepted input;
- product plus residue must equal input within floating-point tolerance;
- zero conversion must yield zero product;
- a zero-capture control must yield zero accepted input and zero product.

## Proof gap

The model does not include polymer chemistry, enzyme kinetics, particle fate, toxicity, pretreatment energy, wastewater, greenhouse-gas accounting, marine ecology, or regulatory compliance. The first physical test remains a closed PET benchmark with analytical product and particle measurements.

