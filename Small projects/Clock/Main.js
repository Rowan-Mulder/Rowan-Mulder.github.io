"use strict"

//Handmatig draaien van wijzers eventueel ter controle van functionaliteit en UX
var rotation;
function ChangeRotationHours()
{
	rotation = document.getElementById("sliderHours").value;
	document.getElementById("arrowHours").style.transform = "translate(-50%, -50%) rotate(" + rotation*30 + "deg)";
}

function ChangeRotationMinutes()
{
	rotation = document.getElementById("sliderMinutes").value;
	document.getElementById("arrowMinutes").style.transform = "translate(-50%, -50%) rotate(" + rotation*6 + "deg)";
}

function ChangeRotationSeconds()
{
	rotation = document.getElementById("sliderSeconds").value;
	document.getElementById("arrowSeconds").style.transform = "translate(-50%, -50%) rotate(" + rotation*6 + "deg)";
}



function UpdateTime()
{
	var date = new Date();
	var dateHours = date.toString().substr(16,2);
	var dateMinutes = date.toString().substr(19,2);
	var dateSeconds = date.toString().substr(22,2);
	
	//Analoge tijd
	document.getElementById("arrowSeconds").style.transform = "translate(-50%, -50%) rotate(" + dateSeconds*6 + "deg)";
	document.getElementById("arrowMinutes").style.transform = "translate(-50%, -50%) rotate(" + dateMinutes*6 + "deg)";
	document.getElementById("arrowHours").style.transform = "translate(-50%, -50%) rotate(" + dateHours*30 + "deg)";
	//Sliders live aanpassen
	document.getElementById("sliderSeconds").value = dateSeconds;
	document.getElementById("sliderMinutes").value = dateMinutes;
	document.getElementById("sliderHours").value = dateHours;
	//Period
	if (dateHours >= 0 && dateHours < 12)
	{
		document.getElementById("period").innerHTML = "A.M.";
	}
	else if (dateHours >= 12 && dateHours < 24)
	{
		document.getElementById("period").innerHTML = "P.M.";
	}
}



//De tijd zal geüpdatet worden elke 1000ms (1s)
window.setInterval(function(){
	UpdateTime();
}, 1000);
//Voor een meer accurate tijdsweergave, verander de interval naar 100ms. Het zal wel iets meer van je CPU vragen.
