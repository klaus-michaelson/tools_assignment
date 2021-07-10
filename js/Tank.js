var canvasCont = document.getElementById("canvasCont");
class Tank {
    name = "Tank";
    id = null;
    status = null;
    color = "silver";
    canvElem = null;
    inputObjs = [];
    outputObjs = [];
    connector = {
        x: 0, y: 0, w: 0, h: 0
    };
    pressure = 200;
    pos = {
        x: 0,
        y: 0,
        alignment: 'v'
    };
    w = 20;
    h = 50;
    constructor(drawen = false) {
        this.id = objscount;
        this.status = "creation";
        this.canvElem = document.createElement("canvas");
        this.canvElem.width = 500;
        this.canvElem.height = 500;
        canvasCont.appendChild(this.canvElem);
        this.update = this.update.bind(this);
        this.animateFlow = this.animateFlow.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.t = setInterval(this.update, 50);
        this.canvElem.addEventListener("mousemove", (event) => {
            if (this.status == "creation") {
                this.pos.x = event.clientX;
                this.pos.y = event.clientY;
            }
        });
        this.canvElem.addEventListener("click", this.handleClick);
    }
    handleClick = function () {
        clearInterval(this.t);
        this.calcPressure();
        if (this.status == "creation"); {
            objects.push(this);
            this.status = "drawen";
        }
        // to start water automatically
        this.status = "onwater";
        this.handleStatus();
        this.canvElem.removeEventListener("click", this.handleClick);
    }
    update = function () {
        this.getInputs();
        this.handleStatus();
        this.draw();
    }
    getInputs = function () {
        this.w = objW * 1;
        this.h = objH * 1;
    }
    handleStatus = function () {
        if (this.status == "onwater") {
            this.color = "blue";
            this.calcPressure();
            this.t = setInterval(this.animateFlow, 30);
            this.draw();
        }
    }
    animateFlow = function () {
        if (this.outputObjs.length > 0)
            return false;
        var context = this.canvElem.getContext("2d");
        context.beginPath();
        var l = (this.pressure);
        var y = this.output.y + 3,
            x = this.output.x + this.output.w + 3;
        var h = (this.output.y + this.output.h) - this.output.y;
        context.clearRect(x - 1, y - 1, x + l + 1, h + 1);
        for (var i = 0; i < h; i += (h / 4)) {
            context.moveTo(x, y + i);
            context.lineTo(x + l + (Math.random() * this.pressure / 2), y + i);
            context.stroke();
        }
    }
    open = function () {
        console.log("Water opened");
        function flowWater(currentFlow) {
            currentFlow.status = "onwater";
            currentFlow.handleStatus();
            currentFlow.outputObjs.forEach((output) => {
                flowWater(output);
            });
        }
        flowWater(this);
        console.log(this.status)
    }
    calcPressure = function () {
        var w = this.h;
        this.pressure = tankPressure.value;
        console.log(this.pressure)
        this.pressure -= this.pressure / (w - (w / 2));
        this.pressure = parseInt(this.pressure.toString().split(".")[0])
        if (this.pressure < 0) this.pressure = 0;
        console.log(this.pressure);
    }
    draw = function () {
        var context = this.canvElem.getContext("2d"),
            width = this.canvElem.width,
            height = this.canvElem.height;
        var w = this.w;
        var h = this.h;
        context.clearRect(0, 0, width, height);
        context.save();
        context.fillStyle = this.color;
        context.beginPath();
        this.drawHead(w, h);
        this.drawBody(w, h);
        this.drawOutput(w, h)
        context.restore();
    }
    drawHead = function (w, h) {
        var context = this.canvElem.getContext("2d");
        this.head = {
            x: this.pos.x - (w),
            y: this.pos.y - 40,
            w: w * 2,
            h: 40
        }
        context.fillRect(this.head.x, this.head.y, this.head.w, this.head.h);
    }
    drawBody = function (w, h) {
        var context = this.canvElem.getContext("2d");
        this.body = {
            x: this.pos.x - (w / 2),
            y: this.pos.y,
            w: w,
            h: h
        }
        context.fillRect(this.body.x, this.body.y, this.body.w, this.body.h);
    }
    drawOutput = function (w, h) {
        var context = this.canvElem.getContext("2d");
        this.leg = {
            w: 30,
            h: 10,
            x: this.body.x + this.body.w,
            y: 0,
        }
        this.leg.y = (this.body.y + this.body.h) - (this.leg.h + 2);
        this.output = {
            x: this.leg.x + this.leg.w,
            y: this.leg.y,
            w: 15,
            h: this.leg.h + 5
        }
        this.output.y -= (this.output.h / 2);
        this.output.y += this.leg.h / 2;
        context.fillRect(this.leg.x, this.leg.y, this.leg.w, this.leg.h);
        context.fillRect(this.output.x, this.output.y, this.output.w, this.output.h);
    }
}