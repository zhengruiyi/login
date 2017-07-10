const express = require('express');
const expressSession = require('express-session');
const mustacheExpress = require('mustache-express');
const parseUrl = require('parseurl');
const bodyParser = require('body-parser');

const app = express();

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

app.use(express.static('/public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(3000, function () {
  console.log('Successfully started application!');
});

var usernameInput = '';
var passwordInput = '';

var loginAttempt = false;


var userDatabase = { users : [
  { username:"scott" , password:"123" },
  { username:"john" , password:"456" },
  { username:"jake" , password:"789" } ]};

app.use(expressSession({
  secret: 'car',
  resave: false,
  saveUninitialized: true
}))


app.get('/', function(request, response){
  if(loginAttempt === true){
    response.render('index', {
      loginAttempt: loginAttempt
    });
  } else {
    response.redirect('/login');
  }
})

app.get('/login', function (request, response) {
  response.render('login', {
    loginAttempt: loginAttempt
  });
})

app.post('/login', function(request, response){
  usernameInput = request.body.username;
  passwordInput = request.body.password;

  request.session.user = usernameInput;
  request.session.password = passwordInput;


  for (var i = 0; i < userDatabase.users.length; i++) {
    if(request.session.user === userDatabase.users[i].username && request.session.password === userDatabase.users[i].password){
      response.redirect('/');
    } else {
      loginAttempt = true;
      response.redirect('login');
      response.render('login', {
        loginAttempt: loginAttempt
      });
    }
  }
})
