const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; // método de autenticación

const User = require('../models/user')

passport.serializeUser((user, done) => {
    done(null, user.id)
});

passport.deserializeUser( async (id, done) => {
    const user = await User.findById(id); // consulta a base de datos
    done(null, user);
});

passport.use('local-signup', new LocalStrategy({ // declaración del método
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
}, 
    async (req, email, password, done) => { //creación y guardado del usuario
    
    const user = await User.findOne({email: email}); //no olvidar AWAIT en busqueda en DB

    if(user){
        return done(null, false, req.flash('signupMessage', 'Email already exist'));
   } else {
    const newUser = new User();
    newUser.email = email;
    newUser.password =  newUser.encryptPassword(password);
    await newUser.save();
    done(null, newUser);
   }
}));

passport.use('local-signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
}, async (req, email, password, done) => {
    
    const user = await User.findOne({email: email});
    if (!user) {
        return done(null, false, req.flash('signinMessage','No user found'));
    } 
    if (!user.comparePassword(password)){//método creado en model//user.js
        return done(null, false, req.flash('signinMessage', 'Incorrect password'));
    } 
    done(null, user);

}))