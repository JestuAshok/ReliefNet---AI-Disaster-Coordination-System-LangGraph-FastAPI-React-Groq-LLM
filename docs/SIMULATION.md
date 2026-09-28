# SIMULATION

The engine is deterministic with seed 42. The default scenario is SCN-FLOOD-001. It updates district risk and invokes the multi-agent pipeline, then produces priority and allocation decisions.

Key logic:

- flood severity affects impact and shelter demand
- network degradation influences communication priority
- road blockages trigger route recalculation
- resource shortages drive allocation optimization
- dynamic replanning records old plan vs new plan
