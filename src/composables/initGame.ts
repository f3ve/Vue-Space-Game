import { onMounted, ref } from 'vue';
import { initializeEnemies, initialPlayerPosition, setPosition } from '@/utils/generalHelpers';
import { Game, DOMRef, ElOrNull } from '@/types';
import { hitDetection, moveLaser, movePlayer, shootLaser } from '@/utils/playerControls';
import { initializeKeyboardControls } from '@/utils/KeyboardHelpers';

interface usePlayerOutput {
  player: DOMRef;
  gameRoot: DOMRef;
}

/**
 * Initializes the player and handles movement of player and the player's fired lasers
 * @param gameState
 */
export default function initGame(gameState: Game): usePlayerOutput {
  const gameRoot = ref<ElOrNull>(null);
  const player = ref<ElOrNull>(null);

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
    const { lasers, enemies } = gameState;

    lasers.forEach((laser) => {
      moveLaser(laser, deltaTime, gameRoot);
      hitDetection(enemies, laser, gameRoot);
    });
  }

  function updateEnemies(dt: number) {
    const dx = Math.sin(gameState.lastTime / 1000.0) * 50;
    const dy = Math.cos(gameState.lastTime / 1000.0) * 50;

    const { enemies } = gameState;

    enemies.forEach((enemy) => {
      const x = enemy.x + dx;
      const y = enemy.y + dy;
      setPosition(enemy.$el, x, y);
    });

    gameState.enemies = gameState.enemies.filter((e) => !e.isDead);
  }

  /**
   * Handles smooth movement animation when moving player
   */
  function updateGame() {
    const currentTime = Date.now();
    const deltaTime = (currentTime - gameState.lastTime) / 1000.0;

    updatePlayer(deltaTime);
    updateLasers(deltaTime);
    updateEnemies(deltaTime);

    gameState.lastTime = currentTime;
    window.requestAnimationFrame(updateGame);
  }

  onMounted(() => {
    initialPlayerPosition({ player, gameState });
    initializeKeyboardControls(gameState);
    initializeEnemies(gameState, gameRoot);
    window.requestAnimationFrame(updateGame);
  });

  return {
    player,
    gameRoot,
  };
}
