FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN echo 'window._env_ = { \
   SURVEY_SERVICE_BASE_URL: "${SURVEY_SERVICE_BASE_URL}", \
   RECAPTCHA_SITE_KEY: "${RECAPTCHA_SITE_KEY}" \
};' > /usr/share/nginx/html/env.js

RUN echo '#!/bin/sh' > /docker-entrypoint.d/40-env.sh && \
   echo 'envsubst < /usr/share/nginx/html/env.js > /usr/share/nginx/html/env.js.tmp && mv /usr/share/nginx/html/env.js.tmp /usr/share/nginx/html/env.js' >> /docker-entrypoint.d/40-env.sh && \
   chmod +x /docker-entrypoint.d/40-env.sh

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]