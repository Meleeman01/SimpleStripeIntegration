//main.js
var stripe = Stripe('pk_test_4lIBlprsnftDmlqOeIbKnedx00E8I3I1gB');
var elements = stripe.elements();

//for payment modals
let button = document.querySelector('#button');
let modal = document.querySelector('.modal');
let modalExit = document.querySelector('.modal-close');

button.addEventListener('click',function() {
    //stripe integration
    modal.classList.add('is-active');

});

modalExit.addEventListener('click',function(e){
    modal.classList.remove('is-active');
    e.stopImmediatePropagation();
});

//stripe card styling
var style = {
    base: {
        color: '#32325D',
        fontWeight: 500,
        fontFamily: 'Source Code Pro, Consolas, Menlo, monospace',
        fontSize: '16px',
        fontSmoothing: 'antialiased',

        '::placeholder': {
            color: '#CFD7DF',
        },
        ':-webkit-autofill': {
            color: '#e39f48',
        },
    },
    invalid: {
        color: '#E25950',

        '::placeholder': {
            color: '#FFCCA5',
        },
    },};
// Create an instance of the card Element.
var card = elements.create('card', {style: style});

// Add an instance of the card Element into the `card-element` <div>.
card.mount('#card-element');

// Create a token or display an error when the form is submitted.
var form = document.getElementById('payment-form');

form.addEventListener('submit', function(event) {
    event.preventDefault();

    stripe.createToken(card).then(function(result) {
        if (result.error) {
            // Inform the customer that there was an error.
            var errorElement = document.getElementById('card-errors');
            errorElement.textContent = result.error.message;
        }
        else {
        // Send the token to your server.
            stripeTokenHandler(result.token);
        }
    });
});

function stripeTokenHandler(token) {
    // Insert the token ID into the form so it gets submitted to the server
    var hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', 'stripeToken');
    hiddenInput.setAttribute('value', token.id);
    form.appendChild(hiddenInput);

    // Submit the form
    form.submit();
}
