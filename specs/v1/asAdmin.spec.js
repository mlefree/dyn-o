const chai = require('chai');
chai.use(require('chai-as-promised'));
const { expect } = require('chai');
const assert = chai['assert'];
const should = chai.should();

const {
  $app,
  request,
} = require('../helper');

describe('as Administrator', () => {

  before(async () => {
  });

  it('should (get) check', async () => {
    const res = await request(await $app)
      .get('/v1/check')
      .expect('Content-Type', /application\/json/)
      .expect(200);

    expect(res.body.done.ok).to.eq(false);
  });

});
