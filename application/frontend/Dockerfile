### First Stage ###
FROM node

WORKDIR /app

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install

COPY . .

ARG BASE_URL
ENV REACT_APP_BASE_URL=${BASE_URL}

RUN yarn build

### Second Stage ###
FROM caddy:2.1.1

ARG CADDYFILE
COPY ${CADDYFILE} /etc/caddy/Caddyfile

COPY --from=builder /app/build/ /srv

EXPOSE 3000
