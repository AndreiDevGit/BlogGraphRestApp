const expect = require('chai').expect
const sinon = require('sinon')
const mongoose = require('mongoose')

const User = require('../models/user')
const FeedController = require('../controllers/feed')

describe('Feed Controller', function() {
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

  it('should add a created post to the posts of the creator', function(done) {
    const req = {
      body: {
        title: 'Test Post',
        content: 'A Test Post'
      },
      file: {
        path: 'abc'
      },
      userId: '66e1bc0ee8155343f254ba70'
    }
    const res = {
      status: function() {
        return this
      },
      json: function() {
      }
    }

    FeedController.createPost(req, res, () => {
    }).then(savedUser => {
      expect(savedUser).to.have.property('posts')
      expect(savedUser.posts).to.have.length(1)
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
