// let it be in global scope if you don't mind?
window.Popup = (function() {
    'use strict';

    // check dependencies at first
    if(!utils) {
        throw new Error('Popup requires the utils.js!');
    }


    function Popup(params) {
        /*
         * check params
         */
        if(!utils.isElement(params.container)) {
            throw new Error("Popup requires container element to be a DOM node!");
        }

        /*
         * apply params
         */
        this.ui = {
            container: params.container || document.body,
            frame: utils.node('iframe', {attr: {
                frameBorder: 0,
                'class': 'popup-frame'
            }})
        };

        /*
         * init
         */
        this.durDOM(params);
        this.initEventHandlers();
        // ну, пусть будут public - ничто не мешает их в любой момент сделать и private, если захочется
        // P.S. Капитан Очевидность: комментарии на русском - яд, зло и плевок в иностранную душу!!!
        return {
            durDOM:             this.durDOM.bind(this),
            initEventHandlers:  this.initEventHandlers.bind(this)
        }
    }



    Popup.prototype = {

        /************
         * private
         ***********/

        // Facade method
        cancelEvent: function(event) {
            if(event && event.preventDefault) {
                event.preventDefault();
                event.stopPropagation();
                return event;
            }
            window.event.returnValue = false;
            window.event.cancelBubble = true;
            return window.event;
        },


        /**********
         * public
         *********/

        durDOM: function(params) {
            this.ui.container.appendChild(this.ui.frame);
            this.ui.frame.contentDocument.write("\
                <html>\
                    <head>\
                        <style>\
                            html,body{margin:0; padding:0; width:100%; height:100%; text-align:center; overflow:hidden;}\
                            span{position:absolute; top:0px; right:0px; border:1px solid red; cursor:pointer; color:red; width:20px;}\
                            div{margin:40px;}\
                        </style>\
                    </head>\
                    <body>\
                        <span>X</span>\
                        <div>Вынос памяти...</div>\
                    </body>\
                </html>\
            ");
            this.ui.frame.contentDocument.close();
            // TODO: ?
            // let the max values for random be hardcoded as 700 for now, because
            // I am too lazy to calculate the window.clientWidth or similar as well as aspect ratio on resize
            this.ui.frame.style.left = params.left || utils.getRandomInt(0, 700) + "px";
            this.ui.frame.style.top = params.top || utils.getRandomInt(0, 700) + "px";
        },


        initEventHandlers: function() {
            this.ui.frame.contentDocument.getElementsByTagName("span")[0].addEventListener('click', function(event) {
                this.cancelEvent(event);
                this.ui.container.removeChild(this.ui.frame);
            }.bind(this));
        }
    };

    return Popup;
})();
