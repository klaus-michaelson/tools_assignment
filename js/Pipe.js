var canvasCont = document.getElementById("canvasCont");

class Pipe {
    name = "Pipe";
    id = null;
    status = null; // creation, drawen
    color = "#aaf";
    pressure = 0;
    canvElem = null;
    inputObjs = [];
    outputObjs = [];
    pos = {
        x: 0,
        y: 0,
        alignment: 'h'
    };
    connector = {
        x: 0, y: 0, w: 0, h: 0
    }
    t = null;
    w = 40;
    h = 20;
    constructor() {
        this.id = objscount;

        this.status = "creation";

        this.canvElem = document.createElement("canvas");
        this.canvElem.width = 500;
        this.canvElem.height = 500;

        canvasCont.appendChild(this.canvElem);

        this.pos.x = this.canvElem.width / 2;
        this.pos.y = this.canvElem.height / 2;

        this.update = this.update.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.animateFlow = this.animateFlow.bind(this);

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
        if (this.status == "creation") {
            objects.push(this);
            this.status = "drawen";
            this.inputObjs.forEach((input) => {
                input.output = this.connector;
                if (input.status == "onwater") {
                    input.open();
                }
            })
        }
        // console.log(this.inputObjs);

        this.canvElem.removeEventListener("click", this.handleClick);
    }
    open = function () {
        this.inputObjs.forEach((obj) => {
            obj.open();
            // console.log("on - " + obj.name)
        })
    }
    update = function () {
        if (this.status == "creation") {
            this.getInputs();
        }

        this.draw();
        this.handleStatus();
    }
    getInputs = function () {
        this.pos.alignment = objAln;

        this.w = objW * 1;
        this.h = objH * 1;
    }
    handleStatus = function () {
        // if (this.status == "creation")
        //     this.status = "ondrag";

        if (this.status == "creation") {
            var noConn = true;
            objects.forEach((obj) => {
                if (obj.id != this.id) {
                    if (this.checkCon(obj)) {
                        this.connect(obj);
                        noConn = false;
                    }
                }
            })
            if (noConn) {
                this.connector.w = 0;
                this.connector.h = 0;
            }
        }

        if (this.status == "onwater") {
            this.color = "blue";
            this.t = setInterval(this.animateFlow, 30);
            this.draw();
            this.calcPressure();
        }

    }
    animateFlow = function () {
        if (this.outputObjs.length > 0)
            return false;

        var context = this.canvElem.getContext("2d");
        context.beginPath();

        var l = (this.pressure);

        if (this.pos.alignment == "v") {
            var y = this.output.y + this.output.h + 3,
                x = this.output.x + 3;

            var w = (this.output.x + this.output.w) - this.output.x;

            context.clearRect(x - 1, y - 1, w + 1, y + l + 1);
            for (var i = 0; i < w; i += (w / 4)) {
                context.moveTo(x + i, y);
                context.lineTo(x + i, y + l + (Math.random() * this.pressure / 2));
                context.stroke();
            }
        } else if (this.pos.alignment == "h") {
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
    }
    calcPressure = function () {
        var w = this.h;
        if (this.pos.alignment == "v")
            w = this.w;

        this.pressure = 0;
        if (this.inputObjs.length > 0) {
            this.inputObjs.forEach((input) => {
                this.pressure += input.pressure / input.outputObjs.length;
                // console.log(input)
            });
        }
        // console.log(this.pressure)
        this.pressure -= this.pressure / (w - (w / 2));

        var l = (this.pressure);

        var context = this.canvElem.getContext("2d");
        if (this.pos.alignment == "v")
            context.fillText(parseInt("" + this.pressure), this.output.x + (this.output.w / 3), this.output.y + 1);
        else
            context.fillText(parseInt("" + this.pressure), this.pos.x + (this.w / 3), this.pos.y + this.h - 5);

    }
    connect = function (obj) {
        var cnx = Math.min(obj.output.x, this.input.x),
            cny = Math.min(this.input.y, obj.output.y),
            cnw = Math.max(this.input.x + this.input.w, obj.output.x + obj.output.w) - cnx,//Math.max(this.input.x + this.input.w, cnx + obj.output.w),
            cnh = Math.max(this.input.y + this.input.h, obj.output.y + obj.output.h) - cny;

        this.connector = {
            x: cnx,
            y: cny,
            w: cnw,
            h: cnh
        }

        if (!this.inputObjs.includes(obj))
            this.inputObjs.push(obj);

        // assigning self as output for its input
        var pushed = false;
        obj.outputObjs.forEach((input, index, arr) => {
            if (input.id == this.id) {
                pushed = true;
            }
        })
        if (!pushed)
            obj.outputObjs.push(this);

    }
    checkCon = function (obj) {
        var rangeIntersect = (min0, max0, min1, max1) => {
            return Math.max(min0, max0) >= Math.min(min1, max1) &&
                Math.min(min0, max0) <= Math.max(min1, max1);
        }
        var rectIntersect = (r0, r1) => {
            return rangeIntersect(r0.x, r0.x + r0.w, r1.x, r1.x + r1.w) &&
                rangeIntersect(r0.y, r0.y + r0.h, r1.y, r1.y + r1.h);
        }


        // var connector = obj.output;
        // if (obj.connector.w > 0)
        //     connector = obj.connector;

        var connection = rectIntersect(this.input, obj.output);

        if (connection) {
            console.log("Connection");
        } else {
        }
        return connection;
    }
    drawConnector = function () {
        var context = this.canvElem.getContext("2d");

        context.save();
        context.fillStyle = "grey";
        context.beginPath();
        context.fillRect(this.connector.x, this.connector.y, this.connector.w, this.connector.h);
        context.restore();
    }
    draw = function () {
        var context = this.canvElem.getContext("2d"),
            width = this.canvElem.width,
            height = this.canvElem.height;

        this.calcAlign();
        context.save();
        context.fillStyle = this.color;
        context.clearRect(0, 0, width, height);


        context.beginPath();
        //body
        context.fillRect(this.pos.x, this.pos.y, this.w, this.h);
        //output
        context.fillRect(this.output.x, this.output.y, this.output.w, this.output.h);
        //input
        context.fillRect(this.input.x, this.input.y, this.input.w, this.input.h);
        context.restore();

        this.drawConnector();

    }
    calcAlign = function () {
        if (this.pos.alignment == "h") {
            if (this.outputObjs.length > 0) {
                this.input = this.connector;
            } else {
                this.input = {
                    x: this.pos.x - 15,
                    y: this.pos.y,
                    w: 15,
                    h: this.h + 5
                }
                this.input.y -= (this.input.h / 2);
                this.input.y += this.h / 2;

            }
            this.output = {
                x: this.pos.x + this.w,
                y: this.pos.y,
                w: 15,
                h: this.h + 5
            }
            this.output.y -= (this.output.h / 2);
            this.output.y += this.h / 2;
        } else if (this.pos.alignment == "v") {
            if (this.outputObjs.length > 0) {
                this.input = this.connector;
            } else {
                this.input = {
                    x: this.pos.x - 5,
                    y: this.pos.y - 15 - 1,
                    w: this.w + (5 * 2),
                    h: 15 + 1
                }
            }

            this.output = {
                x: this.pos.x - 5,
                y: this.pos.y + this.h,
                w: this.w + (5 * 2),
                h: 15
            }
        }
    }
    removeSelf = function () {
        this.inputObjs.forEach((inputs) => {
            console.log(inputs.outputObjs);
            inputs.outputObjs.forEach((output, index, obj) => {
                if (output.id == this.id) {
                    obj.splice(index, 1);
                }
            })
        })
        objects.forEach((obj, index) => {
            if (obj.id == this.id)
                objects.splice(index, 1);
        })
        this.canvElem.remove();
    }
}