# ใช้ Node.js เวอร์ชัน 18 หรือสูงกว่า
FROM node:18.18.2

# ตั้งค่า work directory
WORKDIR /usr/src/app

# คัดลอก package.json และ package-lock.json
 COPY package*.json ./

# Dockerfile
# COPY server.js .  

# คัดลอกไฟล์ server.js ไปยัง /usr/src/app

# ติดตั้ง dependencies
RUN npm install

# คัดลอกไฟล์ทั้งหมดไปยัง container
COPY . .

# เปิดพอร์ต
EXPOSE 3000

# รันแอป
CMD ["npm", "start"]
