var listaTiempos = new Array();
var listaRutas = new Array();
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

function buscarRuta(codigo){
	for(var i=0;i<listaRutas.length;i++){
		if(codigo == listaRutas[i].codigo){
			return i;
		}
	}
}
$(document).ready(function(){
	revisarSesion();
	ocultarLoader();
	$('#cerrarSesion').click(function(e){
			e.preventDefault();
			cerrarSesion();
			alert("Hasta luego");
	});
	listarRutas(function(respuesta){
		var opcion;
		for(var i=0;i<respuesta.length;i++){
			opcion = "";
			opcion = "<option value="+respuesta[i].codigo+ ">Ruta " + respuesta[i].letra + "</option>";
			$('#filtrar').append(opcion);
		}
		listaRutas = respuesta;
	});
	
	$('#btnListar').click(function(){
	
		var codigoRuta = $('#filtrar').val();
		$('tbody tr').remove();
		console.log(codigoRuta);
		listarTiempos(codigoRuta,function(respuesta){
			if(respuesta.length>0){
				var tiempo;
				listaTiempos.splice(0,listaTiempos.length);
				for(var i=0;i<respuesta.length;i++){
					tiempo = "<tr><th>"+(i+1)+"</th><td>"+respuesta[i].ruta.letra+"</td><td>"+respuesta[i].punto.direccion+"</td><td>"+respuesta[i].tiempoEstablecido+"</td>";
					$('#cuerpoTablaTiempos').append(tiempo);
					
					listaTiempos.push(respuesta[i]);
				}
			}else{
				var indice = buscarRuta(codigoRuta);
				$('#letraRuta').text(listaRutas[indice].letra);
				$('#modalListado').modal({
					show:true,
					backdrop:'stratic'
				})
			}
			
		})
	});
	

	 $("#btnImprimir").click(function(e){
		 e.preventDefault();
	
		var doc = new jsPDF("l","mm","a4");
		var columnas = [{title:"Nº", dataKey:"numero"},
						{title:"Letra", dataKey:"letra"},
						{title:"Calles",dataKey:"calles"},
						{title:"Tiempo",dataKey:"tiempo"}];
		var estado;
		var data =[];
		if(listaTiempos.length >0){
			var codigoRuta = listaTiempos[0].ruta.codigo;
			var indice =  buscarRuta(codigoRuta);
			for(var i=0;i<listaTiempos.length;i++){
				
				var callesPunto="";
				callesPunto = listaTiempos[i].punto.direccion;
				data.push({
					numero:i+1,
					letra:listaRutas[indice].letra,
					calles:callesPunto,
					tiempo:listaTiempos[i].tiempoEstablecido
				});
			}
			doc.text("Lista de tiempos establecidos",120,20);


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
			alert("No hay socios listados");
		}
		
	 });
});