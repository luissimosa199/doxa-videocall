FROM node:20

WORKDIR /usr/src/app

# Copy package.json and package-lock.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Transpile TypeScript to JavaScript
RUN npx tsc

# Run the transpiled JavaScript code
CMD ["node", "dist/index.js"]
