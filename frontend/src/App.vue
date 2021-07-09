<template>

  <div class="header flex" style="background-color: cornsilk; border-bottom: 1px solid darkgrey; align-items: center;">

    <h1 style="margin:0;  padding: 0.5em 1em;">
      &#x1F4C3; <a href="/" @click.prevent="goHome" class="brand">notepad.mx</a>

      <span v-if="documentIdShort">
        <span style="padding: 0 0.3em;">&ndash;</span>#{{ documentIdShort }}
      </span>
    </h1>

    <div style="flex-grow: 1; margin-right: 1em; text-align: center;">

      <div>
        <h3 class="text-center">A free cloud-based online notepad</h3>
      </div>

    </div>

    <div>
      <iframe src="https://ghbtns.com/github-btn.html?user=Athlon1600&repo=notepad&type=fork&count=true&size=large"
              frameborder="0" scrolling="0" width="150" height="35" title="GitHub"></iframe>
    </div>

  </div>

  <div class="container flex flex-col flex-grow">

    <div v-if="error" style="height: 50vh; display:flex; justify-content: center; align-items: center; ">
      <h1>{{ error }}</h1>
    </div>

    <Home v-if="!editor"></Home>
    <editor v-if="editor"></editor>

  </div>

</template>

<script>
import Editor from "./Editor";
import Home from "./Home";

import store from "./store";
import {watch} from "vue";

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
  },
  mounted() {

    watch(() => store.getters.key, (newValue) => {

      // we must be in EDIT mode!
      this.editor = !!newValue;

    }, {
      immediate: true
    });

  }
}
</script>
