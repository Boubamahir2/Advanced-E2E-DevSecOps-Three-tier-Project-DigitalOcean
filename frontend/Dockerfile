### First Stage ###
FROM node

WORKDIR /app

COPY package.json ./

RUN npm install --legacy-peer-deps

COPY . .

ENV REACT_APP_BASE_URL=http://localhost:5000/api/v1

EXPOSE 3000

CMD [ "npm", "start" ]
