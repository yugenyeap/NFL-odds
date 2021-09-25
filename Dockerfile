FROM node:dubnium

# Copy app source
COPY /boxing-odds /src

# Set work directory to /src
WORKDIR /src

# Install app dependencies
RUN npm install

# Expose port to ourside world
EXPOSE 3000

# start command as per package.json
CMD ["npm", "start"]