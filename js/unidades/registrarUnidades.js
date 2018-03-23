var listarRUnidades=new Array();
////Dar de baja unidad
function darBajaUnidad(registroUnidad,callback){
	$.ajax({
		method:'delete',
		data:JSON.stringify(registroUnidad),
		url: 'https://chasqui-gateway.herokuapp.com/micro-client/unidades/',//'http://localhost:9000/unidades/',
		headers: {
			//"Content-Type":"application/json",
			//"Access-Control-Allow-Origin":"*",
			"Authorization": "Bearer " + token
		},
		contentType: "application/json; charset=utf-8",
		processData:false
	}).done(function(registroUnidad){
		callback(registroUnidad);
	})
}
// Llenar Campos de modal de Unidad
function llenarCamposModalUnidad(unidades){
	$("#txtNombres").text(unidades.socio.nombres + " "+unidades.socio.apellidoPaterno + " "+unidades.socio.apellidoMaterno);
	$("#txtPlaca").text(unidades.unidad.placa);
	$("#txtMarca").text(unidades.unidad.marca);
	$("#txtModelo").text(unidades.unidad.modelo);
	$("#txtFechaRegistro").text(unidades.fechaRegistro);
	$("#txtColor").text(unidades.unidad.color);
	$("#txtCapacidad").text(unidades.unidad.capacidad);
	$("#txtAnioFabricacion").text(unidades.unidad.anioFabricacion);
	if(unidades.unidad.estado == "A"){
		$("#txtEstado").text("Activo");
	}
	if(unidades.unidad.estado == "I"){
		$("#txtEstado").text("Inactivo");
	}
	if(unidades.unidad.estado == "Y"){
		$("#txtEstado").text("Apoyo");
	}
	
}

/// Llenar campos de modal 
function llenarCamposModal(unidades){
	console.log(unidades);
	var cuerpo = $("#cuerpo");
	var contenidoFila = "";
	cuerpo.text("");
	$("#txtNombresCompletos").text(unidades[0].socio.nombres + " "+unidades[0].socio.apellidoPaterno + " "+unidades[0].socio.apellidoMaterno);
	for(var i=0; i<unidades.length;i++){
		
		//contenidoFila = "<p><label>Placa: <span id=#txtPlaca></span>"+unidades[i].unidad.placa +"<button class='btn btn-primary' id='btnModificarUnidadSocio'>"+'Modificar'+"</button></label></p>";
		contenidoFila = "<p><br><label>Vehículo "+[i+1]+" : <span id=#txtPlaca></span>"+unidades[i].unidad.placa +"<button  onClick='verDatosEspecificosUnidad("+unidades[i].socio.codigo+","+unidades[i].unidad.codigo+")' class='btn btn-info mr-2 ml-5'data-toggle='tooltip' data-placement='top' title='Visualizar datos de la Unidad'>"+"<i class='fas fa-eye'></i></button>"+"<button  onClick='modificar("+unidades[i].codigo+")'class='btn btn-info mr-2'data-toggle='tooltip' data-placement='top' title='Modificar datos'>"+
		"<i class='fas fa-edit'></i></button>"+"<button id='btnEliminar"+unidades[i].codigo+"' onClick='eliminarUnidad("+unidades[i].socio.codigo+","+unidades[i].unidad.codigo+")' class='btn btn-info mr-2' data-toggle='tooltip' data-placement='top' title='Eliminar'><i class='far fa-trash-alt'></i></button></label></p>";
		
		//$("#txtPlaca").text(unidades[i].unidad.placa);
		cuerpo.append(contenidoFila);
	}
	
}


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
// listar unidades por socio
function listarUnidadesSocio(estado,callback){
	$.ajax({
		//beforeSend: function(){$("#modalCargando").modal('show')},
		data:{estado:estado},
		url:'https://chasqui-gateway.herokuapp.com/micro-client/registroUnidades/+localStorage.getItem("idSocio")'+'?/estado='+estado, //'http://localhost:9000/registroUnidades/'+localStorage.getItem("idSocio")+'?/estado='+estado,
		headers:{
			"Authorization": "Bearer " + token
		}

	}).done(function(socio){
		console.log('unidades listadas: ' + JSON.stringify(socio));
		//$("#modalCargando").modal('hide');
		callback(socio);
		
	})
}
//probando
function listarRegistroUnidades(estado,apellido,callback){

	$.ajax({
		/*beforeSend: function(){$("#modalCargando").modal('show')},*/
		data:{estado:estado,apellido:apellido},
		url:'https://chasqui-gateway.herokuapp.com/micro-client/unidades/?estado='+estado+'&apellido='+apellido,//'http://localhost:9000/unidades/?estado='+estado+'&apellido='+apellido,
		processData:false,
		headers:{
			"Authorization": "Bearer " + token
		}
	}).done(function(unidades){
		
		console.log('Registro Unidades Listados: ' + JSON.stringify(unidades));
		
		callback(unidades);
	})
}
/// cargar RegistroUnidades
//function listarRegistroUnidades(estado,apellido,callback){
//
//	$.ajax({
//		/*beforeSend: function(){$("#modalCargando").modal('show')},*/
//		data:{estado:estado,apellido:apellido},
//		url:'http://localhost:9000/unidades/?estado='+estado+'&apellido='+apellido,
//		processData:false
//	}).done(function(unidades){
//		
//		console.log('Registro Unidades Listados: ' + JSON.stringify(unidades));
//		
//		callback(unidades);
//	})
//}
/// cargar socios
function listarSocios(estado,apellido,callback){

	$.ajax({
		/*beforeSend: function(){$("#modalCargando").modal('show')},*/
		data:{estado:estado,apellido:apellido},
		url:'https://chasqui-gateway.herokuapp.com/micro-client/socios/?estado='+estado+'&apellido='+apellido,//'http://localhost:9000/socios/?estado='+estado+'&apellido='+apellido,
		processData:false,
		headers:{
			"Authorization": "Bearer " + token
		}
	}).done(function(socios){
		
		console.log('Socios listados: ' + JSON.stringify(socios));
		
		callback(socios);
	})
}

