<template>

  <div class="header" :style="{'background-image': `linear-gradient(to right, cornsilk, cornsilk, ${noteColor})`}">

    <h1 class="mb-0">
        <span class="hidden md:inline mr-1">&#x1F4C3;</span>
        <a href="/" @click.prevent="goHome" class="brand">notepad.mx</a>
        <template v-if="documentIdShort">
            <span class="mx-2">&ndash;</span>#{{ documentIdShort }}
        </template>
    </h1>

    <div class="hidden md:block flex-grow text-center items-center mb-0" v-html="banner"></div>

    <div class="hidden md:block">
        <a href="https://github.com/Athlon1600/notepad" target="_blank" rel="nofollow noopener noreferrer">
            <svg width="32" height="32" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill="#24292f"/></svg>
        </a>
    </div>

  </div>

  <div class="mx-auto flex flex-col flex-grow" style="max-width: 1024px;">

    <div v-if="error" style="height: 50vh; display:flex; justify-content: center; align-items: center; ">
      <h1>{{ error }}</h1>
    </div>

    <Editor v-if="state.authKey"></Editor>
    <Home v-else></Home>

  </div>

</template>

<script>
import Editor from "./Editor.vue";
import Home from "./Home.vue";

import store from "../store";
import {HEADER_TEXT} from "../config";

export default {
  name: 'App',
  components: {
    Home,
    Editor
  },
  data() {
    return {
      editor: false,
      state: store.state,
        banner: HEADER_TEXT
    }
  },
  computed: {
    error() {
      return store.state.error
    },
    noteColor(){
        if (store.state.authKey) {
            const hex = (store.state.authKey || "").substring(0, 8);
            return '#' + hex;
        }

        return 'cornsilk';
    },
    documentIdShort() {

      if (store.state.authKey) {
        return (store.state.authKey || "").substring(0, 8);
      }

      return null;
    }
  },
  methods: {
    goHome() {
      store.actions.reset();
    }
  }
}
</script>
