const apiBaseUri = '';

class Api {

    async get(code) {

        const options = {
            method: 'GET',
        }

        return fetch('/api/notes/' + code, options)
            .then(response => response.text());
    }

    /**
     *
     * @param code
     * @param contents
     * @returns {Promise<string>}
     */
    async save(code, contents) {

        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "text/plain"
            },
            body: contents
        };

        return fetch('/api/notes/' + code, options)
            .then(response => {

                if (!response.ok) {
                    throw new Error('Error: ' + response.statusText);
                }

                return response.text();
            });
    }

    async delete(code) {

        const options = {
            method: 'DELETE'
        };

        return fetch('/api/notes/' + code, options)
            .then(response => response.text());
    }
}


export default new Api();