<template>
  <div id="game-root" ref="gameRoot">
    <div id="player" ref="player"></div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import {
  KEY_LEFT,
  KEY_RIGHT,
  KEY_SPACE,
  GAME_WIDTH,
  GAME_HEIGHT,
  MOVE_VALUE,
} from '@/constants';

export default {
  name: 'Game',
  setup() {
    const player = ref<HTMLElement | null>(null);
    const gameState = ref({ playerX: 0, playerY: 0 });

    function coordinateKeyDown(e: KeyboardEvent) {
      if (e.code === KEY_LEFT) {
        gameState.value.playerX -= MOVE_VALUE;
        setPosition(
          player.value,
          gameState.value.playerX,
          gameState.value.playerY
        );
        setPosition(
          player.value,
          gameState.value.playerX,
          gameState.value.playerY
        );
      }

      if (e.code === KEY_RIGHT) {
        gameState.value.playerX += MOVE_VALUE;
        setPosition(
          player.value,
          gameState.value.playerX,
          gameState.value.playerY
        );
      }

      if (e.code === KEY_SPACE) {
        console.log('pew pew');
      }
    }

    function setPosition($el: HTMLElement | null, x: number, y: number) {
      console.log($el);
      if ($el) {
        $el.style.transform = `translate(${x}px, ${y}px)`;
      }
    }

    onMounted(() => {
      gameState.value.playerX = GAME_WIDTH / 2;
      gameState.value.playerY = GAME_HEIGHT - 50;
      setPosition(
        player.value,
        gameState.value.playerX,
        gameState.value.playerY
      );
      window.addEventListener('keydown', coordinateKeyDown);
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
