import { Laser, DOMRef, Game } from '@/types';
import { setPosition } from '@/utils/generalHelpers';
import * as C from '@/constants';

/**
 * Adds laser to the DOM
 * @param $container
 */
export function createLaser($container: HTMLElement): HTMLElement {
  const $laser = document.createElement('div');
  $laser.classList.add('player-laser');
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
    $el.classList.add('enemy');
    $root.value.appendChild($el);
    const enemy = { x, y, $el };
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
