<template>
  <div id="game-root" ref="gameRoot">
    <div id="player" ref="player"></div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import usePlayer from '@/composables/usePlayer.ts';

export default {
  name: 'Game',
  setup() {
    const gameState = ref({
      lastTime: Date.now(),
      playerX: 0,
      playerY: 0,
      leftPressed: false,
      rightPressed: false,
      spacePressed: true,
      playerCooldown: 0,
      lasers: [],
    });

    const { player } = usePlayer(gameState.value);

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
