import { Laser, DOMRef } from '@/types';

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
