FROM node:20-alpine3.18 AS builder
WORKDIR /app

COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Install dependencies for both frontend and backend
RUN npm install --prefix ./backend/
RUN npm install --prefix ./frontend/


FROM node:20-alpine3.18 as vue-build
WORKDIR /app
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
