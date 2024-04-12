<template>
  <div class="flex flex-col flex-grow mt-5">

      <div class="flex items-center">

          <div class="">
              <p>
                  <input type="checkbox" id="checkbox" v-model="encrypt" @change="encryptCheckboxChanged" disabled/>
                  <label for="checkbox" class="ml-2">Encrypted</label>
              </p>
          </div>

      </div>

    <div>
      <p>All text is automatically encrypted and saved as you type.

          You can store up to 128 <abbr title="where KB = 1024 bytes">KB</abbr> worth of text, or around 40 Word document pages.
      </p>
    </div>

    <div id="plain_text_not_ace" class="flex flex-col flex-grow">

      <textarea @keyup="textKeyUp" @keydown="textKeyDown" @select="textSelect" @mouseup="textSelect" v-model="text"
                placeholder="Nothing written here yet! Write something!" style="resize: none"
                class="flex-grow"></textarea>

      <div class="flex justify-between mt-2 mb-5">

        <div class="status-bar">
          Words: {{ wordCount }},
          Characters: <span v-if="selectedCharCount">{{ selectedCharCount }}/</span>{{ charCount }},
          Lines: {{ lineCount }}
        </div>

        <div>
          <a href="" @click.prevent="deleteForever" class="font-bold text-red-500">Delete Forever</a>
        </div>

      </div>

    </div>

  </div>
</template>

<script>
import {watch} from "vue";

import {TextUtil} from "../classes/TextUtil";
import debounce from "debounce";
import store from "../store";
import {SecureStorage} from "../classes/SecureStorage";

// https://github.com/reddit-archive/reddit/blob/753b17407e9a9dca09558526805922de24133d53/r2/r2/models/link.py#L149
const TEXT_MAX_LEN = 40000;

export default {
  name: 'editor',
  data() {
    return {
      isBusy: true,
      text: '',
      encrypt: true,
      documentId: '',
      // stats
      charCount: 0,
      selectedCharCount: 0,
      wordCount: 0,
      lineCount: 0
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

        const text = this.text;
        const authKey = store.state.authKey;
        const password = store.state.encryptionKey;

        await SecureStorage.write(authKey, text, password);

      } catch (ex) {
        alert('Something went wrong during saving');
      }

    },
    writeLater: debounce(async function () {
      await this.writeNow();
    }, 800),
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
    textSelect(event) {

      const target = event.target;

      let val = target.value;
      let start = target.selectionStart;
      let end = target.selectionEnd;

      if (start === end) {
        this.selectedCharCount = 0;
      } else {

        let selected = val.substring(start, end);
        this.selectedCharCount = selected.length;
      }

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
    watch(() => store.state.authKey, async (newValue, oldValue) => {

      this.isBusy = true;

      if (newValue) {
          const password = store.state.encryptionKey;
          const text = await SecureStorage.read(newValue, password);

          this.text = text;

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
