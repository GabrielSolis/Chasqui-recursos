

function registrarPersonal(personal,callback){
	$.ajax({
		beforeSend:mostrarLoader(),
		method:'POST',
		//url:'http://localhost:9000/personal/',
		url:'https://chasqui-gateway.herokuapp.com/micro-client/personal/',
		data: JSON.stringify(personal),
		contentType: "application/json; charset=utf-8",
		processData:false,
		statusCode:{
			409:function(){
				ocultarLoader();
				$('#tituloRespuesta').text("Registro de personal");
				$('#mensajeRespuesta').text("DNI ya registrado");
				$('#modalRespuesta').modal({
					show:true,
					backcrop:'static'
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

function validarCampos(personal){
	if(personal.nombres == "" || personal.apellidoPaterno == "" || personal.apellidoMaterno == ""
		||personal.direccion=="" || personal.dni==""||personal.sexo=="" ||personal.fechaNacimiento ==""
			||personal.celular =="" || personal.estadoCivil ==""|| personal.fechaRegistro == "" ||
			!validarTamanio($("#txtDNI"),8) ||
			!validarTamanio($("#txtCelular"),9) ){
		return false;
	}
	return true;
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
	$("#cmbEstadoCivil").val("");
}
$(document).ready(function(){
	revisarSesion();	
	ocultarLoader();
	$('#cerrarSesion').click(function(e){
			e.preventDefault();
			cerrarSesion();
			alert("Hasta luego");
	});
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
		var cargo = $("#cmbCargo").val();
		var fechaRegistro = $("#txtFechaRegistro").val();
	
		var personal = {
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
				cargo : cargo
		}
		if(validarCampos(personal)){
			if(validarEdad(personal.fechaNacimiento)){
				registrarPersonal(personal,function(respuesta){
					$('#tituloRespuesta').text("Registro de personal");
					$('#mensajeRespuesta').text(respuesta);
					$('#modalRespuesta').modal({
						show:true,
						backcrop:'static'
					});			
					limpiarCampos();
				});
			}else{
				$('#tituloRespuesta').text("Error al registrar personal");
				$('#mensajeRespuesta').text("El personal debe tener una edad mayor de 18 y menor que 100");
				$('#modalRespuesta').modal({
					show:true,
					backcrop:'static'
				});
			}
			
		}else{
			$('#tituloRespuesta').text("Error al registrar personal");
			$('#mensajeRespuesta').text("Debe llenar los campos obligatorios(*)");
			$('#modalRespuesta').modal({
				show:true,
				backcrop:'static'
			});	
		}
		
	 });
});

