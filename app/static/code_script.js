var morse_string = []
var flashGO = 0
var codePos = 0
var codePosCheck = 0
var MORSE_CODE_DICT = { 'A':'.-', 'B':'-...',
                    'C':'-.-.', 'D':'-..', 'E':'.',
                    'F':'..-.', 'G':'--.', 'H':'....',
                    'I':'..', 'J':'.---', 'K':'-.-',
                    'L':'.-..', 'M':'--', 'N':'-.',
                    'O':'---', 'P':'.--.', 'Q':'--.-',
                    'R':'.-.', 'S':'...', 'T':'-',
                    'U':'..-', 'V':'...-', 'W':'.--',
                    'X':'-..-', 'Y':'-.--', 'Z':'--..',
                    }
var start_morse = function() {
	flashGO = 1
	codePos = 0
  codePosCheck = 0
	morse_string = MORSE_CODE_DICT[String.fromCharCode(Math.floor(Math.random() * 26) + 65)]
	morse_string += " "
	morse_string += MORSE_CODE_DICT[String.fromCharCode(Math.floor(Math.random() * 26) + 65)]
	document.getElementById("111").value = morse_string;
	on_flash()
}
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
async function on_flash() {
	if (flashGO == 1) {
		if (codePos < morse_string.length) {
			$("#blinker").css("background", "rgb(165, 86, 6)")
			// console.log(codePos)
			if (morse_string.charAt(codePos) == "-") {
				await sleep(300)
				off_flash(100)
			} else if (morse_string.charAt(codePos) == ".") {
				await sleep(100)
				off_flash(100)
			} else {
				off_flash(300)
			}
			codePos += 1
		} else {
			flashGO = 0
			codePos = 0
			$("#blinker").css("background", "rgb(0, 0, 0)")
		}
	}
}
async function off_flash(offTime){
    $("#blinker").css("background", "rgb(0, 0, 0)")
    await sleep(offTime)
    on_flash()
}
async function dotClick() {
  if (morse_string.charAt(codePosCheck) == ".") {
    right()
    codePosCheck += 1
  }
  else {
    wrong()
  }
}
async function dashClick() {
  if (morse_string.charAt(codePosCheck) == "-") {
    right()
    codePosCheck += 1
  }
  else {
    wrong()
  }
}
async function spaceClick() {
  if (morse_string.charAt(codePosCheck) == " ") {
    right()
    codePosCheck += 1
  }
  else {
    wrong()
  }
}

async function right(){
  $("#blinker").css("background", "rgb(0, 150, 0)")
  await sleep(100)
  $("#blinker").css("background", "rgb(0, 0, 0)")
  if (codePosCheck == morse_string.length){
    alert("Correct")
  }
}
async function wrong(){
  $("#blinker").css("background", "rgb(150, 0, 0)")
  await sleep(100)
  $("#blinker").css("background", "rgb(0, 0, 0)")
  alert("Wrong")
}
