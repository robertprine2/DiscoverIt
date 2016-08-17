$(document).ready(function(){
	var app = {
		currentURL: window.location.origin,
		userAuth:{},
		user:{},
	}


	//*********************
	//******HOME PAGE******
	//*********************

	//login click function starts login modal
	$('#login').on('click',function(){
		$('#loginModal').modal('show');
	});

	//submits and posts form data for first time login
	$('#successLoginSubmit').on('click',function(){
		if ($("#loginForm")[0].checkValidity()){
			
			app.userAuth.username = $('#firstLogUser').val().trim();
			app.userAuth.password = $('#firstLogPass').val().trim();
			//post login attempt
			$.post(app.currentURL + "/login", app.userAuth,
			    function(data){
			    	// TO DO...If login success... render user home page.
			    	
			    });

			return false;
		}
		else{
			$("#loginForm")[0].reportValidity()
		}
	}); // end of submit and posts form data for first time login


	//error for incorrect username or password

	//TODO: When refreshing and not logged in, modal pops up, fix this later
	if ($('#loginErrBody').text().trim() !== "") {
		$('#loginErr').modal('show');
	}


	//register click function starts register modal
	$('#register').on('click',function(){
		$('#registerModal').modal('show');
	});

	//submits modal form and stores input in user object
	$('#registerSubmit').on('click',function(){
		if ($("#regForm")[0].checkValidity()){
			
			app.user.firstName = $('#firstName').val().trim();
			app.user.lastName = $('#lastName').val().trim();
			app.user.userName = $('#userName').val().trim();
			app.user.email = $('#email').val().trim();
			if($('#img').val().trim()){app.user.image = $('#img').val().trim();}
			else{app.user.image = "/images/personlogo.jpg"}
			app.user.password = $('#password').val().trim();
			app.user.address = $('#address').val().trim();
			app.user.city = $('#city').val().trim();
			app.user.state = $('#state').val().trim();
			app.user.zip = $('#zip').val().trim();
			app.user.phone = $('#phone').val().trim();

			//post user acount
			$.post(app.currentURL + "/register", app.user,
			    function(data){
			    	// If creation success... show login modal with success message.
			    	if(data == true){
			    		$('#registerModal').modal('hide');
			    		$('#loginModal').modal('show');
			    	}
			    });

			console.log(app.user);
			return false;
		}
		else{
			$("#regForm")[0].reportValidity()
		}
	}); // end of submit register button

	//*********************
	//******USER PAGE******
	//*********************

	$('#find').on('click',function(){
		$('#searchModal').modal('show');
	return false;
	});


	//Create blue highlight when selecting elements in usermain page
	$('.clickable').click(function() {
	    $(this).addClass('active').siblings().removeClass('active');
	});


	//click function allows user to join the group, posts userAuth info and the name of the group to be joined*******Needs to then add that group to user's groups on the page***
	$('#join').on('click',function(){
		console.log($('#groupName').data('id'));
			$.post(app.currentURL + "/join", {
				group: $('#groupName').data('id')},
			    function(data){
			    	//add group to users groups 
			    });
		$('#join').hide();
		$('#leave').show();

			return false;

	});

	$('#leave').on('click', function() {
		console.log($('#groupName').data('id'));
		$.post(app.currentURL + "/leave", {groupId: ($('#groupName').data('id'))}, function(data) {
		
			
		}); // end of post

		$('#leave').hide();
		$('#join').show();

	}); // end of leave click event


	// button for different groups to take you to that groups page
	$('.group').on('click',function(){
		
			$.get(app.currentURL + "/group", {group: $('#name').data('name')},

			    function(data){
			    	if(data){

			    	}
			    });

			return false;

	}); // end of button for specfic group page

	//create group click function starts create group modal
	$('#create').on('click',function(){
		$('#createGroup').modal('show');
	return false;
	}); // end of create group modal

	//submits modal form and stores input in group object
	$('#createSubmit').on('click',function(){
		if ($("#createForm")[0].checkValidity()){
			var group = {};
			group.name = $('#groupName').val().trim();
			group.description = $('#description').val().trim();
			// TO DO***** group.createdBy = ;*******need to group userName that is creating group

			//post group
			$.post(app.currentURL + "/creategroup", group,
			    function(data){
			    	if(data){
			    	$('#createGroup').modal('hide');
			    }
			    });

			console.log(group);
			return false;
		}
		else{
			$("#createForm")[0].reportValidity()
		}
	}); // end of submit modal form to store group object

	$('#driver').on('click', function(){
		$('#driverModal').modal('show');
	});

	$('#driverSubmit').on('click', function(){
		
	if ($("#driverForm")[0].checkValidity()){
		$.post(app.currentURL + "/driver", { groupid: $('#driver').data('id'),
											 seats: $('#seats').val().trim(),
											 info: $('#info').val().trim()},
			    function(data){
			    	if(data){
			    	$('#driverModal').modal('hide');
			    }
			    });
	} else{$("#driverForm")[0].reportValidity()}

	$("#driver").hide();
	return false;
	});

	$('.passenger').on('click',function(){
		var driver = $(this).data('id')

			$.post(app.currentURL + "/passenger", {
				driver: driver},
			    function(data){
			    	//add group to users groups 
			    });
		
		

			return false;

	});



}); // end of document.ready function

