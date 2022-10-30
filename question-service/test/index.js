let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();

chai.use(chaiHttp);

describe('Questions', () => {
    describe('/GET easy question', () => {
        it('it should GET an easy question', (done) => {
          chai.request(server)
            .get('/questions/easy')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.data.should.have.property("difficulty").eql("Easy");
                done();
              });
          });
      });

      describe('/GET medium question', () => {
        it('it should GET a medium question', (done) => {
          chai.request(server)
            .get('/questions/medium')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.data.should.have.property("difficulty").eql("Medium");
                done();
              });
          });
      });

      describe('/GET hard question', () => {
        it('it should GET a hard question', (done) => {
          chai.request(server)
            .get('/questions/hard')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.data.should.have.property("difficulty").eql("Hard");
                done();
              });
          });
      });
})
