FROM node:15.12-alpine as build
WORKDIR /app
COPY . .
RUN npm install

FROM node:15.12-alpine
ENV TZ="America/New_York"
COPY --from=build /app /
EXPOSE 4000
CMD ["npm", "start"]