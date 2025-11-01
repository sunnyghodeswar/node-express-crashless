import express from 'express';
import request from 'supertest';
import { expect } from 'chai';
import crashless from 'crashless';

describe('Crashless exporters', () => {
  it('should call registered exporters asynchronously', async () => {
    let called = false;

    crashless.registerExporter('mock', (err, meta) => {
      called = true;
      expect(meta.method).to.equal('GET');
      expect(meta.path).to.equal('/fail');
    });

    const app = express();
    crashless.handleAsync(app);

    app.get('/fail', async () => {
      throw crashless.createError('Exporter test', 500, 'TEST_EXPORT');
    });

    app.use(crashless());
    await request(app).get('/fail');
    await new Promise((r) => setTimeout(r, 50));

    expect(called).to.be.true;
  });
});
