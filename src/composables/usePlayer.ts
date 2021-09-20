import { onBeforeUnmount, onMounted, Ref, ref, UnwrapRef } from 'vue';
import {
  GAME_HEIGHT,
  GAME_WIDTH,
  KEY_LEFT,
  KEY_RIGHT,
  KEY_SPACE,
  LASER_COOLDOWN,
  LASER_MAX_SPEED,
  PLAYER_MAX_SPEED,
  PLAYER_WIDTH,
} from '@/constants';
import { clamp } from '@/utils/generalHelpers';
import { GameState } from '@/types';

export default function usePlayer(gameState: UnwrapRef<GameState>): {
  player: Ref<HTMLElement | null>;
  gameRoot: Ref<HTMLElement | null>;
} {
  const gameRoot = ref<HTMLElement | null>(null);
  const player = ref<HTMLElement | null>(null);

  function coordinateKeyDown(e: KeyboardEvent) {
    if (e.code === KEY_LEFT) {
      gameState.leftPressed = true;
      return;
    }

    if (e.code === KEY_RIGHT) {
      gameState.rightPressed = true;
    }

    if (e.code === KEY_SPACE) {
      gameState.spacePressed = true;
    }
  }

  function coordinateKeyUp(e: KeyboardEvent) {
    if (e.code === KEY_LEFT) {
      gameState.leftPressed = false;
      return;
    }

    if (e.code === KEY_RIGHT) {
      gameState.rightPressed = false;
    }

    if (e.code === KEY_SPACE) {
      gameState.spacePressed = false;
    }
  }

  function setPosition($el: HTMLElement | null, x: number, y: number) {
    if ($el) {
      $el.style.transform = `translate(${x}px, ${y}px)`;
    }
  }

  function initialPosition() {
    gameState.playerX = GAME_WIDTH / 2;
    gameState.playerY = GAME_HEIGHT - 50;
    setPosition(player.value, gameState.playerX, gameState.playerY);
  }

  function updatePlayer(deltaTime: number) {
    if (gameState.leftPressed) {
      gameState.playerX -= deltaTime * PLAYER_MAX_SPEED;
    }

    if (gameState.rightPressed) {
      gameState.playerX += deltaTime * PLAYER_MAX_SPEED;
    }

    // Prevent moving out of bounds
    gameState.playerX = clamp(gameState.playerX, 0, GAME_WIDTH - PLAYER_WIDTH);

    if (gameState.spacePressed && gameState.playerCooldown <= 0) {
      shootLaser(gameRoot.value, gameState.playerX, gameState.playerY);
      gameState.playerCooldown = LASER_COOLDOWN;
    }

    if (gameState.playerCooldown > 0) {
      gameState.playerCooldown -= deltaTime;
    }

    setPosition(player.value, gameState.playerX, gameState.playerY);
  }

  /**
   * Handles smooth movement animation when moving player
   */
  function update() {
    const currentTime = Date.now();
    const deltaTime = (currentTime - gameState.lastTime) / 1000.0;

    updatePlayer(deltaTime);
    updateLasers(deltaTime);

    gameState.lastTime = currentTime;
    window.requestAnimationFrame(update);
  }

  function shootLaser($container: HTMLElement | null, x: number, y: number) {
    if ($container) {
      const $laser = document.createElement('div');
      $laser.classList.add('player-laser');
      $container.appendChild($laser);
      const laser = { x, y, $el: $laser, isDead: false };
      gameState.lasers.push(laser);
      setPosition($laser, x, y);
    }
  }

  function updateLasers(deltaTime: number) {
    const lasers = gameState.lasers;
    lasers.forEach((laser) => {
      laser.y -= deltaTime * LASER_MAX_SPEED;
      if (laser.y < 0) {
        destroyLaser(laser);
      }
      setPosition(laser.$el, laser.x, laser.y);
    });
  }

  function destroyLaser(laser: {
    x: number;
    y: number;
    $el: HTMLElement;
    isDead: boolean;
  }) {
    if (gameRoot.value) {
      laser.$el.remove();
      laser.isDead = true;
    }
  }

  onMounted(() => {
    initialPosition();
    window.addEventListener('keydown', coordinateKeyDown);
    window.addEventListener('keyup', coordinateKeyUp);
    window.requestAnimationFrame(update);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', coordinateKeyDown);
    window.addEventListener('keyup', coordinateKeyUp);
  });

  return {
    player,
    gameRoot,
  };
}
