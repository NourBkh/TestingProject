# Use an official Node.js image as a base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port that your app will run on (typically 5000 for backend)
EXPOSE 5000

# Command to start the backend server (using your specific command)
CMD ["node", "server.js"]
