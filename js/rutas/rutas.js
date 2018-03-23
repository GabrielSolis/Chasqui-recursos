//-6.780274, -79.844786
//-6.777779, -79.844324
//-6.775680, -79.841856
var map;
var puntoReferencia;
var letraRuta = "";
var listaMarcadoresCalles= new Array(); 
var listaMarcadores = new Array();
var listaRutas = new Array();
var calleActual;
var polilinea;
var rutaActual;
var listaColores = ["#A93226","#2980B9","#1ABC9C","#884EA0","#2ECC71","#F39C12","#D35400","#2E4053","#4A235A","#ABEBC6"];
var direccionPunto;

//var directionsService;
//var directionsDisplay;

///Métodos para consumir REST

function agregarRuta(ruta,callback){
	$.ajax({
		beforeSend:mostrarLoader(),
		method:'POST',
		url:'https://chasqui-gateway.herokuapp.com/micro-client/rutas/',//'http://localhost:9000/rutas/',
		data:JSON.stringify(ruta),
		contentType: "application/json; charset=utf-8",
		headers: {
			//"Content-Type":"application/json",
			//"Access-Control-Allow-Origin":"*",
			"Authorization": "Bearer " + token
		},
		statusCode:{
			409:function(){
				ocultarLoader();
				$('#tituloRespuesta').text('Agregar ruta');
				$('#contenidoRespuesta').text('Ya existe esta ruta registrada');
				$('#modalRespuesta').modal('show');
			}
		},
		processData:false
	}).done(function(respuesta){
		callback(respuesta);
		ocultarLoader();
	})
}

function agregarCalleRuta(ruta,callback){
	$.ajax({
		beforeSend:mostrarLoader(),
		method:'POST',
		url:'https://chasqui-gateway.herokuapp.com/micro-client/rutas/'+Number(ruta.codigo),//'http://localhost:9000/rutas/'+Number(ruta.codigo),
		data:JSON.stringify(ruta),
		contentType: "application/json; charset=utf-8",
		headers: {
			//"Content-Type":"application/json",
			//"Access-Control-Allow-Origin":"*",
			"Authorization": "Bearer " + token
		},
		processData:false
	}).done(function(respuesta){
		callback(respuesta);
		ocultarLoader();
	})
}

function eliminarCalleRuta(calleRuta,callback){
	$.ajax({
		beforeSend:mostrarLoader(),
		method:'DELETE',
		url:'https://chasqui-gateway.herokuapp.com/micro-client/rutas/'+calleRuta.codigo,//'http://localhost:9000/rutas/'+calleRuta.codigo,
		data:JSON.stringify(calleRuta),
		contentType: "application/json; charset=utf-8",
		headers: {
			//"Content-Type":"application/json",
			//"Access-Control-Allow-Origin":"*",
			"Authorization": "Bearer " + token
		},
		processData:false
	}).done(function(respuesta){
		callback(respuesta);
		ocultarLoader();
	})
}

function modificarCalle(calleRuta,callback){
	$.ajax({
		beforeSend:mostrarLoader(),
		method:'PUT',
		url:'https://chasqui-gateway.herokuapp.com/micro-client/rutas/'+calleRuta.codigo,//'http://localhost:9000/rutas/'+calleRuta.codigo,
		data:JSON.stringify(calleRuta),
		contentType: "application/json; charset=utf-8",
		headers:{
			//"Content-Type":"application/json",
			//"Access-Control-Allow-Origin":"*",
			"Authorization": "Bearer " + token
		},
		processData:false
	}).done(function(respuesta){
		callback(respuesta);
		ocultarLoader();
	})
}

function listarRutas(callback){
	$.ajax({
		method:'GET',
		url:'https://chasqui-gateway.herokuapp.com/micro-client/rutas/',//'http://localhost:9000/rutas/',
		processData:false,
		headers:{
			"Authorization": "Bearer " + token
		}
	}).done(function(rutasRespuesta){
		console.log(rutasRespuesta);
		callback(rutasRespuesta);
	})
}

