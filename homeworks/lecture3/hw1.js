/**
 * 🔴 Perception Phase — Do NOT use AI to generate code.
 * Algorithmic thinking can only be built through personal struggle.
 *
 * REQUIREMENT: Submit TWO distinct solutions:
 *   - Solution 1 (brute force): nested loops over coin counts. Will be slow but obviously correct.
 *   - Solution 2 (optimized): use math (e.g., reduce one variable using the constraints
 *     `a + b + c + d = 48` and `a + 5b + 25c + 50d = 100`) so you only loop over fewer variables.
 *
 * The point of writing both is to FEEL the difference between "any working code" and "good code".
 *
 * Submit `learning-log.md`:
 *   1. Brute force: how many iterations does it run? (count them or calculate)
 *   2. Optimized: how did the math reduce the search space?
 *   3. Where did you get stuck? (infinite loop? wrong count? missing cases?)
 *   4. Which is more efficient? By what factor?
 */

/**
 * there are unlimited numbers of 1c, 5c, 25c, 50c
 * pick 48 coins to have 1 dollar (= 100 cents)
 * print out 2 solutions
 */
function pickCoinsBrute() {
    // Solution 1: nested loops. Iterate over all (a, b, c, d) such that a+b+c+d = 48
    //             and check whether a + 5b + 25c + 50d == 100.
    // implement here
}

function pickCoinsOptimized() {
    // Solution 2: reduce a variable with math.
    // Hint: from a+b+c+d=48, we can express d = 48 - a - b - c.
    //       Substitute into the cents equation and only iterate over (a, b, c).
    // implement here
}
