import {reactive, readonly, watch} from "vue";
import {EasyStorage} from "./classes/EasyStorage";
import {Util} from "./classes/Util";
import api from "./api";

const STORAGE_SESSION_ID_KEY = 'session_id';

const _state = reactive({
    isBusy: false, // switching between keys
    sessionId: null,

    authKey: '',
    encryptionKey: '', // cipherKey

    key: '',
    error: '', // any app error - invalid URL, invalid auth, etc..
});

const bootSession = function () {

    let sid = EasyStorage.get(STORAGE_SESSION_ID_KEY);

    if (!sid) {
        sid = Util.randomInt();
        EasyStorage.save(STORAGE_SESSION_ID_KEY, sid);
    }

    _state.sessionId = sid;
}

bootSession();

const getters = {

    get key() {
        return _state.key;
    }
}

const actions = {

    updateHash(hash) {
        _state.key = hash;
    },

    setKeys(authKey, cipherKey) {
        _state.authKey = authKey;
        _state.encryptionKey = cipherKey
    },

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
    getters: getters,
    actions: actions
}
