# Use an official Node.js runtime as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the project's dependencies
RUN npm install

# Copy the rest of the application to the working directory
COPY . .

# Expose the port your app runs on. For example, 3000.
EXPOSE 4000

# Define the command to run the app
CMD ["node", "src/index.ts"]