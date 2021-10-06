import { Laser, DOMRef, Game } from '@/types';
import { random, setPosition } from '@/utils/generalHelpers';
import * as C from '@/constants';

/**
 * Adds laser to the DOM
 * @param $container
 */
export function createLaser($container: HTMLElement, enemy = false): HTMLElement {
  const $laser = document.createElement('div');
  $laser.classList.add(enemy ? 'enemy-laser' : 'player-laser');
  $container.appendChild($laser);
  return $laser;
}

/**
 * Removes laser from DOM
 * @param laser
 * @param gameRoot
 */
export function destroyLaser(laser: Laser, gameRoot: DOMRef): void {
  if (gameRoot.value) {
    laser.$el.remove();
    laser.isDead = true;
  }
}

export function createEnemy(gameState: Game, $root: DOMRef, x: number, y: number): void {
  if ($root.value) {
    const $el = document.createElement('div');
    const enemy = { x, y, $el, isDead: false, cooldown: random(0, C.ENEMY_COOLDOWN) };

    // Style enemy element and add to DOM
    $el.classList.add('enemy');
    $root.value.appendChild($el);

    // Add enemy to gameState and set it's position
    gameState.enemies.push(enemy);
    setPosition(enemy.$el, x, y);
  }
}

export function createEnemies(gameState: Game, $root: DOMRef): void {
  const enemySpacing = (C.GAME_WIDTH - C.ENEMY_HORIZONTAL_PADDING * 2) / (C.ENEMIES_PER_ROW - 1);

  for (let j = 0; j < 3; j++) {
    const y = C.ENEMY_VERTICAL_PADDING + j * C.ENEMY_VERTICAL_SPACING;
    for (let i = 0; i < C.ENEMIES_PER_ROW; i++) {
      const x = i * enemySpacing + C.ENEMY_HORIZONTAL_PADDING;
      createEnemy(gameState, $root, x, y);
    }
  }
}

export function destroyEnemy(enemy: { isDead: boolean; $el: HTMLElement }): void {
  enemy.$el.remove();
  enemy.isDead = true;
}

export function rectsIntersect(r1: DOMRect, r2: DOMRect): boolean {
  return !(r2.left > r1.right || r2.right < r1.left || r2.top > r1.bottom || r2.bottom < r1.top);
}
