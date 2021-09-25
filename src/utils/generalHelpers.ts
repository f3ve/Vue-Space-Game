import * as C from '@/constants';
import { DOMRef, ElOrNull, GameState } from '@/types';

interface initInput {
  player: DOMRef;
  gameState: GameState;
}

/**
 * Returns the provided value if it does not exceed min or max value.
 * If below min value returns min. If above max value returns max
 * @param val - Current value
 * @param [min] - Minimum value
 * @param [max] - Maximum value
 * @return {number} - Value that does not exceed min or max values
 */
export function clamp(
  val: number,
  min = 0,
  max = C.GAME_WIDTH - C.PLAYER_WIDTH
): number {
  if (val < min) return min;
  if (val > max) return max;
  return val;
}

export function setPosition($el: ElOrNull, x: number, y: number): void {
  if ($el) {
    $el.style.transform = `translate(${x}px, ${y}px)`;
  }
}

export function initialPlayerPosition({ gameState, player }: initInput): void {
  gameState.playerX = C.GAME_WIDTH / 2;
  gameState.playerY = C.GAME_HEIGHT - 50;
  setPosition(player.value, gameState.playerX, gameState.playerY);
}
