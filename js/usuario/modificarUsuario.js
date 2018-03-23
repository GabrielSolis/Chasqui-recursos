function modificarContrasenia(usuario,callback){
		$.ajax({
			beforeSend: mostrarLoader(),
			method:'PUT',
			url:'http://chasqui-gateway.herokuapp.com/micro-client/usuario/',//'http://localhost:9000/usuario/',
			data: JSON.stringify(usuario),
			processData:false,
			contentType: "application/json; charset=utf-8",
			headers: {
				//"Content-Type":"application/json",
				//"Access-Control-Allow-Origin":"*",
				"Authorization": "Bearer " + token
			},
		}).done(function(respuesta){
			callback(respuesta);
			ocultarLoader();
		})
	}
function listarUsuario(codigoUsuario,callback){
	
	$.ajax({
		method:'GET',
		url:'http://localhost:9000/usuario/'+codigoUsuario,
		processData:false,
		headers: {
		//	"Content-Type":"application/json",
		//	"Access-Control-Allow-Origin":"*",
			"Authorization": "Bearer " + token
		},
	}).done(function(respuesta){
		callback(respuesta);
	})
}
$(document).ready(function(){
	revisarSesion();
	ocultarLoader();
	$('#cerrarSesion').click(function(e){
			e.preventDefault();
			cerrarSesion();
			alert("Hasta luego");
	});
	var codigoUsuario;
	codigoUsuario = localStorage.getItem('codigoUsuario');
	var usuario;
	if(codigoUsuario == undefined){
		location.href ="index.html";
	};
	listarUsuario(codigoUsuario,function(respuestaUsuario){
		
		usuario = respuestaUsuario[0];
		$('#txtUsuario').val(usuario.usuario);
	});
	
	$('#btnModificar').click(function(e){
		e.preventDefault();
		var claveActual = $('#txtClaveActual').val();
		var nuevaClave = $('#txtNuevaClave').val();
		var nuevaClave1 = $('#txtNuevaClave1').val();
	
		if(nuevaClave == nuevaClave1 && nuevaClave != ''){
			if(nuevaClave.length<6){
				$('#tituloRespuesta').text("Modificar contraseña");
				$('#contenidoRespuesta').text("La contraseña debe ser mayor a 6 caracteres");
				$('#modalRespuesta').modal({
					show:true,
					backdrop:'static'
				});
			}else{
				usuario.claveAntigua = claveActual;
				usuario.clave = nuevaClave;
				modificarContrasenia(usuario,function(respuesta){
					$('#tituloRespuesta').text("Modificar contraseña");
					$('#contenidoRespuesta').text(respuesta);
					$('#modalRespuesta').modal({
						show:true,
						backdrop:'static'
					});
					$('#txtClaveActual').val("");
					$('#txtNuevaClave').val("");
					 $('#txtNuevaClave1').val("");
				
				});
			}
		}else{
			$('#tituloRespuesta').text("Error en modificar contraseña");
			$('#contenidoRespuesta').text("Las contraseñas nuevas no coinciden");
			$('#modalRespuesta').modal({
				show:true,
				backdrop:'static'
			});
			
		}
		
		
	});
});