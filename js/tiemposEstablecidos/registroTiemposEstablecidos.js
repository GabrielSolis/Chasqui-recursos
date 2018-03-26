var listaRutas = new Array();
var listaPuntosControl = new Array(); 
var listaMarcadoresCalles = new Array();
var listaMarcadoresPuntosControl = new Array();
var listaColores = ["#A93226","#2980B9","#1ABC9C","#884EA0","#2ECC71","#F39C12","#D35400","#2E4053","#4A235A","#ABEBC6"];
var listaTiempos = new Array();
var tiempoActual;
var polilinea;
var rutaActual;
var puntoActual;
var listaMarcadoresTiempos = new Array();
var map;
//Consumo de rest
function listarRutas(callback){
	$.ajax({
		beforeSend: mostrarLoader(),
		method:'GET',
		url:'https://chasqui-gateway.herokuapp.com/micro-client/rutas/',//'http://localhost:9000/rutas/',
		processData:false,
		headers:{
			"Authorization": "Bearer " + token
		}
	}).done(function(rutasRespuesta){
		console.log(rutasRespuesta);
		callback(rutasRespuesta);
		ocultarLoader();
	})
}



function listarPuntos(callback){
	$.ajax({
		beforeSend:mostrarLoader(),
		url:'https://chasqui-gateway.herokuapp.com/micro-client/puntos/?estado='+'A',//'http://localhost:9000/puntos/?estado='+'A',
		headers:{
			"Authorization": "Bearer " + token
		}
	}).done(function(respuesta){
//		callback(JSON.stringify(respuesta));
		callback(respuesta);
		ocultarLoader();
	})
}

function modificarTiempoEstablecido(tiempoEstablecido,callback){
	$.ajax({
		beforeSend:mostrarLoader(),
		method:'PUT',
		data:JSON.stringify(tiempoEstablecido),
		url:'https://chasqui-gateway.herokuapp.com/micro-client/tiempoEstablecido/',//'http://localhost:9000/tiempoEstablecido/',
		headers:{
			//"Content-Type":"application/json",
			//"Access-Control-Allow-Origin":"*",
			"Authorization": "Bearer " + token
		},
		contentType: "application/json; charset=utf-8",
		processData:false,
	}).done(function(respuesta){
		callback(respuesta);
		ocultarLoader();
	})
}
function eliminarTiempoEstablecido(tiempoEstablecido,callback){
	$.ajax({
		beforeSend:mostrarLoader(),
		method:'DELETE',
		data:JSON.stringify(tiempoEstablecido),
		url:'https://chasqui-gateway.herokuapp.com/micro-client/tiempoEstablecido/',//'http://localhost:9000/tiempoEstablecido/',
		headers:{
			//"Content-Type":"application/json",
			//"Access-Control-Allow-Origin":"*",
			"Authorization": "Bearer " + token
		},
		contentType: "application/json; charset=utf-8",
		processData:false,
	}).done(function(respuesta){
		callback(respuesta);
		ocultarLoader();
	})
}
function listarTiempos(codigoRuta,callback){
	$.ajax({
		beforeSend:mostrarLoader(),
		method:'GET',
		url:'https://chasqui-gateway.herokuapp.com/micro-client/tiempoEstablecido/'+codigoRuta,//'http://localhost:9000/tiempoEstablecido/'+codigoRuta,
		headers: {
			//"Content-Type":"application/json",
			//"Access-Control-Allow-Origin":"*",
			"Authorization": "Bearer " + token
		},
		processData:false,
	}).done(function(respuesta){
		callback(respuesta);
		ocultarLoader();
	})
}
function registrarTiempoEstablecido(tiempoEstablecido,callback){
	$.ajax({
		beforeSend:mostrarLoader(),
		method:'POST',
		url:'https://chasqui-gateway.herokuapp.com/micro-client/tiempoEstablecido/',//'http://localhost:9000/tiempoEstablecido/',
		data:JSON.stringify(tiempoEstablecido),
		headers: {
			//"Content-Type":"application/json",
			//"Access-Control-Allow-Origin":"*",
			"Authorization": "Bearer " + token
		},
		contentType: "application/json; charset=utf-8",
		processData:false,
	}).done(function(respuesta){
		callback(respuesta);
		ocultarLoader();
	})
}

//Inicio

