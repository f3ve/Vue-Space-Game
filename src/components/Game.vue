<template>
  <div id="game-root" ref="gameRoot">
    <div id="player" ref="player" />
  </div>
  <div>
    <p>Move with left and right arrows. Press space to shoot.</p>
  </div>
</template>

<script lang="ts">
import { ref, computed, watchEffect } from 'vue';
import initGame from '@/composables/initGame';

export default {
  name: 'Game',
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setup() {
    const gameState = ref({
      lastTime: Date.now(),
      playerX: 0,
      playerY: 0,
      leftPressed: false,
      rightPressed: false,
      playerCooldown: 0,
      lasers: [],
      spacePressed: false,
      enemies: [],
      enemyLasers: [],
      gameOver: false,
      won: false,
    });

    const { player, gameRoot } = initGame(gameState.value);

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

.enemy-laser {
  background-color: red;
  height: 20px;
  width: 2px;
  position: absolute;
  margin-left: 9px;
}

.enemy {
  background-color: red;
  position: absolute;
  margin-left: -20px;
  margin-top: -18px;
  width: 40px;
  height: 40px;
}
</style>
