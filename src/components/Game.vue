<template>
  <div id="game-root" ref="gameRoot">
    <div id="player" ref="player"></div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import {
  KEY_LEFT,
  KEY_RIGHT,
  KEY_SPACE,
  GAME_WIDTH,
  GAME_HEIGHT,
  MOVE_VALUE,
  PLAYER_WIDTH,
} from '@/constants.ts';

export default {
  name: 'Game',
  setup() {
    const player = ref<HTMLElement | null>(null);
    const gameState = ref({
      playerX: 0,
      playerY: 0,
      leftPressed: false,
      rightPressed: false,
      spacePressed: true,
    });

    function coordinateKeyDown(e: KeyboardEvent) {
      if (e.code === KEY_LEFT) {
        gameState.value.leftPressed = true;
        return;
      }

      if (e.code === KEY_RIGHT) {
        gameState.value.rightPressed = true;
        return;
      }

      if (e.code === KEY_SPACE) {
        console.log('pew pew');
        gameState.value.spacePressed = true;
        return;
      }
    }

    function coordinateKeyUp(e: KeyboardEvent) {
      if (e.code === KEY_LEFT) {
        gameState.value.leftPressed = false;
        return;
      }

      if (e.code === KEY_RIGHT) {
        gameState.value.rightPressed = false;
        return;
      }

      if (e.code === KEY_SPACE) {
        gameState.value.spacePressed = false;
        return;
      }
    }

    function setPosition($el: HTMLElement | null, x: number, y: number) {
      if ($el) {
        $el.style.transform = `translate(${x}px, ${y}px)`;
      }
    }

    function initialPosition() {
      gameState.value.playerX = GAME_WIDTH / 2;
      gameState.value.playerY = GAME_HEIGHT - 50;
      setPosition(
        player.value,
        gameState.value.playerX,
        gameState.value.playerY
      );
    }

    // Updates player position when left or right keys are pressed
    function updatePlayer() {
      if (gameState.value.leftPressed) {
        gameState.value.playerX -= MOVE_VALUE;
      }

      if (gameState.value.rightPressed) {
        gameState.value.playerX += MOVE_VALUE;
      }

      // Prevent moving out of bounds
      gameState.value.playerX = clamp(
        gameState.value.playerX,
        0,
        GAME_WIDTH - PLAYER_WIDTH
      );

      setPosition(
        player.value,
        gameState.value.playerX,
        gameState.value.playerY
      );
    }

    /**
     * Returns the provided value if it does not exceed min or max value.
     * If below min value returns min. If above max value returns max
     * @param val - Current value
     * @param min - Minimum value
     * @param max - Maximum value
     * @return {number} - Value that does not exceed min or max values
     */
    function clamp(val: number, min: number, max: number): number {
      if (val < min) return min;
      if (val > max) return max;
      return val;
    }

    /**
     * Handles smooth movement animation when moving player
     */
    function update() {
      updatePlayer();
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
      window.removeEventListener('keyup', coordinateKeyUp);
    });

    return {
      player,
    };
  },
};
</script>

<style scoped>
#game-root {
  width: 800px;
  height: 600px;
  background-color: #efefef;
}

#player {
  height: 20px;
  width: 20px;
  background-color: blue;
}
</style>
