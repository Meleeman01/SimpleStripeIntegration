//where the backend js lives.
const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const stripe = require('stripe')('sk_test_hmmExLMUPna7gNr0En6nhMEX00KHvh3PkW');
const crypto = require('crypto');

const app = express();

const https = require('https');
const fs = require('fs');

const port = process.env.PORT || 3000;




app.set('view engine', 'hbs');

// Basic Middleware
app.set('views', __dirname + '/public');
// svg Sprites from Font Awesome
app.use(express.static(__dirname+'/node_modules/@fortawesome/fontawesome-free/sprites'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));




//get all of our dependencies
app.get('/bulma.min.css',(req,res)=> res.sendFile(__dirname + '/node_modules/bulma/css/bulma.min.css'));
app.get('/main.css',(req,res)=> res.sendFile(__dirname + '/public/css/main.css'));
app.get('/sample.mp4',(req,res)=> res.sendFile(__dirname + '/public/sample.mp4'));
app.get('/main.js',(req,res)=> res.sendFile(__dirname + '/public/js/main.js'));
app.get('/sample.pdf',(req,res)=> res.sendFile(__dirname + '/content/sample.pdf'));


// Basic Routes
app.get('/', function (req, res) {
    res.render('index',{
    });
});

app.get('/success', function (req,res) {
    res.render('success',{
    });
});

//generates a unique hash for a download link 
function generateSecureHash(){
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var sha256 = crypto.createHash('sha256').update('Apple'+ date).digest('hex');
    var token = {
        hash:sha256
    };
    console.log('hash Created.\n'+sha256);
    console.log(token);
    return token;
}

app.post('/charge', function(req,res){

    // Token is created using Stripe Checkout or Elements!
    // Get the payment token ID submitted by the form:
    const token = req.body.stripeToken; // Using Express
    const email = req.body.email;

    (async () => {
        const charge = await stripe.charges.create({
            amount: 1500,
            currency: 'usd',
            description: 'Example charge',
            source: token,
            receipt_email: email,
        },function(err,charge){
            if(err) {
                console.log('there is an error with your transaction');
                switch (err.type) {
                case 'StripeCardError':
                    // A declined card error
                    console.log(err.message); // => e.g. "Your card's expiration year is invalid."
                    break;
                case 'StripeRateLimitError':
                    // Too many requests made to the API too quickly
                    console.log(err.message);
                    break;
                case 'StripeInvalidRequestError':
                    // Invalid parameters were supplied to Stripe's API
                    console.log('StripeInvalidRequestError: '+err.message);
                    break;
                case 'StripeAPIError':
                    // An error occurred internally with Stripe's API
                    console.log(err.message);
                    break;
                case 'StripeConnectionError':
                    // Some kind of error occurred during the HTTPS communication
                    console.log(err.message);
                    break;
                case 'StripeAuthenticationError':
                    // You probably used an incorrect API key
                    console.log(err.message);
                    break;
                default:
                    // Handle any other types of unexpected errors
                    console.log("unexpected error: "+err.message);
                    res.redirect('/index');
                    break;
                }
                res.render('index', {
                    errs: err.message
                });
            }
            else{
                console.log(charge.source);
                res.render('success',{
                    token:generateSecureHash()
                });
            }
        });
    })();

    //res.redirect('/index');
});


https.createServer({
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
},app).listen(port);