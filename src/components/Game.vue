<template>
  <div id="game-root" ref="gameRoot" @click="pause">
    <img id="player" ref="player" src="@/assets/playerShip3_blue.png" />
  </div>
  <div>
    <p>Move with left and right arrows. Press space to shoot.</p>
    <p>{{ gameState.score }}</p>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import initGame from '@/composables/initGame';

export default {
  name: 'Game',
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setup() {
    const gameState = ref({
      lastTime: Date.now(),
      playerX: 0,
      playerY: 0,
      playerCooldown: 0,
      leftPressed: false,
      rightPressed: false,
      spacePressed: false,
      gameOver: false,
      won: false,
      lasers: [],
      enemies: [],
      enemyLasers: [],
      paused: false,
      score: 0,
    });

    const { player, gameRoot } = initGame(gameState.value);

    function pause() {
      gameState.value.paused = !gameState.value.paused;
    }

    return {
      player,
      gameRoot,
      gameState,
      pause,
    };
  },
};
</script>

<style>
#game-root {
  width: 800px;
  height: 600px;
  background: url('~@/assets/darkPurple.png');
  /* background: repeat; */
  animation: slide 5s linear infinite;
}

@keyframes slide {
  from {
    background-position-y: 0px;
  }

  to {
    background-position-y: 246px;
  }
}

#player {
  height: 20px;
  width: 20px;
  /* background-color: blue; */
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
  /* background-color: red; */
  position: absolute;
  margin-left: -20px;
  margin-top: -18px;
  width: 40px;
  height: 40px;
}
</style>
