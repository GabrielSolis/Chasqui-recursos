var listaRutas = new Array();
var rutaActual;
function listarRutas(estado,callback){

	$.ajax({
		beforeSend:mostrarLoader(),
		method:'GET',
		//data:{estado:estado},
		url:'https://chasqui-gateway.herokuapp.com/micro-client/rutas/'+estado,//'http://localhost:9000/rutas/'+estado,
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


function modificarRuta(ruta,callback){
	$.ajax({
		beforeSend:mostrarLoader(),
		method:'PUT',
		url:'https://chasqui-gateway.herokuapp.com/micro-client/rutas/',//'http://localhost:9000/rutas/',
		data:JSON.stringify(ruta),
		contentType: "application/json; charset=utf-8",
		headers:{
			//"Content-Type":"application/json",
			//"Access-Control-Allow-Origin":"*",
			"Authorization": "Bearer " + token
		},statusCode:{
			409:function(){
				ocultarLoader();
				$('#tituloRespuesta').text('Agregar ruta');
				$('#cuerpoRespuesta').text('Ya existe esta ruta registrada');
				$('#modalListado').modal('show');
			}
		},
		processData:false
	}).done(function(){
		callback();
		ocultarLoader();
	})
}
function eliminarRuta(ruta,callback){
	$.ajax({
		beforeSend:mostrarLoader(),
		method:'delete',
		data:JSON.stringify(ruta),
		contentType: "application/json; charset=utf-8",
		url:'https://chasqui-gateway.herokuapp.com/micro-client/rutas/',
		headers: {
			//"Content-Type":"application/json",
			//"Access-Control-Allow-Origin":"*",
			"Authorization": "Bearer " + token
		},
		processData:false
	}).done(function(){
		callback();
		ocultarLoader();
	})
}

function mostrarRuta(ruta,i){
	var cuerpo = $("#cuerpoTablaRutas");
	var estado;
	var callesRuta="";
	var contenidoFila = "";
	if(ruta.calles.length >0){
		for(var j=0;j<ruta.calles.length;j++){
			callesRuta = ruta.calles[j].direccion + " | " + callesRuta  ;
		}
	}else{
		callesRuta = "No cuenta con calles";
	}
	
	
	if(ruta.estado == 'A'){
			estado ="Servicio";
		}else{
			estado ="Sin servicio";
		}
	var contenidoFila = "<tr id='"+ruta.codigo+"'>" +
	"<th>"+i+"</th>" +
	"<td>"+ruta.letra+"</td>" + "<td>"+callesRuta + "</td><td>"+
	+ruta.tiempo+"</td><td>"+estado+"</td>" +
		"<td><button id='btnVer' onClick='verDatos("+ruta.codigo+")' class='btn btn-info mr-2'data-toggle='tooltip' data-placement='top' title='Visualizar datos'>" +
		"<i class='fas fa-eye'></i></button>" +
		"<button id='btnModificar"+ ruta.codigo +"'onClick='modificar("+ruta.codigo+")'class='btn btn-info mr-2'data-toggle='tooltip' data-placement='top' title='Modificar datos'>" +
		"<i class='fas fa-edit'></i></button><button class='btn btn-info mr-2' onClick='eliminar("+ruta.codigo+")'><i class='fas fa-trash'></i></button></tr>";
	 		
	cuerpo.append(contenidoFila);

}

function buscarRuta(codigo){
	for(var i=0;i<listaRutas.length;i++){
		if(listaRutas[i].codigo == codigo){
			return i;
		}
	}
}
function eliminar(codigo){
	var indice = buscarRuta(codigo);
	rutaActual = listaRutas[indice];
	$('#rutaEliminar').text(rutaActual.letra);
	$('#modalEliminarRuta').modal({
		show:true,
		backdrop:'static'
	});
}
function modificar(valor){
	var indice = buscarRuta(valor);
	rutaActual = listaRutas[indice];
	$('#txtLetra').val(listaRutas[indice].letra);
	$('#cmbEstado').val(listaRutas[indice].estado);
	$('#modalModificarRuta').modal({
		show:true,
		backdrop:'static'
	});
	
}

function verDatos(codigo){
	var indice = buscarRuta(codigo);
	var calle ="";
	$('tbody.cuerpoTablaCalles tr').remove();
	rutaActual = listaRutas[indice];
	$('#txtRuta').text(rutaActual.letra);
	$('#txtTiempo').text(rutaActual.tiempo);
	if(rutaActual.estado == 'A'){
		$('#txtEstado').text('Con servicio');
	}else{
		$('#txtEstado'.text('Sin servicio'));
	}
	for(var i=0;i<rutaActual.calles.length;i++){
		calle = "";
		calle = "<tr><td>" + (i+1) + "</td><td>" + rutaActual.calles[i].direccion + "</td></tr>";
		$('#cuerpoTablaCalles').append(calle);
	}
	$('#modalDatosRuta').modal({
		show:true,
		backdrop:'static'
	});
}
$(document).ready(function() {
	mostrarLoader();
	revisarSesion();
	ocultarLoader();
	$('#cerrarSesion').click(function(e){
			e.preventDefault();
			cerrarSesion();
			alert("Hasta luego");
	});
	$("#btnListar").click(function(){
	 	listaRutas.splice(0,listaRutas.length);
		var estado = $("#filtrar").val();	
		var estadoString;
		$('tbody tr').remove();
		listarRutas(estado,function(rutas){
		 if(rutas.length > 0){
			 console.log(rutas);
			 for(var i=0;i<rutas.length;i++){
				 listaRutas.push(rutas[i]);
				 mostrarRuta(rutas[i],(i+1));
	
				 $('[data-toggle="tooltip"]').tooltip(); 
			 }
		 }else{
			 if(estado=="A"){
				 //$("#tipoRuta").text("con servicio");
				 estadoString="con servicio";
			 }else if(estado=="I"){
				 //$("#tipoRuta").text("sin servicio");
				 estadoString = "sin servicio";
			 }else{
				 //$("#tipoRuta").text("");
				 estadoString = "";
			 }
			 $('#tituloRespuesta').text('Listado de ruts');
			$('#cuerpoRespuesta').text( 'No hay rutas'+estado+' para listar');
			 $("#modalListado").modal('show');
		 }
	
	 });
	});
	
	
	
	 $("#btnImprimir").click(function(e){
		 e.preventDefault();
	
		var doc = new jsPDF("l","mm","a4");
		var columnas = [{title:"Nº", dataKey:"numero"},
						{title:"Letra", dataKey:"letra"},
						{title:"Calles",dataKey:"calles"},
						{title:"Estado",dataKey:"estado"}];
		var estado;
		var data =[];
		if(listaRutas.length >0){
			
			for(var i=0;i<listaRutas.length;i++){
				if(listaRutas[i].estado == 'A'){
					 estado="Servicio";
				 }else{
					 estado ="Sin servicio";
				 }
				var callesRuta="";
				
				
				if(listaRutas[i].calles.length >0){
					for(var j=0;j<listaRutas[i].calles.length;j++){
						callesRuta = listaRutas[i].calles[j].direccion + " | " + callesRuta  ;
						
					}
				}else{
					callesRuta = "No cuenta con calles";
				}
				data.push({
					numero:i+1,
					letra:listaRutas[i].letra,
					calles:callesRuta,
					estado:estado
				});
			}
			doc.text("Lista de rutas",135,20);


			doc.autoTable(columnas	, data, {
				theme:'grid',
				margin: {horizontal: 7,top:30},
				 styles: {overflow: 'linebreak', columnWidth:'auto',fontSize: 9},
		        columnStyles: {text: {columnWidth: 'auto'}}
		    });
			//doc.autoTable(columnas,data,{margin:{top:25}});
			doc.output('dataurlnewwindow'); //
			//doc.output('save', 'filename.pdf');
			//doc.save('mipdf.pdf');
		}else{
			alert("No hay rutas listados");
		}
		
	 });
	 
	 $('#btnModificarRuta').click(function (){
		 var indice = buscarRuta(rutaActual.codigo);
		 $('#modalModificarRuta').modal('hide');
		 rutaActual.letra = $('#txtLetra').val();
		 rutaActual.estado =$('#cmbEstado').val();
		 console.log(rutaActual.letra + " " + rutaActual.estado);
		 console.log(listaRutas);
		 modificarRuta(rutaActual,function(){
			$('#tituloRespuesta').text('Modificar ruta');
			$('#cuerpoRespuesta').text('¡Ruta modificada exitosamente!');
			$('#modalListado').modal({
				show:true,
				backdrop:'static'
			});
		 });
		 if($('#filtrar').val() != ""){ //Si el filtro no es todos.
			 $('#'+rutaActual.codigo).remove();	
			 listaRutas.splice(indice,1); 
		 }else{
			 listaRutas.splice(0,listaRutas.length);
				var estado = $("#filtrar").val();	
				$('tbody tr').remove();
				listarRutas(estado,function(rutas){
					 console.log(rutas);
					 for(var i=0;i<rutas.length;i++){
						 listaRutas.push(rutas[i]);
						 mostrarRuta(rutas[i],(i+1));
						 $('[data-toggle="tooltip"]').tooltip(); 
					 }
				});
		 }
	 });

	 $('#btnEliminarRuta').click(function(e){
	 	 var indice = buscarRuta(rutaActual.codigo);
		 $('#modalEliminarRuta').modal('hide');
		 eliminarRuta(rutaActual,function(){
			 $('#tituloRespuesta').text('Eliminar ruta');
			 $('#cuerpoRespuesta').text('¡Ruta Eliminada exitosamente!');
			 $('#modalListado').modal({
					show:true,
					backdrop:'static'
				});
		 
			if($('#filtrar').val() != ""){ //Si el filtro no es todos.
			 $('#'+rutaActual.codigo).remove();	
			 listaRutas.splice(indice,1); 
		 }else{
			 listaRutas.splice(0,listaRutas.length);
				var estado = $("#filtrar").val();	
				$('tbody tr').remove();
				listarRutas(estado,function(rutas){
					 console.log(rutas);
					 for(var i=0;i<rutas.length;i++){
						 listaRutas.push(rutas[i]);
						 mostrarRuta(rutas[i],(i+1));
						 $('[data-toggle="tooltip"]').tooltip(); 
					 }
				});
		 }
		 })

	 });
	 
	 $("#btnImprimirRuta").click(function(e){
		 e.preventDefault();
		var doc = new jsPDF();
		var columnas = [{title:"Numero", dataKey:"numero"},
			{title:"Calle", dataKey:"calle"}];
		var data =[];
		var callesRuta="";
		if(rutaActual.calles.length > 0){
			for(var i=0;i<rutaActual.calles.length;i++){
				data.push({
					numero:i+1,
					calle:rutaActual.calles[i].direccion,
				});
				
			}

			doc.text("Datos de socio",80,10);
			doc.text("Ruta: " + $("#txtRuta").text(),10,30 );
			doc.text("Tiempo: " + $("#txtTiempo").text(),40,30);
			doc.text("Estado: "+$("#txtEstado").text(),80,30);
			doc.text("Calles",70,20);
			
			doc.autoTable(columnas,data,{margin:{top:50}});
			doc.output('dataurlnewwindow');	
		}else{
			 $('#tituloRespuesta').text('Imprimir ruta');
			 $('#cuerpoRespuesta').text("La ruta no cuenta con calles registradas");
			 $('#modalListado').modal({
					show:true,
					backdrop:'static'
				});
			
		}
	
	 });
	 
});