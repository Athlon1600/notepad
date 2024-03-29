# Notepad

![GitHub](https://img.shields.io/github/license/athlon1600/notepad)
![GitHub last commit](https://img.shields.io/github/last-commit/athlon1600/notepad)

A simple web-based notepad for writing and securely storing notes online.
Useful for easy sharing of text between people or devices.

- No registration process. You use a passphrase as your login.
- Supports client-side encryption
- Extremely minimal and lightweight

## :star: Demo

Exact version of this application:

- https://demo.notepad.mx

## :hammer: Deployment to Production

Rent a server for free at [linode.com](https://www.linode.com/lp/refer/?r=cee8aa429cd4cbb5a6e6d1ebfd8986f661d8ef4e)

Deploy this whole thing to production in three lines:

```shell
git clone https://github.com/Athlon1600/notepad.git
cd notepad
npm run build && npm run start
```

This will build Vue frontend first, and then move the resulting bundle to the `/public` directory
of the backend application from which the frontend will be served from.

Application will then be available on port `3000`

If you want HTTPS support out of the box, you should install Caddy:

```shell
wget -qO- https://github.com/caddyserver/caddy/releases/download/v2.7.5/caddy_2.7.5_linux_amd64.tar.gz | tar -xz && rm -f caddy_2.7.5_linux_amd64.tar.gz LICENSE README.md && chmod +x caddy && mv caddy /usr/local/bin/caddy
```

Be sure to modify `backend/etc/Caddyfile` replacing `notepad.mx` with your own domain,
and then run:

```shell
cd backend && caddy run --config etc/Caddyfile 
```

## How it works

- You login using a passphrase which produces a hash value of 32 bytes (or 64 characters in hex)
- First 16 bytes is your **authentication key**  used in API calls when sending data back and forth
- Next 16 bytes is your **encryption key** used to encrypt that text data
- Encryption key never leaves your browser.

See the drawing below:

![scrypt](https://github.com/Athlon1600/notepad/assets/1063088/aed67aae-bd10-4917-a149-fc2db0ad1d17)

## To-do list

- rewrite frontend to use TypeScript
- use websockets to better support multiple sessions editing same document scenarios
- add option to use Redis for storing notes
- ability to use this app via command line
- update the editor to allow subdivision of long text into multiple subsections via linebreaks

## Versions

If you want to continue using v1, go here:  
https://github.com/Athlon1600/notepad/tree/v1.0.0-rc.1

## External Links

- https://ricmoo.github.io/scrypt-js/
- https://www.proxynova.com/tools/brute-force-calculator
- https://en.wikipedia.org/wiki/Base62
- https://webpack.js.org/configuration#set-up-a-new-webpack-project
- https://createapp.dev/webpack/vue--css--eslint
