import {computed, reactive, readonly, watch} from "vue";
import {Security} from "./classes/Security";

const _state = reactive({
    // switching between keys
    isBusy: false,

    // any app error - invalid URL, invalid auth, etc..
    error: '',
    sessionId: null,

    key: sessionStorage.getItem('vue-key'),

    // first 32 bits we use for authentication
    authKey: computed(() => {
        return _state.key ? (_state.key || []).slice(0, 32) : null;
    }),

    // next 32 bits = encryption key
    encryptionKey: computed(() => {
        return _state.key ? (_state.key || []).slice(32, 64) : null;
    }),
    urlKey: '',

});

watch(() => _state.key, (newValue) => {
    sessionStorage.setItem('vue-key', newValue);
});

const mutations = {
    setSessionId: (id) => {
        _state.sessionId = id
    },

    /**
     *
     * @param {Uint8Array} hash
     */
    login: (hash) => {

        console.log(hash);

        const hex = Security.byteArrayToHexString(hash);

        _state.key = hex;
        _state.urlKey = Security.base62(hash.slice(0, 16));
    }
}

const getters = {

    get test() {
        return "test";
    }
}

const actions = {

    reset() {
        _state.key = '';
    }
}

export default {
    state: readonly(_state),
    getters: getters,
    mutations,
    actions: actions
}
