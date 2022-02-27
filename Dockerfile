#  Dockerfile for Node Express Backend
FROM node:12.22

WORKDIR /app

# RUN rm -rf /usr/local/lib/node_modules/npm
# RUN mv node_modules/npm /usr/local/lib/node_modules/npm

# Create and define the node_modules's cache directory.
RUN mkdir /usr/src/cache
WORKDIR /usr/src/cache

# Install the application's dependencies into the node_modules's cache directory.
COPY package.json ./
COPY package-lock.json ./

RUN npm install
EXPOSE 6000

# Copy app source code
COPY . .

CMD ["npm","start"]