<template>

  <div class="header" :style="{'background-image': `linear-gradient(to right, cornsilk, cornsilk, ${noteColor})`}">

    <h1 class="mb-0">
        <span class="hidden md:inline">&#x1F4C3;</span>
        <a href="/" @click.prevent="goHome" class="brand">notepad.mx</a>
        <template v-if="documentIdShort">
            <span class="mx-2">&ndash;</span>#{{ documentIdShort }}
        </template>
    </h1>

    <h3 class="hidden md:block flex-grow text-center mb-0">A free cloud-based online notepad</h3>

    <div class="hidden md:block">
      <iframe src="https://ghbtns.com/github-btn.html?user=Athlon1600&repo=notepad&type=fork&count=true&size=large"
              frameborder="0" scrolling="0" width="150" height="35" title="GitHub"></iframe>
    </div>

  </div>

  <div class="mx-auto flex flex-col flex-grow" style="max-width: 1024px;">

    <div v-if="error" style="height: 50vh; display:flex; justify-content: center; align-items: center; ">
      <h1>{{ error }}</h1>
    </div>

    <editor v-if="state.authKey"></editor>
    <Home v-else></Home>

  </div>

</template>

<script>
import Editor from "./Editor.vue";
import Home from "./Home.vue";

import store from "../store";

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
    }
  },
  computed: {
    error() {
      return store.state.error
    },
    noteColor(){
        if (store.state.authKey) {
            const hex = store.state.authKey.substr(0, 8);
            return '#' + hex;
        }

        return 'cornsilk';
    },
    documentIdShort() {

      if (store.state.authKey) {
        return store.state.authKey.substr(0, 8);
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
