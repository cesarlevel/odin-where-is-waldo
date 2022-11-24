<script>
import { ref, onMounted } from 'vue';
import { useLoadChars, useGetDoc, useAddNewScore } from './firebase';

export default {
  setup() {
    const chars = ref([]);
    const doc = ref(null);

    onMounted(async () => {
      chars.value = await useLoadChars();
    });

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
      addScore
    };
  },
}
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
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
