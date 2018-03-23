/*Configuración incial*/

var map;
var punto; //Usaremos esta variable para agregar,modificar y eliminar puntos 
var listaPuntos= new Array(); //Este marcador solo obtendá los datos de los puntos
var listaMarcadores = new Array();
var marcadorReferencia;

var direccionPunto;
///Punto nor-oeste a considerar -6.715980, -79.812047 capote
//Punto mas sur-este a considerar -6.904088, -79.900677 playa la cruz del faro
//Ajax para consumir rest 
function registrarPunto(punto,callback){
	$.ajax({
		beforeSend:mostrarLoader(),
		method:'POST',
		url:'https://chasqui-gateway.herokuapp.com/micro-client/puntos/',//'http://localhost:9000/puntos/',
		data: JSON.stringify(punto),
		contentType: "application/json; charset=utf-8",
		processData:false,
		headers:{
			//"Content-Type":"application/json",
			//"access-control-allow-origin":"*"
			"Authorization": "Bearer " + token
		}
	}).done(function(respuesta){
		//callback(JSON.stringify(respuesta));
		callback(respuesta);
		ocultarLoader();
	})
}
// Ajax para consumir rest al listar los puntos
function listarPuntos(callback){
	$.ajax({
		beforeSend:mostrarLoader(),
		url:'https://chasqui-gateway.herokuapp.com/micro-client/puntos/?estado=A',//'http://localhost:9000/puntos/?estado='+'A'
		headers:{
			//"Content-Type":"application/json",
			//"access-control-allow-origin":"*"
			"Authorization": "Bearer " + token
		}
	}).done(function(respuesta){
//		callback(JSON.stringify(respuesta));
		callback(respuesta);
		ocultarLoader();
	})
}

/// Ajax para eliminar un punto
function eliminarPunto(punto,callback){
	$.ajax({
		beforeSend:mostrarLoader(),
		method:'DELETE',
		url: 'https://chasqui-gateway.herokuapp.com/micro-client/puntos/',//'http://localhost:9000/puntos/',
		data: JSON.stringify(punto),
		contentType: "application/json; charset=utf-8",
		pprocessData:false,
		headers:{
			//"Content-Type":"application/json",
			//"Access-Control-Allow-Origin":"*"
			"Authorization": "Bearer " + token
		}
	}).done(function(respuesta){
		callback(respuesta);
		ocultarLoader();
	})
}

function modificarPunto(punto,callback){
	$.ajax({
		method:'PUT',
		url:'https://chasqui-gateway.herokuapp.com/micro-client/puntos/',//'http://localhost:9000/puntos/',
		data: JSON.stringify(punto),
		contentType: "application/json; charset=utf-8",
		pprocessData:false,
		headers:{
			//"Content-Type":"application/json",
			//"Access-Control-Allow-Origin":"*"
			"Authorization": "Bearer " + token
		}
	}).done(function(respuesta){
		callback(respuesta);
	})
}

function agregarPuntoMapa(e){
	//Validamos que este dentro del rango
	if(e.latLng.lat()>-6.904088 && e.latLng.lat()< -6.715980 && e.latLng.lng()>-79.900677 && e.latLng.lng() <  -79.812047){
		convertirPunto(e.latLng.lat(),e.latLng.lng());
		//conseole.log(direccion);
		setTimeout(function(){
			if(direccionPunto == undefined){
				$("#tituloRespuesta").text('Error al obtener dirección');
		    	$('#contenidoRespuesta').text('No se puedo obtener la dirección');
				$('#modalRespuesta').modal('show');
			}else{
				 punto = {
						latitud:e.latLng.lat(),
						longitud:e.latLng.lng(),
						direccion: direccionPunto,
						//direccion:direccion,
						vigencia: true
				}
				$('#direccionAgregar').text(direccionPunto);
				$('#modalAgregar').modal('show');
			}

		},1000);
	}else{
		$("#tituloRespuesta").text('Error al agregar punto de control');
    	$('#contenidoRespuesta').text('No se puede agregar un nuevo punto de control fuera de chiclayo');
		$('#modalRespuesta').modal('show');
	}
	
}
///Método para geocodificación inversa, obtenemos la direción a partir de la posición
function convertirPunto(latitud,longitud){
	$.ajax({
		beforeSend:mostrarLoader(),
		url:'https://maps.googleapis.com/maps/api/geocode/json?latlng='+latitud+','+longitud+'&key=AIzaSyBLCCyTnMmExDBB0gCyx8gf_I7Av5dbZEA',
	}).done(function(respuesta){
	    direccionPunto= respuesta.results[0].formatted_address;
	   ocultarLoader();
	})
}

