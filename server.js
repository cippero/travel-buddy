///////////////////LOAD MODULES///////////////////
require('dotenv').config(); //loads the .env
var express        = require('express');
var expressLayouts = require('express-ejs-layouts');
var bodyParser     = require('body-parser');
var flash          = require('connect-flash');
var mongoose       = require('mongoose');
var morgan         = require('morgan');
var passport       = require('./config/passportConfig');
var session        = require('express-session');
var User           = require('./models/user');
var app            = express();

///////////////CONNECT TO DATABASE////////////////
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/nutrifood');

////////////////SET & USE MODULES/////////////////
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressLayouts);
app.use(morgan('tiny'));
app.use(session({
	secret:            process.env.SESSION_SECRET,
	resave:            false,
	//saveUninitialized: true
	saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));

//just a convenience that makes life easier:
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.alerts = req.flash();
	next();
});

/////////////////////ROUTES///////////////////////
app.get('/', function(req,res) {
	res.render('search', {currentPage: 'Search'});
})

app.use('/auth', require('./routes/auth'));
app.use('/search', require('./routes/search'));
app.use('/profile', require('./routes/profile'));

app.use(function(req, res){
    res.status(404).render('404', {currentPage: 'Search'});
});

////////////////////LISTENING/////////////////////
app.listen(process.env.PORT || 3000, function(){
	console.log('Listening...');
});