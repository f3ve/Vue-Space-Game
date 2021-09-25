import * as C from '@/constants';
import { DOMRef, ElOrNull, Game, Laser } from '@/types';
import { clamp, setPosition } from '@/utils/generalHelpers';
import { createLaser, destroyLaser } from '@/utils/DOMhelpers';

type Dir = 'left' | 'right';

/**
 * Updates player's x position value
 * @param direction - What direction the player to move the player.
 * @param dt - delta time
 * @param gameState
 */
export function movePlayer(direction: Dir, dt: number, gameState: Game): void {
  direction === 'left'
    ? (gameState.playerX -= dt * C.PLAYER_MAX_SPEED)
    : (gameState.playerX += dt * C.PLAYER_MAX_SPEED);

  gameState.playerX = clamp(gameState.playerX);
}

/**
 * Creates a laser sets it's initial position
 * @param $container
 * @param gameState
 */
export function shootLaser($container: ElOrNull, gameState: Game): void {
  const { playerX: x, playerY: y } = gameState;

  if ($container) {
    const $el = createLaser($container);
    const laser = { x, y, $el, isDead: false };
    gameState.lasers.push(laser);
    setPosition($el, x, y);
    gameState.playerCooldown = C.LASER_COOLDOWN;
  }
}

/**
 * Moves lasers towards the top of the screen. If they exceed bounds of game they are deleted.
 * @param laser
 * @param dt
 * @param gameRoot
 */
export function moveLaser(laser: Laser, dt: number, gameRoot: DOMRef): void {
  laser.y -= dt * C.LASER_MAX_SPEED;
  if (laser.y < 0) destroyLaser(laser, gameRoot);
  setPosition(laser.$el, laser.x, laser.y);
}
