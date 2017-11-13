# This dockerfile is intended to create images for production!
# You should always specify a full version here to ensure all of your developers
# are running the same version of Node.
FROM node:6.11.5

# The base node image sets a very verbose log level.
ENV NPM_CONFIG_LOGLEVEL warn

# Install `serve` to run the application.
RUN npm install -g serve
# Set the command to start the node server.
CMD serve -s build
# Tell Docker about the port we'll run on.
EXPOSE 6001

WORKDIR /home/node/app/

# creates node_modules
COPY package.json package.json
COPY yarn.lock yarn.lock
#COPY npm-shrinkwrap.json npm-shrinkwrap.json
RUN npm install

# Copy all local files into the image.
COPY . .

# Build for production.
RUN npm run build --production
