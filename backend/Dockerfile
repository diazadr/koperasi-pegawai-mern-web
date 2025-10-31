# Gunakan image Node ringan
FROM node:18-alpine

# Set folder kerja di dalam container
WORKDIR /usr/src/app

# Salin file package.json & package-lock.json dari backend
COPY package*.json ./

# Install dependencies backend
RUN npm install

# Salin semua file backend ke dalam container
COPY . .

# Port backend (sesuai di server.js)
EXPOSE 5000

# Jalankan server
CMD ["npm", "start"]