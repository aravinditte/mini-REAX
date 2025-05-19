pragma circom 2.0.0;
include "circomlib/circuits/comparators.circom";

template CollateralThreshold() {
    signal input collateral;   // Private input: user's collateral amount
    signal input threshold;    // Public input: minimum threshold
    signal output isAbove;     // Output: 1 if collateral >= threshold

    // Compute collateral + 1 (to use with LessThan)
    signal collateral_plus_one;
    collateral_plus_one <== collateral + 1;

    // Compare: is threshold < (collateral + 1)?
    component isLess = LessThan(32);
    isLess.in[0] <== threshold;
    isLess.in[1] <== collateral_plus_one;
    isAbove <== isLess.out;    // isAbove == 1 iff collateral >= threshold

    // Enforce the proof only if collateral >= threshold
    isAbove === 1;
}

component main = CollateralThreshold();
