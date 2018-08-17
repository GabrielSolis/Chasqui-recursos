var socioActual;
var listaUnidadesActuales = new Array();
var unidadesTrabajando = false;
////Dar de baja socio
function darBajaSocio(socio,callback){
	$.ajax({
		beforeSend:mostrarLoader(),
		method:'delete',
		data:JSON.stringify(socio),
		url:'https://chasqui-gateway.herokuapp.com/micro-client/socios/',//'http://localhost:9000/socios/',
		contentType: "application/json; charset=utf-8",
		
		headers: {
			//"Content-Type":"application/json",
			//"Access-Control-Allow-Origin":"*",
			"Authorization": "Bearer " + token
		},
		processData:false
	}).done(function(socio){
		callback(socio);
		ocultarLoader();
	})
}



/// cargar socios
function listarSocios(estado,apellido,callback){

	$.ajax({
		beforeSend:mostrarLoader(),
		/*beforeSend: function(){$("#modalCargando").modal('show')},*/
		data:{estado:estado,apellido:apellido},
		url:'https://chasqui-gateway.herokuapp.com/micro-client/socios/?estado='+estado+'&apellido='+apellido,//'http://localhost:9000/socios/?estado='+estado+'&apellido='+apellido,
		processData:false,
		headers:{
			"Authorization": "Bearer " + token
		}
	}).done(function(socios){
		
		//console.log('Socios listados: ' + JSON.stringify(socios));
		ocultarLoader();
		callback(socios);
	})
}
function listarUnidadesSocio(estado,idSocio,callback){
	$.ajax({
		//beforeSend: function(){$("#modalCargando").modal('show')},
		data:{estado:estado},
		url:'https://chasqui-gateway.herokuapp.com/micro-client/registroUnidades/'+idSocio+'?/estado='+estado, //'http://localhost:9000/registroUnidades/'+localStorage.getItem("idSocio")+'?/estado='+estado,
		headers:{
			"Authorization": "Bearer " + token
		}

	}).done(function(socio){
		console.log('unidades listadas: ' + JSON.stringify(socio));
		//$("#modalCargando").modal('hide');
		callback(socio);
		
	})
}
///Cargar datos de un socio
function listarSocio(callback){
	$.ajax({
		//beforeSend: function(){$("#modalCargando").modal('show')},
		beforeSend: mostrarLoader(),
		url:'https://chasqui-gateway.herokuapp.com/micro-client/socios/'+localStorage.getItem("idSocio"),//'http://localhost:9000/socios/'+localStorage.getItem("idSocio"),
		headers:{
			"Authorization": "Bearer " + token
		}
	}).done(function(socio){
		console.log('Socios listados: ' + JSON.stringify(socio));
		//$("#modalCargando").modal('hide');
		ocultarLoader();
		callback(socio);
		
	})
}
/// Llenar campos de modal 
function llenarCampos(socio){
	$("#txtNombresCompletos").text(socio.nombres + " "+socio.apellidoPaterno + " "+socio.apellidoMaterno);
	$("#txtDNI").text(socio.dni);
	if(socio.sexo == 'M'){
		$('#txtSexo').text('Masculino');
	}else{
		$('#txtSexo').text('Femenino');
	}
	$("#cmbEstadoCivil").text(socio.estadoCivil);
	$("#txtDireccion").text(socio.direccion);
	$('#txtEstadoCivil').text(socio.estadoCivil);
	$("#txtCorreo").text(socio.correo);
	if(socio.estado == 'A'){
		$('#txtEstado').text("Activo");
		$("#txtFechaRetiro").text("");
	}else{
		$('#txtEstado').text("Retirado");
		$("#txtFechaRegistro").text(socio.fechaRetiro);
	}
	$("#txtFechaNacimiento").text(socio.fechaNacimiento);
	$("#txtFechaRegistro").text(socio.fechaRegistro);
	$("#txtCelular").text(socio.celular);
	$("#txtNombresPariente").text(socio.nombresApellidosPariente);
	$("#txtTelefonoPariente").text(socio.telefonoPariente);
	$("#txtNumeroAcciones").text(socio.numeroAcciones);
}
// Registrar socio
function registrarSocios(socio,callback){
	$.ajax({
		beforeSend:mostrarLoader(),
		method:'POST',
		url:'https://chasqui-gateway.herokuapp.com/micro-client/socios/',//'http://localhost:9000/socios/',
		data: JSON.stringify(socio),
		contentType: "application/json; charset=utf-8",
		
		processData:false,
		statusCode:{
			409:function(){
				ocultarLoader();
				$("#tituloError").text("Error al registrar socio");
				$("#mensajeError").text("El DNI escrito ya se encuentra registrado");
					$("#modal1").modal({
						show:true,
						backdrop:'static'
					});
				}
		},
		headers: {
			//"Content-Type":"application/json",
			//"access-control-allow-origin":"*",
			"Authorization": "Bearer " + token
		}
	}).done(function(respuesta){
		//console.log("Respuesta: " + Json.stringify(respuesta));
		callback(respuesta);
		ocultarLoader();
	})
}

