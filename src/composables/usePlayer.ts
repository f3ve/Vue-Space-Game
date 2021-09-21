import { onMounted, Ref, ref, UnwrapRef } from 'vue';
import { initialPlayerPosition, setPosition } from '@/utils/generalHelpers';
import { GameState } from '@/types';
import { moveLaser, movePlayer, shootLaser } from '@/utils/playerControls';
import { initializeKeyboardControls } from '@/utils/KeyboardHelpers';

/**
 * Initializes the player and handles movement of player and the player's fired lasers
 * @param gameState
 */
export default function usePlayer(gameState: UnwrapRef<GameState>): {
  player: Ref<HTMLElement | null>;
  gameRoot: Ref<HTMLElement | null>;
} {
  const gameRoot = ref<HTMLElement | null>(null);
  const player = ref<HTMLElement | null>(null);

  /**
   * Updates player position based on current delta time
   * @param deltaTime
   */
  function updatePlayer(deltaTime: number) {
    if (gameState.leftPressed) {
      movePlayer('left', deltaTime, gameState);
    }

    if (gameState.rightPressed) {
      movePlayer('right', deltaTime, gameState);
    }

    if (gameState.spacePressed && gameState.playerCooldown <= 0) {
      shootLaser(gameRoot.value, gameState);
    }

    if (gameState.playerCooldown > 0) {
      gameState.playerCooldown -= deltaTime;
    }

    setPosition(player.value, gameState.playerX, gameState.playerY);
  }

  /**
   * Updates lasers position based on current delta time
   * @param deltaTime
   */
  function updateLasers(deltaTime: number) {
    const lasers = gameState.lasers;
    lasers.forEach((laser) => {
      moveLaser(laser, deltaTime, gameRoot);
    });
  }

  /**
   * Handles smooth movement animation when moving player
   */
  function updateGame() {
    const currentTime = Date.now();
    const deltaTime = (currentTime - gameState.lastTime) / 1000.0;

    updatePlayer(deltaTime);
    updateLasers(deltaTime);

    gameState.lastTime = currentTime;
    window.requestAnimationFrame(updateGame);
  }

  onMounted(() => {
    initialPlayerPosition(player, gameState);
    initializeKeyboardControls(gameState);
    window.requestAnimationFrame(updateGame);
  });

  return {
    player,
    gameRoot,
  };
}
