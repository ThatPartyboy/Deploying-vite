## 安裝與運行

### 1. 安裝前置工具

在開始之前，請確保你已經安裝以下工具：

- [Node.js](https://nodejs.org/) (20.x 或以上)
- [MongoDB](https://www.mongodb.com/) 伺服器 (可以選擇本地安裝或使用 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### 2. 下載專案

透過 Git 將專案下載至本地：

```bash
git clone https://github.com/your-username/your-repository.git
cd your-repository
```

### 3. 前置設定
#### 安裝所需Dependencies
在根目錄執行：
```
npm install
```
#### 設定環境變數
1. 在專案的 backend 目錄下創建一個 .env 文件。
2. 在 .env 文件中，按照範例填入 MongoDB 連接字串及 Port：
```
# MongoDB 連接字串 (本地端)
MONGODB_URI=mongodb://localhost:27017/"你的資料庫名"
# 後端伺服器運行的端口
PORT=3000
```
### 4. 啟動網頁
運行以下指令來同時啟動前端和後端：
```
npm run start
```
- 後端伺服器將運行在 http://localhost:3000 (預設)
- 前端網頁將運行在 http://localhost:5173 (預設 Vite 端口)
