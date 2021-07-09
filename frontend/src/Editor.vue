<template>
  <div class="flex flex-col flex-grow">

    <div class="flex">

      <div class="w-50">
        <p>
          <input type="checkbox" id="checkbox" v-model="encrypt" @change="encryptCheckboxChanged"/>
          <label for="checkbox" style="margin-left: 0.5em;">Encrypted</label>
        </p>
      </div>

      <div class="w-50 text-right">

        <div v-if="publicUrl">
          <p>
            <a :href="publicUrl" target="_blank">Special Public Link</a>
          </p>
        </div>

        <div v-else>
          <p>Nothing to publish yet!</p>
        </div>

      </div>
    </div>

    <div>
      <p>All text is automatically saved as you type. If you decide to <u>encrypt</u> your text,
        this note will no longer be accessible by the special public link above. Only gibberish text will be returned.
      </p>
    </div>

    <div id="plain_text_not_ace" class="flex flex-col flex-grow">

      <textarea @keyup="textKeyUp" @keydown="textKeyDown" v-model="text"
                placeholder="Nothing written here yet! Write something!" style="resize: none"
                class="flex-grow"></textarea>

      <div class="flex" style="margin:1em 0; justify-content: space-between;">

        <div class="status-bar">
          Words: {{ wordCount }}, Characters: {{ charCount }}, Lines: {{ lineCount }}
        </div>

        <div>
          <a href="" @click.prevent="deleteForever" class="bold text-red">Delete Forever</a>
        </div>

      </div>

    </div>

  </div>
</template>

<script>
import {watch} from "vue";

import {TextUtil} from "./classes/TextUtil";
import debounce from "debounce";
import store from "./store";
import {Security} from "./classes/Security";
import api from "./api";
import {Util} from "./classes/Util";

// https://github.com/reddit-archive/reddit/blob/753b17407e9a9dca09558526805922de24133d53/r2/r2/models/link.py#L149
const TEXT_MAX_LEN = 40000;

export default {
  name: 'editor',
  data() {
    return {
      isBusy: true,
      text: '',
      encrypt: false,
      documentId: '',
      // stats
      charCount: 0,
      wordCount: 0,
      lineCount: 0,
      store: store.state
    }
  },
  computed: {
    isWritable() {
      return true;
    },
    dateLastSavedAt() {
      return null;
    },
    publicUrl() {
      return window.location.origin + '/notes/' + this.documentId;
    }
  },
  watch: {
    // nothing
  },
  methods: {
    encryptCheckboxChanged() {
      this.writeNow();
    },
    writeNow: async function () {

      try {

        let text = this.text;

        if (this.encrypt) {
          let encrypted = Security.encrypt(text, store.state.encryptionKey);
          text = JSON.stringify(encrypted);
        }

        await store.actions.saveContents(text);

      } catch (ex) {
        alert('Something went wrong during saving');
      }

    },
    writeLater: debounce(async function () {
      await this.writeNow();
    }, 1000),
    textKeyDown(event) {

      if (event.ctrlKey || event.metaKey) {
        switch (String.fromCharCode(event.which).toLowerCase()) {
          case 's':
            event.preventDefault();
            break;
        }
      }
    },
    async textKeyUp() {
      this.writeLater();
    },
    async deleteForever() {

      if (confirm('Are you sure?? This action cannot be undone')) {

        await store.actions.deleteNote();
        store.actions.reset();
      }

    }
  },
  mounted() {

    // Logged in as new user!
    watch(() => store.getters.key, async (newValue, oldValue) => {

      this.isBusy = true;

      if (newValue) {

        let response = await api.get(newValue);

        const text = response.text;
        console.log(response);

        this.documentId = response.uid;

        if (text && Util.isJson(text)) {

          const json = Util.parseJsonQuietly(text);

          this.text = Security.decrypt(json, store.state.encryptionKey);
          this.encrypt = true;

        } else {
          this.encrypt = false;
          this.text = text;
        }

      } else {
        this.text = '';
      }

      this.isBusy = false;

    }, {
      immediate: true
    });

    const updateTextStats = debounce(() => {

      let str = this.text;

      if (str) {
        this.wordCount = TextUtil.wordCount(str);
        this.charCount = str.length;
        this.lineCount = TextUtil.lineCount(str);
      }

    }, 100)

    watch(() => this.text, function () {
      updateTextStats();
    }, {
      immediate: true
    });

  },
  async beforeUnmount() {
    //await store.actions.saveContents(this.text);
  }
}
</script>
