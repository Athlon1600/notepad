<template>
  <div>

    <div style="max-width:700px; margin:4em auto;">

      <h1 class="text-center"> &#x26A1; Login with a unique pass-phrase</h1>

      <input type="text" id="phrase" ref="query" placeholder="e.g: correct horse battery staple" autocomplete="off"
        autocapitalize="off" @keydown.enter="login" v-model="phrase" :disabled="isBusy">

      <div style="margin-top:1em;" class="text-muted">Can be as short as you want, but in order to make it harder for
        others
        to guess (or brute-force), keep it at least 4 words.
      </div>

      <p>
        <small class="text-muted">Chars: {{ passLen }}. Words: {{ wordCount }}. Entropy: {{ entropy }}. Dictionary
          entropy: {{ phraseEntropy }}</small>
      </p>

    </div>

    <hr>

    <div style="margin-bottom:5em;">

      <h2>What is this?</h2>

      <p>A simple web-based notepad for people to write notes, and store them permanently on the cloud, thus making it
        available for access across multiple devices.

        This can be used as an alternative to taking notes on your native notepad application provided by your
        Windows/Mac operating system.
      </p>

      <h2>Why?</h2>

      <p>On my commute to work, I frequently take notes on my laptop, and often I want to share those notes with my
        computer at work, my computer at home, and my phone.

        I typically would save the notes in an email, and then send it to myself, but I eventually got tired of doing
        that and I was ready to do things differently.</p>

      <p>
        Yes, a search for <strong>"online notepad"</strong> returns millions of results,
        so there are many apps out there that should give me what I want, but as I was browsing around,
        each of the available options were uniquely flawed, and so eventually I thought I should just build something
        myself and
        this came to me on a Friday and so it was the perfect time.</p>

      <p>Here are the features I wanted:</p>

      <ol id="notepad_features">
        <li>

          <strong>No registrations or logins!</strong> I don't wish to give anyone my email, or memorize yet another
          username/password
          combo, and I don't want to maintain all these login sessions across multiple devices.
          <br>
          A common solution to this is to store your notes under some unique URL, but that still requires me to somehow
          remember that URL when I want to see my notes again. Sure, I could just bookmark it, but my bookmarks would
          not persist between different computers or even different browsers...
          <br>
          My solution: create your own unique pass-phrase and use that as your one and only universal login to your
          "note".
        </li>

        <li>

          <strong>Notes I take actually have to persist across devices!</strong> There are so many online note-taking
          apps where
          the contents of your notes are only saved locally within your web browser's storage, so a simple cache clear
          would wipe it all out.

          At that point, I would rather just use my windows notepad if I only cared for those notes to just be stored on
          this one computer.
        </li>

        <li>
          <strong>Notes have to be shareable.</strong> Think of Pastebin or Google docs, where you have the ability to
          share whatever text you've written via a
          unique URL that allows that person to view that text, but not edit it.
        </li>

        <li>
          <strong>Has to be fast and simple!</strong> Modern web has become too slow. A radically simplified UI is what
          I was looking for.

          Even for applications like these that solve such a simple purpose - where all you really need is a textarea
          with a "Save" button, somehow many apps still end up being overcomplicated and overloaded

          See EverNote and ClickUp as examples of "heavy" apps that ruin the whole experience.

        </li>

        <li>
          <strong>Encryption!</strong> This one would have been nice to have too, but it was as optional since
          it would interfere with the feature that lets you share your notes with anyone else.
          Either way, this app has it - so not only do we not know WHO wrote those notes, but virtually no one besides
          you even knows what was written given that entire encryption process happens client-side.
        </li>

      </ol>


      <h2>What happens if I forget my passphrase?</h2>

      <p>
        Then your note is likely to be lost forever. And if it was encrypted, then not even the server administrator (or
        the hackers!) will be able to find it or decrypt it. Make your pass-phrase just short enough (4 or more words)
        for you to
        remember, but very difficult for others to guess.
      </p>

      <h2>Ideas/Feedback</h2>

      <p>
        This project is entirely open source, so not only can you see how it all works behind the scenes, but also fork
        it and customize to your own liking.
        <br>
        <a href="https://github.com/Athlon1600/notepad" target="_blank">https://github.com/Athlon1600/notepad</a>
      </p>

    </div>

  </div>
</template>

<script>

import { TextUtil } from "./classes/TextUtil";
import { Util } from "./classes/Util";

import { Security } from "./classes/Security";
import { APP_KEY } from "./config";
import store from "./store";

export default {
  name: 'home',
  data() {
    return {
      isBusy: false,
      phrase: '',
    }
  },
  computed: {
    wordCount: function () {
      return TextUtil.wordCount(this.phrase);
    },
    entropy: function () {
      return Util.calcEntropy(26, this.phrase.length);
    },
    // words in english dictionary; 171,146 words
    // attacked not at the letter level but at the word level.
    phraseEntropy() {
      return Util.calcEntropy(30000, this.wordCount);
    },
    passLen: function () {
      return this.phrase.length;
    },
    phraseInvalid: function () {
      return false; //this.phrase.length && !validate(this.phrase);
    },
    phraseValid: function () {
      return false; //this.phrase.length && validate(this.phrase);
    }
  },
  methods: {
    async login() {

      this.isBusy = true;

      if (this.phrase.length >= 1) {

        const val = this.phrase;

        console.time('scrypt');

        const hash = await Security.slowHash(val, APP_KEY);

        console.timeEnd('scrypt');

        this.isBusy = false;

        store.mutations.login(hash);
      }
    }
  },
  mounted() {
    this.$refs.query.focus();
  }
}
</script>