function initMap() { 
	revisarSesion();
	$('#cerrarSesion').click(function(e){
			e.preventDefault();
			cerrarSesion();
			alert("Hasta luego");
	});
	map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        minZoom:14,
        center: {lat: -6.801895, lng: -79.846964},
        streetViewControl:true,
        mapTypeControl: true,
        mapTypeControlOptions: {
      	position:google.maps.ControlPosition.TOP_RIGHT,
         
        }
      });
	  ocultarLoader();
		cargarPuntosControl();
	
	//Menu rutas
	$("#mostrar-nav-rutas").click(function(){
    	$('.nav-rutas').toggleClass('mostrar');
    })
    
    $("#btnAgregarTiempo").click(function(){
    	$("#modalAgregarTiempo").modal('hide');
    	var tiempoEstablecido = {
    			codigo:0,
    			ruta:{
    				codigo:rutaActual.codigo
    			},
    			punto:{
    				codigo: puntoActual.codigo
    			},
    			tiempoEstablecido:$("#txtTiempo").val(),
    			orden:$("#txtOrden").val(),
    			vigencia:true
    	}
    	
    	if( Number($('#txtTiempo').val()) !=0 && Number($('#txtOrden').val()) !=0 ){
    		registrarTiempoEstablecido(tiempoEstablecido,function(respuesta){
        		$('#tituloRespuesta').text('Agregar tiempos a ruta');
        		$('#contenidoRespuesta').text(respuesta);
        		$('#modalRespuesta').modal('show');
        		actualizarPuntosControl();
        		listarTiemposRuta(rutaActual.codigo);
        	});
		}else{
			$('#tituloRespuesta').text('Agregar tiempos a ruta');
    		$('#contenidoRespuesta').text('Debe llenar todos los campos');
    		$('#modalRespuesta').modal('show');
		}
    	
    });
	

	$("#btnModificarTiempo").click(function(){
		if( $('#txtTiempoModificar').val() !=0 && $('#txtOrdenModificar').val() !=0 ){
			$('#modalModificarTiempo').modal('hide');
			tiempoActual.tiempoEstablecido = $('#txtTiempoModificar').val();
    		tiempoActual.orden = $('#txtOrdenModificar').val();
    		modificarTiempoEstablecido(tiempoActual,function(respuesta){
    			$('#tituloRespuesta').text('Modificar Tiempo establecido');
        		$('#contenidoRespuesta').text(respuesta);
        		$('#modalRespuesta').modal('show');
        		actualizarPuntosControl();
        		listarTiemposRuta(rutaActual.codigo);
        		console.log("hola");
    		});
		}else{
			$('#tituloRespuesta').text('Modificar Tiempo establecido');
    		$('#contenidoRespuesta').text('Debe llenar todos los campos');
    		$('#modalRespuesta').modal('show');
		}
		
	});
	
	$("#btnEliminarTiempo").click(function(){
		eliminarTiempoEstablecido(tiempoActual,function(respuesta){
			var indice = buscarTiempo(tiempoActual.codigo);
			listaMarcadoresTiempos[indice].setMap(null);
			actualizarPuntosControl();

			$("#modalELiminarTiempo").modal('hide');
			$('#tituloRespuesta').text('Eliminar Tiempo establecido');
    		$('#contenidoRespuesta').text(respuesta);
    		$('#modalRespuesta').modal('show');
    		listarTiemposRuta(rutaActual.codigo);
		});
	});
	
}

function cargarPuntosControl(){
	listarPuntos(function(respuesta){
		listaPuntosControl = respuesta;
		console.log(listaPuntosControl);
		for(var i=0;i<listaPuntosControl.length;i++){
			var marcadorPunto = new google.maps.Marker({
				map: map,
				position: {lat:listaPuntosControl[i].latitud,lng:listaPuntosControl[i].longitud},
				title: listaPuntosControl[i].direccion,
				icon:"../../img/puntoControl.png"
			});
			agregarListenerPuntos(marcadorPunto,listaPuntosControl[i].codigo);
			listaMarcadoresPuntosControl.push(marcadorPunto);
		}
		cargarRutas();
	});
		
}

function cargarRutas(){
	var contenidoRutas;
	$('li.rutaOp').remove();
	
	listarRutas(function(rutasRespuesta){
		for(var i = 0;i<rutasRespuesta.length;i++){
			//console.log(rutasRespuesta[i]);
			contenidoRutas = "";
			contenidoRutas = '<li id="'+i+'" onClick="rutaSeleccionada('+rutasRespuesta[i].codigo+');"class="rutaOp"><span  style="background:'+listaColores[i] +';"></span><label>Ruta '+rutasRespuesta[i].letra+'</label></li>';
			$('#ulRutas').append(contenidoRutas);
		}
		listaRutas = rutasRespuesta;
	});
}

