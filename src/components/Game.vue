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
      spacePressed: false,
      playerCooldown: 0,
      lasers: [],
    });

    const { player, gameRoot } = usePlayer(gameState.value);

    return {
      player,
      gameRoot,
    };
  },
};
</script>

<style>
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

.player-laser {
  background-color: limegreen;
  height: 20px;
  width: 2px;
  position: absolute;
  margin-left: 9px;
}
</style>
