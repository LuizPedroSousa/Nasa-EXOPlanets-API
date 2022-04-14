FROM node:16.0.0-stretch as common-build-stage

COPY . ./app

WORKDIR /app

RUN apt-get update -y 

RUN npm install

EXPOSE 3336

ENV NODE_ENV development

COPY ./scripts/api/init.sh /init.sh

RUN chmod +x /init.sh

# Development build stage
FROM common-build-stage as development-build-stage

ENV NODE_ENV development

ENTRYPOINT ["/init.sh"]

# Production build stage
FROM common-build-stage as production-build-stage

ENV NODE_ENV production

CMD ["npm", "run", "start"]
