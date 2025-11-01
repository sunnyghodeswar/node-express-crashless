import express from 'express';
import request from 'supertest';
import { expect } from 'chai';
import crashless from 'crashless';

describe('Crashless Core Behavior', () => {

  beforeEach(() => {
    delete process.env.NODE_ENV;
  });

  // ───────────────────────────────
  // 1️⃣  BASIC ERROR HANDLING
  // ───────────────────────────────

  it('should catch async route errors safely', async () => {
    const app = express();
    crashless.handleAsync(app);

    app.get('/async-fail', async () => {
      throw crashless.createError('Boom', 400, 'BAD_REQUEST');
    });

    app.use(crashless());

    const res = await request(app).get('/async-fail');
    expect(res.status).to.equal(400);
    expect(res.body.code).to.equal('BAD_REQUEST');
    expect(res.body.success).to.be.false;
  });

  it('should handle synchronous route errors via next(err)', async () => {
    const app = express();

    app.get('/sync-fail', (req, res, next) => {
      try {
        throw new Error('Sync error');
      } catch (err) {
        next(err);
      }
    });

    app.use(crashless());
    const res = await request(app).get('/sync-fail');
    expect(res.status).to.equal(500);
    expect(res.body.code).to.equal('ERR_500');
  });

  it('should handle manually passed errors with custom codes', async () => {
    const app = express();
    app.get('/manual', (req, res, next) => {
      next(crashless.createError('Unauthorized', 401, 'UNAUTHORIZED'));
    });
    app.use(crashless());

    const res = await request(app).get('/manual');
    expect(res.status).to.equal(401);
    expect(res.body.code).to.equal('UNAUTHORIZED');
  });

  // ───────────────────────────────
  // 2️⃣  ERROR MASKING & STACK TRACE
  // ───────────────────────────────

  it('should mask sensitive messages in production', async () => {
    process.env.NODE_ENV = 'production';
    const app = express();
    crashless.handleAsync(app);

    app.get('/secret', async () => {
      throw crashless.createError('Sensitive info', 500, 'SERVER_ERROR');
    });

    app.use(crashless());
    const res = await request(app).get('/secret');
    expect(res.body.message).to.equal('Internal server error');
    expect(res.body.code).to.equal('SERVER_ERROR');
  });

  it('should expose stack trace in development', async () => {
    process.env.NODE_ENV = 'development';
    const app = express();
    crashless.handleAsync(app);

    app.get('/dev', async () => {
      throw crashless.createError('Dev fail', 500, 'DEV_ERROR');
    });

    app.use(crashless());
    const res = await request(app).get('/dev');
    expect(res.body.stack).to.be.a('string');
    expect(res.body.message).to.equal('Dev fail');
  });

  // ───────────────────────────────
  // 3️⃣  EDGE CASES
  // ───────────────────────────────

  it('should gracefully handle null/undefined errors', async () => {
    const app = express();
    app.get('/null', (req, res, next) => {
      const crashlessMiddleware = crashless();
      crashlessMiddleware(null, req, res, next);
    });
    app.use(crashless());

    const res = await request(app).get('/null');
    expect(res.status).to.equal(500);
    expect(res.body.message).to.equal('Unknown error');
  });

  it('should forward when headers already sent', async () => {
    const app = express();
    crashless.handleAsync(app);

    app.get('/headers-sent', (req, res, next) => {
      res.send('Sent!');
      setImmediate(() => next(crashless.createError('Too late', 500, 'TOO_LATE')));
    });
    app.use(crashless());

    const res = await request(app).get('/headers-sent');
    expect(res.status).to.equal(200);
    expect(res.text).to.equal('Sent!');
  });

  // ───────────────────────────────
  // 4️⃣  TELEMETRY & LOGGING
  // ───────────────────────────────

  it('should trigger telemetry callback with metadata', async () => {
    let telemetryCalled = false;
    let capturedMeta = null;

    const app = express();
    crashless.handleAsync(app);
    app.get('/telemetry', async () => {
      throw crashless.createError('Telemetry test', 500, 'TELEMETRY');
    });

    app.use(crashless({
      onTelemetry: (err, meta) => {
        telemetryCalled = true;
        capturedMeta = meta;
      }
    }));

    await request(app).get('/telemetry');
    await new Promise((r) => setTimeout(r, 50));

    expect(telemetryCalled).to.be.true;
    expect(capturedMeta.path).to.equal('/telemetry');
    expect(capturedMeta.method).to.equal('GET');
  });

  it('should not log when log:false', async () => {
    let consoleCalled = false;
    const originalError = console.error;
    console.error = () => (consoleCalled = true);

    const app = express();
    crashless.handleAsync(app);

    app.get('/silent', async () => {
      throw crashless.createError('Silent fail', 500, 'SILENT');
    });
    app.use(crashless({ log: false }));

    await request(app).get('/silent');
    await new Promise((r) => setTimeout(r, 50));
    console.error = originalError;
    expect(consoleCalled).to.be.false;
  });

  // ───────────────────────────────
  // 5️⃣  SUCCESS + HELPERS
  // ───────────────────────────────

  it('should not interfere with success responses', async () => {
    const app = express();
    crashless.handleAsync(app);

    app.get('/success', (req, res) => {
      res.json({ success: true, data: 'OK' });
    });
    app.use(crashless());

    const res = await request(app).get('/success');
    expect(res.status).to.equal(200);
    expect(res.body.success).to.be.true;
  });

  it('createError should generate standardized error objects', () => {
    const err = crashless.createError('Oops', 404, 'NOT_FOUND', { id: 99 });
    expect(err).to.be.instanceOf(Error);
    expect(err.code).to.equal('NOT_FOUND');
    expect(err.status).to.equal(404);
    expect(err.details).to.deep.equal({ id: 99 });
  });

  it('createError should have sensible defaults', () => {
    const err = crashless.createError('Basic fail');
    expect(err.status).to.equal(500);
    expect(err.code).to.equal('ERR_INTERNAL');
  });
});