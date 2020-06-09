### STAGE 1: Build ###

FROM node:lts AS build

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Build package
RUN npm run generate

### STAGE 2: Run ###
FROM nginx:stable-alpine as production-stage

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]