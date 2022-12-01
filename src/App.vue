<script>
import { ref, onMounted, computed } from 'vue';
import { CharModel } from './models/char-model';
import { useLoadChars, useGetDoc, useAddNewScore } from './firebase';

export default {
  setup() {
    const state = ref('start');
    const chars = ref({})
    const doc = ref(null);
    const mouseX = ref(0);
    const mouseY = ref(0);
    const showCharPicker = ref(false);
    const hit = ref(false);
    const timer = ref(0);

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

    const getCharImageUrl = name => {
      return new URL(`./assets/${name}.png`, import.meta.url).href
    }

    onMounted(async () => {
      const set = await useLoadChars();
      chars.value = set.map(item => new CharModel(item));
    });

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
      }
      showCharPicker.value = false;
    }

    function startTimer() {
      timerId = setInterval(() => {
        timer.value++;
      }, 1000);
    }

    function stopTimer() {
      clearInterval(timerId);
    }

    async function getDocument() {
      doc.value = await useGetDoc();
    }

    async function addScore() {
      await useAddNewScore();
    }

    return {
      chars,
      doc,
      getDocument,
      addScore,
      updatePos,
      showCharPicker,
      checkChar,
      startTimer,
      stopTimer,
      hit,
      timer,
      screenCoords,
      activeChars,
      getCharImageUrl,
    };
  },
}
</script>

<template>
  <div>
    <ul class="chars-thumbnails">
      <li v-for="(char, index) in chars">
        <img :class="{'is-found': char.found}" :src="getCharImageUrl(char.name)" :key="index" />
      </li>
    </ul>
    <div class="image-container">
      <Transition>
        <div v-if="showCharPicker">
          <div @click="showCharPicker = false" class="image-blocker"></div>
          <div class="box" :style="`top: ${screenCoords.y}; left: ${screenCoords.x}`">
            <button v-for="char in activeChars" @click="checkChar(char.name)">{{char.name}}</button>
          </div>
        </div>
      </Transition>
      <img @click="updatePos($event)" src="./assets/chars.png" />
    </div>
    <button @click="getDocument">Get Doc</button>
    <button @click="addScore">Add score</button>
    <button @click="startTimer">Start Time</button>
    <button @click="stopTimer">Stop Time</button>
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
