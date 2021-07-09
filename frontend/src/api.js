const apiBaseUri = '';

class Api {

    async get(code) {

        const options = {
            method: 'GET',
        }

        return fetch('/api/get?code=' + code, options)
            .then(response => response.json());
    }

    /**
     *
     * @param code
     * @param contents
     * @returns {Promise<SaveResponse>}
     */
    async save(code, contents) {

        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                code: code,
                contents: contents
            })
        };

        return fetch('/api/save', options)
            .then(response => response.json());
    }

    async delete(code) {

        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                code: code
            })
        };

        return fetch('/api/delete', options)
            .then(response => response.json());
    }
}


export default new Api();