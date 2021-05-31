const express = require('express');
const router = express.Router();

const passport = require('passport');

router.get('/', (req, res, next) => {
    res.render('index')
})

router.get('/signup', (req, res, next) => {
    if(req.isAuthenticated()) {
        res.redirect('/')
    }
    res.render('signup')
})

router.post('/signup', passport.authenticate('local-signup',{
    successRedirect: '/profile',
    failureRedirect: '/signup',
    passReqToCallback: true
}))

router.get('/signin', (req, res, next) => {
    if(req.isAuthenticated()) {
        res.redirect('/')
    }
    res.render('signin')
})

router.post('/signin', passport.authenticate('local-signin',{
    successRedirect: '/profile',
    failureRedirect: '/signin',
    passReqToCallback: true
}))

router.use((req, res, next) => { // para verificar usuario activo antes de utilizar las rutas de abajo
    isAuthenticated(req, res, next);
    next();
})

router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/')
})

router.get('/profile', (req, res, next) => {
    res.render('profile')
})

function isAuthenticated(req, res, next){
    if(req.isAuthenticated()) {
        return next()
    }
    res.redirect('/')
}

module.exports = router;