//Aqui creo la funcion registrar unidad

function registrarUnidades(registroUnidad,callback){
	$.ajax({//la informacion lo genera el objeto ajax
		method:'POST', // se pone para indicar a ajax q metodo vas a utilizar
		url:'https://chasqui-gateway.herokuapp.com/micro-client/unidades/',//'http://localhost:9000/unidades/', //se pone para hacer referencia al REST que va a procesar los datos / UnidadController
		data: JSON.stringify(registroUnidad),// para convertir en formato JSON los datos de unidad o procesar
		processData:false,
		contentType: "application/json; charset=utf-8",
		statusCode:{ 
			409:function(){
				alert("La placa del Vehiculo : " +registroUnidad.unidad.placa + "ya ha sido registrada");
			}
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
function validarCampos(unidad){
	if(unidad.placa == "" || unidad.marca == ""
		||unidad.modelo=="" || unidad.color==""||unidad.capacidad=="" ||unidad.anioFabricacion ==""
			||unidad.color =="" || unidad.estado=="" ||!validarTamanio($("#txtPlaca"),7)) {
				
		
		return false;
	}
	return true;
}
//mostrar la lista de unidades, con su soco en la listaUnidades.html Original
//function mostrarRegistroUnidades(unidades){
//	var i=1;
//	var cuerpo = $("#cuerpoTablaUnidades");
//	var estado;
//	var contenidoFila = "";
//	if(unidades.unidad.estado == 'A'){
//			estado ="Activo";
//			contenidoFila ="<button id='btnBaja"+unidades.codigo+"' onClick='darBaja("+unidades.codigo+")'class='btn btn-info mr-2'data-toggle='tooltip' data-placement='top' title='Dar de baja'>" +
//		"<i class='fas fa-arrow-down'></i></button>"
//		}else{
//			estado ="Inactivo";
//			contenidoFila ="<button id='btnAlta"+unidades.codigo+"'  onClick='darAlta("+unidades.codigo+")' class='btn btn-info mr-2'data-toggle='tooltip' data-placement='top' title='Dar de alta'>" +
// 		"<i class='fas fa-arrow-up'></i></button>"
//		}
//	var contenidoFila = "<tr id='"+unidades.codigo+"'>" +
//	"<th>"+i+"</th>" +
//	"<td>"+unidades.socio.nombres+" " +unidades.socio.apellidoPaterno+" "+unidades.socio.apellidoMaterno +"</td>" +
//	"<td>"+unidades.unidad.placa+"</td> <td>"+estado+"</td>" +
//		"<td><button id='btnVer' onClick='verDatos("+unidades.socio.codigo+")' class='btn btn-info mr-2'data-toggle='tooltip' data-placement='top' title='Visualizar datos'>" +
//		"<i class='fas fa-eye'></i></button>";
//	 		
//	cuerpo.append(contenidoFila);
//
//	i++;
//}


//mostrar la lista de unidades, con su soco en la listaUnidades.html Otra opcion
function mostrarRegistroUnidades(unidades){
	var i=1;
	var cuerpo = $("#cuerpoTablaUnidades");
	var estado;
	var contenidoFila = "";
	if(unidades.estado == 'A'){
			estado ="Activo";
//			contenidoFila ="<button id='btnBaja"+unidades.codigo+"' onClick='darBaja("+unidades.codigo+")'class='btn btn-info mr-2'data-toggle='tooltip' data-placement='top' title='Dar de baja'>" +
//		"<i class='fas fa-arrow-down'></i></button>"
		}
	if(unidades.estado == 'I'){
		estado ="Inactivo";
//		contenidoFila ="<button id='btnAlta"+unidades.codigo+"'  onClick='darAlta("+unidades.codigo+")' class='btn btn-info mr-2'data-toggle='tooltip' data-placement='top' title='Dar de alta'>" +
//	"<i class='fas fa-arrow-up'></i></button>"
		}
	if(unidades.estado == 'Y'){
		estado ="Apoyo";
//		contenidoFila ="<button id='btnAlta"+unidades.codigo+"'  onClick='darAlta("+unidades.codigo+")' class='btn btn-info mr-2'data-toggle='tooltip' data-placement='top' title='Dar de alta'>" +
//	"<i class='fas fa-arrow-up'></i></button>"
	}
	if(unidades.nombreCompleto != null){
		var contenidoFila = "<tr id='"+unidades.codigoSocio+"'>" +
		"<th>"+i+"</th>" +
		"<td>"+unidades.nombreCompleto+"</td>" +
		"<td>"+unidades.placas+"</td> <td>"+estado+"</td>" +
			"<td><button id='btnVer' onClick='verDatos("+unidades.codigoSocio+")' class='btn btn-info mr-2'data-toggle='tooltip' data-placement='top' title='Visualizar datos'>" +
			"<i class='fas fa-eye'></i></button>";	
	}
	 		
	cuerpo.append(contenidoFila);

	i++;
}

//mostrar socio en el combo del registro Unidad . html
function mostrarSocio(socio){
	var i=1;
	var cuerpo = $("#cmbSocio");
	var contenidoFila = "";

	var contenidoFila = "<option class='opciones1' value='"+socio.codigo +"'>"+socio.nombres+" " +socio.apellidoPaterno+" "+socio.apellidoMaterno +"</option>";
	 		
	cuerpo.append(contenidoFila);

	i++;
}
function listarSociosPorDefecto(listaSocios){
	listarSocios("A","",function(socios){
		 
		 for(var i=0;i<socios.length;i++){
			 
			 listaSocios.push(socios[i]);
			 mostrarSocio(socios[i]);

			 $('[data-toggle="tooltip"]').tooltip(); 
		 }
	 });
}


function eliminarUnidad(valor,codigoUnidad){
	console.log(valor);
	console.log(codigoUnidad);
	var registroUnidad;
	var unidad;
	var socio;
	localStorage.setItem("idSocio",valor);
	listarUnidadesSocio("",function (unidades){
		$("#modalSocioUnidades").modal('hide')
		$("#modalConfirmacionEliminar").modal('show');
		$("#btnConfirmacionEliminar").click(function(){
			//console.log("Hola mundo");
			for(var i=0;i<unidades.length;i++){
			
						if(unidades[i].unidad.codigo==codigoUnidad){
							socio={codigo:unidades[i].socio.codigo,numeroAcciones:unidades[i].socio.numeroAcciones}
							unidad={estado:unidades[i].unidad.estado}
							registroUnidad = {codigo:unidades[i].codigo,socio:socio,unidad:unidad,vigencia:false}
							console.log(socio);
							console.log(unidad);
							console.log(registroUnidad);
							darBajaUnidad(registroUnidad,function(respuesta){
								$("#modalRespuesta").modal('show');
								 $("#tituloRespuesta").text("Eliminar Unidad");
								 $("#contenidoRespuesta").text("¡Unidad eliminada con Exito!");
								 $("#contenidoRespuesta02").text("");
								console.log(respuesta);
								
							});
							
						}
					}
			$('#btnEliminar'+valor).tooltip('hide');
			$('#'+valor).remove();
			//location.href="listadoUnidades.html";
		});
		$("#btnCancelarEliminar").click(function(){
			$("#modalSocioUnidades").modal('show');
		});
		
	});
	
	

}
function darAlta(valor){
	console.log(valor);
	var registroUnidad = {codigo:valor,vigencia:true}
	darBajaUnidad(registroUnidad,function(respuesta){
		console.log(respuesta);
	});
	$('#btnAlta'+valor).tooltip('hide');
	$('#'+valor).remove();
}
function modificar(valor){
	localStorage.setItem("idRegistroUnidad",valor);
	location.href="../../paginas/unidades/modificarUnidad.html";
}
function verDatosEspecificosUnidad(codigoSocio,codigoUnidad){
	console.log(codigoSocio,codigoUnidad);
	localStorage.setItem("idSocio",codigoSocio);
	listarUnidadesSocio("",function (unidades){
		for(var i=0;i<unidades.length;i++){

			if(unidades[i].unidad.codigo==codigoUnidad){
				llenarCamposModalUnidad(unidades[i]);
			}
		}
		
	});
	$("#modalUnidad").modal('show');
}
function verDatos(valor){
	console.log(valor);
	listarRUnidades.splice(0,listarRUnidades.length);
	var estado = $("#filtrar").val();
	localStorage.setItem("idSocio",valor);
	listarUnidadesSocio(estado,function (unidades){
		
		llenarCamposModal(unidades);
		for(var i=0;i<unidades.length;i++){
			listarRUnidades.push(unidades[i]);
		}
		
		
		//unidades.splice(0,unidades.length);
	});
	$("#modalSocioUnidades").modal('show');
  
  
}
function limpiarCampos(){
	$("#cmbSocio").val("S");
	$("#txtPlaca").val("");
	$("#txtMarca").val("");
	$("#txtModelo").val("");
	$("#txtColor").val("");
	$("#txtCapacidad").val("");
	$("#txtAnioFabricacion").val("");
	$("#cmbEstado").val("A");
	$("#txtFechaRegistro").val("");
}

$(document).ready(function(){//cuando la pagina carge se hara todo lo q esta aqui
	revisarSesion();
	mostrarLoader();
	ocultarLoader();
	$('#cerrarSesion').click(function(e){
			e.preventDefault();
			cerrarSesion();
			alert("Hasta luego");
	});
	var listaSocios = new Array();
	
	$("#btnRegistrarUnidad").click(function(e){
		
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
		var numerosAcciones;
		
		 for(var i=0;i<listaSocios.length;i++){
			 if(listaSocios[i].codigo == id){
				 numerosAcciones=listaSocios[i].numeroAcciones;
				 //console.log(listaSocios[i]);
			 }
		 }
		 
		var socio = {
				codigo: Number.parseInt(id,10),
				numeroAcciones : Number.parseInt(numerosAcciones,10),
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
	
				fechaRegistro:fechaRegistro,
				fechaRetiro:fechaRegistro,
				socio:socio,
				unidad: unidad,
				
		}
		console.log(registroUnidad);
		if(validarCampos(unidad)){//Aqui se envia el registro que se ha hecho en la pagiina
			//console.log("Campos en blanco");
			console.log(registroUnidad);
			registrarUnidades(registroUnidad,function(respuesta){
			//$("#modalExito").modal('show');
				$("#modalRespuesta").modal('show');
				 $("#tituloRespuesta").text("Registro de Unidades");
				 $("#contenidoRespuesta").text("¡Registro de Unidad Exitoso!");
				 $("#contenidoRespuesta02").text("");
				limpiarCampos();
			//$("#modalExito").modal('show');	
			console.log(respuesta);
			});
		}else{
			alert("Campos errados");	
		}
		
	});
	
	//buscar socios
	 $("#btnBuscar").click(function(){
		 	listaSocios.splice(1,listaSocios.length);
			
			var apellido = $("#buscar").val().toLowerCase();
		
			//.opciones
			$('.opciones1').remove();
		 listarSocios("A",apellido,function(socios){
			 if(socios == ""){
				 $("#modalRespuesta").modal('show');
				 $("#tituloRespuesta").text("Busqueda de socios");
				 $("#contenidoRespuesta").text("¡Socio buscado no encontrado!");
				 $("#contenidoRespuesta02").text("Se ha listado todos los socios - Despliege la opción 'Socio'");
				
				 listarSociosPorDefecto(listaSocios);
			 }
			 for(var i=0;i<socios.length;i++){
				 $("#modalRespuesta").modal('show');
				 $("#tituloRespuesta").text("Busqueda de socios");
				 $("#contenidoRespuesta").text("¡Busqueda de socios Exitosa!");
				 $("#contenidoRespuesta02").text("Se ha listado todos los socios - Despliege la opción 'Socio'");
				 listaSocios.push(socios[i]);
				 mostrarSocio(socios[i]);

				 $('[data-toggle="tooltip"]').tooltip(); 
			 }
		 });
	 });
	 //nuevo listar Original
	 $("#btnListar").click(function(){
		 	listarRUnidades.splice(0,listarRUnidades.length);
			var estado = $("#filtrar").val();

			var apellido = $("#buscar").val().toLowerCase();
			var bandera=0;
			
			$('tbody tr').remove();
		 listarRegistroUnidades(estado,apellido,function(registroUnidades){
			 if(registroUnidades.length>0){
				 for(var i=0;i<registroUnidades.length;i++){
					 if(registroUnidades[i].nombreCompleto != null){
						 bandera=bandera+1;
						 listarRUnidades.push(registroUnidades[i]);
						 mostrarRegistroUnidades(registroUnidades[i]);
			
						 $('[data-toggle="tooltip"]').tooltip(); 
					 }
					 
				 }
			 }else{
				 $("#modalRespuesta").modal('show');
				 $("#tituloRespuesta").text("Listar unidades por socio");
				 $("#contenidoRespuesta").text("¡No se encontro socios con unidades registradas!");
				 $("#contenidoRespuesta02").text("");
			 }
			 if(bandera==0){
				 $("#modalRespuesta").modal('show');
				 $("#tituloRespuesta").text("Listar unidades por socio");
				 $("#contenidoRespuesta").text("¡No se encontro socios con unidades registradas!");
				 $("#contenidoRespuesta02").text("");
			 }
			 
		 });
	 });
	 
	///Imprimir lista de socios con sus unidades
	 $("#btnImprimir").click(function(e){
		 e.preventDefault();
		 var indice=0;
		var doc = new jsPDF();
		
		var columnas = [{title:"Numero", dataKey:"numero"},
						{title:"Socio",dataKey:"socio"},
						{title:"Placas",dataKey:"placas"},
						{title:"Estado",dataKey:"estado"}];
		var data =[];
		if(listarRUnidades.length >0){
			for(var i=0;i<listarRUnidades.length;i++){
				if(listarRUnidades[i].nombreCompleto != null){
					indice=indice+1;
					if(listarRUnidades[i].estado=='A'){
						 estado="Activo";
					 }else{
						 if(listarRUnidades[i].estado=='I'){
							 estado = "Inactivo"
						 }else{
							 estado = "Apoyo"
						 }
					 }
					data.push({
						numero:indice,
						socio:listarRUnidades[i].nombreCompleto,
						placas: listarRUnidades[i].placas,
						estado:estado
					});
					doc.text("Lista de socios con sus unidades",70,40);
					doc.line(70, 41, 153, 41);
					doc.autoTable(columnas,data,{margin:{top:55}});
					doc.output('dataurlnewwindow'); //
					//doc.output('save', 'filename.pdf');
					//doc.save('mipdf.pdf');
				}
				console.log(listarRUnidades[i]);	
			}
			if(indice==0){
				$("#modalRespuesta").modal('show');
				 $("#tituloRespuesta").text("Listado de unidades con sus socios");
				 $("#contenidoRespuesta").text("¡No hay socios con sus unidades listados!");
				 $("#contenidoRespuesta02").text("");
			}
		}else{
			//alert("No hay socios con sus unidades listados");
			$("#modalRespuesta").modal('show');
			 $("#tituloRespuesta").text("Listado de unidades con sus socios");
			 $("#contenidoRespuesta").text("¡No hay socios con sus unidades listados!");
			 $("#contenidoRespuesta02").text("Seleccionar la opción 'Listar'");
		}
		
	 });
	 
	/// Imprimir datos de una unidad
	 $("#btnImprimirUnidad").click(function(e){
		 e.preventDefault();
		
		 //logo.src = "../../img/logo.jpg";
//		 var img = new Image();
//		 img.addEventListener('load',function(){
//					
//		 });
//		 
//		 img.src = '../../img/logo.jpg';
//		 
		 var doc = new jsPDF("p","mm","a4");
		// doc.addImage(img, 'png', 10, 50,60,60);
		 
		 doc.setFontSize(20);
			doc.setFont("helvetica");
			doc.setFontType("bold");
			
			doc.text("Datos de Unidad",75,40);
			doc.line(75, 41, 131, 41);
			doc.setFontSize(13);
			doc.text("Socio: ",20,60);
			doc.text("Placa: ",20,80);
			doc.text("Marca: ",20,100);
			doc.text("Modelo: ",20,120);
			doc.text("Fecha de registro: ",70,120);
			doc.text("Color: ",20,140);
			doc.text("Capacidad: ",20,160);
			doc.text("Año de fabricación:",20,180);
			doc.text("Estado: ",20,200);
			/*doc.setFontSize(20);
			doc.text("Datos de referencia",80,215);
			doc.line(75,216,150,216);
			doc.setFontSize(13);
			doc.text("Nombres y apellidos: ",20,235);
			doc.text("Teléfono: ",20,255);
			
			doc.setFontSize(13);*/
			doc.setFont("helvetica");
			doc.setFontType("normal");
			doc.text( $("#txtNombres").text(),75,60);
			doc.text($("#txtPlaca").text(),75,80);
			doc.text($("#txtMarca").text(),75,100);
			doc.text($('#txtModelo').text(),40,120);
			doc.text( $('#txtFechaRegistro').text(),115,120);
			doc.text($("#txtColor").text(),80,140);
			doc.text($("#txtCapacidad").text(),80,160);
			doc.text($("#txtAnioFabricacion").text(),80,180);
			doc.text($("#txtEstado").text(),80,200);	
			doc.output('dataurlnewwindow');
	
	 });


});