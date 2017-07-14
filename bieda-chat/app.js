let express = require('express')
let passport = require('passport')
let util = require('util')
let session = require('express-session')
let bodyParser = require('body-parser')
let methodOverride = require('method-override')
let GitHubStrategy = require('passport-github2').Strategy
let partials = require('express-partials')
let request = require('request')

let app = express()

let server = require('http').Server(app)
let io = require('socket.io')(server)


io.on('connection', function (socket) {
  socket.on('setUsername', function (data) {
    socket.emit('userSet', { username: data })
  })

  socket.on('exportToJson', function(){
    let params = {
      method: 'post',
      json: true,
      url: 'http://127.0.0.1:3001/messages/export_to_json',
      body: {}
    }
    request(params, function (err, res, body) {})
  })

  socket.on('exportToXml', function(){
    let params = {
      method: 'post',
      json: true,
      url: 'http://127.0.0.1:3001/messages/export_to_xml',
      body: {}
    }
    request(params, function (err, res, body) {})
  })

  socket.on('msg', function (data) {
    io.sockets.emit('newmsg', data)

    let params = {
      method: 'post',
      json: true,
      url: 'http://127.0.0.1:3001/messages/create',
      body: data
    }
    request(params, function (err, res, body) {})
  })
})

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (obj, done) {
  done(null, obj)
})

passport.use(new GitHubStrategy({
  clientID: '2689755f0bf862f32165',
  clientSecret: '4f6ecdb925f426c7fbb77f313bafe2e663652954',
  callbackURL: "http://127.0.0.1:3000/auth/github/callback"
},
  function (accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile)
    })
  }
))

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')
app.use(partials())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(methodOverride())
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }))

app.use(passport.initialize())
app.use(passport.session())

app.get('/', function (req, res) {
  res.render('index', { user: req.user })
})

app.get('/chat', ensureAuthenticated, function (req, res) {
  res.render('chat', { user: req.user })
})

app.get('/login', function (req, res) {
  res.render('login', { user: req.user })
})

app.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] }),
  function (req, res) {
})

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/')
})

app.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/')
})

server.listen(3000)


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next() }
  res.redirect('/login')
}
