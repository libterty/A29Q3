const chai = require('chai');
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
const should = chai.should();
const expect = chai.expect;

describe('GET /', () => {
  it('should return login page if a user is not logged in', done => {
    chai
      .request('http://localhost:3000')
      .get('/')
      .end((err, res) => {
        should.not.exist(err);
        expect(res).to.redirectTo('http://localhost:3000/users/login');
        done();
      });
  });

  it('should return to restaurant page', done => {
    chai
      .request('http://localhost:3000')
      .post('/users/login')
      .type('form')
      .send({
        _method: 'post',
        email: 'test2@test.com',
        password: '123'
      })
      .end((err, res) => {
        should.not.exist(err);
        expect(res).to.redirectTo('http://localhost:3000/');
        done();
      });
  });

  it('should logout a user', done => {
    chai
      .request('http://localhost:3000')
      .get('/users/logout')
      .end((err, res) => {
        should.not.exist(err);
        // console.log(res);
        res.status.should.eql(200);
        expect(res).to.redirectTo('http://localhost:3000/users/login');
        done();
      });
  });

  it('should return back to login after fail login', done => {
    chai
      .request('http://localhost:3000')
      .post('/users/login')
      .type('form')
      .send({
        _method: 'post',
        email: 'test2@test.com',
        password: '11111'
      })
      .end((err, res) => {
        should.not.exist(err);
        expect(res).to.redirectTo('http://localhost:3000/users/login');
        done();
      });
  });
});

describe('POST /users/register', () => {
  describe('Form success', () => {
    it('should return to the login if user signup success', done => {
      chai
        .request('http://localhost:3000')
        .post('/users/register')
        .type('form')
        .send({
          _method: 'post',
          name: 'lib2',
          email: 'lib2@example.com',
          password: '12345678',
          password2: '12345678'
        })
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(200);
          done();
        });
    });
  });
});

describe('POST /users/register', () => {
  describe('From Error', () => {
    it('should return back 200 if user already exists ', done => {
      chai
        .request('http://localhost:3000')
        .post('/users/register')
        .type('form')
        .send({
          _method: 'post',
          name: 'lib1',
          email: 'lib1@example.com',
          password: '12345678',
          password2: '12345678'
        })
        .end((err, res) => {
          should.not.exist(err);
          res.should.be.status(200);
          res.should.be.an('object');
          done();
        });
    });

    it('should return back 400 if users password with wrong input', done => {
      chai
        .request('http://localhost:3000')
        .post('/users/register')
        .type('form')
        .send({
          _method: 'post',
          name: 'lib1',
          email: 'lib1@example.com',
          password: '12345678',
          password2: '12342341'
        })
        .end((err, res) => {
          should.not.exist(err);
          res.should.be.status(400);
          res.error.text.should.be.eql('密碼輸入錯誤');
          done();
        });
    });

    it('should return back 400 if users input blank', done => {
      chai
        .request('http://localhost:3000')
        .post('/users/register')
        .type('form')
        .send({
          _method: 'post',
          name: 'lib2',
          email: '',
          password: '',
          password2: ''
        })
        .end((err, res) => {
          should.not.exist(err);
          res.should.be.status(400);
          res.error.text.should.be.eql('信箱和密碼是必填');
          done();
        });
    });
  });
});
