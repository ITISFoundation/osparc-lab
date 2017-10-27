FROM node:boron

# Will install global dependencies in a non-root user (/home is under node user!)
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .

# RUN npm version
# For npm version 5
#COPY package.json package-lock.json ./

RUN npm install

# Bundle app source
# TODO Read http://bitjudo.com/blog/2014/03/13/building-efficient-dockerfiles-node-dot-js/
COPY . .

# App binds to this port
EXPOSE 8080


# Define your runtime
CMD ["npm", "start"]
