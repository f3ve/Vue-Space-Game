import { GameState, Laser } from '@/types';
import { Ref } from 'vue';

export function createLaser($container: HTMLElement): HTMLElement {
  const $laser = document.createElement('div');
  $laser.classList.add('player-laser');
  $container.appendChild($laser);
  return $laser;
}

export function destroyLaser(
  laser: Laser,
  gameRoot: Ref<HTMLElement | null>
): void {
  if (gameRoot.value) {
    laser.$el.remove();
    laser.isDead = true;
  }
}
