$(document).ready(function(){	
	var userRecords = $('#userListing').DataTable({
		"lengthChange": false,
		"processing":true,
		"serverSide":true,		
		"bFilter": false,
		'serverMethod': 'post',		
		"order":[],
		"ajax":{
			url:"users_action.php",
			type:"POST",
			data:{action:'listUsers'},
			dataType:"json"
		},
		"columnDefs":[
			{
				"targets":[0, 5,6,7,8],
				"orderable":false,
			},
		],
		"pageLength": 10
	});	
	
	$(document).on('click', '.view', function(){
		var id = $(this).attr("id");
		var action = 'getUser';
		$.ajax({
			url:'users_action.php',
			method:"POST",
			data:{id:id, action:action},
			dataType:"json",
			success:function(respData){				
				$("#userDetails").on("shown.bs.modal", function () {
					var resultHTML = '';
					respData.data.forEach(function(item){						
						resultHTML +="<tr>";
						for (var i = 0; i < item.length; i++) {							 
							 resultHTML +="<td>"+item[i]+"</td>";
						}
						resultHTML +="</tr>";
					});					
					$('#userList').html(resultHTML);											
				}).modal();			
			}
		});
	});
	$(document).on('click', '.viewExam', function(){
		console.log('here');
		var userId = $(this).attr("id");
		var action = 'getUserExam';
		$.ajax({
			url: 'users_action.php',
			method: "POST",
			data: { userId: userId, action: action, draw: 1 }, // Add draw to the request data
			dataType: "json",
			success: function(respData){  
				console.log(respData);              
				// Create a form and submit it
				var form = $('<form>', {
					action: 'userExamDetails.php',
					method: 'post',
					style: 'display: none;'
				}).append($('<input>', {
					type: 'hidden',
					name: 'examData',
					value: JSON.stringify(respData.data)
				}));
		
				$('body').append(form);
				console.log("Form appended and submitted");
				form.submit();
			},
			error: function(xhr, status, error) {
				console.error('AJAX Error: ', status, error);
				console.log(xhr.responseText);
			}
		});
	});
	
	
	
	
	
	
	$('#addUser').click(function(){
		$('#userModal').modal('show');
		$('#userForm')[0].reset();
		$('.modal-title').html("<i class='fa fa-plus'></i> Add User");
		$('#action').val('addUser');
		$('#save').val('Save');
	});	
	
	
	$(document).on('click', '.update', function(){
		var userId = $(this).attr("id");
		var action = 'getUserDetails';
		$.ajax({
			url:'users_action.php',
			method:"POST",
			data:{userId:userId, action:action},
			dataType:"json",
			success:function(data){
				$('#userModal').modal('show');
				$('#userId').val(data.id);
				$('#firstName').val(data.first_name);
				$('#lastName').val(data.last_name);
				$('#email').val(data.email);
				$('#address').val(data.address);
				$('#mobile').val(data.mobile);
				$('#role').val(data.role);
				$('#gender').val(data.gender);				
				$('.modal-title').html("<i class='fa fa-plus'></i> Edit User");
				$('#action').val('updateUser');
				$('#save').val('Save');
			}
		})
	});

	$(document).on('submit','#userForm', function(event){
		event.preventDefault();
		$('#save').attr('disabled','disabled');
		var formData = $(this).serialize();
		$.ajax({
			url:"users_action.php",
			method:"POST",
			data:formData,
			success:function(data){				
				$('#userForm')[0].reset();
				$('#userModal').modal('hide');				
				$('#save').attr('disabled', false);
				userRecords.ajax.reload();
			}
		})
	});	

	$(document).on('click', '.delete', function(){
		var userId = $(this).attr("id");		
		var action = "deleteUser";
		if(confirm("Are you sure you want to delete this record?")) {
			$.ajax({
				url:"users_action.php",
				method:"POST",
				data:{userId:userId, action:action},
				success:function(data) {					
					userRecords.ajax.reload();
				}
			})
		} else {
			return false;
		}
	});	
});