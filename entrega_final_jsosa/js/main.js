
// array de multas
const multas = [];
const multasSelec = [];
let cont=0;	
let cantidadMultasBD = 0;
let patente ="";
// hacer array de objetos para las multas seleccionadas


// recupero BD multas
cargar_Multas();

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
	let dd = fecha.getDate();
	let mm = fecha.getMonth() + 1;
	let aa = fecha.getFullYear().toString().slice(-2);
	return dd + "/" + mm + "/"+ aa;
}


function cargar_Multas ()
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

function seleccionado(cBoxId,unMonto)
{
	
	let caja = document.getElementById(cBoxId);

	let multID = cBoxId.split("_");
	if (caja.checked == true)
	{
		caja.parentNode.setAttribute("class", "seleccionado"); 
		totalAPagar = totalAPagar + unMonto;
		// cargo en vector de id de multas seleccionadas
		multasSelec.push(multID[1]);
	
	} 
	else 
	{
		caja.parentNode.setAttribute("class", "divMultas"); 
		totalAPagar = totalAPagar - unMonto;
		// quito en vector de id de multas seleccionadas
		eliminarDeArray(multID[1]);
	} 
	actualizarValorPago(totalAPagar);
}		

// actualizo el valor total a pagar
function actualizarValorPago(unMontoAPagar)
{
	// modifico el valor total a pagar
	let h2Pago = document.querySelector("h2.total");
	h2Pago.innerText='Valor total multas a abonar: '+ unMontoAPagar;
}

// muestro en otra página las multas seleccionadas a abonar
function mostrarSeleccion()
{
	// recorre la base de multas y traigo los ID seleccionados

	let elEncabezado = document.getElementsByClassName("divEncabezado");
	elEncabezado[0].innerHTML = `<h2> Al día de la fecha ${dar_fecha(hoy)}, la patente: ${patente} seleccionó las siguientes multas a abonar:</h2>`;
	
	let divAOcultar = document.getElementsByClassName("divMultas");

	for(let i=0; i < divAOcultar.length; i++)
	{
		divAOcultar[i].remove();
		console.log(divAOcultar[i]);
	}
	
	let divElegido = document.getElementsByClassName("seleccionado");

	// saco los chks de las multas seleccionadas
	for(let i=0; i < divElegido.length; i++)
	{
		//obtengo los nodos div clase seleccionados
		let unDiv = divElegido[i];
		//obtengo el chk hijo
		let chks = unDiv.getElementsByClassName("chk");
		chks[0].remove();
	}
	
	let unBtn = document.getElementById("btnPagar");
	unBtn.remove();

	let elLabel = document.getElementsByClassName("lblPago");
	elLabel[0].innerText = "Confirma realizar el pago seleccionado?";
	let contenedorBotones = document.createElement("div");

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

// elimino del array el id indicado
function eliminarDeArray(unValor)
{
	let indice = multasSelec.indexOf(unValor); 
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
	contenedorMulta.className = "divMultas";
	let nombre_chk  = "'"+"chk_"+laMulta.id+"'";
	contenedorMulta.innerHTML = `<h3> Multa patente: ${laMulta.patente}</h3>
								<label for=${nombre_chk}> Multa: ${laMulta.id}</label>
								<input type = "checkbox" id= ${nombre_chk} class="chk" onclick="seleccionado(${nombre_chk}, ${laMulta.monto})">
								<p> Lugar: ${laMulta.lugar}</p>
								<p> Fecha: ${laMulta.fecha}</p>
								<p> Monto <b>$ ${laMulta.monto} </b></p>`;
	document.body.appendChild(contenedorMulta);
}

function cargar_encabezado_multas()

{
	let div_encabezado_multa = document.createElement("div");
	div_encabezado_multa.className = "divEncabezado";
	div_encabezado_multa.innerHTML = `<h2> Al día de la fecha ${dar_fecha(hoy)}, la patente: ${patente} registra las siguientes multas:</h2>`;
	document.body.appendChild(div_encabezado_multa);
}

function mostrar_web_tot_pagar()
{
	let totalMultasDiv = document.createElement("div");
		totalMultasDiv.innerHTML = `<h2 class="total" id="divTotal"> Valor total multas a abonar: ${totalAPagar}</h2>
									<label class="lblPago" >Abonar monto seleccionado: </label>
									<button id="btnPagar" class="btn pagar" onclick=mostrarSeleccion()>Aceptar</button>`;
		document.body.appendChild(totalMultasDiv);
}

function mostrar_web_no_debe()
{
	let msgNoMultas = document.createElement("div");
		msgNoMultas.className = "divNoMultas";
		msgNoMultas.innerHTML = `<h2> Al día de la fecha ${dar_fecha(hoy)}, la patente: ${patente}</h2>
								<p><b>No registras multas.</b></p>`;
		document.body.appendChild(msgNoMultas);
}