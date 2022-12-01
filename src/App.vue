<script>
import { ref, onMounted, computed, provide } from 'vue';
import { CharModel } from './models/char-model';
import { useLoadChars, useLoadScores, useAddNewScore } from './firebase';
import CharsImages from './components/CharsImages.vue';

export default {
  components: {
    CharsImages,
  },
  setup() {
    const state = ref('intro');
    const chars = ref([])
    const mouseX = ref(0);
    const mouseY = ref(0);
    const showCharPicker = ref(false);
    const hit = ref(false);
    const timer = ref(0);
    const playerName = ref(null);
    const scoreTable = ref([]);

    let timerId = null;

    const screenCoords = computed(() => {
      return {
        x: `${mouseX.value}px`,
        y: `${mouseY.value}px`
      };
    });

    const activeChars = computed(() => {
      return chars.value.filter(({found}) => !found);
    });

    const sortScores = computed(() => {
      return scoreTable.value.sort((a, b) => a.time - b.time);
    });

    function startGame() {
      state.value = 'start';
      startTimer();
    }

    async function gameOver() {
      state.value = 'gameOver';
      stopTimer();
      await useAddNewScore({name: playerName.value, time: timer.value});
      const scores = await useLoadScores();
      scoreTable.value = scores;
    }

    function resetGame() {
      timer.value = 0;
      chars.value = chars.value.map(char => ({...char, found: false}));
      state.value = 'intro';
    }

    function startTimer() {
      timerId = setInterval(() => {
        timer.value++;
      }, 1000);
    }

    function stopTimer() {
      clearInterval(timerId);
    }

    function updatePos({offsetX, offsetY}) {
      showCharPicker.value = true;
      mouseX.value = offsetX;
      mouseY.value = offsetY;
    }

    function checkChar(charName){
      const charIndex = chars.value.findIndex(({name}) => name === charName);
      if (charIndex > -1) {
        const [x, y] = chars.value[charIndex].pos;
        const check = (x > mouseX.value - 40 && x < mouseX.value + 40)
          && (y > mouseY.value - 40 && y < mouseY.value + 40)
        hit.value = check;
        if (check) {
          chars.value[charIndex].found = true;
        }
        if (!activeChars.value.length) {
          gameOver();
        }
      }
      showCharPicker.value = false;
    }
     
    onMounted(async () => {
      const charSet = await useLoadChars();
      chars.value = charSet.map(item => new CharModel(item));
    });

    provide('chars', chars);

    return {
      state,
      chars,
      showCharPicker,
      timer,
      screenCoords,
      activeChars,
      playerName,
      sortScores,
      updatePos,
      checkChar,
      startGame,
      resetGame,
    };
  },
}
</script>

<template>
  <div>
    <Transition>
      <div class="big-modal" v-if="state === 'intro'">
        <h2>Find these Capcom characters</h2>
        <CharsImages />
        <div class="modal-form">
          <label for="">Enter your name</label>
          <input type="text" v-model="playerName">
          <button @click="startGame" :disabled="!playerName">Start Game</button>
        </div>
      </div>
    </Transition>
    <Transition>
      <div class="big-modal" v-if="state === 'gameOver'">
        <h2>Game Over</h2>
        <div class="modal-form">
          <table v-if="sortScores.length">
            <thead>
              <th>Player</th>
              <th>Time</th>
            </thead>
            <tr v-for="(score, index) in sortScores" :key="index">
              <td>{{score.name}}</td>
              <td>{{score.time}}s</td>
            </tr>
          </table>
          <p v-else>Loading highscores...</p>
          <div class="modal-form">
            <button @click="resetGame">Play Again</button>
          </div>
        </div>
      </div>
    </Transition>
    <div class="header">
      <div class="timer">
      <p>{{timer}}s</p>
      </div>
      <CharsImages />
    </div>
    <div class="image-container">
      <Transition>
        <div v-if="showCharPicker">
          <div @click="showCharPicker = false" class="image-blocker"></div>
          <div class="select-char-box" :style="`top: ${screenCoords.y}; left: ${screenCoords.x}`">
            <button v-for="char in activeChars" @click="checkChar(char.name)">{{char.name}}</button>
          </div>
        </div>
      </Transition>
      <img @click="updatePos($event)" src="./assets/chars.png" />
    </div>
  </div>
</template>

<style>
  .v-enter-active,
  .v-leave-active {
    transition: all 0.2s ease;
  }
  .v-enter-from {
    opacity: 0;
    translate: 0 -10px;
  }
  .v-leave-to {
    opacity: 0;
    translate: 0 10px;
  }
</style>
