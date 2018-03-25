//var RUAntiguo = new Array();
var RUAntiguo;
function listarRUnidad(callback){
	$.ajax({
		//beforeSend: function(){$("#modalCargando").modal('show')},
		url:'https://chasqui-gateway.herokuapp.com/micro-client/unidades/'+localStorage.getItem("idRegistroUnidad"),//'http://localhost:9000/unidades/'+localStorage.getItem("idRegistroUnidad"),
		headers:{
			"Authorization": "Bearer " + token
		}
	}).done(function(socio){
		console.log('unidades listadas: ' + JSON.stringify(socio));
		//$("#modalCargando").modal('hide');
		callback(socio);
		
	})
}

function validarCampos(unidad){
	if(unidad.placa == "" || unidad.marca == ""
		||unidad.modelo=="" || unidad.color==""||unidad.capacidad=="" ||unidad.anioFabricacion ==""
			||unidad.color =="" || unidad.estado=="" ||!validarTamanio($("#txtPlaca"),7)) {
				
		
		return false;
	}
	return true;
}
function modificarUnidades(registroUnidad,estado,callback){
	$.ajax({//la informacion lo genera el objeto ajax
		method:'PUT', // se pone para indicar a ajax q metodo vas a utilizar
		url: 'https://chasqui-gateway.herokuapp.com/micro-client/unidades/?estado='+estado,//'http://localhost:9000/unidades/?estado='+estado, //se pone para hacer referencia al REST que va a procesar los datos / UnidadController
		data: JSON.stringify(registroUnidad),// para convertir en formato JSON los datos de unidad o procesar
		processData:false,
		contentType: "application/json; charset=utf-8",
		statusCode:{ 
//			409:function(){
//				alert("La placa del Vehiculo : " +registroUnidad.unidad.placa + "ya ha sido registrada");
//			}
		},
		headers: {
			//"Content-Type":"application/json",
			//"access-control-allow-origin":"*"
			"Authorization": "Bearer " + token
		}
	}).done(function(respuesta){
		//console.log("Respuesta: " + Json.stringify(respuesta));
		callback(respuesta);
	})
}
function mostrarSocioAmodificar(registroUnidad){
	var i=1;
	var cuerpo = $("#cmbSocio");
	var contenidoFila = "";

	var contenidoFila = "<option class='opciones1' value='"+registroUnidad.socio.codigo +"'>"+registroUnidad.socio.nombres+" " +registroUnidad.socio.apellidoPaterno+" "+registroUnidad.socio.apellidoMaterno +"</option>";
	 		
	cuerpo.append(contenidoFila);
	
	i++;
}
function llenarCampos(registroUnidad){
	$("#cmbSocio").val(registroUnidad.socio.codigo);
	$("#txtPlaca").val(registroUnidad.unidad.placa);
	$("#txtMarca").val(registroUnidad.unidad.marca);
	$("#txtModelo").val(registroUnidad.unidad.modelo);
	$("#txtColor").val(registroUnidad.unidad.color);
	$("#txtFechaRegistro").val(registroUnidad.fechaRegistro);
	$("#txtCapacidad").val(registroUnidad.unidad.capacidad);
	$("#txtAnioFabricacion").val(registroUnidad.unidad.anioFabricacion);
	$("#cmbEstado").val(registroUnidad.unidad.estado);
}
function limpiarCampos(){
	$("#cmbSocio").val("S");
	$("#txtPlaca").val("");
	$("#txtMarca").val("");
	$("#txtModelo").val("");
	$("#txtFechaRegistro").val();
	$("#txtColor").val("");
	$("#txtCapacidad").val("");
	$("#txtAnioFabricacion").val("");
	$("#cmbEstado").val("A");
	$("#txtFechaRegistro").val("");
}
$(document).ready(function() {
	revisarSesion();
	$('#cerrarSesion').click(function(e){
			e.preventDefault();
			cerrarSesion();
			alert("Hasta luego");
	});	
	listarRUnidad(function extraerRegistroUnidad(registroUnidadAntiguo){
		mostrarSocioAmodificar(registroUnidadAntiguo);
		llenarCampos(registroUnidadAntiguo);
		RUAntiguo=registroUnidadAntiguo;
	});
	$("#btnModificarUnidad").click(function(e){
		
		//estado=RUAntiguo.unidad.estado;
		e.preventDefault();
			
		var id = $("#cmbSocio").val();
		var placa = $("#txtPlaca").val();
		var marca = $("#txtMarca").val();
		var modelo = $("#txtModelo").val();
		var fechaRegistro = $("#txtFechaRegistro").val();
		var color = $("#txtColor").val();
		var capacidad = $("#txtCapacidad").val();
		var anioFabricacion = $("#txtAnioFabricacion").val();
		var estado = $("#cmbEstado").val();
		var numeroAcciones=RUAntiguo.socio.numeroAcciones;
	
			
			//console.log(nombre + " " + apellidoP +" " +apellidoM+" " +dni+" " +direccion+" " + fecha+"" +correo
			//		+" " +celular+" " +nombresPariente+" " +dniPariente+" " +parentezco);
			
		var socio = {
				codigo: Number.parseInt(id,10),
				
				numeroAcciones : Number.parseInt(numeroAcciones,10),
		} 
		var unidad = {
			placa: placa,
			marca : marca,
			modelo : modelo,
			capacidad : capacidad,
			anioFabricacion : anioFabricacion,
			color : color,
			estado : estado,
			
		}
		var registroUnidad = {
				codigo:localStorage.getItem("idRegistroUnidad"),
				fechaRegistro:fechaRegistro,
				fechaRetiro:fechaRegistro,
				socio:socio,
				unidad: unidad,
				
		}
			
		if(validarCampos(unidad)){//Aqui se envia el registro que se ha hecho en la pagiina
			//console.log("Campos en blanco");
			//console.log(RUAntiguo.socio.numeroAcciones)
			//console.log(RUAntiguo);
			//console.log(RUAntiguo.unidad.estado);
			console.log(registroUnidad);
			modificarUnidades(registroUnidad,RUAntiguo.unidad.estado,function(respuesta){
			//$("#modalExito").modal('show');
				$("#modalRespuesta").modal('show');
				 $("#tituloRespuesta").text("Modificación de Unidades");
				 $("#contenidoRespuesta").text("¡Modificación de Unidad Exitosa!");
				 $("#contenidoRespuesta02").text("");
				 limpiarCampos();
			//$("#modalExito").modal('show');	
				 console.log(respuesta);
			
			});
			//location.href="../../paginas/unidades/listadoUnidades.html";
		}else{
			alert("Campos errados");	
		}
	});
	$("#btnExito").click(function(){
		location.href="listadoUnidades.html";
	});
});