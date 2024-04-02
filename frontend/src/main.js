import {createApp} from 'vue'
import App from './components/App.vue'

import './sass/app.scss';
import store from "./store";
import {EasyStorage} from "./classes/EasyStorage";
import {Util} from "./classes/Util";

const STORAGE_SESSION_ID_KEY = 'session_id';

const bootSession = function () {

    let sid = EasyStorage.get(STORAGE_SESSION_ID_KEY);

    if (!sid) {
        sid = Util.randomInt();
        EasyStorage.save(STORAGE_SESSION_ID_KEY, sid);
    }

    store.mutations.setSessionId(sid);
}

bootSession();


const app = createApp(App).mount('#app')
