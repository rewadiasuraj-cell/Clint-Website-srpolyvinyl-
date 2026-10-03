$(document).ready(function() {
    $('.contactformx').on('submit', function() {
        var name = $("#name");
        var address = $("#address");
        var email = $("#email");
        var mobile = $("#mobile");
        var product = $("#product");
        var message = $("#message");
        /*if(name.length==0) {
        		alert("name cannot be empty");
        		$("#name").addClass("error");
        }
         */
        
        var form = $(this);
        $.ajax({
            url: "sendemail.php",
            method: form.attr('method'),
            data: form.serialize(),
            success: function(result) {
                if (result == 'success') {
                    $('.output_message').text('Thank you for contacting us! Your message has been sent.');
                } else{
                    $('.output_message').text('Error Sending email!');
                }
            }
        });

        // Prevents default submission of the form after clicking on the submit button. 
        return false;
        /*
        
        if(isNotEmpty(name) && isNotEmpty(address) && isNotEmpty(email) && isNotEmpty(mobile)){
        	$.ajax({
        		url:'sendemail.php',
        		method:'POST',
        		dataType:'json',
        	data:{
        		name: name.val(),
        		email:email.val(),
        		subject:subject.val(),
        	message:message.val()
        	},success:function(response){
        		$('#myform')[0].reset();
        		$('.sendnotification').text("Message Send Successfully")
        	}
        	})
        }*/
    });

});

function isNotEmpty(caller) {
    if (caller.val() == "") {
        caller.css('border', '1px solid red')
    }
}