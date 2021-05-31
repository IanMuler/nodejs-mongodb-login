const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const morgan = require('morgan');
const passport = require('passport')
const session = require('express-session')
const flash = require('connect-flash')

// Initializations
const app = express();
require('./database')
require('./passport/local-auth')


//settings
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));//para tomar los datos desde la url enviada en el form
app.use(session({ // crea session de express-session
    secret: 'mySecretSession',
    resave: false,
    saveUninitialized: false
}))
app.use(flash()); // antes de passport y después de sessions - manda mensajes entre multiples páginas
app.use(passport.initialize())
app.use(passport.session())

//Global variables
app.use((req, res, next) => {
    app.locals.signupMessage = req.flash('signupMessage')
    app.locals.signinMessage = req.flash('signinMessage')
    app.locals.user = req.user,
    next();
})

//starting the server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'))
})

//routes
app.use('/', require('./routes'))