///Al cargar el mapa
 function initMap() {
 	revisarSesion();
 	 mostrarLoader();
	 ocultarLoader();
	 $('#cerrarSesion').click(function(e){
			e.preventDefault();
			cerrarSesion();
			alert("Hasta luego");
	});
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
      cargarRutas();
      map.addListener('rightclick',function(e){
        	//e.preventDefault();
        	//console.log(e);
        	agregarPuntoMapa(e);
        });
      //Geocodificación
      var geocoder = new google.maps.Geocoder();
      document.getElementById('submit').addEventListener('click', function() {
        geocodeAddress(geocoder, map);
      });
     
      
          
      ///Opciones para el menú de rutas y para la opcion satelital-mapa
        $("#mostrar-nav-rutas").click(function(){
        	$('.nav-rutas').toggleClass('mostrar');
        });
        
        //Para agregar ruta
        $("#btnAgregarRuta").click(function(){
        	
        	$('#modalAgregarRuta').modal('show');
        });
        
        $("#btnModalAgregarRuta").click(function(){
        	$("#modalAgregarRuta").modal('hide');
        	var letra = $("#txtLetra").val();
        	var ruta = {letra:letra,estado:'A',tiempo:0,vigencia:true};
        	agregarRuta(ruta,function(respuesta){
        		$('#tituloRespuesta').text('Agregar ruta');
        		$('#contenidoRespuesta').text('Ruta agregada exitosamente');
        		$('#modalRespuesta').modal('show');
        		cargarRutas();
        	});
        	
        });
        
        ////////////////
        $('#btnAgregarCalle').click(function(){
			  $('#modalAgregarCalle').modal('hide');
			  var indiceRuta = buscarRuta(rutaActual.codigo);
			  var direccion = $('#txtCalle').val();
			  var numeroOrden = $('#txtOrden').val();
			  var arrayRutaNueva = new Array();
			  var calleRegistrar ={ 
					    codigo:0,
					    direccion: direccion, 
						latitud: listaMarcadores[listaMarcadores.length-1].position.lat(),
						longitud:listaMarcadores[listaMarcadores.length-1].position.lng(),
						numeroOrden:numeroOrden,
						vigencia:true};
			    rutaActual.calles.push(calleRegistrar);
				listaMarcadores[listaMarcadores.length-1].setMap(null);
				agregarCalleRuta(rutaActual,function(respuesta){
					$('#tituloRespuesta').text('Agregar calle a ruta');
					$('#contenidoRespuesta').text('Calle agregada exitosamente');
					$('#modalRespuesta').modal('show');
					calleRegistrar.codigo = respuesta;
					agregarMarcadorCallesMapa(calleRegistrar);
					agregarPolilinea(buscarRuta(rutaActual.codigo));
				})
		
	      });
        
        $('#btnModificarCalle').click(function(){
        	var indice = buscarCalle(calleActual.codigo);	
        	var indiceRuta = buscarRuta(rutaActual.codigo);
        	calleActual.direccion = $('#txtModificarCalle').val();
        	calleActual.numeroOrden =Number($('#txtModificarOrden').val());
        	//console.log(calleActual);
        	//console.log(listaMarcadoresCalles[indice]);
        	agregarMarcadorCallesMapa(calleActual);
        	listaMarcadoresCalles[indice].setMap(null);
        	listaMarcadoresCalles[indice] = listaMarcadoresCalles[listaMarcadoresCalles.length-1];
        	listaMarcadoresCalles.splice(listaMarcadoresCalles.length-1,1);
        	rutaActual.calles[indice] = calleActual;
        	//listaRutas[indiceRuta].calles[indice] = calleActual;
        	ordenarCalles();
        	agregarPolilinea(indiceRuta);
        	modificarCalle(calleActual,function(respuesta){
        		$('#modalModificarCalle').modal('hide');
        		$('#tituloRespuesta').text('Modificar calle de ruta');
				$('#contenidoRespuesta').text(respuesta);
				$('#modalRespuesta').modal({
					show:true,
					backdrop:'static'
				});
				
        	})
        	
        });
        
        $('#btnEliminarCalle').click(function(){
        	var indice = buscarCalle(calleActual.codigo);
        	var indiceRuta = buscarRuta(rutaActual.codigo);
        	listaMarcadoresCalles[indice].setMap(null);
        	eliminarCalleRuta(calleActual,function(){
        		$('#modalEliminar').modal('hide');
        		$('#tituloRespuesta').text('Eliminar calle de ruta');
				$('#contenidoRespuesta').text('Calle eliminada  exitosamente');
				$('#modalRespuesta').modal({
					show:true,
					backdrop:'static'
				});
				listaMarcadoresCalles.splice(indice,1);
				rutaActual.calles.splice(indice,1);
				agregarPolilinea(indiceRuta);
        	})
        });
 }
 
 ///Funciones 
 function geocodeAddress(geocoder, resultsMap) {
	    
		var address = document.getElementById('address').value;
		geocoder.geocode({'address': address,
			componentRestrictions:{
				country:'PE',
				locality:'Lambayeque',
			}}, function(results, status) {
				if (status === 'OK') {
					//console.log(results);
					//console.log(puntoReferencia);
					if(puntoReferencia != undefined){
						puntoReferencia.setMap(null);
						puntoReferencia = null;
					}
					resultsMap.setCenter(results[0].geometry.location);
					var direccion = "";
					for(var i=0;i<results[0].address_components.length;i++){
						direccion = direccion + results[0].address_components[i].long_name + " ";
					}
					if(puntoReferencia != undefined){
						puntoReferencia.setMap(null);
					   
					}
					puntoReferencia= new google.maps.Marker({
						map: resultsMap,
						position: results[0].geometry.location,
						title: direccion,
						draggable:true
					});
					//console.log(listaMarcadores.lenght);
					agregarListeners(puntoReferencia,listaMarcadores.length)
					listaMarcadores.push(puntoReferencia);
					
				} else {
					alert('No se pudo encontrar la dirección: ' + status);
				}
	    });
	  }
 
 ///
 
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
					if(puntoReferencia != undefined){
						puntoReferencia.setMap(null);
					}
					puntoReferencia= new google.maps.Marker({
							map: map,
							position: {lat:e.latLng.lat(),lng:e.latLng.lng()},
							title: direccionPunto,
							draggable:true
						});
						agregarListeners(puntoReferencia,listaMarcadores.length);
					    listaMarcadores.push(puntoReferencia);
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
 
 ///
 function agregarListeners(marcador,indice){
		var infowindow = new google.maps.InfoWindow({
	  	    content: "<div class='mb-2'><p>"+marcador.title + "</p></div><div class='text-center'>" +
	  	    		"<button  title='Agregar calle' onClick='modalAgregarCalle("+indice+");' style='border-radius:100%;'class='btn btn-sm btn-info mr-2'><i class='fas fa-plus-circle'></i></button>" +
	  	    		"<button  title='Visualizar punto' onClick='irAPunto("+indice+");' style='border-radius:100%;'class='btn btn-sm btn-info mr-2'><i class='fas fa-street-view'></i></button>" +
	  	    		"<button  title='Retirar punto de referencia' onClick='eliminarPuntoReferencia("+indice+");' style='border-radius:100%;'class='btn btn-sm btn-info'><i class='far fa-trash-alt'></i></button></div>" 
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
				  	    		"<button  title='Agregar calle' onClick='modalAgregarCalle("+indice+");' style='border-radius:100%;'class='btn btn-sm btn-info mr-2'><i class='fas fa-plus-circle'></i></button>" +
				  	    		"<button  title='Visualizar punto' onClick='irAPunto("+indice+");' style='border-radius:100%;'class='btn btn-sm btn-info mr-2'><i class='fas fa-street-view'></i></button>" +
				  	    		"<button  title='Retirar punto de referencia' onClick='eliminarPuntoReferencia("+indice+");' style='border-radius:100%;'class='btn btn-sm btn-info'><i class='far fa-trash-alt'></i></button></div>" 
				  	  });
					
					marcador.addListener('click',function(){
						infowindow.open(marcador.get('map'),marcador);
					});
				}

			},1000);
			
		});
		
	}

 function agregarListenersCalle(marcador,codigo,numeroOrden){
	 console.log(marcador);
	 //var infowindow
	  var infowindow = new google.maps.InfoWindow({
	  	    content: "<div class='mb-2'><p> Dirección: "+marcador.title + "</p><p>Orden: " +numeroOrden+"<p/></div><div class='text-center'>" +
	  	    		"<button  title='Modificar calle' onClick='modalModificarCalle("+codigo+");' style='border-radius:100%;'class='btn btn-sm btn-info mr-2'><i class='fas fa-edit'></i></button>" +
	  	    		"<button  title='Retirar calle' onClick='modalEliminarCalle("+codigo+");' style='border-radius:100%;'class='btn btn-sm btn-info'><i class='far fa-trash-alt'></i></button></div>" 
	  	  });
		marcador.addListener('click',function(){
			infowindow.open(marcador.get('map'),marcador);
		});
			
 }
 
