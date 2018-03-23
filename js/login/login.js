$(document).ready(function () {
    $("#btnIngresar").click(function (e) {
   	     e.preventDefault();
   	     mostrarLoader();
		let usuario = document.getElementById("txtUsuario").value;   
		let clave = document.getElementById("txtClave").value;      
		let claveHash = md5(clave);
		let body = {
				"grant_type":"password",
				"client_id":"chasqui",
				"username": usuario,
				"password": claveHash				
				}
				
		let encoded = window.btoa("chasqui:chasquisecret");	
		console.log(encoded);
		
		$.ajax({
					type: "POST",
					url:  "http://chasqui-gateway.herokuapp.com/uaa/oauth/token",
					contentType: "application/x-www-form-urlencoded",
					dataType: "json",
					
					headers: {
						"Authorization": "Basic " + encoded,
				
					},
					data: body,
					success: function (data) {						
						console.log(data);
						token = data.access_token;
						sessionStorage.setItem("k", token);	
					
						console.log(token);
						var usuarioLogin = {
								usuario:usuario,
								clave:clave
						}
						$.ajax({
							type: "POST",
							url:  "http://chasqui-gateway.herokuapp.com/micro-client/usuario/login?access_token=" + token, //"https://mito-zuul-sp.herokuapp.com/micro-client/persona/leerCorreo/" + correo,
							contentType: "application/json; charset=utf-8",
							data : JSON.stringify(usuarioLogin),
							dataType: "json",		
							success: function (data) {   
								console.log(data);             
								ocultarLoader();
								if(data > 0){
									sessionStorage.setItem("id", data);
									window.location.href = "paginas/personal/listadoPersonal.html";
								}else{
									alert("Credenciales incorrectas");
								}
							},								
						});
					},
	
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						console.log("Request: " + XMLHttpRequest.toString() + "\n\nStatus: " + textStatus + "\n\nError: " + errorThrown);
					}
				});	            
        });

});


    
    
    
    
    