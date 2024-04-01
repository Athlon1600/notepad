FROM node:16-alpine3.14 AS builder
WORKDIR /app

COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Install dependencies for both frontend and backend
RUN npm install --prefix ./backend/
RUN npm install --prefix ./frontend/


FROM node:16-alpine3.14 as runner
WORKDIR /app
COPY --from=builder /app ./

## TODO: split this into multi-stage too
COPY . .

RUN cd frontend && npm run build && npm run copy:backend
RUN cd backend && npm run build

#RUN npm install -g nodemon

WORKDIR /app/backend

EXPOSE 3000
#CMD [ "node", "backend/dist/index.js" ]
#CMD ["sleep", "1d"]
CMD ["npm", "run", "serve"]

