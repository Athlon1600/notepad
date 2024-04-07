FROM node:20-alpine3.18 AS builder
WORKDIR /app

COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Install dependencies for both frontend and backend
RUN npm install --prefix ./backend/
RUN npm install --prefix ./frontend/


FROM node:20-alpine3.18 as vue-build
# FROM node:20-bullseye as vue-build
WORKDIR /app
# RUN apt-get update && apt-get install -y ca-certificates fonts-liberation libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release wget xdg-utils && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/frontend ./frontend
COPY ./frontend ./frontend
RUN cd frontend && npm run build


FROM node:20-alpine3.18 as runner
WORKDIR /app

COPY --from=vue-build /app/frontend ./frontend
COPY --from=builder /app/backend ./backend

RUN apk --update add tar

COPY ./backend ./backend
RUN cd backend && npm run build

EXPOSE 3000

#CMD ["sleep", "1d"]
CMD /bin/sh -c "cd frontend && npm run copy:backend && cd ../backend && npm run serve"
