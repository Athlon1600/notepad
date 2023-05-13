import {reactive, readonly} from "vue";
import api from "./api";
import {Security} from "./classes/Security";

const _state = reactive({
    isBusy: false, // switching between keys
    sessionId: null,

    authKey: '',
    encryptionKey: '', // cipherKey
    urlKey: '',

    key: '',
    error: '', // any app error - invalid URL, invalid auth, etc..
});

const mutations = {
    setSessionId: (id) => {
        _state.sessionId = id
    },

    /**
     *
     * @param {Uint8Array|String} hash
     */
    login: (hash) => {

        const hex = Security.byteArrayToHexString(hash);

        // first 32 bits we use for authentication
        _state.authKey = hex.slice(0, 32);

        // next 32 bits = encryption key
        _state.encryptionKey = hex.slice(32, 64);

        _state.key = _state.authKey;
        _state.urlKey = Security.base62(hash.slice(0, 16));
    }
}

const getters = {

    get key() {
        return _state.key;
    }
}

const actions = {

    async saveContents(contents) {
        await api.save(_state.key, contents);
    },

    async deleteNote() {
        await api.delete(_state.key);
    },

    reset() {
        _state.key = '';
        _state.authKey = '';
        _state.encryptionKey = '';
    }
}

export default {
    state: readonly(_state),
    mutations,
    getters: getters,
    actions: actions
}
