FROM node:8 as develop
WORKDIR /app 
COPY . . 
RUN npm install
 
FROM node:8-alpine 
COPY --from=develop /app / 
EXPOSE 4000
CMD ["npm", "start"]