/**
 * Returns the provided value if it does not exceed min or max value.
 * If below min value returns min. If above max value returns max
 * @param val - Current value
 * @param min - Minimum value
 * @param max - Maximum value
 * @return {number} - Value that does not exceed min or max values
 */
export function clamp(val: number, min: number, max: number): number {
  if (val < min) return min;
  if (val > max) return max;
  return val;
}
