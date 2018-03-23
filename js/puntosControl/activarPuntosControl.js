var listaPuntos= new Array(); //Este marcador solo obtendá los datos de los puntos
var listaMarcadores = new Array();
function listarPuntos(callback){

	$.ajax({
		beforeSend: mostrarLoader(),
		//url:'http://localhost:9000/puntos/?estado=R',
		url:'https://chasqui-gateway.herokuapp.com/micro-client/puntos/?estado=R',
		processData:false,
		headers:{
			"Authorization": "Bearer " + token
		}
	}).done(function(socios){
		//console.log('Puntos listado: ' + JSON.stringify(socios));
		callback(socios);
		ocultarLoader();
	})
}


function agregarInfowindow(marcador,codigoPunto){
	var infowindow = new google.maps.InfoWindow({
  	    content: "<div class='mb-2'><p>"+marcador.title + "</p></div><div class='text-center'>" +
  	    		"<button  title='Activar punto' onClick='darAlta("+codigoPunto+");' style='border-radius:100%;'class='btn btn-sm btn-info'><i class='fas fa-arrow-up'></i></button></div>" 
  	  });
	marcador.addListener('click',function(){
		infowindow.open(marcador.get('map'),marcador);
	})

}

function modificarEstadoPunto(punto,callback){
	$.ajax({
		beforeSend:mostrarLoader(),
		method:'PUT',
		url:'https://chasqui-gateway.herokuapp.com/micro-client/puntos/',//'http://localhost:9000/puntos/',
		data: JSON.stringify(punto),
		contentType: "application/json; charset=utf-8",
		processData:false,
		headers:{
			//"Content-Type":"application/json",
			//"Access-Control-Allow-Origin":"*"
			"Authorization": "Bearer " + token
		}
	}).done(function(respuesta){
		ocultarLoader();
		callback(respuesta);
		
	})
}


function darAlta(valor){
	var punto;
	var indice;
	  for(var i=0;i<listaPuntos.length;i++){
		  if(listaPuntos[i].codigo == valor){
			  punto = listaPuntos[i];
			  punto.vigencia =true;
			  indice = i;
		  }
	  }
	  modificarEstadoPunto(punto,function(respuesta){
		  listaMarcadores[indice].setMap(null);
	  });
	  
}

/// Calback al cargar el mapa
function initMap() {
	revisarSesion();
	ocultarLoader();
	$('#cerrarSesion').click(function(e){
			e.preventDefault();
			cerrarSesion();
			alert("Hasta luego");
	});
	var map;
	var punto;
	var direccionPunto;
     map = new google.maps.Map(document.getElementById('map'), {
         zoom: 15,
         minZoom:14,
         center: {lat: -6.801895, lng: -79.846964},
         streetViewControl:true,
       });
     
     //Listo todos los puntos registrados activos
       listarPuntos(function(respuesta){
       
    	   if(respuesta.length >0){
    		   listaPuntos = respuesta;
    		   for(var i=0;i<listaPuntos.length;i++){
    			   posicion = {lat: listaPuntos[i].latitud , lng:listaPuntos[i].longitud};
    			   var marcadorBD= new google.maps.Marker({
    				   map: map,
    				   position: posicion,
    				   title: "PC " +(i+1)+": " +listaPuntos[i].direccion,
    				   icon:"../../img/puntoControlInactivo.png",
    				   draggable:true
    			   });
    			   agregarInfowindow(marcadorBD,listaPuntos[i].codigo,listaPuntos);
    			   listaMarcadores.push(marcadorBD);
    		   }	
    	   }else{
    		   $("#tituloRespuesta").text('Listado de puntos de control retirados');
    		   $('#contenidoRespuesta').text('No existe ningun punto de control retirado');
    		   $('#modalRespuesta').modal('show');
    	   }

       });   
}