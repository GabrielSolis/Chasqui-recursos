

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
function listarPersonal(callback){
	$.ajax({
		//beforeSend: function(){$("#modalCargando").modal('show')},
		beforeSend: mostrarLoader(),
		//url:'http://localhost:9000/personal/'+localStorage.getItem("idPersonal")
		url:'https://chasqui-gateway.herokuapp.com/micro-client/personal/'+sessionStorage.getItem("idPersonal"),
		headers:{
			"Authorization": "Bearer " + token
		}
	}).done(function(personal){
		ocultarLoader();
		callback(personal);
		
	})
}

function modificarPersonal(personal,callback){
	$.ajax({
		beforeSend: mostrarLoader(),
		method:'PUT',
		//url:'http://localhost:9000/personal/',
		url:'http://chasqui-gateway.herokuapp.com/micro-client/personal/',
		contentType: "application/x-www-form-urlencoded",
		data: JSON.stringify(personal),
		statusCode:{
			409:function(){
		
				ocultarLoader();
				$('#tituloRespuesta').text("Modificar personal");
				$('#mensajeRespuesta').text("DNI ya registrado");
				$('#modalRespuesta').modal({
					show:true,
					backcrop:'static'
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
		callback(respuesta);
		ocultarLoader();
	})
}

function llenarCampos(personal){
	$("#txtNombres").val(personal.nombres);
	$("#txtApellidoP").val(personal.apellidoPaterno);
	$("#txtApellidoM").val(personal.apellidoMaterno);
	$("#txtDNI").val(personal.dni);
	if(personal.sexo == 'M'){
		$('#rdbSexoM').prop("checked", true);
	}else{
		$('#rdbSexoF').prop("checked", true);
	}
	$("#cmbEstadoCivil").val(personal.estadoCivil);
	$("#txtDireccion").val(personal.direccion);
	$('#txtEstadoCivil').val(personal.estadoCivil);
	$("#txtCorreo").val(personal.correo);
	$("#txtFechaNacimiento").val(personal.fechaNacimiento);
	$("#txtFechaRegistro").val(personal.fechaRegistro);
	$("#txtCelular").val(personal.celular);
	$("#cmbCargo").val(personal.cargo);
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


$(document).ready(function() {
	revisarSesion();	
	ocultarLoader();
	$('#cerrarSesion').click(function(e){
			e.preventDefault();
			cerrarSesion();
			alert("Hasta luego");
	});
	listarPersonal(function mostrarPersonal(personal){
		llenarCampos(personal);
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
			var cargo = $("#cmbCargo").val();
			var fechaRegistro = $("#txtFechaRegistro").val();
			var dni = $("#txtDNI").val();
			var personal = {
					codigo:sessionStorage.getItem("idPersonal"),
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
					cargo:cargo,
					dni:dni
					
			}
			//console.log(personal);
			if(validarCampos(personal)){
				if(validarEdad(personal.fechaNacimiento)){
					modificarPersonal(personal,function(respuesta){
						$('#tituloRespuesta').text("Modificar  personal");
						$('#mensajeRespuesta').text(respuesta);
						$('#modalExito').modal({
							show:true,
							backcrop:'static'
						});			

					limpiarCampos();
					});
				}else{
					$('#tituloRespuesta').text("Error al modificar personal");
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
	
	$('#btnExito').click(function(){
		location.href ="listadoPersonal.html";
	});
		
	
});
