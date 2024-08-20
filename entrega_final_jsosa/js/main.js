
// array de multas
const multas = [];
const misMultas = [];
const multasSelec = [];
let cont=0;	
let cantidadMultasBD = 0;
let patente ="";
// hacer array de objetos para las multas seleccionadas


// recupero BD multas
traer_multas_db();

let totalAPagar = 0;	
const hoy = new Date();

let botonBuscar = document.getElementById("btnBuscar");
botonBuscar.onclick = () => {encontrar_patente(document.getElementById('inputPatente').value)};

let botonReset = document.getElementById("btnRecargar");
botonReset.onclick = () => location.reload();

function encontrar_patente(unaPatente)
{
	let infractor = false;
	let encabezadoPatente = false;
	patente= unaPatente.toUpperCase()

	// recorro multas buscando patente ingresada

	for (const multa of multas)
	{
		if (multa.patente == patente)
		{
			// si no tiene encabezado la patente
			if (!encabezadoPatente)
			{
				encabezadoPatente = true;
				cargar_encabezado_multas();
			}
		
			infractor = true;
			// muestro la multa en web

			cargar_web_multas(multa);
			misMultas.push(multa);
		} 
	} 
	
	// si es una patente con multas
	if (infractor)
	{
		// recorrer array con multas seleccionadas
		mostrar_web_tot_pagar();
	}	
	else
	{
		mostrar_web_no_debe();
	}	
} 		
	
function dar_fecha(fecha) 
{
	// dar fecha de hoy

	let dd = fecha.getDate();
	let mm = fecha.getMonth() + 1;
	let aa = fecha.getFullYear().toString().slice(-2);
	return dd + "/" + mm + "/"+ aa;
}


function traer_multas_db()
{
	// recupero multas de BD y las cargo en array multas

	fetch("./db/las_multas.json")
			.then(respuestas => respuestas.json())
			.then(lasMultas => 
			{
				try 
				{
					if ( lasMultas.length == 0 )
					{
							throw new Error ("No es posible recuperar registros de la BD Multas");
					}
					else
					{
						lasMultas.forEach (unaMulta => 
							{
								multas.push(unaMulta);
					
							} )
					}
				} catch (error) 
				{
					// quitar controles de búsqueda
					// mostrar salida de no funcionamiento
					alert(error);
				} 
			});
}	

function cambia_chkbox(cBoxId,unMonto)
{
	// cambio el color del div de la multa, agrego a array de seleccionados para pago
	let caja = document.getElementById(cBoxId);

	let multID = cBoxId.split("_");
	let laMultID = multID[1];
	if (caja.checked == true)
	{
		caja.parentNode.setAttribute("class", "seleccionado"); 
		totalAPagar = totalAPagar + unMonto;
		// cargo en vector de id de multas seleccionadas
		for (const uMulta of misMultas)
		{
			if (uMulta.id == laMultID)
			{
				multasSelec.push(uMulta);
			}	
		}	
	} 
	else 
	{
		caja.parentNode.setAttribute("class", "divMultas"); 
		totalAPagar = totalAPagar - unMonto;
		// quito en vector de id de multas seleccionadas

		for (const uMulta of misMultas)
		{
				if (uMulta.id == laMultID)
				{
					eliminarDeArray(uMulta);
				}	
		}	
	} 
	actualizarValorPago(totalAPagar);
}		


function actualizarValorPago(unMontoAPagar)
{
	// actualizo el valor total a pagar

	let h2Pago = document.querySelector("h2.total");
	h2Pago.innerText='Valor total multas a abonar: '+ unMontoAPagar;
}


function mostrarSeleccion()
{
	// muestro las multas seleccionadas a abonar

	let elEncabezado = document.getElementsByClassName("divEncabezado");
	elEncabezado[0].innerHTML = `<h2> Al día de la fecha ${dar_fecha(hoy)}, la patente: ${patente} seleccionó las siguientes multas a abonar:</h2>`;
	
	borrar_div_multas();
	borrar_div_tot_pagar();

	for(const unaMulta of multasSelec)
	{
		cargar_web_mis_multas(unaMulta);
	}
	
	let totalMultasDiv = document.createElement("div");
		totalMultasDiv.className = "totAPagar";
		totalMultasDiv.setAttribute("id","totAPagarFin");
		totalMultasDiv.innerHTML = `<h2 class="total" id="divTotal"> Valor total multas a abonar: <b>$ ${totalAPagar}</b></h2>
									<label class="lblPago" >Confirma abonar el monto seleccionado? </label>`;
		document.body.appendChild(totalMultasDiv);

	let contenedorBotones = document.createElement("div");
		contenedorBotones.setAttribute("id","btnFinales");
		contenedorBotones.innerHTML = `<button id="btnAceptarPago" class="btn pagar" onclick="compraRealizada()">Aceptar</button>
								   <button id="btnCancelararPago" class="btn pagar" onclick="cancelarBtn()">Cancelar</button>`;
		document.body.appendChild(contenedorBotones);

	if (multasSelec.length > 0)
	{
		
    	let div_encabezado_multa = document.createElement("div");
		div_encabezado_multa.className = "divEncabezadoMulta";
		div_encabezado_multa.innerHTML = '<h2> Primer ingreso</h2>';
    }
	else
	{
		alert("No tiene cargado multas a abonar");
	}
}


