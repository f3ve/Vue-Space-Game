import { onBeforeUnmount, onMounted, Ref, ref } from 'vue';
import {
  GAME_HEIGHT,
  GAME_WIDTH,
  KEY_LEFT,
  KEY_RIGHT,
  KEY_SPACE,
  PLAYER_MAX_SPEED,
  PLAYER_WIDTH,
} from '@/constants';
import { clamp } from '@/utils/generalHelpers';

interface GameState {
  lastTime: number;
  playerX: number;
  playerY: number;
  leftPressed: boolean;
  rightPressed: boolean;
  spacePressed: boolean;
  playerCooldown: number;
  lasers: never[];
}

export default function usePlayer(gameState: GameState): {
  player: Ref<HTMLElement | null>;
} {
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
      console.log('pew pew');
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

    setPosition(player.value, gameState.playerX, gameState.playerY);
  }

  /**
   * Handles smooth movement animation when moving player
   */
  function update() {
    const currentTime = Date.now();
    const deltaTime = (currentTime - gameState.lastTime) / 1000.0;

    updatePlayer(deltaTime);

    gameState.lastTime = currentTime;
    window.requestAnimationFrame(update);
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
  };
}
