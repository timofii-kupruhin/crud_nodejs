function previewFile() {
	let preview = document.querySelector('#articleImage')
	let file    = document.querySelector('input[type=file]').files[0];
	let reader  = new FileReader();
	reader.onloadend = function () {
	  preview.src = reader.result;
    }
	if (file) {
	  reader.readAsDataURL(file);
	} else { 
	  preview.src = "../images/blank.png"
	}
}