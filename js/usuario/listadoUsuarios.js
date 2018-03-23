var listaUsuarios = new Array();
function listarUsuarios(estado,callback){
	console.log(estado);
	$.ajax({
		beforeSend:mostrarLoader(),
		url:'http://chasqui-gateway.herokuapp.com/micro-client/usuario/'+estado,//'http://localhost:9000/usuario/'+estado,
		headers: {
			//"Content-Type":"application/json",
			//"Access-Control-Allow-Origin":"*",
			"Authorization": "Bearer " + token
		},
		processData:false
	}).done(function(socios){
		ocultarLoader();
		callback(socios);
	})
}

function mostrarUsuario(usuario,i){
	var cuerpo = $("#cuerpoTablaUsuarios");
	var estado;
	
	var contenidoFila = "";
	
	console.log(usuario.personal.cargo);
	
	if(usuario.estado == true){
			estado ="Activo";
			contenidoFila = "<td><button id='btnBaja"+usuario.codigo+"' onClick='darBaja("+usuario.codigo+")'class='btn btn-info mr-2'data-toggle='tooltip' data-placement='top' title='Dar de baja'>" +
			"<i class='fas fa-arrow-down'></i></button></td></tr>";
		}else{
			estado ="Inactivo";
			 contenidoFila ="<td><button id='btnAlta"+usuario.codigo+"'  onClick='darAlta("+usuario.codigo+")'class='btn btn-info mr-2'data-toggle='tooltip' data-placement='top' title='Dar de alta'>" +
	 		"<i class='fas fa-arrow-up'></i></button></td></tr>"
		}
	 contenidoFila = "<tr id='"+usuario.codigo+"'>" +
	"<th>"+i+"</th>" +
	"<td>"+usuario.usuario+"</td>" + "<td>"+usuario.personal.nombres  +" "+ usuario.personal.apellidoPaterno + " " + usuario.personal.apellidoMaterno + "</td><td>"+
	 usuario.personal.cargo +"</td><td>"+estado+"</td>" + contenidoFila;
	 		
	cuerpo.append(contenidoFila);
}
function darBaja(valor){
	$('#mensajeBaja').text('¿Desea dar de baja al socio?');
	$('#modalBaja').modal({
		show:true,
		backdrop:'static'
	});
	socioActual = {codigo:valor,estado:'R'}
	
}
function darAlta(valor){
	$('#mensajeAlta').text('¿Desea dar de alta al socio?');
	$('#modalAlta').modal({
		show:true,
		backdrop:'static'
	});
	 socioActual = {codigo:valor,estado:'A'}
}
$(document).ready(function() {
	revisarSesion();
	ocultarLoader();
	$('#cerrarSesion').click(function(e){
			e.preventDefault();
			cerrarSesion();
			alert("Hasta luego");
	});
	$("#btnListar").click(function(){
	 	listaUsuarios.splice(0,listaUsuarios.length);
		var estado = $("#filtrar").val();	
		$('tbody tr').remove();
		listarUsuarios(estado,function(usuarios){
		 if(usuarios.length > 0){
			
			 for(var i=0;i<usuarios.length;i++){
				 listaUsuarios.push(usuarios[i]);
				 mostrarUsuario(usuarios[i],(i+1));
	
				 $('[data-toggle="tooltip"]').tooltip(); 
			 }
		 }else{
			 if(estado="A"){
				 $('#contenidoRespuesta').text("No existen usuarios activos");

			 }else if(estado="I"){
				 $('#contenidoRespuesta').text("No existen usuarios inactivos");
			 }else{
				 $('#contenidoRespuesta').text("No existen usuarios registrados");
			 }
			 $('#tituloRespuesta').text("Listado de usuarios");
			 $('#modalRespuesta').modal({
				 show:true,
				 backdrop:'static'
			 })
		 }
	
	 });
});
	
	});


	
	
	