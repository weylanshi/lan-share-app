FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制文件
COPY package*.json ./
RUN npm install

# 复制服务端与前端页面
COPY . .

# 暴露端口（Web 页面和 WebSocket）
EXPOSE 3000

CMD ["node", "server.js"]
