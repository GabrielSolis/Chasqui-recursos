

/// cargar puntos
function listarPuntos(estado,callback){

	$.ajax({
		beforeSend: mostrarLoader(),
		data:{estado:estado},
		url:'http://chasqui-gateway.herokuapp.com/micro-client/puntos/?estado='+estado,//'http://localhost:9000/puntos/?estado='+estado,
		//url:'http://localhost:9000/puntos/',
		processData:false,
		headers:{
			"Authorization": "Bearer " + token
		}
	}).done(function(puntos){
		//console.log('Puntos listado: ' + JSON.stringify(socios));
		callback(puntos);
		ocultarLoader();
	})
}


function mostrarPunto(punto,i){
	
	var cuerpo = $("#cuerpoTablaPuntos");
	var estado;
	var contenidoFila = "";

	if(punto.vigencia == true){
		estado = "Activo";
	}else{
		estado ="Retirado";
	}
	 contenidoFila = "<tr id='"+punto.codigo+"'>" +
	"<th>"+i+"</th>" +
	"<td>"+punto.direccion+"</td>" +
	//"<td>"+punto.latitud +","+punto.longitud+ "</td>"
	"<td>"+estado+"</td> </th>";
	cuerpo.append(contenidoFila);
	
}


$(document).ready(function(){
	revisarSesion();
	ocultarLoader();
	$('#cerrarSesion').click(function(e){
			e.preventDefault();
			cerrarSesion();
			alert("Hasta luego");
	});
	var listaPuntos = new Array();
	
	$("#btnListar").click(function(){
		 	listaPuntos.splice(0,listaPuntos.length);
			var estado = $("#filtrar").val();
			
			$('tbody tr').remove();
			listarPuntos(estado,function(puntos){
				
				if(puntos.length > 0){
					for(var i=0;i<puntos.length;i++){
						 listaPuntos.push(puntos[i]);
						 mostrarPunto(puntos[i],i+1); 
					 }
				}else{
					if(estado="A"){
						$("#tipoPunto").text("activos");
					}else if(estado="R"){
						$("#tipoPunto").text("retirados");
					}else{
						$("#tipoPunto").text("");
					}
					$("#modalListado").modal('show');
				}
			 
		 });
	 });
	
	
	 ///Imprimir lista de puntos
	 $("#btnImprimir").click(function(e){
		 e.preventDefault();
		 mostrarLoader();
		var doc = new jsPDF("p","mm","a4");


		var columnas = [{title:"#", dataKey:"numero"},
						{title:"Dirección de referencia",dataKey:"direccion"},
						//{title:"Coordenadas",dataKey:"coordenadas"},
						{title:"Estado",dataKey:"estado"}];
		var data =[];
		if(listaPuntos.length >0){
			for(var i=0;i<listaPuntos.length;i++){
				if(listaPuntos[i].vigencia==true){
					 estado="Activo";
				 }else{
					 estado ="Retirado";
				 }
				data.push({
					numero:i+1,
					direccion:listaPuntos[i].direccion,
					//coordenadas: listaPuntos[i].latitud + ","+listaPuntos[i].longitud,
					estado:estado
				});
			}
			doc.setFontSize(11);
			doc.text("Lista de puntos de control",85,40);
			doc.line(80, 41, 130, 41);
			doc.autoTable(columnas,data,{margin:{top:55}});	
			doc.output('dataurlnewwindow'); //
			//doc.output('save', 'filename.pdf');
			//doc.save('mipdf.pdf');
		}else{
			alert("No hay puntos de control listados");
		}
		ocultarLoader();
	 });
	
});