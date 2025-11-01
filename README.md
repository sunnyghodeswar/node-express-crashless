# ⚡ node-express-crashless

> Minimal **Express.js** application demonstrating real-world crash prevention, async safety, and smart logging using [Crashless](https://www.npmjs.com/package/crashless).

Crashless ensures your app **never crashes unexpectedly** — even if async DB calls explode 💣, APIs fail 🌍, or developers “forget” try-catch 😅.

---

## 🚀 Quick Start

### 🧩 1. Install Dependencies
```bash
npm install
```

### 🧠 2. Run in Development Mode
```bash
npm run dev
```
✅ Shows **full stack traces**  
✅ Logs every crash with metadata  
✅ No message masking — useful for debugging  

Example output:
```
⚡ Server running on http://localhost:4000
[Crashless] Error: Database read failed for user ID: 1
```

---

### 🛡️ 3. Run in Production Mode
```bash
npm start
```
✅ Sensitive messages masked  
✅ Stack traces hidden  
✅ Clean, production-friendly logs  

---

### 🧪 4. Run Automated Tests
```bash
npm test
```
Runs all route tests using **Mocha + Supertest**  
Verifies async, sync, and external API failures are gracefully handled.

---

## 🔗 Example Endpoints

| Method | Route | Description |
|--------|--------|-------------|
| `GET` | `/ping` | Health check (returns OK) |
| `GET` | `/user/:id` | Simulates DB read failure |
| `POST` | `/user` | Simulates DB write failure |
| `DELETE` | `/user/:id` | Simulates DB delete failure |
| `GET` | `/external` | Simulates failed external API call |
| `GET` | `/crash` | Manual “organic” crash |

---

## 🧰 Example Commands (from separate terminals)

### Terminal 1 → Start the app
```bash
npm run dev
```

### Terminal 2 → Hit routes
```bash
curl -s http://localhost:4000/user/1
curl -s -X POST http://localhost:4000/user -H "Content-Type: application/json" -d '{"name":"Sunny"}'
curl -s http://localhost:4000/crash
curl -s http://localhost:4000/external
```

Each response will return a **standardized JSON** structure like:
```json
{
  "success": false,
  "message": "Database read failed for user ID: 1",
  "code": "SERVER_ERROR"
}
```

---

## 🧠 File Structure

```
node-express-crashless/
├── server.js        # Express + Crashless integration
├── db.js            # Simulated DB & API failure logic
├── package.json     # Scripts & deps
├── .gitignore       # Clean repo setup
└── README.md        # You’re reading this 😎
```

---

## 🧾 Example Logs

Development mode (`npm run dev`):

```
⚡ Server running on http://localhost:4000
[Crashless] Error: Database read failed for user ID: 1
{ method: 'GET', path: '/user/1', status: 500, timestamp: '...' }
```

Production mode (`npm start`):

```
⚡ Server running on http://localhost:4000
[Crashless] Error: Masked error (production mode)
{ method: 'GET', path: '/user/1', status: 500 }
```

---

## 🧠 Live Demo

👉 **Try it instantly on StackBlitz:**  
[https://stackblitz.com/github/sunnyghodeswar/node-express-crashless?file=server.js](https://stackblitz.com/github/sunnyghodeswar/node-express-crashless?file=server.js)

---

## 🪄 Related Links

- [Crashless on npm](https://www.npmjs.com/package/crashless)  
- [Crashless GitHub Repository](https://github.com/sunnyghodeswar/crashless)  
- [Vegaa Framework (by the same author)](https://github.com/sunnyghodeswar/vegaa)

---

## 🧑‍💻 Author

**Sunny Ghodeswar**  
Senior Full-Stack Developer — Pune, India 🇮🇳  
Building **Vegaa ⚡** & **Crashless 🧯** for safer, faster backends.
