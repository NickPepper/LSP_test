;(function(win, doc, undefined) {
    "use strict";

    /**
     * Singleton.
     * ("Герой должен быть один!" ©)
     */
    win.appController = win.appController || (function() {

        var DOM = {
            btnSimple:  null,
            btnComplex: null,
            btnBonus:   null,
            divMain:    null,
            divBonus:   null
        },

        MODEL = {
            // although we don't have any Model yet
        },

        Init = function() {
            // check dependencies at first
            if(!win.utils) {
                throw new Error('appController requires the utils.js!');
            }
            if(!win.Popup) {
                throw new Error('appController requires the LSP_popup.js!');
            }
            if(!win.PopupChild) {
                throw new Error('appController requires the LSP_popupchild.js!');
            }

            // well, init
            this.initDOMElements();
            this.attachListeners();
        },

        shprot = {

            /**
             * Link all needed DOM-elements for later use.
             * @private
             */
            initDOMElements: function() {
                DOM.btnSimple   = doc.getElementById("btn_simple");
                if(!DOM.btnSimple) {
                    throw new Error('DOM.btnSimple must be a DOM-Element!');
                }
                DOM.btnComplex  = doc.getElementById("btn_complex");
                if(!DOM.btnComplex) {
                    throw new Error('DOM.btnComplex must be a DOM-Element!');
                }
                DOM.btnBonus    = doc.getElementById("btn_bonus");
                if(!DOM.btnBonus) {
                    throw new Error('DOM.btnBonus must be a DOM-Element!');
                }
                DOM.divMain     = doc.getElementById("main");
                if(!DOM.divMain) {
                    throw new Error('DOM.divMain must be a DOM-Element!');
                }
                DOM.divBonus    = doc.getElementById("bonus");
                if(!DOM.divBonus) {
                    throw new Error('DOM.divBonus must be a DOM-Element!');
                }
            },


            /**
             * Attaches event listeners.
             * @private
             */
            attachListeners: function() {

                doc.addEventListener("click", function(e) {
                    var eid = e.target.getAttribute("id");
                    if(e.target.nodeName.toLowerCase() === "button" && eid) {
                        e = shprot.cancelEvent(e);
                        switch(eid) {
                            case "btn_bonus":
                                DOM.divMain.style.display = "none";
                                DOM.divBonus.style.display = "block";
                                break;

                            case "btn_simple":
                                DOM.divBonus.style.display = "none";
                                DOM.divMain.style.display = "block";
                                this.actor = new Popup({container: DOM.divMain});
                                break;

                            case "btn_complex":
                                DOM.divBonus.style.display = "none";
                                DOM.divMain.style.display = "block";
                                this.actor = new PopupChild({container: DOM.divMain});
                                break;

                            default:
                                break;
                        }
                    }
                });

            },


            /**
             * Facade method.
             * @private
             */
            cancelEvent: function(event) {
                if(event && event.preventDefault) {
                    event.preventDefault();
                    event.stopPropagation();
                    return event;
                }
                win.event.returnValue = false;
                win.event.cancelBubble = true;
                return win.event;
            },


            /**
             *  entry point
             *  @public
             */
            standUp: function() {
                return new Init();
            }

        };

        Init.prototype = shprot;

        // Public Interface
        return {
            standUp: shprot.standUp
        };

    })();


    doc.addEventListener("DOMContentLoaded", function() {
        win.appController.standUp();
    }, true);

})(window, document);
