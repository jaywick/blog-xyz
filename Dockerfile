FROM mhart/alpine-node

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app

RUN yarn && yarn build

HEALTHCHECK --interval=1m --timeout=5s \
    CMD curl -f http://localhost/test || exit 1

EXPOSE 80
CMD [ "yarn", "standup" ]