function listarTarjetasActivas(codigoRU,callback){
		$.ajax({
		beforeSend: mostrarLoader(),
		method:'get',
		//data:JSON.stringify(tarjeta),
		url: 'https://chasqui-gateway.herokuapp.com/micro-control/tarjeta/listar/'+codigoRU+'/'+cargarDiaActual()+'/'+cargarDiaActual(),//'http://localhost:9000/tarjeta/'+Number(tarjeta.codigoRegistroUnidad)+'/'+tarjeta.fecha,//'http://localhost:9000/unidades/',
		headers: {
			"Authorization": "Bearer " + token
			//"Authorization": "Bearer " + token
		},
		contentType: "application/json; charset=utf-8",
		processData:false
	}).done(function(tarjetas){
		ocultarLoader();
		callback(tarjetas);
		//console.log(registroUnidad);
	});
}
function validarCampos(socio){
	//|| socio.nombresPariente==""  || !validarTamanio($("#txtTelefonoPariente"),9
	if(socio.nombres == "" || socio.apellidoPaterno == "" || socio.apellidoMaterno == ""
		||socio.direccion=="" || socio.dni==""||socio.sexo=="" ||socio.fechaNacimiento ==""
			||socio.celular ==""  || socio.estadoCivil ==""|| socio.fechaRegistro == "" ||
			!validarTamanio($("#txtDNI"),8) ||
			!validarTamanio($("#txtCelular"),9) ){
		return false;
	}
	return true;
}
function mostrarSocio(socio,i){
	var cuerpo = $("#cuerpoTablaSocios");
	var estado;
	var contenidoFila = "";
	if(socio.estado == 'A'){
			estado ="Activo";
			contenidoFila ="<button id='btnBaja"+socio.codigo+"' onClick='darBaja("+socio.codigo+")'class='btn btn-info mr-2'data-toggle='tooltip' data-placement='top' title='Dar de baja'>" +
		"<i class='fas fa-arrow-down'></i></button></td></tr>"
		}else{
			estado ="Retirado";
			contenidoFila ="<button id='btnAlta"+socio.codigo+"'  onClick='darAlta("+socio.codigo+")'class='btn btn-info mr-2'data-toggle='tooltip' data-placement='top' title='Dar de alta'>" +
 		"<i class='fas fa-arrow-up'></i></button></td></tr>"
		}
	var contenidoFila = "<tr id='"+socio.codigo+"'>" +
	"<th>"+i+"</th>" +
	"<td>"+socio.nombres+" " +socio.apellidoPaterno+" "+socio.apellidoMaterno +"</td>" +
	"<td>"+socio.dni+"</td> <td>"+socio.numeroAcciones+"</td><td>"+estado+"</td>" +
		"<td><button id='btnVer' onClick='verDatos("+socio.codigo+")' class='btn btn-info mr-2'data-toggle='tooltip' data-placement='top' title='Visualizar datos'>" +
		"<i class='fas fa-eye'></i></button>" +
		"<button  onClick='modificar("+socio.codigo+")'class='btn btn-info mr-2'data-toggle='tooltip' data-placement='top' title='Modificar datos'>" +
		"<i class='fas fa-edit'></i></button>" + contenidoFila;
	 		
	cuerpo.append(contenidoFila);

}
function darBaja(valor){
	$('#mensajeBaja').text('¿Desea dar de baja al socio?');
	$('#modalBaja').modal({
		show:true,
		backdrop:'static'
	});
	listarUnidadesSocio('A',valor,function(unidades){
		console.log(unidades);
		if(unidades.length > 0){
			listaUnidadesActuales = unidades;
			for(var i=0;i<listaUnidadesActuales.length;i++){
				listarTarjetasActivas(listaUnidadesActuales[i].codigo,function(respuesta){
					console.log(respuesta);
					if(respuesta.length != 0){
						unidadesTrabajando = true;
					}
				});
			}
		}
		
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
function modificar(valor){
	localStorage.setItem("idSocio",valor);
	location.href="modificarSocio.html";
}
function verDatos(valor){
	localStorage.setItem("idSocio",valor);
	listarSocio(function mostrarSocio(socio){
		llenarCampos(socio);
	});
  $("#modalSocio").modal('show');
}
function limpiarCampos(){
	$("#txtNombres").val("");
	$("#txtApellidoP").val("");
	$("#txtApellidoM").val("");
	$("#txtDNI").val("");
	$('input:radio[name=rdbSexo]:checked').val("");
	$("#txtDireccion").val("");
	$("#txtCorreo").val("");
	$("#txtFechaNacimiento").val("");
	$("#txtFechaRegistro").val("");
	$("#txtCelular").val("");
	$("#txtNombresPariente").val("");
	$("#txtDNIPariente").val("");
	$("#cmbEstadoCivil").val("");
	$('#txtTelefonoPariente').val("");
}

///Inicio
 $(document).ready(function() {
 	revisarSesion();
	ocultarLoader();
	$('#cerrarSesion').click(function(e){
			e.preventDefault();
			cerrarSesion();
			alert("Hasta luego");
	});	 
	 $('[data-toggle="tooltip"]').tooltip(); 
	 var listaSocios = new Array();
	 $("#btnRegistrar").click(function(e){
		 e.preventDefault();
		var nombre = $("#txtNombres").val();
		var apellidoP = $("#txtApellidoP").val();
		var apellidoM = $("#txtApellidoM").val();
		var dni = $("#txtDNI").val();
		var sexo = $('input:radio[name=rdbSexo]:checked').val();
		var estadoCivil = $("#cmbEstadoCivil").val();
		var direccion = $("#txtDireccion").val();
		var correo = $("#txtCorreo").val();
		var fecha = $("#txtFechaNacimiento").val();
		var celular = $("#txtCelular").val();
		var nombresPariente = $("#txtNombresPariente").val();
		var fechaRegistro = $("#txtFechaRegistro").val();
		var telefonoPariente = $("#txtTelefonoPariente").val();
		
		var a = $("#txtFechaNacimiento").val();
		console.log(a);
		
		//console.log(nombre + " " + apellidoP +" " +apellidoM+" " +dni+" " +direccion+" " + fecha+"" +correo
		//		+" " +celular+" " +nombresPariente+" " +dniPariente+" " +parentezco);
		
		var socio = {
				nombres: nombre,
				apellidoPaterno:apellidoP,
				apellidoMaterno:apellidoM,
				correo:correo,
				direccion:direccion,
				dni:dni,
				sexo:sexo,
				fechaNacimiento:fecha,
				celular:celular,
				estadoCivil:estadoCivil,
				fechaRegistro:fechaRegistro,
				nombresApellidosPariente:nombresPariente,
				telefonoPariente:telefonoPariente,
		}
		if(validarCampos(socio)){
			if(validarEdad(socio.fechaNacimiento)){
				registrarSocios(socio,function(respuesta){
				$("#modalExito").modal('show');
					limpiarCampos();
					console.log(respuesta);
				});
			}else{
				$('#mensajeError').text("El socio debe tener una edad mayor de 18 y menor que 100");
				$("#modal1").modal('show');	
				//alert("El socio debe tener una edad mayor de 18 y menor que 100");
			}
			
		}else{
			$('#mensajeError').text("Debe llenar los campos vacios (Llenado Opcional: Correo/DNI pariente)");
			$("#modal1").modal('show');		
		}
		
	 });
	 
	 ///Imprimir lista de socios
	 $("#btnImprimir").click(function(e){
		 e.preventDefault();
		 var url  = generarReporteGeneral();
		 if(url != undefined){
		 	console.log(url);
		 	nuevaVentanaReporte(url);
		 }
	 });
	
	 $("#btnListar").click(function(){
		 	listaSocios.splice(0,listaSocios.length);
			var estado = $("#filtrar").val();

			var apellido = $("#buscar").val().toLowerCase();
		
			
			$('tbody tr').remove();
			listarSocios(estado,apellido,function(socios){
			 if(socios.length > 0){
				 for(var i=0;i<socios.length;i++){
					 
					 listaSocios.push(socios[i]);
					 mostrarSocio(socios[i],(i+1));

					 $('[data-toggle="tooltip"]').tooltip(); 
				 }
			 }else{
				 if(estado=="A"){
					 $("#tipoSocio").text("activos");
				 }else if(estado=="R"){
					 $("#tipoSocio").text("retirados");
				 }else{
					 $("#tipoSocio").text("");
				 }
				 $("#modalListado").modal('show');
			 }

		 });
	 });
	 
	 
	 /// Imprimir datos de un socio
	 $("#btnImprimirSocio").click(function(e){
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
			
			doc.text("Datos de socio",80,40);
			doc.line(75, 41, 135, 41);
			doc.setFontSize(13);
			doc.text("Nombres y apellidos: ",20,60);
			doc.text("Fecha de nacimiento: ",20,80);
			doc.text("DNI: ",20,100);
			doc.text("Sexo: ",20,120);
			doc.text("Estado civil: ",70,120);
			doc.text("Fecha de ingreso a la empresa: ",20,140);
			doc.text("Fecha de retiro de la empresa: ",20,160);
			doc.text("Correo:",20,180);
			doc.text("Numero de acciones: ",20,200);
			doc.setFontSize(20);
			doc.text("Datos de referencia",80,215);
			doc.line(75,216,150,216);
			doc.setFontSize(13);
			doc.text("Nombres y apellidos: ",20,235);
			doc.text("Teléfono: ",20,255);
			
			doc.setFontSize(13);
			doc.setFont("helvetica");
			doc.setFontType("normal");
			doc.text( $("#txtNombresCompletos").text(),75,60);
			doc.text($("#txtFechaNacimiento").text(),75,80);
			doc.text($("#txtDNI").text(),40,100);
			doc.text($('#txtSexo').text(),40,120);
			doc.text( $('#txtEstadoCivil').text(),105,120);
			doc.text($("#txtFechaRegistro").text(),105,140);
			doc.text($("#txtFechaRetiro").text(),105,160);
			doc.text($("#txtCorreo").text() ,45,180);
			doc.text($("#txtNumeroAcciones").text(),80,200)
			doc.text($("#txtNombresPariente").text(),80,235);
			doc.text($("#txtTelefonoPariente").text(),50,255);	
			//doc.save('socio.pdf');
			var url = doc.output('datauristring'); 
			nuevaVentanaReporte(url);
			/*var win = window.open(url);

		     //win.document.write('<iframe src="' + url + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>')
			var a = document.createElement('a');
			console.log(url);
			a.href=url;
			a.click();*/	
		
	 });
	 
	

	 $('#btnModalBaja').click(function(){
	 	console.log(unidadesTrabajando);
	 	if(unidadesTrabajando){
	 		$("#tituloError").text("Error al dar de baja socio");
					$("#contenidoRespuesta").text("El socio posee unidades trabajando");
					$("#modal1").modal({
						show:true,
						backdrop:'static'
					});
	 		$('#modalBaja').modal('toggle');
	 				

	 	}else{	 
	 		 darBajaSocio(socioActual,function(respuesta){
				console.log(respuesta);
			});
			$('#btnBaja'+socioActual.codigo).tooltip('hide');
			$('#'+socioActual.codigo).remove();
			$('#modalBaja').modal('hide');

	 	}
		
	 });
	 $('#btnModalAlta').click(function(){
			darBajaSocio(socioActual,function(respuesta){
				console.log(respuesta);
			});
			$('#btnAlta'+socioActual.codigo).tooltip('hide');
			$('#'+socioActual.codigo).remove();
			$('#modalAlta').modal('hide');
	 });
	 

	 function generarReporteGeneral(){

	 	var doc = new jsPDF();
	 	var pdf = new jsPDF();
		var img = new Image;
		img.onload = function() {
		    pdf.addImage(this, 10, 10);
		    pdf.save("test.pdf");
		};
		img.crossOrigin = "undefined";  // for demo as we are at different origin than image
		img.src = "../../img/logo.jpg"; 
		
		var columnas = [{title:"Numero", dataKey:"numero"},
						{title:"Nombres y Apellidos",dataKey:"nombres"},
						{title:"DNI",dataKey:"dni"},
						{title:"Numero de acciones",dataKey:"numeroAcciones"},
						{title:"Estado",dataKey:"estado"}];
		var data =[];
		if(listaSocios.length >0){
			for(var i=0;i<listaSocios.length;i++){
				if(listaSocios[i].estado=='A'){
					 estado="Activo";
				 }else{
					 estado ="Retirado";
				 }
				console.log(listaSocios[i]);
				data.push({
					numero:i+1,
					nombres:listaSocios[i].nombres + " " + listaSocios[i].apellidoPaterno + " " + listaSocios[i].apellidoMaterno,
					dni: listaSocios[i].dni,
					numeroAcciones:listaSocios[i].numeroAcciones,
					estado:estado
				});
			}
			doc.text("Lista de socios",85,40);
			doc.line(80, 41, 130, 41);
			doc.autoTable(columnas,data,{margin:{top:55}});
			//console.log(dataurlnewwindow);
			//doc.output('dataurlnewwindow'); //
			var url = doc.output('datauristring'); 
			return url;
			//nuevaVentanaReporte(url);
			//doc.output('save', 'filename.pdf');
			//doc.save('mipdf.pdf');
		}else{
			alert("No hay socios listados");
		}
	 }
 });