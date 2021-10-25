<template>
  <div id="game-root" ref="gameRoot" @click="pause">
    <img id="player" ref="player" src="@/assets/playerShip3_blue.png" />
  </div>
  <div>
    <p>Move with left and right arrows. Press space to shoot.</p>
    <p>{{ gameState.score }}</p>
    <p>{{ accuracy }}</p>
  </div>
  <div v-if="gameState.paused || gameState.gameOver" class="overlay">
    <p class="countdown" v-if="counting">STARTING IN</p>
    <p v-if="counting" class="countdown">{{ countDown }}</p>
    <button v-if="!counting" @click="start">Start</button>
  </div>
</template>

<script lang="ts">
import { ref, watchEffect, computed } from 'vue';
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
      paused: true,
      score: 0,
      lasersFired: 0,
    });

    const countDown = ref(3);
    const counting = ref(false);
    const accuracy = computed(
      () => `${Math.round((gameState.value.score / gameState.value.lasersFired) * 100)}%`
    );
    let countInterval: number | undefined;

    const { player, gameRoot } = initGame(gameState.value);

    function pause() {
      gameState.value.paused = !gameState.value.paused;
    }

    function start() {
      countDown.value = 3;
      counting.value = true;
      countInterval = setInterval(() => {
        countDown.value--;
      }, 1000);
    }

    watchEffect(() => {
      if (countDown.value === 0) {
        counting.value = false;
        gameState.value.paused = false;
        clearInterval(countInterval);
      }
    });

    return {
      player,
      gameRoot,
      gameState,
      countDown,
      counting,
      pause,
      start,
      accuracy,
    };
  },
};
</script>

<style>
.overlay {
  position: absolute;
  background: rgba(0, 0, 0, 0.75);
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#game-root {
  width: 800px;
  height: 600px;
  background: url('~@/assets/darkPurple.png');
  animation: slide 5s linear infinite;
  position: relative;
  overflow: hidden;
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
  position: absolute;
  margin-left: -20px;
  margin-top: -18px;
  width: 40px;
  height: 40px;
}

.countdown {
  font-size: 24px;
  color: red;
}
</style>
