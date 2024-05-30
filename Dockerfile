# Use an official Node.js runtime as a parent image
FROM node:16-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json into the container at /usr/src/app
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Copy the rest of the working directory contents into the container at /usr/src/app
COPY . .

# Install nodemon globally
RUN npm install -g nodemon

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Default command to run the app
CMD ["npm", "start"]
