import {reactive, readonly} from "vue";
import api from "./api";

const _state = reactive({
    isBusy: false, // switching between keys
    sessionId: null,

    authKey: '',
    encryptionKey: '', // cipherKey

    key: '',
    error: '', // any app error - invalid URL, invalid auth, etc..
});

const mutations = {
    setSessionId: (id) => {
        _state.sessionId = id
    },
    updateHash: (hash) => {
        _state.key = hash;
    },
    setKeys(authKey, cipherKey) {
        _state.authKey = authKey;
        _state.encryptionKey = cipherKey
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
