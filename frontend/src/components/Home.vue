<template>
    <div class="w-full max-w-screen-lg mx-auto px-1">

        <div style="max-width:700px; margin:3em auto;">

            <h1 class="text-center"> 🔑 Login with a unique passphrase</h1>

            <input type="text" id="phrase" ref="query" placeholder="e.g: correct horse battery staple"
                   autocomplete="off"
                   autocapitalize="off" @keydown.enter="login" v-model="phrase" :disabled="isBusy">

            <div class="text-muted mt-2">Can be as short as you want, but in order to make it harder for
                others to guess (or brute-force), make it at least 4 words.
            </div>

            <p class="my-5">
                <small class="text-muted">Characters: {{ passLen }}
                    <span class="mx-2"></span> Words: {{ wordCount }}
                    <span class="mx-2"></span> Entropy: {{ entropy }} bits
                </small>
            </p>

        </div>

        <hr>

        <div class="my-5">

            <p>A simple web-based application for people to write and store notes
                securely online. Can be accessed from any device anywhere in the world.
                Built to be as a more portable, more secure alternative to <strong>Simplenote</strong> and <strong>Evernote</strong>.
            </p>

            <h2>Features</h2>

            <ul id="notepad_features">
                <li>🔑 <strong>Uses passphrase as your universal login</strong>

                    - no accounts to create, no emails to verify.
                    Pick some hard to guess combination of words, and that is your one and only login.
                </li>

                <li>🔐 <strong>Fully encrypted</strong> - your notes are encrypted client-side before being sent and
                    stored on the server.
                    No one (not even the authorities) will be able to decrypt or view the contents of your notes,
                    unless they can guess your passphrase.
                </li>

                <li>💻 <strong>Open source</strong> - see how this all works, and deploy your own version of this
                    application on your own servers if you want.
                </li>

                <li>💾 <strong>Fully exportable</strong> - anyone can download all the notes ever created on this app
                    (encrypted of course), and host their own copy of this application including all of its data no
                    problem! Your notes do not have to disappear if the server gets shut down, as long
                    as copies of it are still being mirrored elsewhere.
                </li>

            </ul>

            <p class="my-4"></p>

            <p>
                It works on any device/platform that has a web-browser.
                It's also very small (~100 kilobytes), and very fast so it works well on even the slowest internet
                connections.
            </p>


            <h2>🔐 How secure is it?</h2>

            <p>It depends entirely on your passphrase. If someone can guess it (or brute-force it), then they would gain
                access to your notes.</p>

            <p>Apart from that, your notes are fully encrypted client-side (using portion of your passphrase as the
                encryption key) before being saved on the server's hard drive.

                To prove how safe they are, you can actually download all the notes stored on this server from here:
                <br>
                <a href="https://notepad.mx/archive.tar.gz" target="_blank">https://notepad.mx/archive.tar.gz</a>
            </p>

            <p>
                You will get a bunch of files with encrypted looking text inside
                that is of no use to you, unless you plan on hosting your own copy
                of this application.
            </p>

            <p>
                Additionally, there are no usernames or emails for us to keep track off.
                We do not log IP addresses either. All we have is a bunch of text files
                whose contents are a mystery to anyone without corresponding encryption key.
            </p>

            <h2>What happens if I forget my passphrase?</h2>

            <p>
                Then your notes are lost forever.
                It will continue existing somewhere on the server,
                but because it was encrypted,
                not even the server administrator will be able to find it or decrypt it.
            </p>

            <h2>💡 Ideas/Feedback</h2>

            <p class="pb-12">
                This project is entirely open source. You can discuss it all on our GitHub page here:

                <a href="https://github.com/Athlon1600/notepad"
                   target="_blank">https://github.com/Athlon1600/notepad</a>
            </p>

        </div>

    </div>
</template>

<script>

import {TextUtil} from "../classes/TextUtil";
import {Util} from "../classes/Util";

import {Security} from "../classes/Security";
import {APP_KEY} from "../config";
import store from "../store";

export default {
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
            // TODO: do not assume charset size of 26 as most phrases will be [a-z] + space
            return Util.calcEntropy(26, this.phrase.length);
        },
        // words in english dictionary; 171,146 words
        // attacked not at the letter level but at the word level.
        phraseEntropy() {
            return Util.calcEntropy(30000, this.wordCount);
        },
        passLen: function () {
            return this.phrase.length;
        }
    },
    methods: {
        async login() {

            if (this.phrase.length >= 1) {

                this.isBusy = true;

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