function eliminarDeArray(objMulta)
{
	// elimino del array el id indicado

	let indice = multasSelec.indexOf(objMulta);
	multasSelec.splice(indice, 1); 

}

function cancelarBtn()
{
	location.reload();
}

function compraRealizada()
{
	alert ("Gracias por su pago");
	location.reload();
}

function cargar_web_multas(laMulta)
{
	// muestro la multa en web

	let contenedorMulta = document.createElement("div");
	let contenedorGeneral = document.getElementById("contenedorGral");

	contenedorMulta.className = "divMultas";
	let nombre_chk  = "'"+"chk_"+laMulta.id+"'";
	contenedorMulta.innerHTML = `<h3> Multa patente: ${laMulta.patente}</h3>
								<label for=${nombre_chk}> Multa: ${laMulta.id}</label>
								<input type = "checkbox" id= ${nombre_chk} class="chk" onclick="cambia_chkbox(${nombre_chk}, ${laMulta.monto})">
								<p> Lugar: ${laMulta.lugar}</p>
								<p> Fecha: ${laMulta.fecha}</p>
								<p> Monto <b>$ ${laMulta.monto} </b></p>`;
	contenedorGeneral.appendChild(contenedorMulta);
}

function cargar_encabezado_multas()
{
	// cargo info de la fecha y la patente

	let div_encabezado_multa = document.createElement("div");
		div_encabezado_multa.className = "divEncabezado";
		div_encabezado_multa.innerHTML = `<h2> Al día de la fecha ${dar_fecha(hoy)}, la patente: ${patente} registra las siguientes multas:</h2>`;
		document.body.appendChild(div_encabezado_multa);
		cargar_contenedor_gral()
}

function mostrar_web_tot_pagar()
{
	// muestro el valor a abonar

	let totalMultasDiv = document.createElement("div");
		totalMultasDiv.className = "totAPagar";
		totalMultasDiv.setAttribute("id","totAPagar");
		totalMultasDiv.innerHTML = `<h2 class="total" id="divTotal"> Valor total multas a abonar: <b>$ ${totalAPagar}</b></h2>
									<label class="lblPago" >Abonar monto seleccionado: </label>
									<button id="btnPagar" class="btn pagar" onclick=mostrarSeleccion()>Aceptar</button>`;
		document.body.appendChild(totalMultasDiv);
}

function mostrar_web_no_debe()
{
	// informo que no tiene multas impagas

	let msgNoMultas = document.createElement("div");
		msgNoMultas.className = "divNoMultas";
		msgNoMultas.innerHTML = `<h2> Al día de la fecha ${dar_fecha(hoy)}, la patente: ${patente}</h2>
								<p><b>No registras multas.</b></p>`;
		document.body.appendChild(msgNoMultas);
}

function borrar_div_multas()
{
	// borro el div contenedor de todas las multas de una patente

	let elDivGeneral = document.getElementById("contenedorGral");
	elDivGeneral.remove();
}

function cargar_web_mis_multas(esaMulta)
{
	// muestro mis multas seleccionadas

	cargar_contenedor_gral();
	let contenedorMulta = document.createElement("div");
	let contenedorGeneral = document.getElementById("contenedorGral");

	contenedorMulta.className = "divMultas";
	contenedorMulta.innerHTML = `<h3> Multa patente: ${esaMulta.patente}</h3>
								<p> Multa: ${esaMulta.id}</p>
								<p> Lugar: ${esaMulta.lugar}</p>
								<p> Fecha: ${esaMulta.fecha}</p>
								<p> Monto <b>$ ${esaMulta.monto} </b></p>`;
	contenedorGeneral.appendChild(contenedorMulta);
}

function cargar_contenedor_gral()
{
	// cargo el contenedor general

	let contenedorMulta = document.createElement("div");
		contenedorMulta.className = "contenedorMultas";
		contenedorMulta.setAttribute("id","contenedorGral");
		document.body.appendChild(contenedorMulta);
}
function borrar_div_tot_pagar()
{
	let divTotPag = document.getElementById("totAPagar");
	divTotPag.remove();
}