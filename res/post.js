
function post(path, data) {
    var payload = {};

    for (let property in data) {
        var item = data[property].toString();
        var isSelector = startsWith(item, "#") || startsWith(item, ".");
        
        payload[property] = isSelector ? evaluate(item) : item;
    }

    var request = new XMLHttpRequest();
    request.open("POST", path);
    request.setRequestHeader("Content-Type", "application/json");

    request.onload = function() {
        if (request.status !== 200) {
            alert("Request failed. Returned status of " + request.status);
            return;
        } else if (request.readyState === request.DONE) {
            var redirect = JSON.parse(request.response).redirect;
            redirect && (window.location = redirect);
        }
    };

    request.send(JSON.stringify(payload));
}

function evaluate(selector) {
    var element = document.querySelector(selector);

    if (element.tagName === "SELECT")
        return element.options[element.selectedIndex].value;
    else
        return document.querySelector(selector).value || document.querySelector(selector).innerHTML;
}

function refresh() {
    window.location.reload(true); // force reload
}

function startsWith(text, substring) {
    return text.indexOf(substring) === 0;
}