function buscarPuntoLista(id){
	
	for(var i=0;i<listaPuntos.length;i++){
		  if(listaPuntos[i].codigo == id){
			  return i;
		  }
	  }
}


///Agregar los addListener a los marcadores.
function agregarListenersPuntoControl(marcador,id){
	var posicion;
	var direccionModificar;
	var infowindow = new google.maps.InfoWindow({
  	    content: "<div class='mb-2'><p>"+marcador.title + "</p></div><div class='text-center'>" +
  	    		"<button  title='Visualizar punto' onClick='irAPunto("+id+");' style='border-radius:100%;'class='btn btn-sm btn-info mr-2'><i class='fas fa-street-view'></i></button>" +
  	    		"<button  title='Retornar a posicion anterior del punto' onClick='retornarAPosicion("+id+");' style='border-radius:100%;'class='btn btn-sm btn-info'><i class='fas fa-undo'></i></button>"+
  	    		"<button  title='Eliminar punto' onClick='eliminar("+id+");' style='border-radius:100%;'class='btn btn-sm btn-info ml-2'><i class='far fa-trash-alt'></i></button></div>" 
  	  });
	marcador.addListener('click',function(){
		//infowindow.open(map.getStreetView(),marcador);
		infowindow.open(marcador.get('map'),marcador);
	
	});
	
	marcador.addListener('dragend',function(e){
		console.log(id);
		//direccionModificar = convertirPunto(e.latLng.lat(),e.latLng.lng());
		convertirPunto(e.latLng.lat(),e.latLng.lng());
		setTimeout(function(){
			if(direccionPunto == undefined){
				$("#tituloRespuesta").text('Error al obtener dirección');
		    	$('#contenidoRespuesta').text('No se puedo obtener la dirección');
				$('#modalRespuesta').modal('show');
			
			}else{
				indice = buscarPuntoLista(id);
				punto = listaPuntos[indice];
				//posicion = buscarPuntoLista(id);
				//punto = $.extend(true,{},listaPuntos[posicion]);
				
				punto.punto2 = punto.latitud + "," + punto.longitud;
				punto.latitud = e.latLng.lat();
				punto.longitud = e.latLng.lng();
				punto.direccion = direccionPunto;
				//listaMarcadores[indice].setMap(null);
				//console.log(punto);
				$("#tituloModificar").text("Modificar Punto de control");
				$("#direccionModificar").text(direccionPunto);
				$("#modalModificar").modal('show');
			}

		},1000);
		
	});
}


///Metodo para activar el street view
function irAPunto(valor){
	var indice;
	indice = buscarPuntoLista(valor);
	panorama = map.getStreetView();
    panorama.setPosition(listaMarcadores[indice].position);
    if(panorama.getVisible() == true){
    	console.log("Estamos en street view");
    	panorama.setVisible(false);
    }else{
    	console.log("Algo salio mal");
    	panorama.setVisible(true);
    	
    }
}


function eliminar(valor){
	  var punto = { 
			  	codigo:valor,
				vigencia: false
		}
	  eliminarPunto(punto,function(respuesta){
		  //console.log(respuesta);
		  for(var i=0;i<listaPuntos.length;i++){
			  if(listaPuntos[i].codigo == valor){
				  listaMarcadores[i].setMap(null);
			  }
		  }
	  });
	  
}
function retornarAPosicion(idPunto){
	var indice = buscarPuntoLista(idPunto);
	var coordenadasPunto2;
	if(listaPuntos[indice].punto2 == null){
	   $("#tituloRespuesta").text('Retornar a posición anterior');
  	   $('#contenidoRespuesta').text('No existe ubicación anterior desde punto');
  	   $('#modalRespuesta').modal('show');
	}else{
		punto = listaPuntos[indice];
		//punto =$.extend(true,{},listaPuntos[indice]);
		coordenadasPunto2 = punto.punto2.split(",");
//		console.log(coordenadasPunto2[0].replace('(',''));
//		console.log(coordenadasPunto2[1].replace(')',''));
		//console.log("retornar posición");
		convertirPunto(Number(coordenadasPunto2[0].replace('(','')),Number(coordenadasPunto2[1].replace(')','')));
		setTimeout(function(){
			if(direccionPunto == undefined){
				$("#tituloRespuesta").text('Error al obtener dirección');
		    	$('#contenidoRespuesta').text('No se puedo obtener la dirección');
				$('#modalRespuesta').modal('show');
				
			}else{
//				posicion = buscarPuntoLista(idPunto);
//				punto =$.extend(true,{},listaPuntos[indice]);
				
				punto.punto2 = punto.latitud + "," + punto.longitud;
				punto.latitud = Number(coordenadasPunto2[0].replace('(',''));
				punto.longitud = Number(coordenadasPunto2[1].replace(')',''));
				punto.direccion = direccionPunto;
				//listaMarcadores[indice] = punto;
				//listaMarcadores[indice].setMap(null);
				//console.log(punto);
				$("#tituloModificar").text("Retornar posición de punto de control");
				$("#direccionModificar").text(direccionPunto);
				$("#modalModificar").modal('show');
			}

		},1000);
	}
}
///Geocodificar



