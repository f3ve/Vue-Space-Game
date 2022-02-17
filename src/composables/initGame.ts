import { watchEffect, ref } from 'vue';
import { initializeEnemies, initialPlayerPosition, setPosition } from '@/utils/generalHelpers';
import { Game, DOMRef, ElOrNull } from '@/types';
import {
  hitDetection,
  moveLaser,
  movePlayer,
  shootEnemyLaser,
  shootLaser,
} from '@/utils/playerControls';
import { initializeKeyboardControls } from '@/utils/KeyboardHelpers';
import { destroyEnemy, destroyLaser, destroyPlayer, rectsIntersect } from '@/utils/DOMhelpers';
import { GAME_HEIGHT, initialState, LASER_MAX_SPEED } from '@/constants';

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
      hitDetection(gameState, laser, gameRoot);
    });
  }

  function updateEnemyLasers(deltaTime: number): void {
    const { enemyLasers: lasers } = gameState;
    lasers.forEach((laser) => {
      laser.y += deltaTime * LASER_MAX_SPEED;
      if (laser.y > GAME_HEIGHT - 40) {
        destroyLaser(laser, gameRoot);
      }

      setPosition(laser.$el, laser.x, laser.y);
      const laserPos = laser.$el.getBoundingClientRect();
      const playerPos = player.value?.getBoundingClientRect();
      if (playerPos) {
        if (rectsIntersect(laserPos, playerPos)) {
          destroyPlayer(gameState);
          destroyLaser(laser, gameRoot);
        }
      }
    });

    gameState.enemyLasers = gameState.enemyLasers.filter((laser) => !laser.isDead);
  }

  function updateEnemies(deltaTime: number) {
    const dx = Math.sin(gameState.lastTime / 1000.0) * 50;
    const dy = Math.cos(gameState.lastTime / 1000.0) * 50;

    const { enemies } = gameState;

    enemies.forEach((enemy) => {
      setPosition(enemy.$el, enemy.x + dx - 20, enemy.y + dy);
      enemy.cooldown -= deltaTime;
      if (enemy.cooldown <= 0) {
        shootEnemyLaser(gameRoot.value, gameState, enemy);
      }
    });

    gameState.enemies = gameState.enemies.filter((e) => !e.isDead);
  }

  /**
   * Handles smooth movement animation when moving player
   */
  function updateGame() {
    if (gameState.won) {
      // initializeEnemies(gameState, gameRoot);
      // gameState.won = false;
    }

    if (gameState.gameOver) {
      gameState.enemies.forEach((enemy) => {
        destroyEnemy(enemy);
      });
      gameState.lasers.forEach((laser) => {
        destroyLaser(laser, gameRoot);
      });
      gameState.enemyLasers.forEach((laser) => {
        destroyLaser(laser, gameRoot);
      });
      resetGame(gameState);
      return;
    }

    function resetGame(gameState: Game) {
      gameState.lastTime = initialState.lastTime();
      gameState.playerX = initialState.playerX;
      gameState.playerY = initialState.playerY;
      gameState.playerCooldown = initialState.playerCooldown;
      gameState.leftPressed = initialState.leftPressed;
      gameState.spacePressed = initialState.spacePressed;
      gameState.gameOver = initialState.gameOver;
      gameState.won = initialState.won;
      gameState.lasers = initialState.lasers;
      gameState.enemies = initialState.enemies;
      gameState.enemyLasers = initialState.enemyLasers;
      gameState.paused = initialState.paused;
      gameState.score = initialState.score;
      gameState.lasersFired = initialState.lasersFired;
      gameState.start = initialState.start;
    }

    if (!gameState.paused && !gameState.gameOver) {
      const currentTime = Date.now();
      const deltaTime = (currentTime - gameState.lastTime) / 1000.0;
      updatePlayer(deltaTime);
      updateLasers(deltaTime);
      updateEnemies(deltaTime);
      updateEnemyLasers(deltaTime);
      gameState.lastTime = currentTime;
    }
    window.requestAnimationFrame(updateGame);
  }

  watchEffect(() => {
    if (!gameState.paused && !gameState.gameOver) {
      window.requestAnimationFrame(updateGame);

      if (gameState.start) {
        initialPlayerPosition({ player, gameState });
        initializeKeyboardControls(gameState);
        initializeEnemies(gameState, gameRoot);
        gameState.lastTime = initialState.lastTime();
        gameState.start = false;
      }
    }
  });

  return {
    player,
    gameRoot,
  };
}
