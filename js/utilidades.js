/*function soloLetras(e) {
    key = e.keyCode || e.which;
    tecla = String.fromCharCode(key).toLowerCase();
    letras = " áéíóúabcdefghijklmnñopqrstuvwxyz";
    especiales = [8, 37, 39, 46];

    tecla_especial = false
    for(var i in especiales) {
        if(key == especiales[i]) {
            tecla_especial = true;
            break;
        }
    }

    if(letras.indexOf(tecla) == -1 && !tecla_especial)
        return false;
}*/
function cargarDiaActual(){
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!

	var yyyy = today.getFullYear();
	if(dd<10){
	    dd='0'+dd;
	} 
	if(mm<10){
	    mm='0'+mm;
	} 
	var today = yyyy+'-'+mm+'-'+dd;

	return today;
}


function ocultarLoader(){
	$('#contenedor_carga').hide();
}

function mostrarLoader(){
	$('#contenedor_carga').show();
	token = sessionStorage.getItem("k");
}

function validaSoloNumero(e){
	var patron = /^[0-9\b\t]*$/;
	 key = e.keyCode || e.which;
	  tecla = String.fromCharCode(key).toLowerCase();
	  // En caso de querer validar cadenas con espacios usar: /^[a-zA-Z\s]*$/
	  if(!tecla.search(patron) || (key>=37 && key<=40))
	    return true;
	  else
	    return false;
}
function validaSoloTexto(e){
	//\u00f1\u00d1 son ñ y Ñ
	  var patron = /^[\u00f1\u00d1áéíóúa-zA-Z\b\s]*$/;
	  key = e.keyCode || e.which;
	  tecla = String.fromCharCode(key).toLowerCase();
	  // En caso de querer validar cadenas con espacios usar: /^[a-zA-Z\s]*$/
	  if(!tecla.search(patron) || (key>=37 && key<=40))
	    return true;
	  else
	    return false;
	}
function validarTamanio(elemento,tamanio){
		
		if(elemento.val().length < tamanio){
			console.log(elemento);
			elemento.addClass('inputError');
			return false;
		}else{
			elemento.removeClass('inputError');
			return true;
		}
}

function validarEdad(elemento){
	var edad = elemento.split("-");
	var fecha = new Date();
	var ano = fecha.getFullYear();
	if(ano - Number(edad[0]) < 18 || ano - Number(edad[0]) > 100){
		return false;
	}else{
		return true;
	}
}

$('#cerrarSesion').click(function(e){
		e.preventDefault();
		cerrarSesion();
		alert("Hasta luego");
});

function cerrarSesion(){
	sessionStorage.removeItem('id');
	sessionStorage.removeItem('k');
	//window.location.href = "paginas/personal/listadoPersonal.html";
	window.location.href = "../../index.html";
}

function revisarSesion(){
	if(sessionStorage.getItem("k") == "" || sessionStorage.getItem("k") == undefined){
		window.location.href = "../../index.html";
	}
}



