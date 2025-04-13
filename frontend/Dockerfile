FROM node:lts-alpine as builder
WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn build


FROM nginx:stable-alpine as deploy
COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]