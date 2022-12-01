<script setup>
import { inject } from 'vue'

const chars = inject('chars');

const getCharImageUrl = name => {
    return new URL(`../assets/${name}.png`, import.meta.url).href;
}
</script>

<template>
      <ul class="chars-thumbnails">
        <li v-for="(char, index) in chars">
            <img :class="{'is-found': char.found}" :src="getCharImageUrl(char.name)" :key="index" />
        </li>
      </ul>
</template>

