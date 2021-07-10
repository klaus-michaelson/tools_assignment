var objscount = 0;
function createObj(objname, draw = false) {
    switch (objname) {
        case 'Tank':
            objscount++;
            new Tank(draw)
            break;
        case 'Pipe':
            objscount++;
            new Pipe()
            break;
    }
    console.log(objects);
}
// automatic tank creation
createObj("Tank");

function display(id) {
    var elem = document.getElementById(id);
    if (elem.classList.contains("dsp-n")) {
        elem.classList.remove("dsp-n");
    } else elem.classList.add("dsp-n");
}

function goBack() {
    if (objects.length > 0) {
        objects[objects.length - 1].removeSelf();
    } else {
        console.log("No History");
    }
}

function openWater() {
    if (objects.length > 0) {
        objects[0].open();
    }
}

var tankPressure = document.getElementById("tankPressure");
tankPressure.addEventListener("input", function (event) {
    openWater();
})


var _objW = document.getElementById("objWidth");
var _objH = document.getElementById("objHeight");
var _objAln = document.getElementById("objAlignment");

var objW = document.getElementById("objWidth").value;
var objH = document.getElementById("objHeight").value;
var objAln = document.getElementById("objAlignment").value;

_objW.addEventListener("change", function (event) {
    objW = this.value;
})
_objH.addEventListener("change", function (event) {
    objH = this.value;
})
_objAln.addEventListener("change", function (event) {
    objAln = this.value;
})



document.addEventListener("keyup", function (event) {
    var notInput = true;
    if (event.target.tagName == "INPUT")
        notInput = false;

    if (event.key == "Backspace" && notInput) {
        event.preventDefault();
        goBack();
    }
})