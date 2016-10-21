function promptFile(callback) {
    var element = document.createElement("input");
    element.type = "file";
    
    element.onchange = function(e) {
        file = this.files && this.files.length === 1 && this.files[0];
        upload(file, callback);
    };

    element.click();
}

function upload(file, callback) {
    var formData = new FormData();
    formData.append("image", file, file.name);

    var request = new XMLHttpRequest();
    request.open("POST", "/admin/upload", true);
    
    request.onload = function() {
        if (request.readyState === 4) {  
            if (request.status === 200) {  
                var tempPath = JSON.parse(request.responseText).tempPath;
                callback(file.name, tempPath);
            } else {
                console.error(request.statusText);
            }
        }
    };
    
    request.send(formData);
}