///Mostar todos los puntos
function limpiarMapa(){
	for(var i=0;i<listaMarcadores.length;i++){
		listaMarcadores[i].setMap(null);
	}
}
function cargarPuntos(){
	//Listo todos los puntos registrados activos
    listarPuntos(function(respuesta){
    	listaPuntos = respuesta;
    	limpiarMapa();
    	listaMarcadores.splice(0,listaMarcadores.length);
    	//console.log(respuesta);
    	for(var i=0;i<listaPuntos.length;i++){
    		posicion = {lat: listaPuntos[i].latitud , lng:listaPuntos[i].longitud};
    		var marcadorBD= new google.maps.Marker({
    			map: map,
    			position: posicion,
    			title: "PC " +(i+1)+": " +listaPuntos[i].direccion,
    			icon:"../../img/puntoControl.png",
    			//icon:"https://png.icons8.com/ultraviolet/40/c0392b/marker.png",
    			draggable:true
    		});
    		agregarListenersPuntoControl(marcadorBD,listaPuntos[i].codigo);
    		listaMarcadores.push(marcadorBD);
    		
    	}	    });
}

function geocodeAddress(geocoder, resultsMap) {
    
	var address = document.getElementById('address').value;
	geocoder.geocode({'address': address,
		componentRestrictions:{
			country:'PE',
			locality:'Lambayeque',
		}}, function(results, status) {
			if (status === 'OK') {
				//console.log(results);
				//console.log(punto);
				if(marcadorReferencia != undefined){
					marcadorReferencia.setMap(null);
					marcadorReferencia = null;
				}
				resultsMap.setCenter(results[0].geometry.location);
				var direccion = "";
				for(var i=0;i<results[0].address_components.length;i++){
					direccion = direccion + results[0].address_components[i].long_name + " ";
				}
//				if(punto != undefined){
//					punto.setMap(null);
//				   
//				}
				marcadorReferencia= new google.maps.Marker({
					map: resultsMap,
					position: results[0].geometry.location,
					title: direccion,
					draggable:true
				});
				//console.log(listaMarcadores.lenght);
				agregarListeners(marcadorReferencia);
				//listaMarcadores.push(punto);
				
			} else {
				alert('No se pudo encontrar la dirección: ' + status);
			}
    });
  }



