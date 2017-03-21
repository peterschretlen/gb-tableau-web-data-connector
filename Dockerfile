FROM mhart/alpine-node:6

ADD src src

ADD package.json package.json
ADD conf.js conf.js
ADD server.js server.js

RUN npm install

EXPOSE 8000

CMD ["npm", "start"]