function modalAgregarCalle(indice){
	var i=0;
	//console.log(rutaActual);
	if(rutaActual != undefined && rutaActual != ""){
		var punto = listaMarcadores[indice];
		$('#preguntaAgregarCalle').text('¿Desea agregar una nueva calle a la ruta?');
		$('#nombreRuta').text("Ruta " + rutaActual.letra);
		convertirPunto(listaMarcadores[indice].position.lat(),listaMarcadores[indice].position.lng());
		
		setTimeout(function(){
			if(direccionPunto == undefined){
				$("#tituloRespuesta").text('Error al obtener dirección');
		    	$('#contenidoRespuesta').text('No se puedo obtener la dirección');
				$('#modalRespuesta').modal('show');
			}else{
				//$('#direccionReferencia').text(listaMarcadores[indice].title);
				$('#direccionReferencia').text(direccionPunto);
				$('#txtCalle').val("");
				if(rutaActual.calles[rutaActual.calles.length-1] != undefined){
					$('#txtOrden').val(Number(rutaActual.calles[rutaActual.calles.length-1].numeroOrden) + 1);
				}else{
					$('#txtOrden').val(1);
				}
				
				
				$('#modalAgregarCalle').modal({
					show:true,
					backdrop:'static'
				});
				  
			}
		},1000);
	}else{
		$('#tituloRespuesta').text('Agregar calle a ruta');
		$('#contenidoRespuesta').text('Debe seleccionar una ruta para poder agregar calles');
		$('#modalRespuesta').modal('show');
	}
	
}

