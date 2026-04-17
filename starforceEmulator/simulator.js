// Pure star-force simulation + statistics. No DOM access.
// Exposes `window.StarForceSim` consumed by app.js.
(function () {
  const MAX_ATTEMPTS = 500000;

  function calculateStats(data) {
    const n = data.length;
    if (n === 0) {
      return { mean: 0, median: 0, stdev: 0, min: 0, max: 0, p75: 0, p85: 0, p95: 0 };
    }
    // Copy before sorting so callers don't see their array mutated.
    const sorted = [...data].sort((a, b) => a - b);
    const sum = sorted.reduce((a, b) => a + b, 0);
    const mean = sum / n;
    const mid = Math.floor(n / 2);
    const median = n % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    const variance = sorted.reduce((a, b) => a + (b - mean) ** 2, 0) / n;
    const stdev = Math.sqrt(variance);
    return {
      mean,
      median,
      stdev,
      min: sorted[0],
      max: sorted[n - 1],
      p75: sorted[Math.floor(n * 0.75)],
      p85: sorted[Math.floor(n * 0.85)],
      p95: sorted[Math.floor(n * 0.95)],
    };
  }

  // options: { useSafeguard, is30off, is5_10_15, isDestroyProtect, sundayDiscount,
  //            vipRating (string), equipmentCost }
  // starForceData: array of { success, maintain, downgrade, destroy, cost } indexed by current stars.
  function simulateOneItem(startStars, targetStars, options, starForceData) {
    let currentStars = startStars;
    let totalCost = 0;
    let totalBooms = 0;
    let attempts = 0;

    while (currentStars < targetStars && attempts < MAX_ATTEMPTS) {
      attempts++;
      const prob = { ...starForceData[currentStars] };
      const baseCost = prob.cost;

      // 5/10/15 event guarantees success at those stars — no destroy risk,
      // so safeguard is redundant and should NOT be charged.
      const isAutoSuccess =
        options.is5_10_15 && (currentStars === 5 || currentStars === 10 || currentStars === 15);

      // 防爆 applies to 15→16, 16→17, 17→18 (current = 15/16/17).
      const useSafeguard =
        !isAutoSuccess &&
        options.useSafeguard &&
        currentStars >= 15 &&
        currentStars <= 17;

      // Multiplicative discount stack on the base cost.
      // VIP applies only to the 1-17 star attempts (current = 0..16).
      let discountedBase = baseCost;
      if (currentStars <= 16) {
        const vipDiscount = parseInt(options.vipRating, 10) / 100 || 0;
        discountedBase *= 1 - vipDiscount;
      }
      if (options.sundayDiscount) discountedBase *= 0.7;
      if (options.is30off) discountedBase *= 0.7;

      // Safeguard adds +200% of the *undiscounted* base on top of the discounted base.
      const attemptCost = useSafeguard ? discountedBase + baseCost * 2 : discountedBase;
      totalCost += attemptCost;

      if (isAutoSuccess) {
        currentStars++;
        continue;
      }

      // Safeguard zeroes destroy (converts it into maintain).
      if (useSafeguard) {
        prob.maintain += prob.destroy;
        prob.destroy = 0;
      }

      // Destroy-protect event (15-21 star attempts): cut destroy% by 30% of itself.
      if (options.isDestroyProtect && currentStars >= 15 && currentStars <= 21) {
        const reduction = prob.destroy * 0.3;
        prob.destroy -= reduction;
        prob.maintain += reduction;
      }

      const rand = Math.random() * 100;
      if (rand < prob.success) {
        currentStars++;
      } else if (rand < prob.success + prob.destroy) {
        totalBooms++;
        currentStars = 12;
        totalCost += options.equipmentCost || 0;
      } else if (rand < prob.success + prob.destroy + prob.downgrade) {
        currentStars--;
      }
      // else maintain — no state change.
    }

    return attempts >= MAX_ATTEMPTS ? null : { cost: totalCost, booms: totalBooms };
  }

  window.StarForceSim = { calculateStats, simulateOneItem };
})();
