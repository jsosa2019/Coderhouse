
// array de multas
const multas = [];
const multasSelec = [];
let cont=0;	
let cantidadMultasBD = 0;
let patente ="";
// hacer array de objetos para las multas seleccionadas


// recupero BD multas
cargar_Multas();

// sumar cfg donde poner ruta de json base


let totalAPagar = 0;	
const hoy = new Date();

let botonBuscar = document.getElementById("btnBuscar");
//botonBuscar.onclick = () => {encontrar_patente(document.getElementById('inputPatente').value); ocultar_comentario();}
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
				let div_encabezado_multa = document.createElement("div");
				div_encabezado_multa.className = "divEncabezado";
				div_encabezado_multa.innerHTML = `<h2> Al día de la fecha ${dar_fecha(hoy)}, la patente: ${patente} registra las siguientes multas:</h2>`;
				document.body.appendChild(div_encabezado_multa);
				encabezadoPatente = true;
			}
			
			infractor = true;
			// muestro la multa en web
			let contenedorMulta = document.createElement("div");
			contenedorMulta.className = "divMultas";
			let nombre_chk  = "'"+"chk_"+multa.id+"'";
			contenedorMulta.innerHTML = `<h3> Multa patente: ${multa.patente}</h3>
										<label for=${nombre_chk}> Multa: ${multa.id}</label>
									 	<input type = "checkbox" id= ${nombre_chk} class="chk" onclick="seleccionado(${nombre_chk}, ${multa.monto})">
										<p> Lugar: ${multa.lugar}</p>
										<p> Fecha: ${multa.fecha}</p>
										<p> Monto <b>$ ${multa.monto} </b></p>`;
			document.body.appendChild(contenedorMulta);
		} 
	} 
	
	// si es una patente sin multas
	if (infractor)
	{
		// recorrer array con multas seleccionadas
		let totalMultasDiv = document.createElement("div");
		
		totalMultasDiv.innerHTML = `<h2 class="total"> Valor total multas a abonar: ${totalAPagar}</h2>
									<label>Abonar monto seleccionado: </label>
									<button id="btnPagar" class="btn pagar" onclick=mostrarSeleccion()>Aceptar</button>`;
		document.body.appendChild(totalMultasDiv);
	} 
	else
	{
		let msgNoMultas = document.createElement("div");
		msgNoMultas.className = "divNoMultas";
		msgNoMultas.innerHTML = `<h2> Al día de la fecha ${dar_fecha(hoy)}, la patente: ${unaPatente.toUpperCase()}</h2>
								<p><b>No registras multas.</b></p>`;
		document.body.appendChild(msgNoMultas);

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
		// console.log(multasSelec);
		
	} 
	else 
	{
		caja.parentNode.setAttribute("class", "divMultas"); 
		totalAPagar = totalAPagar - unMonto;
		// quito en vector de id de multas seleccionadas
		eliminarDeArray(multID[1]);
		//	console.log(multasSelec);
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

	//  oculto las divNoseleccionados y botón acepta*/
	/* sumo un btn aceptar y otro cancelar */
	// ocultar los chkbox */


	let elEncabezado = document.getElementsByClassName("divEncabezado");
	elEncabezado[0].innerHTML = `<h2> Al día de la fecha ${dar_fecha(hoy)}, la patente: ${patente} seleccionó las siguientes multas a abonar:</h2>`;
	
	let divAOcultar = document.getElementsByClassName("divMultas");
	//console.log (divAOcultar.length);

	for(let i=0; i < divAOcultar.length; i++)
	{
		//divAOcultar[i].remove();
		//console.log(divAOcultar[i]);
	}
	
	let divElegido = document.getElementsByClassName("seleccionado");

	// saco los chks de las multas seleccionadas
	for(let i=0; i < divElegido.length; i++)
	{
		//obtengo los nodos div clase seleccionados
		let unDiv = divElegido[i];
		//obtengo el chk hijo
		let chks = unDiv.getElementsByClassName("chk");
		//console.log(chks[0]);
		//console.log(unDiv);
		chks[0].remove();
	}
	
	let unBtn = document.getElementById("btnPagar");
	unBtn.remove();

	let contenedorBotones = document.createElement("div");

	contenedorBotones.innerHTML = `<button id="btnAceptarPago" class="btn pagar" onclick="compraRealizada()">Aceptar</button>
								   <button id="btnCancelararPago" class="btn pagar" onclick="cancelarBtn()">Cancelar</button>`;
		
	//let btnAceptar = document.createElement("button");
	//let btnCancelar = document.createElement("button");
	//btnAceptar.innerHTML = `<button id="btnAceptarPago" class="btn pagar">Aceptar</button>`;
	//btnCancelar.innerHTML = `<button id="btnCancelararPago" class="btn cancelar">Cancelar</button>`;
	//document.body.appendChild(btnAceptar);
	document.body.appendChild(contenedorBotones);


	if (multasSelec.length > 0)
	{
		//let nuevaVentana = window.open("resultado.html", "Listado de multas a pagar");
		//const otroDocumento = nuevaVentana.document;
		//otroDocumento = document.

    	let div_encabezado_multa = document.createElement("div");
		div_encabezado_multa.className = "divEncabezadoMulta";
		div_encabezado_multa.innerHTML = '<h2> Primer ingreso</h2>';
                
	//	console.log(multasSelec);
		
	//	for (const laMulta of multasSelec)
		for (let x = 0; x < multasSelec.length; x++ )
		{
		//	console.log(multasSelec[x]);
			//div_encabezado_multa.innerHTML = '<h2> ${laMulta[x]} </h2>';
		
			/* 
			
			let div_multa = document.createElement("div");
			div_multa.className = "divEncabezadoMulta";
			div_multa.innerHTML = '<h2> Primer ingreso</h2>';
        	div_multa.innerHTML = '<h2> '+ multasSelec[x]+'</h2>';
			document.body.appendChild(div_multa);

			*/

			//${multa.lugar}
			//<h2> Segunda '+multasSelec[1]+'</h2><h2> Tercer '+multasSelec[2]+'</h2>';
		}
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