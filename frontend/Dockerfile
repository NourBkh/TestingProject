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


# Build the React app for production
RUN npm run build

# Install serve to serve the static files
RUN npm install -g serve


# Expose port 3000, which is the default port for React development server
EXPOSE 3000

# Set environment variable to ensure React app binds to all network interfaces
ENV HOST=0.0.0.0

# Serve the production build
CMD ["serve", "-s", "build", "-l", "tcp://0.0.0.0:3000"]

