const expect = require('chai').expect
const sinon = require('sinon')
const mongoose = require('mongoose')

const User = require('../models/user')
const AuthController = require('../controllers/auth')

describe('Auth Controller', function() {
  before(function(done) {
    mongoose
      .connect(
        'mongodb+srv://andreidev:andreidev@project0.ee9xrg1.mongodb.net/test-messages?retryWrites=true&w=majority&appName=Project0'
      )
      .then(result => {
        const user = new User({
          email: 'andrei@test.com',
          password: 'qweqwe',
          name: 'AndreDev',
          posts: [],
          _id: '66e1bc0ee8155343f254ba70'
        })
        return user.save()
      })
      .then(() => {
        done()
      })
  })

  beforeEach(function() {
  })

  afterEach(function() {
  })

  it('should throw an error with code 500 if accessing the database fails', function(done) {
    sinon.stub(User, 'findOne')
    User.findOne.throws()

    const req = {
      body: {
        email: 'andrei@test.com',
        password: 'qweqwe'
      }
    }

    AuthController.login(req, {}, () => {
    }).then(result => {
      expect(result).to.be.an('error')
      expect(result).to.have.property('statusCode', 500)
      done()
    })

    User.findOne.restore()
  })

  it('should send a response with a valid user status for an existing user', function(done) {
    const req = { userId: '66e1bc0ee8155343f254ba70' }
    const res = {
      statusCode: 500,
      userStatus: null,
      status: function(code) {
        this.statusCode = code
        return this
      },
      json: function(data) {
        this.userStatus = data.status
      }
    }
    AuthController.getUserStatus(req, res, () => {
    }).then(() => {
      expect(res.statusCode).to.be.equal(200)
      expect(res.userStatus).to.be.equal('This is new status!')
      done()
    })
  })

  after(function(done) {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect()
      })
      .then(() => {
        done()
      })
  })
})
