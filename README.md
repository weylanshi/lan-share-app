# LAN Share App

一个基于 WebRTC 的局域网文件共享应用，支持点对点（P2P）文件传输和文本共享。

## 功能特点

- 基于 WebRTC 的点对点文件传输
- 实时文本共享
- 支持多房间
- 无需安装，直接在浏览器中使用
- 支持 Docker 部署

## 技术栈

- Node.js
- Express.js
- WebSocket
- WebRTC
- Docker

## 系统要求

- Node.js 14.0 或更高版本
- 现代浏览器（支持 WebRTC）

## 安装和运行

### 本地运行

1. 克隆仓库
```bash
git clone [repository-url]
cd lan-share-app
```

2. 安装依赖
```bash
npm install
```

3. 启动服务器
```bash
npm start
```

服务器将在 http://localhost:3000 启动

### Docker 部署

1. 构建 Docker 镜像
```bash
docker build -t lan-share-app .
```

2. 运行容器
```bash
docker run -p 3000:3000 lan-share-app
```

## 使用方法

1. 在浏览器中访问 http://localhost:3000
2. 创建新房间或加入现有房间
3. 在房间内可以：
   - 拖拽文件到指定区域进行文件传输
   - 使用文本输入框进行文本共享

## 注意事项

- 文件传输采用点对点方式，不经过服务器
- 确保设备在同一局域网内
- 建议使用现代浏览器（Chrome、Firefox、Edge 等）

## 开发

### 项目结构

```
lan-share-app/
├── public/          # 静态文件
├── server.js        # 服务器入口
├── package.json     # 项目配置
└── Dockerfile       # Docker 配置
```

### 环境变量

- `PORT`: 服务器端口号（默认：3000）

## 许可证

MIT License 