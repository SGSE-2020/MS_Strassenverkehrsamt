FROM node:lts

# Create app directory
WORKDIR /app 

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install
# If you are building your code for production

# Bundle app source
COPY . .

RUN npm test

EXPOSE 8080
CMD [ "node", "server.js" ]