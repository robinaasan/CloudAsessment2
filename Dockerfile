FROM node:16

ENV AWS_ACCESS_KEY_ID XXX
ENV AWS_SECRET_ACCESS_KEY YYY
ENV AWS_SESSION_TOKEN ZZZ

# Copy app source
COPY ./backend /src/app

COPY ./image-generator/dist /src/image-generator/dist

WORKDIR /src/app

RUN npm install

RUN redis-server

EXPOSE 3000

CMD ["npm", "start"]
