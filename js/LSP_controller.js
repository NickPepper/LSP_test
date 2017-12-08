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
            // we don't need any Model for now
        },

        Init = function() {
            // check dependencies at first
            if(!win.utils) {
                throw new Error('Our brilliant App requires the utils.js!');
            }
            if(!win.Actor) {
                throw new Error('Our brilliant App requires the LSP_actor.js!');
            }
            if(!win.Artist) {
                throw new Error('Our brilliant App requires the LSP_artist.js!');
            }

            this.initDOMElements();
            this.attachListeners();
        },

        prot = {

            /**
             * Link all needed DOM-elements for later use.
             * @private
             */
            initDOMElements: function() {
                DOM.btnSimple   = doc.getElementById("btn_simple");
                DOM.btnComplex  = doc.getElementById("btn_complex");
                DOM.btnBonus    = doc.getElementById("btn_bonus");
                DOM.divMain     = doc.getElementById("main");
                DOM.divBonus    = doc.getElementById("bonus");
            },


            /**
             * Attaches event listeners.
             * @private
             */
            attachListeners: function() {

                doc.addEventListener("click", function(e) {
                    var eid = e.target.getAttribute("id");
                    if(e.target.nodeName.toLowerCase() === "button" && eid) {
                        e = prot.cancelEvent(e);
                        switch(eid) {
                            case "btn_bonus":
                                DOM.divMain.style.display = "none";
                                DOM.divBonus.style.display = "block";
                                break;

                            case "btn_simple":
                                DOM.divBonus.style.display = "none";
                                DOM.divMain.style.display = "block";
                                this.xep = new Actor({container: DOM.divMain});
                                break;

                            case "btn_complex":
                                DOM.divBonus.style.display = "none";
                                DOM.divMain.style.display = "block";
                                this.xep = new Artist({container: DOM.divMain});
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

        Init.prototype = prot;

        // Public Interface
        return {
            standUp: prot.standUp
        };

    })();


    doc.addEventListener("DOMContentLoaded", function() {
        win.appController.standUp();
    }, true);

})(window, document);
