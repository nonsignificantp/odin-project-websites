
const map = { // Tracks all changes on the canvas
    "creation-date": Date(Date.now()).toString(),
    "data":{"black-pixels":0,"white-pixels":256},
    "data-points":[]
}; 
const pixels = document.querySelectorAll('#Pixel'); // Select all the pixels
const savebtn = document.querySelector('#Download');
const resetbtn = document.querySelector('#Reset');
const loadbtn = document.getElementById('jsonfile');

pixels.forEach(pixel => {
    // Add clicking functionality
    pixel.addEventListener('click', makeSelect)
    pixel.addEventListener('touchstart', makeSelect)
});

savebtn.onclick = () => {
    // Saves on local the map object as a JSON file
    let data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(map));
    savebtn.setAttribute("href", data);
    savebtn.setAttribute("download", "canvas.json");
};

resetbtn.onclick = () => {
    // Resets canvas to all white again
    pixels.forEach(pixel => {
        if (pixel.classList.contains('is-selected')) {
            pixel.classList.toggle('is-selected');
            removePointFromMap(pixel.attributes['data-x'].nodeValue, pixel.attributes['data-y'].nodeValue);
        }
    });
};

loadbtn.onchange = (element) => {
    let file = element.target.files[0];
    let reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    
    reader.onload = function(event) {
        let data = JSON.parse(event.target.result);
        loadUploadedData(data);
      }
};

function makeSelect(element) {
    // Assess if the point had already been added
    if (!this.classList.contains('is-selected')) {
        addPointToMap(this.attributes['data-x'].nodeValue, this.attributes['data-y'].nodeValue);
    } else {
        removePointFromMap(this.attributes['data-x'].nodeValue, this.attributes['data-y'].nodeValue);
    }

    this.classList.toggle('is-selected');
}

function addPointToMap(x,y) {
    // Adds a pint with x and y coordinates to the map object
    map['data-points'].push({x,y});
    updateMapClicks('add');
}

function removePointFromMap(x,y) {
    // If the point had been already added, then it is erased from the map object
    let index = map['data-points'].findIndex(point => point.x == x && point.y == y);
    map['data-points'].splice(index, 1);
    updateMapClicks('remove');
}

function updateMapClicks(type) {
    // Updates data that goes inside the JSON
    if (type=='add') {
        map['data']["black-pixels"] += 1;
        map['data']["white-pixels"] -= 1;
        updateV();
    }

    if (type=='remove') {
        map['data']["black-pixels"] -= 1;
        map['data']["white-pixels"] += 1;
        updateV();
    }
}

function loadUploadedData(data) {
    resetbtn.click();
    let pixels = data['data-points'];
    
    pixels.forEach((pixel) => {
        addPointToMap(pixel['x'], pixel['y']);
        let element = document.querySelector(`#Pixel[data-x='${pixel['x']}'][data-y='${pixel['y']}']`);
        element.classList.toggle('is-selected');
    });
}

var counterW = new Vue({
    el: '#White',
    data: {
        name: 'White',
        count: map['data']['white-pixels']
    }
});

var counterB = new Vue({
    el: '#Black',
    data: {
        name: 'Black',
        count: map['data']['black-pixels']
    }
});

function updateV() {
    Vue.set(counterW, 'count', map['data']['white-pixels']);
    Vue.set(counterB, 'count', map['data']['black-pixels']);
}



