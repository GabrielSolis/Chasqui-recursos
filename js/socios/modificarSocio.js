function validarCampos(socio){
	if(socio.nombres == "" || socio.apellidoPaterno == "" || socio.apellidoMaterno == ""
		||socio.direccion=="" || socio.dni==""||socio.sexo=="" ||socio.fechaNacimiento ==""
			||socio.celular =="" || socio.nombresPariente==""|| socio.parentezco==""  ||
			!validarTamanio($("#txtCelular"),9) || !validarTamanio($("#txtTelefonoPariente"),9)){
		return false;
	}
	return true;
}
function listarSocio(callback){
	
	$.ajax({
		beforeSend: mostrarLoader(),
		url:'https://chasqui-gateway.herokuapp.com/micro-client/socios/'+localStorage.getItem("idSocio"),//'http://localhost:9000/socios/'+localStorage.getItem("idSocio"),
		headers:{
			"Authorization": "Bearer  " + token
		}
	}).done(function(socio){
		//console.log('Socios listados: ' + JSON.stringify(socio));
		callback(socio);
		ocultarLoader();
		
	})
}
function modificarSocio(socio,callback){
	$.ajax({
		beforeSend: mostrarLoader(),
		method:'PUT',
		url:'https://chasqui-gateway.herokuapp.com/micro-client/socios/',//'http://localhost:9000/socios/',
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify(socio),
		statusCode:{
			409:function(){
				ocultarLoader();
				$("#tituloError").text("Error al registrar socio")
				$("#contenidoRespuesta").text("El DNI escrito ya se encuentra registrado");
					$("#modal1").modal({
						show:true,
						backdrop:'static'
					});
			}
		},
		processData:false,
		headers: {
			//"Content-Type":"application/json",
			//"Access-Control-Allow-Origin":"*",
			"Authorization": "Bearer " + token
		}
	}).done(function(respuesta){
		//console.log("Respuesta: " + Json.stringify(respuesta));
		callback(respuesta);
		ocultarLoader();
	})
}


function llenarCampos(socio){
	$("#txtNombres").val(socio.nombres);
	$("#txtApellidoP").val(socio.apellidoPaterno);
	$("#txtApellidoM").val(socio.apellidoMaterno);
	$("#txtDNI").val(socio.dni);
	if(socio.sexo == 'M'){
		$('#rdbSexoM').prop("checked", true);
	}else{
		$('#rdbSexoF').prop("checked", true);
	}
	$("#cmbEstadoCivil").val(socio.estadoCivil);
	$("#txtDireccion").val(socio.direccion);
	$('#txtEstadoCivil').val(socio.estadoCivil);
	$("#txtCorreo").val(socio.correo);
	$("#txtFechaNacimiento").val(socio.fechaNacimiento);
	$("#txtFechaRegistro").val(socio.fechaRegistro);
	$("#txtCelular").val(socio.celular);
	$("#txtNombresPariente").val(socio.nombresApellidosPariente);
	$("#txtTelefonoPariente").val(socio.telefonoPariente);
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
	$("cmbEstadoCivil").val("");
}
$(document).ready(function() {
	mostrarLoader();
	revisarSesion();
	ocultarLoader();
	console.log(token);
	$('#cerrarSesion').click(function(e){
			e.preventDefault();
			cerrarSesion();
			alert("Hasta luego");
	});
	listarSocio(function mostrarSocio(socio){
		llenarCampos(socio);
	});
	$("#btnModificar").click(function(e){
		
		e.preventDefault();
			var nombre = $("#txtNombres").val();
			var apellidoP = $("#txtApellidoP").val();
			var apellidoM = $("#txtApellidoM").val();
			//var dni = $("#txtDNI").val();
			var sexo = $('input:radio[name=rdbSexo]:checked').val();
			var estadoCivil = $("#cmbEstadoCivil").val();
			var direccion = $("#txtDireccion").val();
			var correo = $("#txtCorreo").val();
			var fecha = $("#txtFechaNacimiento").val();
			var celular = $("#txtCelular").val();
			var nombresPariente = $("#txtNombresPariente").val();
			var fechaRegistro = $("#txtFechaRegistro").val();
			var telefonoPariente = $("#txtTelefonoPariente").val();
			
			//console.log(nombre + " " + apellidoP +" " +apellidoM+" " +dni+" " +direccion+" " + fecha+"" +correo
			//		+" " +celular+" " +nombresPariente+" " +dniPariente+" " +parentezco);
			
			var socio = {
					codigo:localStorage.getItem("idSocio"),
					nombres: nombre,
					apellidoPaterno:apellidoP,
					apellidoMaterno:apellidoM,
					correo:correo,
					direccion:direccion,
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
					console.log(socio);
					modificarSocio(socio,function(respuesta){
					$("#modalExito").modal('show');
					limpiarCampos();
					location.href ="listadoSocios.html";
					});
				}else{
					$('#mensajeError').text("El socio debe tener una edad mayor de 18 y menor que 100");
					$("#modal1").modal('show');	
				}
				
			}else{
				$('#mensajeError').text("Debe llenar los campos vacios (Llenado Opcional: Correo/DNI pariente)");
				$("#modal1").modal('show');		
			}
	});
	
	$('#btnExito').click(function(){
		location.href ="listadoSocios.html";
	});
		
	
});