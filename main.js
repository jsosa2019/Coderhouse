const DIFERENCIADOR = "1.609";


let unidades = ["km/h","mph"];
let seguir = true;

while (seguir)
{	
	let opcion = prompt("Coloque (1) si desea convertir km/h a mph o (2) si desea convertir mph a km/h");
	if (opcion == "1")
	{
		let kmh = prompt("Indique el valor de "+ unidades[0]+ " a convertir a "+unidades[1]);
		let calculo = calcular_millas(kmh);
		dar_Respuesta (calculo,unidades[1]);
	}
	else 
	{
		if (opcion == "2")
		{
			let mph = prompt("Indique el valor de "+ unidades[1]+ " a convertir a "+unidades[0]);
			let calculo = calcular_km(mph);
			dar_Respuesta (calculo,unidades[0]);
		}
	}	
	
	if ((opcion == "1")||(opcion == "2"))
	{	
		let confirmacion = confirm("Desea seguir?");
		if (!confirmacion)
		{
			seguir = false;
			alert ("Hasta luego!!");
		}
	}
 }

//mostrar_respuesta(valor, tipo_de_unidad) 
function dar_Respuesta(resultado, unidad) 
{
  alert( resultado+" "+unidad );
} 

//calcular_millas(km_ingresadas)	
function calcular_millas(valor) 
{
  return valor / DIFERENCIADOR;
} 

//calcular_km(millas_ingresadas)	
function calcular_km(valor) 
{
  return valor * DIFERENCIADOR;
} 

