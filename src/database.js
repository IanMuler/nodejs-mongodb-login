const mongoose = require('mongoose');
const { mongodb } = require('./keys')

mongoose.connect(mongodb.URI, {useNewUrlParser: true, useUnifiedTopology: true} )
    .then(db => console.log('connected db'))
    .catch(err => console.log(err))