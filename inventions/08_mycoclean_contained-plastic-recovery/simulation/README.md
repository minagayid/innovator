# MYCO-CLEAN finite accounting model

This model is an **illustrative architecture screen**. It propagates declared input mass, capture, sorting, conversion and product-recovery fractions. It does not estimate biological kinetics, ecological impact, energy efficiency, toxicity, or deployment readiness.

Run:

```bash
python3 test_model.py
python3 model.py
```

The output JSON is an illustrative stream allocation from placeholder fractions,
not an independent mass-closure calculation. The model exposes uncaptured,
sorting-reject, unconverted, product-loss, and recovered-product streams. It
cannot establish real closure until those streams are independently measured
and versioned. The output file retains its legacy `mass_balance` filename; the
JSON model label and accounting basis identify its actual scope.

