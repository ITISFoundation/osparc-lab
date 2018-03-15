# This dockerfile is intended to create images for production!
# You should always specify a full version here to ensure all of your developers
# are running the same version of Node.
FROM node:8.9.2

# The base node image sets a very verbose log level.
ENV NPM_CONFIG_LOGLEVEL warn

# Tell Docker about the port we'll run on.
EXPOSE 6001

WORKDIR /home/node/app/

# Creates node_modules.
COPY package.json package.json
RUN npm install --no-bin-links

# Copy all local (but the ones in .dockerignore) files into the image.
COPY . .

# Build for production.
#RUN npm run build --production
