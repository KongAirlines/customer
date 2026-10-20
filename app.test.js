const { expect } = require('chai');
const request = require('supertest')(require('./app'));
const A = '11111111-1111-4111-8111-111111111111';
const B = '22222222-2222-4222-8222-222222222222';
describe('Customer application accounts', () => {
  it('keeps health available without identity', async () => {
    expect((await request.get('/health')).status).to.equal(200);
  });
  it('rejects missing, malformed, and legacy identities', async () => {
    expect((await request.get('/customer')).status).to.equal(401);
    expect((await request.get('/customer').set('X-KongAir-Account-ID', 'jdoe')).status).to.equal(401);
    expect((await request.get('/customer').set('X-Consumer-Username', 'jdoe')).status).to.equal(401);
  });
  it('returns deterministic synthetic customer data isolated by application', async () => {
    const a = await request.get('/customer').set('X-KongAir-Account-ID', A);
    const again = await request.get('/customer').set('X-KongAir-Account-ID', A);
    const b = await request.get('/customer').set('X-KongAir-Account-ID', B);
    expect(a.status).to.equal(200);
    expect(a.body).to.deep.equal(again.body);
    expect(a.body.id).to.equal(A);
    expect(b.body.id).to.equal(B);
    expect(a.body.username).not.to.equal(b.body.username);
    expect(a.body.information.payment_methods).to.deep.equal([]);
  });
  it('ignores a legacy passenger header when selecting an application account', async () => {
    const res = await request.get('/customer').set('X-KongAir-Account-ID', A)
      .set('X-Consumer-Username', 'jdoe');
    expect(res.status).to.equal(200);
    expect(res.body.id).to.equal(A);
    expect(res.body.username).not.to.equal('jdoe');
  });
});
