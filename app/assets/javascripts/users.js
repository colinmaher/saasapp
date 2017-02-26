/* global $, Stripe */
$(document).on('turbolinks:load', function(){
    var theForm = $('#pro_form');
    var submitBtn = $('form-submit-btn');
    //Set Stripe public key;
    Stripe.setPublishableKey( $('meta[name="stripe-key"]').attr('content'));
    //When user clicks form submit btn
    submitBtn.click(function(event){
        //prevent default submission of fields
            event.preventDefault();
            submitBtn.val("Processing").prop('disabled', true);
            //collect the card fields
            var ccNum = $('#card_number').val(),
                cvcNum = $('#card_code').val(),
                expMonth = $('#card_month').val(),
                expYear = $('#card_year').val();
            //Send the card info to stripe
            
        
        //Stripe will return a card token
        //Inject card token as a hidden field to form
        //Submit form to our Rails app
        var error = false;
        //Validate CVC number
        if (!Stripe.card.validateExpiry(cvcNum)) {
            error = true;
            alert('The expiration date appears to be invalid');
        }
        
        if (!Stripe.card.validateExpiry(expMonth, expYear)) {
            error = true;
            alert('The expiration date appears to be invalid');
        }
        
        if (error) {
            submitBtn.prop('disabled', false).val("Sign Up");
        } else {
            //Send the are card info to Stripe
            Stripe.createToken({
               number: ccNum,
               cvc: cvcNum,
               exp_month: expMonth,
               exp_year: expYear
            }, stripeResponseHandler);
        }
        return false;
    });
    function stripeResponseHandler(status, response) {
        //Get the token from the response.
        var token = response.id;
        //Inject the card token in a hidden field.
        theForm.append( $('<input type="hidden" name="user[stripe_card_token]">').val(token) );
        //Submit form to our Rails app.
        theForm.get(0).submit();
    }
});