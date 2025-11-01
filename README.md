# ⚡ node-express-crashless

> Minimal Express app demonstrating [Crashless](https://www.npmjs.com/package/crashless) error prevention, async safety, and testing setup.

## 🚀 Quick Start

### Install
```bash
npm install
```

### Development Mode
```bash
npm run dev
```
- Shows full error details
- Displays stack traces
- Verbose logs

### Production Mode
```bash
npm start
```
- Masks sensitive messages
- Clean logs

### Test All Routes
```bash
npm test
```
Runs automated tests using **Mocha + Supertest**.

## 🧪 Example Endpoints

| Method | Route | Description |
|--------|--------|-------------|
| GET | /ping | Health check |
| GET | /user/:id | DB read fail |
| POST | /user | DB write fail |
| DELETE | /user/:id | DB delete fail |
| GET | /external | API simulation |
| GET | /crash | Manual crash |