function agregarListenerPuntos(marcadorPunto,codigo){
	var infowindow = new google.maps.InfoWindow({
  	    content: "<div class='mb-2'><p>"+marcadorPunto.title + "</p></div><div class='text-center'>" +
  	    		"<button  title='Agregar Tiempo' onClick='modalAgregarTiempo("+codigo+");' style='border-radius:100%;'class='btn btn-sm btn-info mr-2'><i class='fas fa-plus-circle'></i></button>" +
  	    		"<button  title='Visualizar punto de control' onClick='irAPunto("+codigo+");' style='border-radius:100%;'class='btn btn-sm btn-info mr-2'><i class='fas fa-street-view'></i></button></div>"
  	  });
	marcadorPunto.addListener('click',function(){
		infowindow.open(marcadorPunto.get('map'),marcadorPunto);
	});
}

function agregarListenerTiempos(marcadorTiempo,codigo){
	var indice = buscarTiempo(codigo);
	var infowindow = new google.maps.InfoWindow({
		
  	    content: "<div class='mb-2'><p>"+marcadorTiempo.title + "</p><p>Tiempo: " + listaTiempos[indice].tiempoEstablecido +" min.</p></div><div class='text-center'>" +
  	    		"<button  title='Modificar Tiempo' onClick='modalModificarTiempo("+codigo+");' style='border-radius:100%;'class='btn btn-sm btn-info mr-2'><i class='fas fa-edit'></i></button>" +
  	    		"<button  title='Visualizar punto de control' onClick='irAPunto("+codigo+");' style='border-radius:100%;'class='btn btn-sm btn-info mr-2'><i class='fas fa-street-view'></i></button>" +
  	    		"<button  title='Retirar tiempo establecido' onClick='modalEliminarTiempo("+codigo+");' style='border-radius:100%;'class='btn btn-sm btn-info'><i class='far fa-trash-alt'></i></button></div>"
  	  });
	marcadorTiempo.addListener('click',function(){
		infowindow.open(marcadorTiempo.get('map'),marcadorTiempo);
	});
}

function modalAgregarTiempo(codigo){
	if(rutaActual != undefined && rutaActual != ""){
		var indice = buscarMarcadorPunto(codigo);
		puntoActual = listaPuntosControl[indice];
		$('#preguntaAgregarTiempo').text('¿Desea agregar un nuevo tiempo establecido?');
		$('#nombreRuta').text("Ruta " + rutaActual.letra);
		$('#direccionPuntoControlAgregar').text(listaMarcadoresPuntosControl[indice].title);
		$('#modalAgregarTiempo').modal({
			show:true,
			backdrop:'static'
		});
	}else{
		$('#tituloRespuesta').text('Agregar tiempos a ruta');
		$('#contenidoRespuesta').text('Debe seleccionar una ruta para poder agregar tiempos');
		$('#modalRespuesta').modal('show');
	}
}
function modalModificarTiempo(codigoTiempo){
	var indice = buscarTiempo(codigoTiempo);
	var indicePuntoControl = buscarPuntoControl(listaTiempos[indice].punto.codigo);

	$('#nombreRutaModificar').text("Ruta " + rutaActual.letra);
	$('#direccionPuntoControlModificar').text(listaMarcadoresPuntosControl[indicePuntoControl].title);
	$('#txtTiempoModificar').val(listaTiempos[indice].tiempoEstablecido);
	$('#txtOrdenModificar').val(listaTiempos[indice].orden);
	$('#modalModificarTiempo').modal({
		show:true,
		backdrop:'static'
	});
	tiempoActual = listaTiempos[indice];
}

function modalEliminarTiempo(codigoTiempo){

	var indice = buscarTiempo(codigoTiempo);
	var indicePuntoControl = buscarPuntoControl(listaTiempos[indice].punto.codigo);
	$('#nombreRutaEliminar').text("Ruta " + rutaActual.letra);
	$('#direccionPuntoControlEliminar').text(listaMarcadoresPuntosControl[indicePuntoControl].title);
	$('#tiempoEliminar').text(listaTiempos[indice].tiempoEstablecido);
	$('#ordenEliminar').text(listaTiempos[indice].orden);
	$('#modalELiminarTiempo').modal({
		show:true,
		backdrop:'static'
	});
	tiempoActual = listaTiempos[indice];
	
}
function irAPunto(codigo){
	var indice = buscarMarcadorPunto(codigo);
	var punto = listaMarcadoresPuntosControl[indice];
	panorama = map.getStreetView();
    panorama.setPosition(punto.position);
    if(panorama.getVisible() == true){
    	console.log("Estamos en street view");
    	panorama.setVisible(false);
    }else{
    	console.log("Algo salio mal");
    	panorama.setVisible(true);
    	
    }
}

