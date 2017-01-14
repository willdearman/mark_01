FROM node:4.3.2

RUN useradd --user-group --create-home --shell /bin/false app &&\
  npm install --global npm@3.7.5

ENV HOME=/home/app
COPY package.json npm-shrinkwrap.json $HOME/marketbotio_01/
RUN chown -R app:app $HOME/*

USER app
WORKDIR $HOME/marketbotio_01
RUN npm install
CMD ["node", "app.js"]
