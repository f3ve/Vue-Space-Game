import { GAME_WIDTH, PLAYER_WIDTH } from '@/constants';
import * as C from '@/constants';
import { GameState } from '@/types';
import { Ref } from 'vue';
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
  max = GAME_WIDTH - PLAYER_WIDTH
): number {
  if (val < min) return min;
  if (val > max) return max;
  return val;
}

export function setPosition(
  $el: HTMLElement | null,
  x: number,
  y: number
): void {
  if ($el) {
    $el.style.transform = `translate(${x}px, ${y}px)`;
  }
}

export function initialPlayerPosition(
  player: Ref<HTMLElement | null>,
  gameState: GameState
): void {
  gameState.playerX = C.GAME_WIDTH / 2;
  gameState.playerY = C.GAME_HEIGHT - 50;
  setPosition(player.value, gameState.playerX, gameState.playerY);
}
