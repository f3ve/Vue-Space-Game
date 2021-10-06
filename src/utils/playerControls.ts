import * as C from '@/constants';
import { DOMRef, ElOrNull, Game, GameState, Laser } from '@/types';
import { clamp, setPosition } from '@/utils/generalHelpers';
import { createLaser, destroyLaser, destroyEnemy, rectsIntersect } from '@/utils/DOMhelpers';

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

export function shootEnemyLaser(
  $container: ElOrNull,
  gameState: Game,
  enemy: GameState['enemies'][0]
): void {
  const { x, y } = enemy;

  if ($container) {
    const $el = createLaser($container, true);
    const laser = { x, y, $el, isDead: false };
    gameState.enemyLasers.push(laser);
    setPosition($el, x, y);
    enemy.cooldown = C.ENEMY_COOLDOWN;
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

export function hitDetection(enemies: GameState['enemies'], laser: Laser, gameRoot: DOMRef): void {
  const r1 = laser.$el.getBoundingClientRect();
  for (let j = 0; j < enemies.length; j++) {
    const enemy = enemies[j];
    if (enemy.isDead) continue;
    const r2 = enemy.$el.getBoundingClientRect();
    if (rectsIntersect(r1, r2)) {
      console.log('yay');
      // Enemy was hit
      destroyEnemy(enemy);
      destroyLaser(laser, gameRoot);
      break;
    }
  }
}