/////////// Agregados desde rutas
function agregarListeners(marcador){
	var infowindow = new google.maps.InfoWindow({
  	    content: "<div class='mb-2'><p>"+marcador.title + "</p></div><div class='text-center'>" +
  	    		"<button  title='Agregar calle' onClick='modalAgregarPunto();' style='border-radius:100%;'class='btn btn-sm btn-info mr-2'><i class='fas fa-plus-circle'></i></button>" +
  	    		"<button  title='Visualizar punto' onClick='irAPuntoReferencia();' style='border-radius:100%;'class='btn btn-sm btn-info mr-2'><i class='fas fa-street-view'></i></button>" +
  	    		"<button  title='Retirar punto de referencia' onClick='eliminarPuntoReferencia();' style='border-radius:100%;'class='btn btn-sm btn-info'><i class='far fa-trash-alt'></i></button></div>" 
  	  });
	marcador.addListener('click',function(){
		infowindow.open(marcador.get('map'),marcador);
	});
	
	
	marcador.addListener('dragend',function(e){
		//console.log(id);
		//direccionModificar = convertirPunto(e.latLng.lat(),e.latLng.lng());
		convertirPunto(e.latLng.lat(),e.latLng.lng());
		setTimeout(function(){
			if(direccionPunto == undefined){
				$("#tituloRespuesta").text('Error al obtener dirección');
		    	$('#contenidoRespuesta').text('No se puedo obtener la dirección');
				$('#modalRespuesta').modal('show');
			
			}else{
				marcador.title = direccionPunto;
				infowindow.open(null,null);
				infowindow = new google.maps.InfoWindow({
			  	    content: "<div class='mb-2'><p>"+marcador.title + "</p></div><div class='text-center'>" +
			  	    		"<button  title='Agregar calle' onClick='modalAgregarPunto();' style='border-radius:100%;'class='btn btn-sm btn-info mr-2'><i class='fas fa-plus-circle'></i></button>" +
			  	    		"<button  title='Visualizar punto' onClick='irAPuntoReferencia();' style='border-radius:100%;'class='btn btn-sm btn-info mr-2'><i class='fas fa-street-view'></i></button>" +
			  	    		"<button  title='Retirar punto de referencia' onClick='eliminarPuntoReferencia();' style='border-radius:100%;'class='btn btn-sm btn-info'><i class='far fa-trash-alt'></i></button></div>" 
			  	  });
				
				marcador.addListener('click',function(){
					infowindow.open(marcador.get('map'),marcador);
				});
			}

		},1000);
		
	});
}
	
	function modalAgregarPunto(){
		$('#direccionAgregar').text(marcadorReferencia.title);
		console.log(marcadorReferencia);
		punto = {
				latitud:marcadorReferencia.position.lat(),
				longitud:marcadorReferencia.position.lng(),
				direccion: marcadorReferencia.title,
				//direccion:direccion,
				vigencia: true
		}
		marcadorReferencia.setMap(null);
		$('#modalAgregar').modal({show:true,backdrop:'static'});
	}

	function irAPuntoReferencia(){
		panorama = map.getStreetView();
	    panorama.setPosition(marcadorReferencia.position);	
	    panorama.setVisible(true);
	}
	function eliminarPuntoReferencia(){
		marcadorReferencia.setMap(null);
	}
																	///*******Inicio****************
/// Calback al cargar el mapa
 function initMap() {
 	revisarSesion();
	 ocultarLoader();
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
        });
       
        cargarPuntos();
        
       /// Usamos geocodificacion 
        var geocoder = new google.maps.Geocoder();
        document.getElementById('submit').addEventListener('click', function() {
          geocodeAddress(geocoder, map);
        });
        
        /// al hacer click derecho se agregara un punto nuevo
       map.addListener('rightclick',function(e){
          	//e.preventDefault();
          	//console.log(e);
          	agregarPuntoMapa(e);
 
          });

       $('#btnAgregar').click(function(e){
    	   registrarPunto(punto,
    		   function(respuesta){
//    		   console.log(respuesta);
//    		   console.log(e);
//    		   console.log(respuesta.latitud);
    		   var myLatLng = {lat: respuesta.latitud, lng:respuesta.longitud} ;
    		  
    		   var nuevoPunto= new google.maps.Marker({
                   map: map,
                   position: myLatLng,
                   title: punto.direccion,
                   icon:"../../img/puntoControl.png",
                   draggable:true
                 });
    		   listaPuntos.push(respuesta);
        	   agregarListenersPuntoControl(nuevoPunto,respuesta.codigo);
        	   listaMarcadores.push(nuevoPunto);
        	   $('#modalAgregar').modal('hide');
        	   $("#tituloRespuesta").text('Agregar nuevo punto de control');
        	   $('#contenidoRespuesta').text('¡Punto de control agregado con éxito!');
        	   $('#modalRespuesta').modal('show');
    	   });
       });
       
       $('#btnModificar').click(function(e){
			  $("#modalModificar").modal('hide');
	    	   modificarPunto(punto,function(respuesta){
	    		   //console.log(respuesta);
	    	   	  cargarPuntos();
	    	   })
	       });
       
       $('#btnCancelarModificar').click(function(e){
    	   cargarPuntos();
    	   console.log(listaMarcadores);
    	   $("#modalModificar").modal('hide');
       });
       
//       $('btnRetornar').click(function(e){
//    	   $("#modalRetornar").modal('hide');
//    	   modificarPunto(punto,function(respuesta))
//       });
//        
 }
 	  
 		
      
