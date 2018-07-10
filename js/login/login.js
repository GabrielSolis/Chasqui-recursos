function obtenerCorreoUsuario(callback){

	$.ajax({
		//beforeSend: function(){$("#modalCargando").modal('show')},
		beforeSend: mostrarLoader(),
		url:'https://chasqui-gateway.herokuapp.com/micro-client/usuario/'+localStorage.getItem("usuario"),//'http://localhost:9000/unidades/'+localStorage.getItem("idRegistroUnidad"),
		headers:{
			"Authorization": "Bearer " + token
		}
	}).done(function(socio){
		console.log('correo listado: ' + JSON.stringify(socio));
		//$("#modalCargando").modal('hide');
		callback(socio);

	})
}
$(document).ready(function () {
    $("#btnIngresar").click(function (e) {
   	     e.preventDefault();

		let usuario = document.getElementById("txtUsuario").value;
		let clave = document.getElementById("txtClave").value;
		let claveHash = md5(clave);

		if (usuario.length<6) {

			$('#tituloRespuesta').text("Error");
			$('#contenidoRespuesta').text("Ingresar un usuario de 6 digitos como minimo");
			$('#contenidoRespuesta02').text("");
			$('#modalRespuesta').modal({

				show:true,
				backdrop:'static'
			});

		}else{
			if(clave.length<6){
				$('#tituloRespuesta').text("Error");
				$('#contenidoRespuesta').text("Ingresar una contraseña de 6 digitos como minimo");
				$('#contenidoRespuesta02').text("");
				$('#modalRespuesta').modal({

					show:true,
					backdrop:'static'
				});
			}else{
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
						beforeSend:mostrarLoader(),
						url:  "https://chasqui-gateway.herokuapp.com/uaa/oauth/token",
						//url:  "http://localhost:8099/uaa/oauth/token",
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
								url:  "https://chasqui-gateway.herokuapp.com/micro-client/usuario/login?access_token=" + token, //"https://mito-zuul-sp.herokuapp.com/micro-client/persona/leerCorreo/" + correo,
								//url: "http://localhost:9000/micro-client/usuario/login?access_token=" + token,
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
				}
			}

        });

 	$("#linkRecuperar").click(function () {
    	let usuario = document.getElementById("txtUsuario").value;

		if (usuario.length<6) {

			$('#tituloRespuesta').text("Error");
			$('#contenidoRespuesta').text("Ingresar un usuario de 6 digitos como minimo");
			$('#contenidoRespuesta02').text("");
			$('#modalRespuesta').modal({

				show:true,
				backdrop:'static'
			});

		}else{
			obtenerCorreoUsuario(usuario,function(correo){
				$('#tituloRespuesta').text("Recuperar contraseña");
				$('#contenidoRespuesta').text("Se envio un 'Codigo' a su correo: "+correo);
				$('#contenidoRespuesta02').text("Ingrese Codigo :");
				$('#modalRespuesta').modal({

					show:true,
					backdrop:'static'
				});
    		});

		}
    });

});






