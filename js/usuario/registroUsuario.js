
function registrarUsuario(usuario,callback){
	$.ajax({
		beforeSend:mostrarLoader(),
		method:'POST',
		url:'http://chasqui-gateway.herokuapp.com/micro-client/usuario/',//'http://localhost:9000/usuario/',
		data:JSON.stringify(usuario),
		contentType: "application/json; charset=utf-8",
		headers: {
			//"Content-Type":"application/json",
			//"Access-Control-Allow-Origin":"*",
			  "Authorization": "Bearer " + token
		},
		processData:false,
	}).done(function(respuesta){
		callback(respuesta);
		ocultarLoader();
	})
}


function generarUsuario(codigoPersonal){
	var indice;
	indice = buscarPersonal(codigoPersonal);
	
	var usuario = {
			personal : listaPersonal[indice],
			vigencia:true
	}

	registrarUsuario(usuario,function(usuario){
		if(usuario != '' && usuario != undefined){
			$('#usuario').text(usuario);
			$('#clave').text(usuario);
			$('#modalUsuario').modal({
				show:true,
				backdrop:'static'
			});
		}
		
	});
}

function buscarPersonal(codigoPersonal){
	for(var i=0;i<listaPersonal.length;i++){
		if(listaPersonal[i].codigo == codigoPersonal){
			
			return i;
		}
	}
}
