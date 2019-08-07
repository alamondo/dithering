var prcoessingResVal = 128;
var outputScaleVal = 16;
var color = 0;
var algoVal = "FS";
var palVal = "ADA";
var colorCountVal = 16;
var base64img = "";
var algo = document.getElementById("algo");
var pal = document.getElementById("pal");
var colorCount = document.getElementById("colorCount");
var palettePicker = document.getElementById("palettePicker");
var paletteContainer = document.getElementById("paletteContainer");
var colorPaletteMap = new Map();
var uniqueColorId = 0;
var imageCache = "";

$("#palettePicker").css("display","inherit");
$("#paletteContainer").css("display","grid");
palettePicker.parentNode.removeChild(palettePicker);
paletteContainer.parentNode.removeChild(paletteContainer);

document.getElementById("downloadBtn").disabled = true;

var btnColorUpdate = function() {
	document.getElementById("colorButton").style.backgroundColor = document.getElementById("colorInput").value;
}

document.getElementById("processingResIndicator").value = document.getElementById("processingResSlider").value;
$("#loader").css("display","unset");
$("#loader").hide();

document.getElementById("processingResSlider").oninput = function() {
    if ((this.value > 1024 ) || (this.value<64)) {
        document.getElementById("processingResIndicator").value = document.getElementById("processingResSlider").value;
        alert("Resolution must be in range (64,1024)");
        return false;
    } else {
		document.getElementById("processingResIndicator").value = this.value;
		document.getElementById("outputResIndicator").innerHTML = Math.round(2000/this.value) * this.value;
		prcoessingResVal = this.value;
		document.getElementById("outputResSlider").value = Math.round(2000/this.value);
	}
}

document.getElementById("processingResIndicator").onchange = function() {
	if ((this.value > 1024 ) || (this.value<64)) {
	document.getElementById("processingResIndicator").value = document.getElementById("processingResSlider").value;
    alert("Resolution must be in range (64,1024)");
    return false;
  }
	else {
		document.getElementById("processingResSlider").value = this.value;
		document.getElementById("outputResIndicator").innerHTML = Math.round(2000/this.value) * this.value;
		prcoessingResVal = this.value;
		document.getElementById("outputResSlider").value = Math.round(2000/this.value);
	}
}

var positionImage = function(){

}

document.getElementById("algoList").onchange = function() {
	algoVal = this.value;
}

document.getElementById("outputResIndicator").innerHTML = document.getElementById("outputResSlider").value * document.getElementById("processingResIndicator").value;
document.getElementById("outputResSlider").oninput = function() {
	document.getElementById("outputResIndicator").innerHTML = this.value * document.getElementById("processingResIndicator").value;
	outputScaleVal = this.value;
}

document.getElementById("colorCountSlider").oninput = function() {
	document.getElementById("colorCountIndicator").innerHTML = this.value;
	colorCountVal = this.value;
}



document.getElementById("colorSlider").oninput = function() {
	if (this.value == 1) {
		var table = document.getElementById("controlContainer");
		try {
			colorCount.parentNode.removeChild(colorCount);
		} catch (err) {};
		try {
			palettePicker.parentNode.removeChild(palettePicker);
			paletteContainer.parentNode.removeChild(paletteContainer);
		} catch (err) {};
		pal.parentNode.removeChild(pal);
	} else {
		var table = document.getElementById("controlContainer");
		table.appendChild(pal);
		document.getElementById("palList").value = "ADA";
		table.appendChild(colorCount);
	}
}

document.getElementById("palList").onchange = function() {
	palVal = this.value;
	if (this.value == "ADA") {
		var table = document.getElementById("controlContainer");
		table.appendChild(colorCount);
	} else {
		try {
			colorCount.parentNode.removeChild(colorCount);
		} catch (err) {};
	}
	if (this.value == "CUSTOM") {
		var table = document.getElementById("controlContainer");
		table.appendChild(palettePicker);
		document.getElementById("controlCard").appendChild(paletteContainer);
	} else {
		try {
			palettePicker.parentNode.removeChild(palettePicker);
			paletteContainer.parentNode.removeChild(paletteContainer);
		} catch (err) {};
	}
}

function previewFile() { 
	var preview = document.querySelector('img'); 
	var file   = document.querySelector('input[type=file]').files[0]; 
	var reader  = new FileReader(); 
	if (file.size > 30000000){
		alert("Max file size is 30Mb");
    return false;
	}
	else {
		reader.addEventListener("load", function() {  
			preview.style = ("display: inherit;")
			imageCache = reader.result;
			preview.src = reader.result; 
		}, false); 
		if (file) {  
			reader.readAsDataURL(file); 
		}
	}
}

const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');

function switchTheme(e) {
	if (e.target.checked) {
		document.documentElement.setAttribute('data-theme', 'light');
	} else {
		document.documentElement.setAttribute('data-theme', 'dark');
	}
}

const hexToRgb = hex => hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b).substring(1).match(/.{2}/g).map(x => parseInt(x, 16))
var deleteColor = function(element) {
	colorPaletteMap.delete(parseInt(element.target.id));
	document.getElementById("paletteContainer").removeChild(element.target);
}

var addColor = function() {
	colorPaletteMap.set(uniqueColorId, hexToRgb(document.getElementById("colorInput").value));
	var para = document.createElement("div");
	var node = document.createTextNode("X");
	para.appendChild(node);
	para.style.backgroundColor = document.getElementById("colorInput").value;
	paletteContainer.appendChild(para);
	para.setAttribute('id', uniqueColorId + 'color');
	uniqueColorId += 1;
	para.setAttribute('class', 'color-element');
	para.addEventListener('click', deleteColor, false);
}

$("#reset").click(function() {
    document.querySelector('img').src = imageCache;
});

$("#render").click(function() {

    if (document.getElementById('output').src == ""){
        return false;
    } else {

        $.ajaxSetup({
            cache: false
        });
        var tmp = null;
        $.ajax({
            beforeSend: function() {
                $("#loader").show();
                document.getElementById("loader").style.left = parseInt(document.getElementById("card").offsetWidth) / 2 - parseInt(document.getElementById("loader").offsetWidth) / 2+ "px";
                document.getElementById("loader").style.top = parseInt(document.getElementById("card").offsetHeight) / 2 - parseInt(document.getElementById("loader").offsetHeight) / 2 + "px";
            },
            cache: false,
            async: true,
            type: "POST",
            global: false,
            url: "/dither",
            data: {
                'prcoessingResVal': prcoessingResVal,
                'outputScaleVal': outputScaleVal,
                'color': document.getElementById("colorSlider").value,
                'algoVal': algoVal,
                'palVal': palVal,
                'colorCountVal': colorCountVal,
                'colorPaletteArray': Array.from(colorPaletteMap.values()).join(),
                'image': document.getElementById('output').src
            },
            success: function(response) {
                $("#loader").hide();
                $("#output").attr("src", "data:image/png;base64," + response);
                $("#download").attr("href", "data:image/png;base64," + response);
                $('#downloadBtn').removeAttr('disabled');
            },
            error: function (request, status, error) {
                $("#loader").hide();
                alert(request.responseText);
            }
        });

	}
});

function getBase64Image(img) {
	var canvas = document.createElement("canvas");
	canvas.width = img.width;
	canvas.height = img.height;
	var ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0);
	var dataURL = canvas.toDataURL("image/png");
	return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}
