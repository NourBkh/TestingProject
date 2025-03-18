# Use the official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files into the container
COPY . .

# Expose port 3000, which is the default port for React development server
EXPOSE 3000

# Set environment variable to ensure React app binds to all network interfaces
ENV HOST=0.0.0.0

# Start the React app using npm start
CMD ["npm", "start"]
