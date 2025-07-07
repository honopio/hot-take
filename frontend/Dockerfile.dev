FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 4200

# Development server
CMD ["npm", "start", "--", "--host", "0.0.0.0", "--poll", "2000"]
