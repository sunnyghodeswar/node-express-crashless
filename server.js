import express from 'express';
import crashless from 'crashless';
import { getUser, createUser, deleteUser, fetchExternalData } from './db.js';

const app = express();
app.use(express.json());

crashless.handleAsync(app);

const ENV = process.env.NODE_ENV || 'development';
const isProd = ENV === 'production';
console.log(`🌍 Starting Crashless demo in ${ENV.toUpperCase()} mode`);

app.get('/user/:id', async (req, res) => {
  const user = await getUser(req.params.id);
  res.json(user);
});

app.post('/user', async (req, res) => {
  const user = await createUser(req.body);
  res.status(201).json(user);
});

app.delete('/user/:id', async (req, res) => {
  const result = await deleteUser(req.params.id);
  res.json(result);
});

app.get('/external', async (req, res) => {
  const data = await fetchExternalData();
  res.json(data);
});

app.get('/crash', (req, res) => {
  throw crashless.createError('Manual crash triggered!', 500, 'ORGANIC_CRASH');
});

app.get('/ping', (req, res) => {
  res.json({ success: true, message: 'Server alive ⚡' });
});

app.use(
  crashless({
    handleAsync: true,
    log: true,
    maskMessages: true,
    defaultStatus: 500,
    onTelemetry: (err, meta) => {
      console.log(
        `📡 [Telemetry] ${meta.method} ${meta.path} -> ${meta.status} (${err.code || 'NO_CODE'})`
      );
    }
  })
);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Crashless demo running at http://localhost:${PORT}`);
  console.log(`🪶 Logs ${isProd ? 'masked and concise (production-safe)' : 'verbose (developer mode)'}`);
});

export default app;