function irAPunto(indice){
	
	var punto = listaMarcadores[indice];
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
		console.log(listaRutas);
		console.log(rutasRespuesta);
	});
}


//Al seleccionar una ruta
function rutaSeleccionada(codigoRuta){
	
	var indice = buscarRuta(codigoRuta);
	$('li.rutaOp').removeClass('seleccionado');
	$('li#'+indice).addClass('seleccionado');
	//$(indice).addClass('seleccionado');
	rutaActual = listaRutas[indice];
	limpiarMapa();
	listaMarcadoresCalles.splice(0,listaMarcadoresCalles.length);
	for(var i=0;i<rutaActual.calles.length;i++){
		agregarMarcadorCallesMapa(rutaActual.calles[i]);
		console.log(rutaActual.calles[i]);
	}
	agregarPolilinea(indice);
	if(rutaActual.calles[0] != undefined){
		map.setCenter({lat:rutaActual.calles[0].latitud,lng:rutaActual.calles[0].longitud});
	}
	
	//console.log(rutaActual.calles[0]);
	

}
function limpiarMapa(){
	if(listaMarcadoresCalles.length > 0){
		for(var i=0;i<listaMarcadoresCalles.length;i++){
			listaMarcadoresCalles[i].setMap(null);
		}
	}
	
}
function eliminarPuntoReferencia(indice){
	listaMarcadores[indice].setMap(null);
}

