var personalActual;
var listaPersonal = new Array();
//  var id = sessionStorage.getItem("id");  
var token = sessionStorage.getItem("k");




//
function darBajaPersonal(personal,callback){
	$.ajax({
		beforeSend:mostrarLoader(),
		method:'delete',
		contentType: "application/json; charset=utf-8",
		data:JSON.stringify(personal),
		//url:'http://localhost:9000/personal/',
		//url:'http://chasqui-gateway.herokuapp.com/micro-client/personal/',
		
		url:'http://chasqui-gateway.herokuapp.com/micro-client/personal/',
		headers: {
			//"Content-Type":"application/json",
			//"Access-Control-Allow-Origin":"*",
			"Authorization": "Bearer " + token
		},
		processData:false
	}).done(function(personal){
		callback(personal);
		ocultarLoader();
	})
}



/// cargar socios
function listarPersonales(estado,apellido,callback){
	console.log(estado + " " + apellido);
	$.ajax({
		beforeSend:mostrarLoader(),
		/*beforeSend: function(){$("#modalCargando").modal('show')},*/
		data:{estado:estado,apellido:apellido},
		//url:'http://localhost:9000/personal/?estado='+estado+'&apellido='+apellido,
		url:'http://chasqui-gateway.herokuapp.com/micro-client/personal/?estado='+estado+'&apellido='+apellido,
		processData:false,
		headers:{
			"Authorization": "Bearer " + token
		}
	}).done(function(personal){
		ocultarLoader();
		callback(personal);
	})
}

///Cargar datos de un socio
function listarPersonal(callback){
	$.ajax({
		//beforeSend: function(){$("#modalCargando").modal('show')},
		beforeSend: mostrarLoader(),
		contentType: "application/json; charset=utf-8",
		//url:'http://localhost:9000/personal/'+sessionStorage.getItem("idPersonal")
		url:'http://chasqui-gateway.herokuapp.com/micro-client/personal/'+sessionStorage.getItem("idPersonal"),
		headers:{
			"Authorization": "Bearer " + token
		}
	}).done(function(personal){
		ocultarLoader();
		callback(personal);
		
	})
}

function llenarCampos(personal){
	$("#txtNombresCompletos").text(personal.nombres + " "+personal.apellidoPaterno + " "+personal.apellidoMaterno);
	$("#txtDNI").text(personal.dni);
	if(personal.sexo == 'M'){
		$('#txtSexo').text('Masculino');
	}else{
		$('#txtSexo').text('Femenino');
	}
	$("#cmbEstadoCivil").text(personal.estadoCivil);
	$("#txtDireccion").text(personal.direccion);
	$('#txtEstadoCivil').text(personal.estadoCivil);
	$("#txtCorreo").text(personal.correo);
	if(personal.vigencia == true){
		$('#txtEstado').text("Activo");
		$("#txtFechaRetiro").text("");
	}else{
		$('#txtEstado').text("Retirado");
		$("#txtFechaRegistro").text(personal.fechaRetiro);
	}
	$("#txtFechaNacimiento").text(personal.fechaNacimiento);
	$("#txtFechaRegistro").text(personal.fechaRegistro);
	$("#txtCelular").text(personal.celular);
	$("#txtCargo").text(personal.cargo);
}

