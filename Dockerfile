FROM mhart/alpine-node:12 as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --prod 

FROM mhart/alpine-node:12
ENV NODE_ENV="production"
ENV TZ="America/New_York"
WORKDIR /app
COPY --from=build /app .
COPY . .
EXPOSE 4000
CMD ["npm", "start"]