function agregarMarcadorCallesMapa(calle){
	marcadorCalle = new google.maps.Marker({
		map: map,
		position: {lat:calle.latitud , lng:calle.longitud},
		title: calle.direccion ,
		dragged:true
	});
	agregarListenersCalle(marcadorCalle,calle.codigo,calle.numeroOrden);
	listaMarcadoresCalles.push(marcadorCalle);
}

function modalModificarCalle(codigo){
	var indice;
	indice = buscarCalle(codigo);
	console.log();
	calleActual = rutaActual.calles[indice];
	$('#nombreRutaModificar').text(rutaActual.letra);
	$('#preguntaModificarCalle').text("¿Desea modificar la calle?");
	console.log(indice);
	console.log(rutaActual);
	console.log(calleActual);
	$('#txtModificarCalle').val(calleActual.direccion);
	$('#txtModificarOrden').val(calleActual.numeroOrden);
	$('#modalModificarCalle').modal({
		show:true,
		backdrop:'static'
	});
}

function modalEliminarCalle(codigo){
	var indice;
	
	indice = buscarCalle(codigo);
	calleActual = rutaActual.calles[indice];
	$('#calleEliminar').text(listaMarcadoresCalles[indice].title);
	$('#modalEliminar').modal({
		show:true,
		backdrop:'static'
	})
	
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
	//
//        var waypoints = new Array();
//        
//        for(var i=1;i<listaMarcadoresCalles.length-1;i++){
//        	waypoints.push({
//        		location:listaMarcadoresCalles[i].position,
//        		stopover: true
//        	});
//        }
//        if(directionsDisplay != undefined){
//        	directionsDisplay.setMap(null);
//        }
//        directionsService = new google.maps.DirectionsService;
//        directionsDisplay = new google.maps.DirectionsRenderer({
//      	draggable:true,
//      	map:map
//        });
//        directionsService.route({
//            origin: listaMarcadoresCalles[0].position,
//            waypoints:waypoints,
//            destination: listaMarcadoresCalles[listaMarcadoresCalles.length-1].position,
//            travelMode: 'DRIVING'
//          }, function(response, status) {
//        	  console.log(response);
//            if (status === 'OK') {
//              directionsDisplay.setDirections(response);
//            } else {
//              window.alert('Directions request failed due to ' + status);
//            }
//          });     
//        
}
function buscarCalle(codigoCalle){
	for(var i=0;i<rutaActual.calles.length;i++){
		if(codigoCalle == rutaActual.calles[i].codigo){
			console.log("Hey te encontre: " + i);
			return i;
		}
	}
}
function buscarRuta(codigoRuta){
	for(var i = 0;i<listaRutas.length;i++){
		if(codigoRuta == listaRutas[i].codigo){
			return i;
		}
	}
}

function ordenarCalles(){
	var orden;
	var marcadorCalle;
	var calle;
	var indice = buscarRuta(rutaActual.codigo);
	for(var i=0;i<rutaActual.calles.length -1;i++){
		
		for(var j=0;j<rutaActual.calles.length-1;j++){
		
			if(rutaActual.calles[j].numeroOrden > rutaActual.calles[j+1].numeroOrden){
				
				orden = rutaActual.calles[j+1];
				rutaActual.calles[j+1] = rutaActual.calles[j];
				rutaActual.calles[j] = orden;

				marcadorCalle = listaMarcadoresCalles[j+1];
				listaMarcadoresCalles[j+1] = listaMarcadoresCalles[j];
				listaMarcadoresCalles[j]=marcadorCalle;
//				
			}
		}
	}
}
