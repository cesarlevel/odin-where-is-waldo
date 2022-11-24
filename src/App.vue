<script>
import { ref, onMounted } from 'vue';
import { useLoadChars, useGetDoc, useAddNewScore } from './firebase';

export default {
  setup() {
    const state = ref('start');
    const chars = ref([]);
    const doc = ref(null);
    const mouseX = ref(0);
    const mouseY = ref(0);
    const showCharPicker = ref(false);
    const hit = ref(false);

    onMounted(async () => {
      chars.value = await useLoadChars();
    });

    function updatePos(e) {
      showCharPicker.value = true;
      const {offsetX, offsetY} = e;
      const [x, y] = chars.value[0].mario
      mouseX.value = `${offsetX}px`;
      mouseY.value = `${offsetY}px`;
    }

    function checkChar(char){
      if (chars.value[0]?.[char]) {
        const [x, y] = chars.value[0][char];
        const mX = +mouseX.value.replace('px', '');
        const mY = +mouseY.value.replace('px', '');
        const check = (x > mX - 40 && x < mX + 40) && (y > mY - 40 && y < mY + 40)
        console.log(check);
        hit.value = check;
      }
      showCharPicker.value = false;
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
      mouseX,
      mouseY,
      showCharPicker,
      checkChar,
      hit,
    };
  },
}
</script>

<template>
  <div>
    <p>{{hit}}</p>
    <div class="image-container">
      <template v-if="showCharPicker">
        <div @click="showCharPicker = false" class="image-blocker"></div>
        <div class="box" :style="`top: ${mouseY}; left: ${mouseX}`">
          <button @click="checkChar('mario')">Mario</button>
        </div>
      </template>
      <img @click="updatePos($event)" src="./assets/chars.png" />
    </div>
    <p v-if="!chars.length">Loading</p>
    <p v-else>{{chars}}</p>
    <button @click="getDocument">Get Doc</button>
    <button @click="addScore">Add score</button>

    <p v-if="doc">{{doc}}</p>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
