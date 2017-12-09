// let it be in global scope if you don't mind?
window.PopupChild = (function() {
    'use strict';

    // check dependencies at first
    if(!utils) {
        throw new Error('PopupChild requires the utils.js!');
    }
    if(!window.Popup) {
        throw new Error('PopupChild requires the LSP_popup.js!');
    }


    function PopupChild(params) {
        // call super constructor
        Popup.call(this, params);
    }

    PopupChild.prototype = Object.create(Popup.prototype);
    PopupChild.prototype.constructor = PopupChild;

    /*
     * Override the super methods
     */
    PopupChild.prototype.durDOM = function(params) {
        this.ui.container.appendChild(this.ui.frame);
        this.ui.frame.contentDocument.write("\
            <html>\
                <head>\
                    <style>\
                        html,body{margin:0; padding:0; width:100%; height:100%; text-align:center; overflow:hidden;}\
                        span{position:absolute; top:0px; right:0px; border:1px solid red; cursor:pointer; color:red; width:20px;}\
                        div{margin:20px;}\
                        input{width:140px;max-width:140px;}\
                        button{cursor:pointer;}\
                    </style>\
                </head>\
                <body>\
                    <span>X</span>\
                    <form>\
                        <div>\
                            <input type=\"text\" placeholder=\"Введи сюда...\" size=\"30\">\
                        </div>\
                        <div>\
                            <button>Матюгнуть в консоль</button>\
                        </div>\
                    </form>\
                </body>\
            </html>\
        ");
        this.ui.frame.contentDocument.close();
        // TODO: ?
        // let the max values for random be hardcoded as 700 for now, because
        // I am too lazy to calculate the window.innerWidth or similar as well as aspect ratio on resize
        this.ui.frame.style.left = params.left || utils.getRandomInt(0, 700) + "px";
        this.ui.frame.style.top = params.top || utils.getRandomInt(0, 700) + "px";
    };


    PopupChild.prototype.initEventHandlers = function() {
        this.ui.frame.contentDocument.getElementsByTagName("span")[0].addEventListener('click', function(event) {
            this.cancelEvent(event);
            this.ui.container.removeChild(this.ui.frame);
        }.bind(this));

        this.ui.frame.contentDocument.getElementsByTagName("button")[0].addEventListener('click', function(event) {
            this.cancelEvent(event);
            var val = this.ui.frame.contentDocument.getElementsByTagName("input")[0].value;
            console.log("Input value: [" + val + "]");
        }.bind(this));
    };


    return PopupChild;
})();