function buscarMarcadorPunto(codigo){
	
	for(var i=0;i<listaPuntosControl.length;i++){
		if(listaPuntosControl[i].codigo == codigo ){
			return i;
		}
	}
}

//Al seleccionar una ruta
function rutaSeleccionada(codigoRuta){
	actualizarPuntosControl();
	var indice = buscarRuta(codigoRuta);
	$('li.rutaOp').removeClass('seleccionado');
	$('li#'+indice).addClass('seleccionado');
	rutaActual = listaRutas[indice];
	limpiarMapa();
	listaMarcadoresCalles.splice(0,listaMarcadoresCalles.length);
	for(var i=0;i<rutaActual.calles.length;i++){
		agregarMarcadorCallesMapa(rutaActual.calles[i]);
		console.log(rutaActual.calles[i]);
	}
	listarTiemposRuta(codigoRuta);
	agregarPolilinea(indice);
	if(rutaActual.calles[0] != undefined){
		map.setCenter({lat:rutaActual.calles[0].latitud,lng:rutaActual.calles[0].longitud});
	}
	
	
}

function listarTiemposRuta(codigoRuta){
	listarTiempos(codigoRuta,function(respuesta){
		listaTiempos = respuesta;
		for(var i=0;i<listaTiempos.length;i++){
			for(var j=0;j<listaPuntosControl.length;j++){
				if(listaTiempos[i].punto.codigo == listaPuntosControl[j].codigo){
					listaMarcadoresPuntosControl[j].setMap(null);
					var marcadorTiempo = new google.maps.Marker({
						map: map,
						position: {lat:listaPuntosControl[j].latitud,lng:listaPuntosControl[j].longitud},
						title: listaPuntosControl[j].direccion,
						icon:"../../img/tiempoEstablecido.png"
					});
					listaMarcadoresTiempos.push(marcadorTiempo);
					agregarListenerTiempos(marcadorTiempo,listaTiempos[i].codigo);
				}
			}
		}
	});
}
function actualizarPuntosControl(){
	for(var j=0;j<listaPuntosControl.length;j++){
		listaMarcadoresPuntosControl[j].setMap(map);
	}
}
function buscarRuta(codigoRuta){
	for(var i = 0;i<listaRutas.length;i++){
		if(codigoRuta == listaRutas[i].codigo){
			return i;
		}
	}
}

function buscarTiempo(codigoTiempo){
	for(var i = 0;i<listaTiempos.length;i++){
		if(codigoTiempo == listaTiempos[i].codigo){
			return i;
		}
	}
}

function buscarPuntoControl(codigoPunto){
	for(var i = 0;i<listaPuntosControl.length;i++){
		if(codigoPunto == listaPuntosControl[i].codigo){
			return i;
		}
	}
}


function limpiarMapa(){
	if(listaMarcadoresCalles.length > 0){
		for(var i=0;i<listaMarcadoresCalles.length;i++){
			listaMarcadoresCalles[i].setMap(null);
		}
	}
	if(listaMarcadoresTiempos.length>0){
		for(var i=0;i<listaMarcadoresTiempos.length >0;i++){
			listaMarcadoresTiempos[i].setMap(null);
		}
	}
	listaMarcadoresTiempos.splice(0,listaMarcadoresTiempos.length);
}

function agregarMarcadorCallesMapa(calle){
	marcadorCalle = new google.maps.Marker({
		map: map,
		position: {lat:calle.latitud , lng:calle.longitud},
		title: calle.direccion ,
		dragged:true
	});
	//agregarListenersCalle(marcadorCalle,calle.codigo,calle.numeroOrden);
	listaMarcadoresCalles.push(marcadorCalle);
}

function agregarPolilinea(valor){
	var puntosPolilinea = new Array();
	
	if(polilinea != undefined){
		polilinea.setMap(null);
	}
	for(var i=0;i<listaMarcadoresCalles.length;i++){
		puntosPolilinea.push(listaMarcadoresCalles[i].position);
	}
		  polilinea= new google.maps.Polyline({
          path: puntosPolilinea,
          geodesic: true,
          strokeColor: listaColores[valor],
          strokeOpacity: 1.0,
          strokeWeight: 4
        });
        polilinea.setMap(map);
}