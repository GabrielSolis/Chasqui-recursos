function generar(callback){

	$.ajax({
		beforeSend:mostrarLoader(),
		method:'GET',
		/*beforeSend: function(){$("#modalCargando").modal('show')},*/
		url:'https://chasqui-gateway.herokuapp.com/micro-client/socios/reporte/listarSocios',//'http://localhost:9000/socios/?estado='+estado+'&apellido='+apellido,
		processData:false,
		dataType:'blob',
		headers:{
			"Authorization": "Bearer " + token
		}
	}).done(function(socios){
		console.log(socios);
		//console.log('Socios listados: ' + JSON.stringify(socios));
		ocultarLoader();
		callback(socios);
	})
}
function listarSocios(estado,apellido,callback){

	$.ajax({
		beforeSend:mostrarLoader(),
		/*beforeSend: function(){$("#modalCargando").modal('show')},*/
		url:'https://chasqui-gateway.herokuapp.com/micro-client/socios/reporte/listarSocios',//'http://localhost:9000/socios/?estado='+estado+'&apellido='+apellido,
		dataType:'blob',
		headers:{
			"Authorization": "Bearer " + token
		}
	}).done(function(socios){
		
		//console.log('Socios listados: ' + JSON.stringify(socios));
		ocultarLoader();
		callback(socios);
	})
}
$(document).ready(function(){
	ocultarLoader();
	$("#generar").click(function(){
		/*generar(function(respuesta){
			console.log(respuesta);
		})*/
	 listarSocios("","",function(respuesta){
	 	console.log(respuesta);
	 })
	});
});