function mostrarPersonal(personal,i){
	var cuerpo = $("#cuerpoTablaPersonal");
	var estado;
	var contenidoFila = "";
	if(personal.vigencia == true){
			estado ="Activo";
			contenidoFila ="<button id='btnBaja"+personal.codigo+"' onClick='darBaja("+personal.codigo+")'class='btn btn-info mr-2'data-toggle='tooltip' data-placement='top' title='Dar de baja'>" +
		"<i class='fas fa-arrow-down'></i></button><button onClick='generarUsuario("+personal.codigo+")' class='btn btn-info mr-2' data-toogle='tooltip' data-placement='top' title='Generar Usuario'>"
		+"<i class='fas fa-user-plus'></i></button></td></tr>"
		}else{
			estado ="Retirado";
			contenidoFila ="<button id='btnAlta"+personal.codigo+"'  onClick='darAlta("+personal.codigo+")'class='btn btn-info mr-2'data-toggle='tooltip' data-placement='top' title='Dar de alta'>" +
 		"<i class='fas fa-arrow-up'></i></button></td></tr>"
		}
	var contenidoFila = "<tr id='"+personal.codigo+"'>" +
	"<th>"+i+"</th>" +
	"<td>"+personal.nombres+" " +personal.apellidoPaterno+" "+personal.apellidoMaterno +"</td>" +
	"<td>"+personal.dni+"</td> <td>"+personal.cargo+"</td><td>"+estado+"</td>" +
		"<td><button id='btnVer' onClick='verDatos("+personal.codigo+")' class='btn btn-info mr-2'data-toggle='tooltip' data-placement='top' title='Visualizar datos'>" +
		"<i class='fas fa-eye'></i></button>" +
		"<button  onClick='modificar("+personal.codigo+")'class='btn btn-info mr-2'data-toggle='tooltip' data-placement='top' title='Modificar datos'>" +
		"<i class='fas fa-edit'></i></button>" + contenidoFila;
	 		
	cuerpo.append(contenidoFila);

}
function darBaja(valor){
	$('#mensajeBaja').text('¿Desea dar de baja al personal?');
	$('#modalBaja').modal({
		show:true,
		backdrop:'static'
	});
	personalActual = {codigo:valor,vigencia:false}
	
}
function darAlta(valor){
	$('#mensajeAlta').text('¿Desea dar de alta al personal?');
	$('#modalAlta').modal({
		show:true,
		backdrop:'static'
	});
	 personalActual = {codigo:valor,vigencia:true}

}
function modificar(valor){
	sessionStorage.setItem("idPersonal",valor);
	location.href="modificarPersonal.html";
}
function verDatos(valor){
	sessionStorage.setItem("idPersonal",valor);
	listarPersonal(function mostrarPersonal(personal){
		llenarCampos(personal);
	});
  $("#modalPersonal").modal('show');
}
$(document).ready(function() {
	 revisarSesion();	
	 ocultarLoader();

	 
	$('#cerrarSesion').click(function(e){
			e.preventDefault();
			cerrarSesion();
			alert("Hasta luego");
	});
	 $('#btnModalBaja').click(function(){
		 darBajaPersonal(personalActual,function(respuesta){
				
			});
			$('#btnBaja'+personalActual.codigo).tooltip('hide');
			$('#'+personalActual.codigo).remove();
			$('#modalBaja').modal('hide');
	 });
	 $('#btnModalAlta').click(function(){
			darBajaPersonal(personalActual,function(respuesta){
				
			});
			$('#btnAlta'+personalActual.codigo).tooltip('hide');
			$('#'+personalActual.codigo).remove();
			$('#modalAlta').modal('hide');
	 });
	 
	 $("#btnListar").click(function(){
		 	listaPersonal.splice(0,listaPersonal.length);
			var estado = $("#filtrar").val();

			var apellido = $("#buscar").val().toLowerCase();
		
			
			$('tbody tr').remove();
			listarPersonales(estado,apellido,function(personal){
			 if(personal.length > 0){
				 for(var i=0;i<personal.length;i++){
					 
					 listaPersonal.push(personal[i]);
					 mostrarPersonal(personal[i],(i+1));

					 $('[data-toggle="tooltip"]').tooltip(); 
				 }
			 }else{
				 if(estado="A"){
					 $("#tipoPersonal").text("activos");
				 }else if(estado="R"){
					 $("#tipoPersonal").text("retirados");
				 }else{
					 $("#tipoPersonal").text("");
				 }
				 $("#modalListado").modal('show');
			 }

		 });
	 });
	 
	 $("#btnImprimir").click(function(e){
		 e.preventDefault();
	
		var doc = new jsPDF();
		
		var columnas = [{title:"Numero", dataKey:"numero"},
						{title:"Nombres y Apellidos",dataKey:"nombres"},
						{title:"DNI",dataKey:"dni"},
						{title:"Cargo",dataKey:"cargo"},
						{title:"Estado",dataKey:"estado"}];
		var data =[];
		if(listaSocios.length >0){
			for(var i=0;i<listaSocios.length;i++){
				if(listaSocios[i].vigencia==true){
					 estado="Activo";
				 }else{
					 estado ="Retirado";
				 }
				console.log(listaPersonall[i]);
				data.push({
					numero:i+1,
					nombres:listaPersonal[i].nombres + " " + listaPersonal[i].apellidoPaterno + " " + listaPersonal[i].apellidoMaterno,
					dni: listaSocios[i].dni,
					cargo:listaPersonal[i].cargo,
					estado:estado
				});
			}
			doc.text("Lista de personal",85,40);
			doc.line(80, 41, 130, 41);
			doc.autoTable(columnas,data,{margin:{top:55}});
			doc.output('dataurlnewwindow'); //
			//doc.output('save', 'filename.pdf');
			//doc.save('mipdf.pdf');
		}else{
			$('#modalListado').modal({
				show:true,
				backdrop:'static'
			});
			//alert("No hay personal listados");
		}
		
	 });
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
			
			doc.text("Datos de personal",80,40);
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
			doc.text("Cargo: ",20,200);
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
			doc.text($("#txtCargo").text(),80,200)
			doc.output('dataurlnewwindow');
	
		
		
	 });
});