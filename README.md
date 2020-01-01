<h1>prerequisites:</h1>
--stripe API keys
--SSL Certificate, either by LetsEncrypt or CA authority. self signed certs work for testing,

<h2>Building instructions</h2>
to build, run npm install

some of the variables you will need to set for production enviornment,
--in main.js, your public key for stripe
--in server.js your private key for stripe

refer to this linke when taking this site live
https://stripe.com/docs/checklist