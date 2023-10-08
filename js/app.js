(() => {
    "use strict";
    const modules_flsModules = {};
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(webP.height == 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = support === true ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    function getHash() {
        if (location.hash) return location.hash.replace("#", "");
    }
    let _slideUp = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = `${target.offsetHeight}px`;
            target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout((() => {
                target.hidden = !showmore ? true : false;
                !showmore ? target.style.removeProperty("height") : null;
                target.style.removeProperty("padding-top");
                target.style.removeProperty("padding-bottom");
                target.style.removeProperty("margin-top");
                target.style.removeProperty("margin-bottom");
                !showmore ? target.style.removeProperty("overflow") : null;
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideUpDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideDown = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.hidden = target.hidden ? false : null;
            showmore ? target.style.removeProperty("height") : null;
            let height = target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = height + "px";
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            window.setTimeout((() => {
                target.style.removeProperty("height");
                target.style.removeProperty("overflow");
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideDownDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideToggle = (target, duration = 500) => {
        if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
    };
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function spollers() {
        const spollersArray = document.querySelectorAll("[data-spollers]");
        if (spollersArray.length > 0) {
            document.addEventListener("click", setSpollerAction);
            const spollersRegular = Array.from(spollersArray).filter((function(item, index, self) {
                return !item.dataset.spollers.split(",")[0];
            }));
            if (spollersRegular.length) initSpollers(spollersRegular);
            let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
            if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem => {
                mdQueriesItem.matchMedia.addEventListener("change", (function() {
                    initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                }));
                initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            }));
            function initSpollers(spollersArray, matchMedia = false) {
                spollersArray.forEach((spollersBlock => {
                    spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
                    if (matchMedia.matches || !matchMedia) {
                        spollersBlock.classList.add("_spoller-init");
                        initSpollerBody(spollersBlock);
                    } else {
                        spollersBlock.classList.remove("_spoller-init");
                        initSpollerBody(spollersBlock, false);
                    }
                }));
            }
            function initSpollerBody(spollersBlock, hideSpollerBody = true) {
                let spollerItems = spollersBlock.querySelectorAll("details");
                if (spollerItems.length) spollerItems.forEach((spollerItem => {
                    let spollerTitle = spollerItem.querySelector("summary");
                    if (hideSpollerBody) {
                        spollerTitle.removeAttribute("tabindex");
                        if (!spollerItem.hasAttribute("data-open")) {
                            spollerItem.open = false;
                            spollerTitle.nextElementSibling.hidden = true;
                        } else {
                            spollerTitle.classList.add("_spoller-active");
                            spollerItem.open = true;
                        }
                    } else {
                        spollerTitle.setAttribute("tabindex", "-1");
                        spollerTitle.classList.remove("_spoller-active");
                        spollerItem.open = true;
                        spollerTitle.nextElementSibling.hidden = false;
                    }
                }));
            }
            function setSpollerAction(e) {
                const el = e.target;
                if (el.closest("summary") && el.closest("[data-spollers]")) {
                    e.preventDefault();
                    if (el.closest("[data-spollers]").classList.contains("_spoller-init")) {
                        const spollerTitle = el.closest("summary");
                        const spollerBlock = spollerTitle.closest("details");
                        const spollersBlock = spollerTitle.closest("[data-spollers]");
                        const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
                        const scrollSpoller = spollerBlock.hasAttribute("data-spoller-scroll");
                        const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                        if (!spollersBlock.querySelectorAll("._slide").length) {
                            if (oneSpoller && !spollerBlock.open) hideSpollersBody(spollersBlock);
                            !spollerBlock.open ? spollerBlock.open = true : setTimeout((() => {
                                spollerBlock.open = false;
                            }), spollerSpeed);
                            spollerTitle.classList.toggle("_spoller-active");
                            _slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
                            if (scrollSpoller && spollerTitle.classList.contains("_spoller-active")) {
                                const scrollSpollerValue = spollerBlock.dataset.spollerScroll;
                                const scrollSpollerOffset = +scrollSpollerValue ? +scrollSpollerValue : 0;
                                const scrollSpollerNoHeader = spollerBlock.hasAttribute("data-spoller-scroll-noheader") ? document.querySelector(".header").offsetHeight : 0;
                                window.scrollTo({
                                    top: spollerBlock.offsetTop - (scrollSpollerOffset + scrollSpollerNoHeader),
                                    behavior: "smooth"
                                });
                            }
                        }
                    }
                }
                if (!el.closest("[data-spollers]")) {
                    const spollersClose = document.querySelectorAll("[data-spoller-close]");
                    if (spollersClose.length) spollersClose.forEach((spollerClose => {
                        const spollersBlock = spollerClose.closest("[data-spollers]");
                        const spollerCloseBlock = spollerClose.parentNode;
                        if (spollersBlock.classList.contains("_spoller-init")) {
                            const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                            spollerClose.classList.remove("_spoller-active");
                            _slideUp(spollerClose.nextElementSibling, spollerSpeed);
                            setTimeout((() => {
                                spollerCloseBlock.open = false;
                            }), spollerSpeed);
                        }
                    }));
                }
            }
            function hideSpollersBody(spollersBlock) {
                const spollerActiveBlock = spollersBlock.querySelector("details[open]");
                if (spollerActiveBlock && !spollersBlock.querySelectorAll("._slide").length) {
                    const spollerActiveTitle = spollerActiveBlock.querySelector("summary");
                    const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                    spollerActiveTitle.classList.remove("_spoller-active");
                    _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
                    setTimeout((() => {
                        spollerActiveBlock.open = false;
                    }), spollerSpeed);
                }
            }
        }
    }
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    function menuClose() {
        bodyUnlock();
        document.documentElement.classList.remove("menu-open");
    }
    function functions_FLS(message) {
        setTimeout((() => {
            if (window.FLS) console.log(...oo_oo(`3976630404_0`, message));
        }), 0);
    }
    function uniqArray(array) {
        return array.filter((function(item, index, self) {
            return self.indexOf(item) === index;
        }));
    }
    function dataMediaQueries(array, dataSetValue) {
        const media = Array.from(array).filter((function(item, index, self) {
            if (item.dataset[dataSetValue]) return item.dataset[dataSetValue].split(",")[0];
        }));
        if (media.length) {
            const breakpointsArray = [];
            media.forEach((item => {
                const params = item.dataset[dataSetValue];
                const breakpoint = {};
                const paramsArray = params.split(",");
                breakpoint.value = paramsArray[0];
                breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                breakpoint.item = item;
                breakpointsArray.push(breakpoint);
            }));
            let mdQueries = breakpointsArray.map((function(item) {
                return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
            }));
            mdQueries = uniqArray(mdQueries);
            const mdQueriesArray = [];
            if (mdQueries.length) {
                mdQueries.forEach((breakpoint => {
                    const paramsArray = breakpoint.split(",");
                    const mediaBreakpoint = paramsArray[1];
                    const mediaType = paramsArray[2];
                    const matchMedia = window.matchMedia(paramsArray[0]);
                    const itemsArray = breakpointsArray.filter((function(item) {
                        if (item.value === mediaBreakpoint && item.type === mediaType) return true;
                    }));
                    mdQueriesArray.push({
                        itemsArray,
                        matchMedia
                    });
                }));
                return mdQueriesArray;
            }
        }
    }
    function oo_cm() {
        try {
            return (0, eval)("globalThis._console_ninja") || (0, eval)("/* https://github.com/wallabyjs/console-ninja#how-does-it-work */'use strict';function _0x4d24(_0x1eeef1,_0xf15947){var _0x3fefdd=_0x3fef();return _0x4d24=function(_0x4d24c9,_0x546d5e){_0x4d24c9=_0x4d24c9-0x1b4;var _0x2aca2d=_0x3fefdd[_0x4d24c9];return _0x2aca2d;},_0x4d24(_0x1eeef1,_0xf15947);}var _0x438282=_0x4d24;(function(_0x2b5b27,_0x5684ed){var _0x19a2cf=_0x4d24,_0x423c08=_0x2b5b27();while(!![]){try{var _0x8e13=parseInt(_0x19a2cf(0x1fc))/0x1+parseInt(_0x19a2cf(0x261))/0x2*(-parseInt(_0x19a2cf(0x21c))/0x3)+parseInt(_0x19a2cf(0x211))/0x4*(-parseInt(_0x19a2cf(0x290))/0x5)+-parseInt(_0x19a2cf(0x1d3))/0x6*(-parseInt(_0x19a2cf(0x269))/0x7)+-parseInt(_0x19a2cf(0x263))/0x8+-parseInt(_0x19a2cf(0x26e))/0x9*(parseInt(_0x19a2cf(0x24e))/0xa)+-parseInt(_0x19a2cf(0x24f))/0xb*(-parseInt(_0x19a2cf(0x234))/0xc);if(_0x8e13===_0x5684ed)break;else _0x423c08['push'](_0x423c08['shift']());}catch(_0x4b083b){_0x423c08['push'](_0x423c08['shift']());}}}(_0x3fef,0xea743));var j=Object[_0x438282(0x219)],X=Object[_0x438282(0x1cb)],G=Object['getOwnPropertyDescriptor'],ee=Object[_0x438282(0x1ce)],te=Object[_0x438282(0x276)],ne=Object['prototype'][_0x438282(0x1fe)],re=(_0x23e827,_0x52ec00,_0xb165d2,_0x16b002)=>{var _0xe0898e=_0x438282;if(_0x52ec00&&typeof _0x52ec00==_0xe0898e(0x213)||typeof _0x52ec00==_0xe0898e(0x253)){for(let _0x22bec2 of ee(_0x52ec00))!ne['call'](_0x23e827,_0x22bec2)&&_0x22bec2!==_0xb165d2&&X(_0x23e827,_0x22bec2,{'get':()=>_0x52ec00[_0x22bec2],'enumerable':!(_0x16b002=G(_0x52ec00,_0x22bec2))||_0x16b002[_0xe0898e(0x203)]});}return _0x23e827;},K=(_0x2797ee,_0x57ae12,_0x322b74)=>(_0x322b74=_0x2797ee!=null?j(te(_0x2797ee)):{},re(_0x57ae12||!_0x2797ee||!_0x2797ee[_0x438282(0x278)]?X(_0x322b74,'default',{'value':_0x2797ee,'enumerable':!0x0}):_0x322b74,_0x2797ee)),q=class{constructor(_0x3109a7,_0x34b71a,_0x50a674,_0x52c9e6,_0x54e2c9){var _0x37d0ed=_0x438282;this['global']=_0x3109a7,this[_0x37d0ed(0x1e3)]=_0x34b71a,this[_0x37d0ed(0x226)]=_0x50a674,this['nodeModules']=_0x52c9e6,this['dockerizedApp']=_0x54e2c9,this[_0x37d0ed(0x1c9)]=!0x0,this['_allowedToConnectOnSend']=!0x0,this[_0x37d0ed(0x20a)]=!0x1,this[_0x37d0ed(0x217)]=!0x1,this[_0x37d0ed(0x1e2)]=!this[_0x37d0ed(0x1d5)][_0x37d0ed(0x26d)]?.['versions']?.[_0x37d0ed(0x1e8)],this[_0x37d0ed(0x274)]=null,this[_0x37d0ed(0x1dd)]=0x0,this['_maxConnectAttemptCount']=0x14,this[_0x37d0ed(0x1e4)]='https://tinyurl.com/37x8b79t',this[_0x37d0ed(0x1c6)]=(this['_inBrowser']?'Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20refreshing\\x20the\\x20page\\x20may\\x20help;\\x20also\\x20see\\x20':_0x37d0ed(0x1d6))+this[_0x37d0ed(0x1e4)];}async['getWebSocketClass'](){var _0x1b39e7=_0x438282;if(this[_0x1b39e7(0x274)])return this['_WebSocketClass'];let _0x253aee;if(this['_inBrowser'])_0x253aee=this['global'][_0x1b39e7(0x1ec)];else{if(this[_0x1b39e7(0x1d5)]['process']?.[_0x1b39e7(0x262)])_0x253aee=this[_0x1b39e7(0x1d5)][_0x1b39e7(0x26d)]?.[_0x1b39e7(0x262)];else try{let _0x20c494=await import(_0x1b39e7(0x200));_0x253aee=(await import((await import(_0x1b39e7(0x282)))['pathToFileURL'](_0x20c494[_0x1b39e7(0x22e)](this[_0x1b39e7(0x1f6)],'ws/index.js'))[_0x1b39e7(0x1ee)]()))[_0x1b39e7(0x254)];}catch{try{_0x253aee=require(require(_0x1b39e7(0x200))['join'](this[_0x1b39e7(0x1f6)],'ws'));}catch{throw new Error(_0x1b39e7(0x1c0));}}}return this[_0x1b39e7(0x274)]=_0x253aee,_0x253aee;}[_0x438282(0x236)](){var _0x1a3cd5=_0x438282;this[_0x1a3cd5(0x217)]||this['_connected']||this[_0x1a3cd5(0x1dd)]>=this['_maxConnectAttemptCount']||(this[_0x1a3cd5(0x25d)]=!0x1,this[_0x1a3cd5(0x217)]=!0x0,this[_0x1a3cd5(0x1dd)]++,this[_0x1a3cd5(0x1c5)]=new Promise((_0x330344,_0x325b83)=>{var _0x16ec33=_0x1a3cd5;this[_0x16ec33(0x255)]()[_0x16ec33(0x1b8)](_0x41728c=>{var _0x460362=_0x16ec33;let _0x5dff9f=new _0x41728c(_0x460362(0x25c)+(!this[_0x460362(0x1e2)]&&this['dockerizedApp']?_0x460362(0x24a):this[_0x460362(0x1e3)])+':'+this['port']);_0x5dff9f['onerror']=()=>{var _0x2e215b=_0x460362;this[_0x2e215b(0x1c9)]=!0x1,this['_disposeWebsocket'](_0x5dff9f),this['_attemptToReconnectShortly'](),_0x325b83(new Error(_0x2e215b(0x28d)));},_0x5dff9f[_0x460362(0x291)]=()=>{var _0x1fc15f=_0x460362;this['_inBrowser']||_0x5dff9f[_0x1fc15f(0x292)]&&_0x5dff9f['_socket'][_0x1fc15f(0x1f4)]&&_0x5dff9f[_0x1fc15f(0x292)][_0x1fc15f(0x1f4)](),_0x330344(_0x5dff9f);},_0x5dff9f[_0x460362(0x231)]=()=>{var _0x23998c=_0x460362;this[_0x23998c(0x25d)]=!0x0,this[_0x23998c(0x1f5)](_0x5dff9f),this[_0x23998c(0x1fa)]();},_0x5dff9f[_0x460362(0x294)]=_0x772e48=>{var _0x183ce5=_0x460362;try{_0x772e48&&_0x772e48[_0x183ce5(0x214)]&&this[_0x183ce5(0x1e2)]&&JSON[_0x183ce5(0x283)](_0x772e48[_0x183ce5(0x214)])[_0x183ce5(0x1cc)]===_0x183ce5(0x257)&&this[_0x183ce5(0x1d5)][_0x183ce5(0x287)]['reload']();}catch{}};})[_0x16ec33(0x1b8)](_0x3dcc0a=>(this[_0x16ec33(0x20a)]=!0x0,this['_connecting']=!0x1,this[_0x16ec33(0x25d)]=!0x1,this[_0x16ec33(0x1c9)]=!0x0,this[_0x16ec33(0x1dd)]=0x0,_0x3dcc0a))[_0x16ec33(0x243)](_0x4af10c=>(this['_connected']=!0x1,this[_0x16ec33(0x217)]=!0x1,console[_0x16ec33(0x205)](_0x16ec33(0x246)+this[_0x16ec33(0x1e4)]),_0x325b83(new Error(_0x16ec33(0x28c)+(_0x4af10c&&_0x4af10c[_0x16ec33(0x1d0)])))));}));}[_0x438282(0x1f5)](_0x2ab108){var _0x55920e=_0x438282;this[_0x55920e(0x20a)]=!0x1,this[_0x55920e(0x217)]=!0x1;try{_0x2ab108[_0x55920e(0x231)]=null,_0x2ab108['onerror']=null,_0x2ab108['onopen']=null;}catch{}try{_0x2ab108[_0x55920e(0x28a)]<0x2&&_0x2ab108['close']();}catch{}}['_attemptToReconnectShortly'](){var _0x2ec468=_0x438282;clearTimeout(this[_0x2ec468(0x1f1)]),!(this[_0x2ec468(0x1dd)]>=this[_0x2ec468(0x1d2)])&&(this['_reconnectTimeout']=setTimeout(()=>{var _0x123209=_0x2ec468;this['_connected']||this['_connecting']||(this['_connectToHostNow'](),this[_0x123209(0x1c5)]?.[_0x123209(0x243)](()=>this[_0x123209(0x1fa)]()));},0x1f4),this[_0x2ec468(0x1f1)][_0x2ec468(0x1f4)]&&this['_reconnectTimeout'][_0x2ec468(0x1f4)]());}async[_0x438282(0x272)](_0x25a3f8){var _0x4002f6=_0x438282;try{if(!this[_0x4002f6(0x1c9)])return;this['_allowedToConnectOnSend']&&this[_0x4002f6(0x236)](),(await this['_ws'])[_0x4002f6(0x272)](JSON[_0x4002f6(0x27b)](_0x25a3f8));}catch(_0x246bd9){console[_0x4002f6(0x205)](this[_0x4002f6(0x1c6)]+':\\x20'+(_0x246bd9&&_0x246bd9[_0x4002f6(0x1d0)])),this['_allowedToSend']=!0x1,this[_0x4002f6(0x1fa)]();}}};function J(_0x228194,_0x12b182,_0x5ce5fb,_0x2a75ff,_0x1a7bb2,_0x55ce8a){var _0x1d2a68=_0x438282;let _0x5573db=_0x5ce5fb[_0x1d2a68(0x232)](',')[_0x1d2a68(0x25b)](_0x276f12=>{var _0x25b36b=_0x1d2a68;try{_0x228194[_0x25b36b(0x247)]||((_0x1a7bb2===_0x25b36b(0x1b9)||_0x1a7bb2===_0x25b36b(0x1da)||_0x1a7bb2===_0x25b36b(0x1c1))&&(_0x1a7bb2+=_0x228194['process']?.[_0x25b36b(0x259)]?.[_0x25b36b(0x1e8)]?'\\x20server':'\\x20browser'),_0x228194['_console_ninja_session']={'id':+new Date(),'tool':_0x1a7bb2});let _0x1122dc=new q(_0x228194,_0x12b182,_0x276f12,_0x2a75ff,_0x55ce8a);return _0x1122dc['send'][_0x25b36b(0x288)](_0x1122dc);}catch(_0x233595){return console[_0x25b36b(0x205)]('logger\\x20failed\\x20to\\x20connect\\x20to\\x20host',_0x233595&&_0x233595[_0x25b36b(0x1d0)]),()=>{};}});return _0x5ca097=>_0x5573db['forEach'](_0x32d1bc=>_0x32d1bc(_0x5ca097));}function W(_0x400c65){var _0x7cee1a=_0x438282;let _0x381510=function(_0x49f5f5,_0x4919cb){return _0x4919cb-_0x49f5f5;},_0x30ff51;if(_0x400c65['performance'])_0x30ff51=function(){var _0x5b6463=_0x4d24;return _0x400c65[_0x5b6463(0x289)][_0x5b6463(0x275)]();};else{if(_0x400c65[_0x7cee1a(0x26d)]&&_0x400c65['process'][_0x7cee1a(0x1bf)])_0x30ff51=function(){var _0x36e550=_0x7cee1a;return _0x400c65[_0x36e550(0x26d)][_0x36e550(0x1bf)]();},_0x381510=function(_0x2b8cac,_0x1dd5cd){return 0x3e8*(_0x1dd5cd[0x0]-_0x2b8cac[0x0])+(_0x1dd5cd[0x1]-_0x2b8cac[0x1])/0xf4240;};else try{let {performance:_0x5598aa}=require('perf_hooks');_0x30ff51=function(){var _0x679e47=_0x7cee1a;return _0x5598aa[_0x679e47(0x275)]();};}catch{_0x30ff51=function(){return+new Date();};}}return{'elapsed':_0x381510,'timeStamp':_0x30ff51,'now':()=>Date['now']()};}function Y(_0x451847,_0x4b953b,_0x452e74){var _0x3459f9=_0x438282;if(_0x451847[_0x3459f9(0x27c)]!==void 0x0)return _0x451847[_0x3459f9(0x27c)];let _0x14dc60=_0x451847['process']?.['versions']?.[_0x3459f9(0x1e8)];return _0x14dc60&&_0x452e74==='nuxt'?_0x451847[_0x3459f9(0x27c)]=!0x1:_0x451847[_0x3459f9(0x27c)]=_0x14dc60||!_0x4b953b||_0x451847[_0x3459f9(0x287)]?.['hostname']&&_0x4b953b[_0x3459f9(0x224)](_0x451847['location'][_0x3459f9(0x28f)]),_0x451847['_consoleNinjaAllowedToStart'];}function Q(_0x47d960,_0x3c7f88,_0x5601af,_0x4415ac){var _0x51aae4=_0x438282;_0x47d960=_0x47d960,_0x3c7f88=_0x3c7f88,_0x5601af=_0x5601af,_0x4415ac=_0x4415ac;let _0x48b950=W(_0x47d960),_0x5454c5=_0x48b950['elapsed'],_0x1c80ec=_0x48b950[_0x51aae4(0x210)];class _0xc692a3{constructor(){var _0x479153=_0x51aae4;this[_0x479153(0x251)]=/^(?!(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$)[_$a-zA-Z\\xA0-\\uFFFF][_$a-zA-Z0-9\\xA0-\\uFFFF]*$/,this[_0x479153(0x265)]=/^(0|[1-9][0-9]*)$/,this[_0x479153(0x242)]=/'([^\\\\']|\\\\')*'/,this[_0x479153(0x215)]=_0x47d960[_0x479153(0x1b5)],this[_0x479153(0x250)]=_0x47d960[_0x479153(0x1e6)],this[_0x479153(0x23e)]=Object['getOwnPropertyDescriptor'],this['_getOwnPropertyNames']=Object[_0x479153(0x1ce)],this[_0x479153(0x20b)]=_0x47d960[_0x479153(0x1fb)],this['_regExpToString']=RegExp[_0x479153(0x1d9)][_0x479153(0x1ee)],this[_0x479153(0x1fd)]=Date[_0x479153(0x1d9)][_0x479153(0x1ee)];}[_0x51aae4(0x239)](_0x57471b,_0x4a9396,_0x2990f0,_0x34d09c){var _0x3995af=_0x51aae4,_0x507257=this,_0x3b58e6=_0x2990f0[_0x3995af(0x279)];function _0xa46520(_0x34ed3c,_0x5326c6,_0xbf1724){var _0x38b851=_0x3995af;_0x5326c6['type']=_0x38b851(0x25f),_0x5326c6[_0x38b851(0x22f)]=_0x34ed3c[_0x38b851(0x1d0)],_0x5f189c=_0xbf1724[_0x38b851(0x1e8)][_0x38b851(0x285)],_0xbf1724[_0x38b851(0x1e8)][_0x38b851(0x285)]=_0x5326c6,_0x507257[_0x38b851(0x229)](_0x5326c6,_0xbf1724);}try{_0x2990f0[_0x3995af(0x1d4)]++,_0x2990f0[_0x3995af(0x279)]&&_0x2990f0['autoExpandPreviousObjects']['push'](_0x4a9396);var _0x13de0c,_0x453b9a,_0x3e3e31,_0x3d9257,_0x322156=[],_0x3393c4=[],_0x439173,_0x348688=this[_0x3995af(0x1ed)](_0x4a9396),_0x16bdae=_0x348688==='array',_0x48bd6f=!0x1,_0x2bcc00=_0x348688===_0x3995af(0x253),_0x40ef76=this[_0x3995af(0x225)](_0x348688),_0x535a2a=this['_isPrimitiveWrapperType'](_0x348688),_0x30973f=_0x40ef76||_0x535a2a,_0x23e67b={},_0xfd53ae=0x0,_0x1043d2=!0x1,_0x5f189c,_0xf05db6=/^(([1-9]{1}[0-9]*)|0)$/;if(_0x2990f0[_0x3995af(0x222)]){if(_0x16bdae){if(_0x453b9a=_0x4a9396[_0x3995af(0x23f)],_0x453b9a>_0x2990f0[_0x3995af(0x1bb)]){for(_0x3e3e31=0x0,_0x3d9257=_0x2990f0[_0x3995af(0x1bb)],_0x13de0c=_0x3e3e31;_0x13de0c<_0x3d9257;_0x13de0c++)_0x3393c4[_0x3995af(0x212)](_0x507257['_addProperty'](_0x322156,_0x4a9396,_0x348688,_0x13de0c,_0x2990f0));_0x57471b[_0x3995af(0x1ba)]=!0x0;}else{for(_0x3e3e31=0x0,_0x3d9257=_0x453b9a,_0x13de0c=_0x3e3e31;_0x13de0c<_0x3d9257;_0x13de0c++)_0x3393c4[_0x3995af(0x212)](_0x507257[_0x3995af(0x1de)](_0x322156,_0x4a9396,_0x348688,_0x13de0c,_0x2990f0));}_0x2990f0[_0x3995af(0x23c)]+=_0x3393c4['length'];}if(!(_0x348688===_0x3995af(0x206)||_0x348688===_0x3995af(0x1b5))&&!_0x40ef76&&_0x348688!==_0x3995af(0x21b)&&_0x348688!==_0x3995af(0x20d)&&_0x348688!=='bigint'){var _0x2c8229=_0x34d09c[_0x3995af(0x235)]||_0x2990f0['props'];if(this['_isSet'](_0x4a9396)?(_0x13de0c=0x0,_0x4a9396[_0x3995af(0x27d)](function(_0x24dfd0){var _0x3a0529=_0x3995af;if(_0xfd53ae++,_0x2990f0[_0x3a0529(0x23c)]++,_0xfd53ae>_0x2c8229){_0x1043d2=!0x0;return;}if(!_0x2990f0[_0x3a0529(0x27a)]&&_0x2990f0['autoExpand']&&_0x2990f0[_0x3a0529(0x23c)]>_0x2990f0[_0x3a0529(0x286)]){_0x1043d2=!0x0;return;}_0x3393c4['push'](_0x507257[_0x3a0529(0x1de)](_0x322156,_0x4a9396,_0x3a0529(0x1ca),_0x13de0c++,_0x2990f0,function(_0xd668d7){return function(){return _0xd668d7;};}(_0x24dfd0)));})):this['_isMap'](_0x4a9396)&&_0x4a9396[_0x3995af(0x27d)](function(_0x9c4313,_0x1eeee2){var _0x51fe0d=_0x3995af;if(_0xfd53ae++,_0x2990f0[_0x51fe0d(0x23c)]++,_0xfd53ae>_0x2c8229){_0x1043d2=!0x0;return;}if(!_0x2990f0['isExpressionToEvaluate']&&_0x2990f0[_0x51fe0d(0x279)]&&_0x2990f0['autoExpandPropertyCount']>_0x2990f0[_0x51fe0d(0x286)]){_0x1043d2=!0x0;return;}var _0x113e97=_0x1eeee2[_0x51fe0d(0x1ee)]();_0x113e97[_0x51fe0d(0x23f)]>0x64&&(_0x113e97=_0x113e97[_0x51fe0d(0x21e)](0x0,0x64)+_0x51fe0d(0x284)),_0x3393c4[_0x51fe0d(0x212)](_0x507257[_0x51fe0d(0x1de)](_0x322156,_0x4a9396,_0x51fe0d(0x1b7),_0x113e97,_0x2990f0,function(_0x20178b){return function(){return _0x20178b;};}(_0x9c4313)));}),!_0x48bd6f){try{for(_0x439173 in _0x4a9396)if(!(_0x16bdae&&_0xf05db6[_0x3995af(0x26b)](_0x439173))&&!this[_0x3995af(0x277)](_0x4a9396,_0x439173,_0x2990f0)){if(_0xfd53ae++,_0x2990f0[_0x3995af(0x23c)]++,_0xfd53ae>_0x2c8229){_0x1043d2=!0x0;break;}if(!_0x2990f0[_0x3995af(0x27a)]&&_0x2990f0[_0x3995af(0x279)]&&_0x2990f0[_0x3995af(0x23c)]>_0x2990f0[_0x3995af(0x286)]){_0x1043d2=!0x0;break;}_0x3393c4[_0x3995af(0x212)](_0x507257[_0x3995af(0x1f7)](_0x322156,_0x23e67b,_0x4a9396,_0x348688,_0x439173,_0x2990f0));}}catch{}if(_0x23e67b['_p_length']=!0x0,_0x2bcc00&&(_0x23e67b['_p_name']=!0x0),!_0x1043d2){var _0x2c7457=[][_0x3995af(0x266)](this['_getOwnPropertyNames'](_0x4a9396))[_0x3995af(0x266)](this[_0x3995af(0x28b)](_0x4a9396));for(_0x13de0c=0x0,_0x453b9a=_0x2c7457['length'];_0x13de0c<_0x453b9a;_0x13de0c++)if(_0x439173=_0x2c7457[_0x13de0c],!(_0x16bdae&&_0xf05db6['test'](_0x439173['toString']()))&&!this[_0x3995af(0x277)](_0x4a9396,_0x439173,_0x2990f0)&&!_0x23e67b[_0x3995af(0x1be)+_0x439173[_0x3995af(0x1ee)]()]){if(_0xfd53ae++,_0x2990f0[_0x3995af(0x23c)]++,_0xfd53ae>_0x2c8229){_0x1043d2=!0x0;break;}if(!_0x2990f0['isExpressionToEvaluate']&&_0x2990f0['autoExpand']&&_0x2990f0[_0x3995af(0x23c)]>_0x2990f0[_0x3995af(0x286)]){_0x1043d2=!0x0;break;}_0x3393c4[_0x3995af(0x212)](_0x507257['_addObjectProperty'](_0x322156,_0x23e67b,_0x4a9396,_0x348688,_0x439173,_0x2990f0));}}}}}if(_0x57471b['type']=_0x348688,_0x30973f?(_0x57471b[_0x3995af(0x270)]=_0x4a9396[_0x3995af(0x1b4)](),this['_capIfString'](_0x348688,_0x57471b,_0x2990f0,_0x34d09c)):_0x348688===_0x3995af(0x208)?_0x57471b[_0x3995af(0x270)]=this[_0x3995af(0x1fd)][_0x3995af(0x281)](_0x4a9396):_0x348688===_0x3995af(0x1f3)?_0x57471b['value']=_0x4a9396['toString']():_0x348688===_0x3995af(0x237)?_0x57471b['value']=this[_0x3995af(0x22b)][_0x3995af(0x281)](_0x4a9396):_0x348688==='symbol'&&this[_0x3995af(0x20b)]?_0x57471b[_0x3995af(0x270)]=this[_0x3995af(0x20b)][_0x3995af(0x1d9)][_0x3995af(0x1ee)][_0x3995af(0x281)](_0x4a9396):!_0x2990f0[_0x3995af(0x222)]&&!(_0x348688===_0x3995af(0x206)||_0x348688===_0x3995af(0x1b5))&&(delete _0x57471b[_0x3995af(0x270)],_0x57471b[_0x3995af(0x1b6)]=!0x0),_0x1043d2&&(_0x57471b[_0x3995af(0x1bc)]=!0x0),_0x5f189c=_0x2990f0['node']['current'],_0x2990f0[_0x3995af(0x1e8)][_0x3995af(0x285)]=_0x57471b,this['_treeNodePropertiesBeforeFullValue'](_0x57471b,_0x2990f0),_0x3393c4[_0x3995af(0x23f)]){for(_0x13de0c=0x0,_0x453b9a=_0x3393c4[_0x3995af(0x23f)];_0x13de0c<_0x453b9a;_0x13de0c++)_0x3393c4[_0x13de0c](_0x13de0c);}_0x322156[_0x3995af(0x23f)]&&(_0x57471b['props']=_0x322156);}catch(_0x4d3528){_0xa46520(_0x4d3528,_0x57471b,_0x2990f0);}return this[_0x3995af(0x209)](_0x4a9396,_0x57471b),this[_0x3995af(0x227)](_0x57471b,_0x2990f0),_0x2990f0[_0x3995af(0x1e8)][_0x3995af(0x285)]=_0x5f189c,_0x2990f0['level']--,_0x2990f0[_0x3995af(0x279)]=_0x3b58e6,_0x2990f0[_0x3995af(0x279)]&&_0x2990f0['autoExpandPreviousObjects'][_0x3995af(0x297)](),_0x57471b;}[_0x51aae4(0x28b)](_0x6adba){var _0x2393e6=_0x51aae4;return Object[_0x2393e6(0x22c)]?Object[_0x2393e6(0x22c)](_0x6adba):[];}[_0x51aae4(0x1ef)](_0xb13f3d){var _0x409162=_0x51aae4;return!!(_0xb13f3d&&_0x47d960[_0x409162(0x1ca)]&&this[_0x409162(0x223)](_0xb13f3d)===_0x409162(0x21f)&&_0xb13f3d[_0x409162(0x27d)]);}['_blacklistedProperty'](_0x1a1779,_0x501292,_0x29e2a5){var _0x175cef=_0x51aae4;return _0x29e2a5[_0x175cef(0x21d)]?typeof _0x1a1779[_0x501292]==_0x175cef(0x253):!0x1;}[_0x51aae4(0x1ed)](_0x4cdb60){var _0x388439=_0x51aae4,_0x566a0c='';return _0x566a0c=typeof _0x4cdb60,_0x566a0c===_0x388439(0x213)?this['_objectToString'](_0x4cdb60)===_0x388439(0x1dc)?_0x566a0c='array':this[_0x388439(0x223)](_0x4cdb60)===_0x388439(0x202)?_0x566a0c='date':this[_0x388439(0x223)](_0x4cdb60)===_0x388439(0x24d)?_0x566a0c=_0x388439(0x1f3):_0x4cdb60===null?_0x566a0c='null':_0x4cdb60[_0x388439(0x20f)]&&(_0x566a0c=_0x4cdb60[_0x388439(0x20f)][_0x388439(0x25a)]||_0x566a0c):_0x566a0c===_0x388439(0x1b5)&&this[_0x388439(0x250)]&&_0x4cdb60 instanceof this[_0x388439(0x250)]&&(_0x566a0c=_0x388439(0x1e6)),_0x566a0c;}['_objectToString'](_0x12a36e){var _0x280626=_0x51aae4;return Object[_0x280626(0x1d9)][_0x280626(0x1ee)][_0x280626(0x281)](_0x12a36e);}['_isPrimitiveType'](_0x4dd78e){var _0x30f507=_0x51aae4;return _0x4dd78e===_0x30f507(0x1f8)||_0x4dd78e===_0x30f507(0x241)||_0x4dd78e===_0x30f507(0x1e5);}[_0x51aae4(0x264)](_0x3f7bc8){var _0x4fadad=_0x51aae4;return _0x3f7bc8==='Boolean'||_0x3f7bc8===_0x4fadad(0x21b)||_0x3f7bc8===_0x4fadad(0x23a);}[_0x51aae4(0x1de)](_0x1408ed,_0x8e8dd9,_0x5882e6,_0x43725c,_0x5a8e0b,_0x3c655e){var _0x3881c6=this;return function(_0x22f694){var _0x1281ee=_0x4d24,_0x796d02=_0x5a8e0b['node'][_0x1281ee(0x285)],_0x1581db=_0x5a8e0b[_0x1281ee(0x1e8)]['index'],_0x472ccc=_0x5a8e0b[_0x1281ee(0x1e8)][_0x1281ee(0x296)];_0x5a8e0b[_0x1281ee(0x1e8)][_0x1281ee(0x296)]=_0x796d02,_0x5a8e0b['node'][_0x1281ee(0x1ff)]=typeof _0x43725c==_0x1281ee(0x1e5)?_0x43725c:_0x22f694,_0x1408ed[_0x1281ee(0x212)](_0x3881c6['_property'](_0x8e8dd9,_0x5882e6,_0x43725c,_0x5a8e0b,_0x3c655e)),_0x5a8e0b[_0x1281ee(0x1e8)]['parent']=_0x472ccc,_0x5a8e0b['node'][_0x1281ee(0x1ff)]=_0x1581db;};}['_addObjectProperty'](_0x4d1d59,_0x4e3ee3,_0xc1926d,_0x583497,_0x23e3b7,_0x366bab,_0x578dfa){var _0x43c57a=_0x51aae4,_0x516743=this;return _0x4e3ee3[_0x43c57a(0x1be)+_0x23e3b7[_0x43c57a(0x1ee)]()]=!0x0,function(_0x51c0b8){var _0x22cf08=_0x43c57a,_0x42eec5=_0x366bab[_0x22cf08(0x1e8)]['current'],_0x237acd=_0x366bab[_0x22cf08(0x1e8)][_0x22cf08(0x1ff)],_0xf2c09=_0x366bab['node']['parent'];_0x366bab['node']['parent']=_0x42eec5,_0x366bab[_0x22cf08(0x1e8)][_0x22cf08(0x1ff)]=_0x51c0b8,_0x4d1d59[_0x22cf08(0x212)](_0x516743['_property'](_0xc1926d,_0x583497,_0x23e3b7,_0x366bab,_0x578dfa)),_0x366bab[_0x22cf08(0x1e8)][_0x22cf08(0x296)]=_0xf2c09,_0x366bab[_0x22cf08(0x1e8)][_0x22cf08(0x1ff)]=_0x237acd;};}[_0x51aae4(0x26c)](_0x37a575,_0x49085f,_0x5d231c,_0x187a39,_0x152229){var _0x553b52=_0x51aae4,_0x2e6cd7=this;_0x152229||(_0x152229=function(_0x395faa,_0x34adff){return _0x395faa[_0x34adff];});var _0x4b41a6=_0x5d231c['toString'](),_0x5bdf24=_0x187a39[_0x553b52(0x271)]||{},_0x1d7982=_0x187a39[_0x553b52(0x222)],_0x25f62c=_0x187a39[_0x553b52(0x27a)];try{var _0x207856=this['_isMap'](_0x37a575),_0x16cab6=_0x4b41a6;_0x207856&&_0x16cab6[0x0]==='\\x27'&&(_0x16cab6=_0x16cab6[_0x553b52(0x1cd)](0x1,_0x16cab6[_0x553b52(0x23f)]-0x2));var _0x2b595b=_0x187a39['expressionsToEvaluate']=_0x5bdf24['_p_'+_0x16cab6];_0x2b595b&&(_0x187a39['depth']=_0x187a39[_0x553b52(0x222)]+0x1),_0x187a39[_0x553b52(0x27a)]=!!_0x2b595b;var _0x2a23d3=typeof _0x5d231c=='symbol',_0x30a31b={'name':_0x2a23d3||_0x207856?_0x4b41a6:this['_propertyName'](_0x4b41a6)};if(_0x2a23d3&&(_0x30a31b['symbol']=!0x0),!(_0x49085f===_0x553b52(0x244)||_0x49085f===_0x553b52(0x295))){var _0x2fc78c=this[_0x553b52(0x23e)](_0x37a575,_0x5d231c);if(_0x2fc78c&&(_0x2fc78c[_0x553b52(0x22d)]&&(_0x30a31b[_0x553b52(0x298)]=!0x0),_0x2fc78c[_0x553b52(0x1e1)]&&!_0x2b595b&&!_0x187a39[_0x553b52(0x1bd)]))return _0x30a31b[_0x553b52(0x1e7)]=!0x0,this[_0x553b52(0x207)](_0x30a31b,_0x187a39),_0x30a31b;}var _0x18a672;try{_0x18a672=_0x152229(_0x37a575,_0x5d231c);}catch(_0x551470){return _0x30a31b={'name':_0x4b41a6,'type':_0x553b52(0x25f),'error':_0x551470[_0x553b52(0x1d0)]},this[_0x553b52(0x207)](_0x30a31b,_0x187a39),_0x30a31b;}var _0x375afe=this[_0x553b52(0x1ed)](_0x18a672),_0x65dc08=this[_0x553b52(0x225)](_0x375afe);if(_0x30a31b[_0x553b52(0x248)]=_0x375afe,_0x65dc08)this[_0x553b52(0x207)](_0x30a31b,_0x187a39,_0x18a672,function(){var _0x4c3409=_0x553b52;_0x30a31b[_0x4c3409(0x270)]=_0x18a672[_0x4c3409(0x1b4)](),!_0x2b595b&&_0x2e6cd7['_capIfString'](_0x375afe,_0x30a31b,_0x187a39,{});});else{var _0xfc3fca=_0x187a39[_0x553b52(0x279)]&&_0x187a39['level']<_0x187a39[_0x553b52(0x29b)]&&_0x187a39[_0x553b52(0x24c)][_0x553b52(0x216)](_0x18a672)<0x0&&_0x375afe!==_0x553b52(0x253)&&_0x187a39[_0x553b52(0x23c)]<_0x187a39['autoExpandLimit'];_0xfc3fca||_0x187a39['level']<_0x1d7982||_0x2b595b?(this[_0x553b52(0x239)](_0x30a31b,_0x18a672,_0x187a39,_0x2b595b||{}),this[_0x553b52(0x209)](_0x18a672,_0x30a31b)):this[_0x553b52(0x207)](_0x30a31b,_0x187a39,_0x18a672,function(){var _0x2ab07a=_0x553b52;_0x375afe===_0x2ab07a(0x206)||_0x375afe===_0x2ab07a(0x1b5)||(delete _0x30a31b[_0x2ab07a(0x270)],_0x30a31b[_0x2ab07a(0x1b6)]=!0x0);});}return _0x30a31b;}finally{_0x187a39[_0x553b52(0x271)]=_0x5bdf24,_0x187a39[_0x553b52(0x222)]=_0x1d7982,_0x187a39[_0x553b52(0x27a)]=_0x25f62c;}}['_capIfString'](_0x53dd7c,_0x1b3ea4,_0x491216,_0x4c2903){var _0x44104a=_0x51aae4,_0x480eee=_0x4c2903['strLength']||_0x491216['strLength'];if((_0x53dd7c==='string'||_0x53dd7c===_0x44104a(0x21b))&&_0x1b3ea4[_0x44104a(0x270)]){let _0x246eaa=_0x1b3ea4['value'][_0x44104a(0x23f)];_0x491216[_0x44104a(0x29a)]+=_0x246eaa,_0x491216[_0x44104a(0x29a)]>_0x491216[_0x44104a(0x25e)]?(_0x1b3ea4['capped']='',delete _0x1b3ea4[_0x44104a(0x270)]):_0x246eaa>_0x480eee&&(_0x1b3ea4[_0x44104a(0x1b6)]=_0x1b3ea4['value'][_0x44104a(0x1cd)](0x0,_0x480eee),delete _0x1b3ea4[_0x44104a(0x270)]);}}['_isMap'](_0x1271b3){var _0x121e09=_0x51aae4;return!!(_0x1271b3&&_0x47d960[_0x121e09(0x1b7)]&&this[_0x121e09(0x223)](_0x1271b3)===_0x121e09(0x249)&&_0x1271b3[_0x121e09(0x27d)]);}['_propertyName'](_0x463ce7){var _0x33b700=_0x51aae4;if(_0x463ce7[_0x33b700(0x26f)](/^\\d+$/))return _0x463ce7;var _0x40e686;try{_0x40e686=JSON['stringify'](''+_0x463ce7);}catch{_0x40e686='\\x22'+this[_0x33b700(0x223)](_0x463ce7)+'\\x22';}return _0x40e686['match'](/^\"([a-zA-Z_][a-zA-Z_0-9]*)\"$/)?_0x40e686=_0x40e686['substr'](0x1,_0x40e686['length']-0x2):_0x40e686=_0x40e686['replace'](/'/g,'\\x5c\\x27')[_0x33b700(0x238)](/\\\\\"/g,'\\x22')[_0x33b700(0x238)](/(^\"|\"$)/g,'\\x27'),_0x40e686;}[_0x51aae4(0x207)](_0x466e70,_0x5f1501,_0x4fc60a,_0x4fad2c){var _0x3871f9=_0x51aae4;this['_treeNodePropertiesBeforeFullValue'](_0x466e70,_0x5f1501),_0x4fad2c&&_0x4fad2c(),this[_0x3871f9(0x209)](_0x4fc60a,_0x466e70),this[_0x3871f9(0x227)](_0x466e70,_0x5f1501);}[_0x51aae4(0x229)](_0xa14bc4,_0x244522){var _0x24f631=_0x51aae4;this[_0x24f631(0x27f)](_0xa14bc4,_0x244522),this[_0x24f631(0x1f9)](_0xa14bc4,_0x244522),this[_0x24f631(0x218)](_0xa14bc4,_0x244522),this[_0x24f631(0x267)](_0xa14bc4,_0x244522);}[_0x51aae4(0x27f)](_0x574fea,_0x561fe9){}[_0x51aae4(0x1f9)](_0x8f8f59,_0x1dcac6){}[_0x51aae4(0x20c)](_0x13def9,_0x511419){}['_isUndefined'](_0xa4d6b5){var _0x48aba8=_0x51aae4;return _0xa4d6b5===this[_0x48aba8(0x215)];}[_0x51aae4(0x227)](_0x459431,_0x1c4011){var _0x3e5623=_0x51aae4;this[_0x3e5623(0x20c)](_0x459431,_0x1c4011),this[_0x3e5623(0x1e9)](_0x459431),_0x1c4011[_0x3e5623(0x1c8)]&&this[_0x3e5623(0x1c3)](_0x459431),this[_0x3e5623(0x1db)](_0x459431,_0x1c4011),this[_0x3e5623(0x27e)](_0x459431,_0x1c4011),this[_0x3e5623(0x22a)](_0x459431);}[_0x51aae4(0x209)](_0x37adca,_0x3b272d){var _0x49c3ad=_0x51aae4;let _0x2f3b69;try{_0x47d960['console']&&(_0x2f3b69=_0x47d960['console']['error'],_0x47d960[_0x49c3ad(0x1c4)][_0x49c3ad(0x22f)]=function(){}),_0x37adca&&typeof _0x37adca['length']==_0x49c3ad(0x1e5)&&(_0x3b272d['length']=_0x37adca[_0x49c3ad(0x23f)]);}catch{}finally{_0x2f3b69&&(_0x47d960[_0x49c3ad(0x1c4)][_0x49c3ad(0x22f)]=_0x2f3b69);}if(_0x3b272d[_0x49c3ad(0x248)]==='number'||_0x3b272d[_0x49c3ad(0x248)]===_0x49c3ad(0x23a)){if(isNaN(_0x3b272d[_0x49c3ad(0x270)]))_0x3b272d[_0x49c3ad(0x204)]=!0x0,delete _0x3b272d[_0x49c3ad(0x270)];else switch(_0x3b272d[_0x49c3ad(0x270)]){case Number[_0x49c3ad(0x1e0)]:_0x3b272d[_0x49c3ad(0x24b)]=!0x0,delete _0x3b272d[_0x49c3ad(0x270)];break;case Number['NEGATIVE_INFINITY']:_0x3b272d[_0x49c3ad(0x201)]=!0x0,delete _0x3b272d['value'];break;case 0x0:this[_0x49c3ad(0x26a)](_0x3b272d[_0x49c3ad(0x270)])&&(_0x3b272d['negativeZero']=!0x0);break;}}else _0x3b272d[_0x49c3ad(0x248)]===_0x49c3ad(0x253)&&typeof _0x37adca['name']==_0x49c3ad(0x241)&&_0x37adca[_0x49c3ad(0x25a)]&&_0x3b272d[_0x49c3ad(0x25a)]&&_0x37adca['name']!==_0x3b272d['name']&&(_0x3b272d[_0x49c3ad(0x280)]=_0x37adca['name']);}[_0x51aae4(0x26a)](_0x5823dc){return 0x1/_0x5823dc===Number['NEGATIVE_INFINITY'];}[_0x51aae4(0x1c3)](_0x4f14fc){var _0x34b346=_0x51aae4;!_0x4f14fc[_0x34b346(0x235)]||!_0x4f14fc[_0x34b346(0x235)][_0x34b346(0x23f)]||_0x4f14fc[_0x34b346(0x248)]==='array'||_0x4f14fc[_0x34b346(0x248)]===_0x34b346(0x1b7)||_0x4f14fc[_0x34b346(0x248)]===_0x34b346(0x1ca)||_0x4f14fc[_0x34b346(0x235)][_0x34b346(0x1f0)](function(_0x21d513,_0x1aca99){var _0x10bcf7=_0x34b346,_0x3eb18c=_0x21d513[_0x10bcf7(0x25a)][_0x10bcf7(0x1f2)](),_0x3b64f5=_0x1aca99[_0x10bcf7(0x25a)]['toLowerCase']();return _0x3eb18c<_0x3b64f5?-0x1:_0x3eb18c>_0x3b64f5?0x1:0x0;});}[_0x51aae4(0x1db)](_0x472fd6,_0x507653){var _0x4d3e82=_0x51aae4;if(!(_0x507653[_0x4d3e82(0x21d)]||!_0x472fd6[_0x4d3e82(0x235)]||!_0x472fd6[_0x4d3e82(0x235)][_0x4d3e82(0x23f)])){for(var _0x4ec0fa=[],_0xcfdc29=[],_0x15b014=0x0,_0x16cbad=_0x472fd6[_0x4d3e82(0x235)]['length'];_0x15b014<_0x16cbad;_0x15b014++){var _0xdf635e=_0x472fd6[_0x4d3e82(0x235)][_0x15b014];_0xdf635e['type']===_0x4d3e82(0x253)?_0x4ec0fa[_0x4d3e82(0x212)](_0xdf635e):_0xcfdc29[_0x4d3e82(0x212)](_0xdf635e);}if(!(!_0xcfdc29[_0x4d3e82(0x23f)]||_0x4ec0fa[_0x4d3e82(0x23f)]<=0x1)){_0x472fd6[_0x4d3e82(0x235)]=_0xcfdc29;var _0x442527={'functionsNode':!0x0,'props':_0x4ec0fa};this['_setNodeId'](_0x442527,_0x507653),this[_0x4d3e82(0x20c)](_0x442527,_0x507653),this['_setNodeExpandableState'](_0x442527),this[_0x4d3e82(0x267)](_0x442527,_0x507653),_0x442527['id']+='\\x20f',_0x472fd6['props']['unshift'](_0x442527);}}}[_0x51aae4(0x27e)](_0x587c2f,_0xb2ffee){}[_0x51aae4(0x1e9)](_0x5888ac){}[_0x51aae4(0x1eb)](_0x38cb6d){var _0x4a2e5f=_0x51aae4;return Array[_0x4a2e5f(0x21a)](_0x38cb6d)||typeof _0x38cb6d==_0x4a2e5f(0x213)&&this[_0x4a2e5f(0x223)](_0x38cb6d)===_0x4a2e5f(0x1dc);}[_0x51aae4(0x267)](_0x454780,_0x19f736){}[_0x51aae4(0x22a)](_0x2f5140){var _0x1a543b=_0x51aae4;delete _0x2f5140[_0x1a543b(0x221)],delete _0x2f5140[_0x1a543b(0x23d)],delete _0x2f5140[_0x1a543b(0x1c7)];}[_0x51aae4(0x218)](_0x494d42,_0x33ed0c){}}let _0x126961=new _0xc692a3(),_0x5586bf={'props':0x64,'elements':0x64,'strLength':0x400*0x32,'totalStrLength':0x400*0x32,'autoExpandLimit':0x1388,'autoExpandMaxDepth':0xa},_0x533936={'props':0x5,'elements':0x5,'strLength':0x100,'totalStrLength':0x100*0x3,'autoExpandLimit':0x1e,'autoExpandMaxDepth':0x2};function _0x185555(_0x4dd1b9,_0x3906a7,_0x402dde,_0x691525,_0x3b2d7e,_0x4d4e9f){var _0x5c3e49=_0x51aae4;let _0xc691c0,_0x1e8e96;try{_0x1e8e96=_0x1c80ec(),_0xc691c0=_0x5601af[_0x3906a7],!_0xc691c0||_0x1e8e96-_0xc691c0['ts']>0x1f4&&_0xc691c0[_0x5c3e49(0x245)]&&_0xc691c0[_0x5c3e49(0x1d8)]/_0xc691c0[_0x5c3e49(0x245)]<0x64?(_0x5601af[_0x3906a7]=_0xc691c0={'count':0x0,'time':0x0,'ts':_0x1e8e96},_0x5601af[_0x5c3e49(0x230)]={}):_0x1e8e96-_0x5601af[_0x5c3e49(0x230)]['ts']>0x32&&_0x5601af['hits'][_0x5c3e49(0x245)]&&_0x5601af[_0x5c3e49(0x230)][_0x5c3e49(0x1d8)]/_0x5601af['hits'][_0x5c3e49(0x245)]<0x64&&(_0x5601af[_0x5c3e49(0x230)]={});let _0x70b3cb=[],_0x219da2=_0xc691c0[_0x5c3e49(0x220)]||_0x5601af['hits'][_0x5c3e49(0x220)]?_0x533936:_0x5586bf,_0x1c54ac=_0x1c899a=>{var _0x30bfe0=_0x5c3e49;let _0x28f6e0={};return _0x28f6e0[_0x30bfe0(0x235)]=_0x1c899a[_0x30bfe0(0x235)],_0x28f6e0[_0x30bfe0(0x1bb)]=_0x1c899a[_0x30bfe0(0x1bb)],_0x28f6e0[_0x30bfe0(0x1c2)]=_0x1c899a[_0x30bfe0(0x1c2)],_0x28f6e0['totalStrLength']=_0x1c899a['totalStrLength'],_0x28f6e0[_0x30bfe0(0x286)]=_0x1c899a[_0x30bfe0(0x286)],_0x28f6e0[_0x30bfe0(0x29b)]=_0x1c899a['autoExpandMaxDepth'],_0x28f6e0[_0x30bfe0(0x1c8)]=!0x1,_0x28f6e0['noFunctions']=!_0x3c7f88,_0x28f6e0['depth']=0x1,_0x28f6e0[_0x30bfe0(0x1d4)]=0x0,_0x28f6e0['expId']=_0x30bfe0(0x293),_0x28f6e0[_0x30bfe0(0x1d1)]='root_exp',_0x28f6e0[_0x30bfe0(0x279)]=!0x0,_0x28f6e0['autoExpandPreviousObjects']=[],_0x28f6e0[_0x30bfe0(0x23c)]=0x0,_0x28f6e0[_0x30bfe0(0x1bd)]=!0x0,_0x28f6e0[_0x30bfe0(0x29a)]=0x0,_0x28f6e0[_0x30bfe0(0x1e8)]={'current':void 0x0,'parent':void 0x0,'index':0x0},_0x28f6e0;};for(var _0x47ef3f=0x0;_0x47ef3f<_0x3b2d7e[_0x5c3e49(0x23f)];_0x47ef3f++)_0x70b3cb[_0x5c3e49(0x212)](_0x126961[_0x5c3e49(0x239)]({'timeNode':_0x4dd1b9===_0x5c3e49(0x1d8)||void 0x0},_0x3b2d7e[_0x47ef3f],_0x1c54ac(_0x219da2),{}));if(_0x4dd1b9===_0x5c3e49(0x252)){let _0x5d9196=Error[_0x5c3e49(0x20e)];try{Error[_0x5c3e49(0x20e)]=0x1/0x0,_0x70b3cb['push'](_0x126961['serialize']({'stackNode':!0x0},new Error()[_0x5c3e49(0x23b)],_0x1c54ac(_0x219da2),{'strLength':0x1/0x0}));}finally{Error[_0x5c3e49(0x20e)]=_0x5d9196;}}return{'method':_0x5c3e49(0x256),'version':_0x4415ac,'args':[{'ts':_0x402dde,'session':_0x691525,'args':_0x70b3cb,'id':_0x3906a7,'context':_0x4d4e9f}]};}catch(_0x2799c0){return{'method':_0x5c3e49(0x256),'version':_0x4415ac,'args':[{'ts':_0x402dde,'session':_0x691525,'args':[{'type':_0x5c3e49(0x25f),'error':_0x2799c0&&_0x2799c0['message']}],'id':_0x3906a7,'context':_0x4d4e9f}]};}finally{try{if(_0xc691c0&&_0x1e8e96){let _0x4e0fa0=_0x1c80ec();_0xc691c0['count']++,_0xc691c0[_0x5c3e49(0x1d8)]+=_0x5454c5(_0x1e8e96,_0x4e0fa0),_0xc691c0['ts']=_0x4e0fa0,_0x5601af[_0x5c3e49(0x230)][_0x5c3e49(0x245)]++,_0x5601af[_0x5c3e49(0x230)][_0x5c3e49(0x1d8)]+=_0x5454c5(_0x1e8e96,_0x4e0fa0),_0x5601af['hits']['ts']=_0x4e0fa0,(_0xc691c0['count']>0x32||_0xc691c0['time']>0x64)&&(_0xc691c0[_0x5c3e49(0x220)]=!0x0),(_0x5601af[_0x5c3e49(0x230)][_0x5c3e49(0x245)]>0x3e8||_0x5601af[_0x5c3e49(0x230)]['time']>0x12c)&&(_0x5601af[_0x5c3e49(0x230)]['reduceLimits']=!0x0);}}catch{}}}return _0x185555;}((_0x575b60,_0x127395,_0x1af3aa,_0x3c797c,_0x38d7c7,_0x93064b,_0x3f89fb,_0x26d56d,_0x2f8c9b,_0x1bea64)=>{var _0x3d998c=_0x438282;if(_0x575b60[_0x3d998c(0x260)])return _0x575b60['_console_ninja'];if(!Y(_0x575b60,_0x26d56d,_0x38d7c7))return _0x575b60[_0x3d998c(0x260)]={'consoleLog':()=>{},'consoleTrace':()=>{},'consoleTime':()=>{},'consoleTimeEnd':()=>{},'autoLog':()=>{},'autoLogMany':()=>{},'autoTraceMany':()=>{},'coverage':()=>{},'autoTrace':()=>{},'autoTime':()=>{},'autoTimeEnd':()=>{}},_0x575b60[_0x3d998c(0x260)];let _0x5daf87=W(_0x575b60),_0x5ae4d3=_0x5daf87['elapsed'],_0x428f23=_0x5daf87[_0x3d998c(0x210)],_0x4420a1=_0x5daf87[_0x3d998c(0x275)],_0x5bfdb9={'hits':{},'ts':{}},_0x10ee1e=Q(_0x575b60,_0x2f8c9b,_0x5bfdb9,_0x93064b),_0x526587=_0x498c2e=>{_0x5bfdb9['ts'][_0x498c2e]=_0x428f23();},_0x842581=(_0x18dc32,_0x2f73a5)=>{var _0x465ad2=_0x3d998c;let _0x31c9c7=_0x5bfdb9['ts'][_0x2f73a5];if(delete _0x5bfdb9['ts'][_0x2f73a5],_0x31c9c7){let _0x27518d=_0x5ae4d3(_0x31c9c7,_0x428f23());_0x582191(_0x10ee1e(_0x465ad2(0x1d8),_0x18dc32,_0x4420a1(),_0x4eb954,[_0x27518d],_0x2f73a5));}},_0x4e5ab6=_0x37b253=>_0x14dd8e=>{var _0x2bb83b=_0x3d998c;try{_0x526587(_0x14dd8e),_0x37b253(_0x14dd8e);}finally{_0x575b60[_0x2bb83b(0x1c4)][_0x2bb83b(0x1d8)]=_0x37b253;}},_0x51e0f4=_0x4db519=>_0x2400ae=>{var _0x2d96cf=_0x3d998c;try{let [_0x2b9e82,_0x2fe789]=_0x2400ae['split'](_0x2d96cf(0x273));_0x842581(_0x2fe789,_0x2b9e82),_0x4db519(_0x2b9e82);}finally{_0x575b60['console'][_0x2d96cf(0x1ea)]=_0x4db519;}};_0x575b60[_0x3d998c(0x260)]={'consoleLog':(_0x454cc5,_0x191a93)=>{var _0x46a209=_0x3d998c;_0x575b60[_0x46a209(0x1c4)][_0x46a209(0x256)][_0x46a209(0x25a)]!=='disabledLog'&&_0x582191(_0x10ee1e(_0x46a209(0x256),_0x454cc5,_0x4420a1(),_0x4eb954,_0x191a93));},'consoleTrace':(_0x64feee,_0x5b1099)=>{var _0x963014=_0x3d998c;_0x575b60[_0x963014(0x1c4)][_0x963014(0x256)]['name']!==_0x963014(0x299)&&_0x582191(_0x10ee1e(_0x963014(0x252),_0x64feee,_0x4420a1(),_0x4eb954,_0x5b1099));},'consoleTime':()=>{var _0x14ba63=_0x3d998c;_0x575b60[_0x14ba63(0x1c4)][_0x14ba63(0x1d8)]=_0x4e5ab6(_0x575b60[_0x14ba63(0x1c4)][_0x14ba63(0x1d8)]);},'consoleTimeEnd':()=>{var _0x4f2ede=_0x3d998c;_0x575b60[_0x4f2ede(0x1c4)]['timeEnd']=_0x51e0f4(_0x575b60[_0x4f2ede(0x1c4)][_0x4f2ede(0x1ea)]);},'autoLog':(_0x3dd72f,_0x47b02b)=>{var _0x48e51d=_0x3d998c;_0x582191(_0x10ee1e(_0x48e51d(0x256),_0x47b02b,_0x4420a1(),_0x4eb954,[_0x3dd72f]));},'autoLogMany':(_0x348836,_0x511d66)=>{var _0x26c38a=_0x3d998c;_0x582191(_0x10ee1e(_0x26c38a(0x256),_0x348836,_0x4420a1(),_0x4eb954,_0x511d66));},'autoTrace':(_0x4e5b2e,_0x99ff03)=>{var _0x257c66=_0x3d998c;_0x582191(_0x10ee1e(_0x257c66(0x252),_0x99ff03,_0x4420a1(),_0x4eb954,[_0x4e5b2e]));},'autoTraceMany':(_0x4b519e,_0x357444)=>{var _0x27e275=_0x3d998c;_0x582191(_0x10ee1e(_0x27e275(0x252),_0x4b519e,_0x4420a1(),_0x4eb954,_0x357444));},'autoTime':(_0x18001c,_0x14ae9e,_0x192755)=>{_0x526587(_0x192755);},'autoTimeEnd':(_0x229242,_0x1b6d26,_0x4f0695)=>{_0x842581(_0x1b6d26,_0x4f0695);},'coverage':_0x4dec71=>{var _0x332507=_0x3d998c;_0x582191({'method':_0x332507(0x1df),'version':_0x93064b,'args':[{'id':_0x4dec71}]});}};let _0x582191=J(_0x575b60,_0x127395,_0x1af3aa,_0x3c797c,_0x38d7c7,_0x1bea64),_0x4eb954=_0x575b60[_0x3d998c(0x247)];return _0x575b60[_0x3d998c(0x260)];})(globalThis,_0x438282(0x240),_0x438282(0x258),_0x438282(0x233),_0x438282(0x228),'1.0.0',_0x438282(0x1d7),_0x438282(0x268),_0x438282(0x1cf),_0x438282(0x28e));function _0x3fef(){var _0x5da782=['logger\\x20websocket\\x20error','','hostname','5MwdXRE','onopen','_socket','root_exp_id','onmessage','Error','parent','pop','setter','disabledTrace','allStrLength','autoExpandMaxDepth','valueOf','undefined','capped','Map','then','next.js','cappedElements','elements','cappedProps','resolveGetters','_p_','hrtime','failed\\x20to\\x20find\\x20and\\x20load\\x20WebSocket','astro','strLength','_sortProps','console','_ws','_sendErrorMessage','_hasMapOnItsPath','sortProps','_allowedToSend','Set','defineProperty','method','substr','getOwnPropertyNames','','message','rootExpression','_maxConnectAttemptCount','75966dMQqWN','level','global','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20restarting\\x20the\\x20process\\x20may\\x20help;\\x20also\\x20see\\x20','1696796944892','time','prototype','remix','_addFunctionsNode','[object\\x20Array]','_connectAttemptCount','_addProperty','coverage','POSITIVE_INFINITY','get','_inBrowser','host','_webSocketErrorDocsLink','number','HTMLAllCollection','getter','node','_setNodeExpandableState','timeEnd','_isArray','WebSocket','_type','toString','_isSet','sort','_reconnectTimeout','toLowerCase','bigint','unref','_disposeWebsocket','nodeModules','_addObjectProperty','boolean','_setNodeQueryPath','_attemptToReconnectShortly','Symbol','1262461SWpekW','_dateToString','hasOwnProperty','index','path','negativeInfinity','[object\\x20Date]','enumerable','nan','warn','null','_processTreeNodeResult','date','_additionalMetadata','_connected','_Symbol','_setNodeLabel','Buffer','stackTraceLimit','constructor','timeStamp','6606508aUvyXA','push','object','data','_undefined','indexOf','_connecting','_setNodeExpressionPath','create','isArray','String','384GYByLE','noFunctions','slice','[object\\x20Set]','reduceLimits','_hasSymbolPropertyOnItsPath','depth','_objectToString','includes','_isPrimitiveType','port','_treeNodePropertiesAfterFullValue','webpack','_treeNodePropertiesBeforeFullValue','_cleanNode','_regExpToString','getOwnPropertySymbols','set','join','error','hits','onclose','split',\"c:\\\\Users\\\\Lenovo\\\\.vscode\\\\extensions\\\\wallabyjs.console-ninja-0.0.228\\\\node_modules\",'45844116NUkrJy','props','_connectToHostNow','RegExp','replace','serialize','Number','stack','autoExpandPropertyCount','_hasSetOnItsPath','_getOwnPropertyDescriptor','length','127.0.0.1','string','_quotedRegExp','catch','array','count','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host,\\x20see\\x20','_console_ninja_session','type','[object\\x20Map]','gateway.docker.internal','positiveInfinity','autoExpandPreviousObjects','[object\\x20BigInt]','70FEqbsq','11EvqbgY','_HTMLAllCollection','_keyStrRegExp','trace','function','default','getWebSocketClass','log','reload','1191','versions','name','map','ws://','_allowedToConnectOnSend','totalStrLength','unknown','_console_ninja','15594mUeKWH','_WebSocket','11196264ZecJpY','_isPrimitiveWrapperType','_numberRegExp','concat','_setNodePermissions',[\"localhost\",\"127.0.0.1\",\"example.cypress.io\",\"DESKTOP-ST7LNSS\",\"192.168.220.1\",\"192.168.80.1\",\"192.168.0.103\"],'959QMymZX','_isNegativeZero','test','_property','process','2324394fQIAwR','match','value','expressionsToEvaluate','send',':logPointId:','_WebSocketClass','now','getPrototypeOf','_blacklistedProperty','__es'+'Module','autoExpand','isExpressionToEvaluate','stringify','_consoleNinjaAllowedToStart','forEach','_addLoadNode','_setNodeId','funcName','call','url','parse','...','current','autoExpandLimit','location','bind','performance','readyState','_getOwnPropertySymbols','failed\\x20to\\x20connect\\x20to\\x20host:\\x20'];_0x3fef=function(){return _0x5da782;};return _0x3fef();}");
        } catch (e) {}
    }
    function oo_oo(i, ...v) {
        try {
            oo_cm().consoleLog(i, v);
        } catch (e) {}
        return v;
    }
    let gotoblock_gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
        const targetBlockElement = document.querySelector(targetBlock);
        if (targetBlockElement) {
            let headerItem = "";
            let headerItemHeight = 0;
            if (noHeader) {
                headerItem = "header.header";
                const headerElement = document.querySelector(headerItem);
                if (!headerElement.classList.contains("_header-scroll")) {
                    headerElement.style.cssText = `transition-duration: 0s;`;
                    headerElement.classList.add("_header-scroll");
                    headerItemHeight = headerElement.offsetHeight;
                    headerElement.classList.remove("_header-scroll");
                    setTimeout((() => {
                        headerElement.style.cssText = ``;
                    }), 0);
                } else headerItemHeight = headerElement.offsetHeight;
            }
            let options = {
                speedAsDuration: true,
                speed,
                header: headerItem,
                offset: offsetTop,
                easing: "easeOutQuad"
            };
            document.documentElement.classList.contains("menu-open") ? menuClose() : null;
            if (typeof SmoothScroll !== "undefined") (new SmoothScroll).animateScroll(targetBlockElement, "", options); else {
                let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + scrollY;
                targetBlockElementPosition = headerItemHeight ? targetBlockElementPosition - headerItemHeight : targetBlockElementPosition;
                targetBlockElementPosition = offsetTop ? targetBlockElementPosition - offsetTop : targetBlockElementPosition;
                window.scrollTo({
                    top: targetBlockElementPosition,
                    behavior: "smooth"
                });
            }
            functions_FLS(`[gotoBlock]: Юхуу...їдемо до ${targetBlock}`);
        } else functions_FLS(`[gotoBlock]: Йой... Такого блоку немає на сторінці: ${targetBlock}`);
    };
    let formValidate = {
        getErrors(form) {
            let error = 0;
            let formRequiredItems = form.querySelectorAll("*[data-required]");
            if (formRequiredItems.length) formRequiredItems.forEach((formRequiredItem => {
                if ((formRequiredItem.offsetParent !== null || formRequiredItem.tagName === "SELECT") && !formRequiredItem.disabled) error += this.validateInput(formRequiredItem);
            }));
            return error;
        },
        validateInput(formRequiredItem) {
            let error = 0;
            if (formRequiredItem.dataset.required === "email") {
                formRequiredItem.value = formRequiredItem.value.replace(" ", "");
                if (this.emailTest(formRequiredItem)) {
                    this.addError(formRequiredItem);
                    error++;
                } else this.removeError(formRequiredItem);
            } else if (formRequiredItem.type === "checkbox" && !formRequiredItem.checked) {
                this.addError(formRequiredItem);
                error++;
            } else if (!formRequiredItem.value.trim()) {
                this.addError(formRequiredItem);
                error++;
            } else this.removeError(formRequiredItem);
            return error;
        },
        addError(formRequiredItem) {
            formRequiredItem.classList.add("_form-error");
            formRequiredItem.parentElement.classList.add("_form-error");
            let inputError = formRequiredItem.parentElement.querySelector(".form__error");
            if (inputError) formRequiredItem.parentElement.removeChild(inputError);
            if (formRequiredItem.dataset.error) formRequiredItem.parentElement.insertAdjacentHTML("beforeend", `<div class="form__error">${formRequiredItem.dataset.error}</div>`);
        },
        removeError(formRequiredItem) {
            formRequiredItem.classList.remove("_form-error");
            formRequiredItem.parentElement.classList.remove("_form-error");
            if (formRequiredItem.parentElement.querySelector(".form__error")) formRequiredItem.parentElement.removeChild(formRequiredItem.parentElement.querySelector(".form__error"));
        },
        formClean(form) {
            form.reset();
            setTimeout((() => {
                let inputs = form.querySelectorAll("input,textarea");
                for (let index = 0; index < inputs.length; index++) {
                    const el = inputs[index];
                    el.parentElement.classList.remove("_form-focus");
                    el.classList.remove("_form-focus");
                    formValidate.removeError(el);
                }
                let checkboxes = form.querySelectorAll(".checkbox__input");
                if (checkboxes.length > 0) for (let index = 0; index < checkboxes.length; index++) {
                    const checkbox = checkboxes[index];
                    checkbox.checked = false;
                }
                if (modules_flsModules.select) {
                    let selects = form.querySelectorAll(".select");
                    if (selects.length) for (let index = 0; index < selects.length; index++) {
                        const select = selects[index].querySelector("select");
                        modules_flsModules.select.selectBuild(select);
                    }
                }
            }), 0);
        },
        emailTest(formRequiredItem) {
            return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
        }
    };
    class SelectConstructor {
        constructor(props, data = null) {
            let defaultConfig = {
                init: true,
                logging: true,
                speed: 150
            };
            this.config = Object.assign(defaultConfig, props);
            this.selectClasses = {
                classSelect: "select",
                classSelectBody: "select__body",
                classSelectTitle: "select__title",
                classSelectValue: "select__value",
                classSelectLabel: "select__label",
                classSelectInput: "select__input",
                classSelectText: "select__text",
                classSelectLink: "select__link",
                classSelectOptions: "select__options",
                classSelectOptionsScroll: "select__scroll",
                classSelectOption: "select__option",
                classSelectContent: "select__content",
                classSelectRow: "select__row",
                classSelectData: "select__asset",
                classSelectDisabled: "_select-disabled",
                classSelectTag: "_select-tag",
                classSelectOpen: "_select-open",
                classSelectActive: "_select-active",
                classSelectFocus: "_select-focus",
                classSelectMultiple: "_select-multiple",
                classSelectCheckBox: "_select-checkbox",
                classSelectOptionSelected: "_select-selected",
                classSelectPseudoLabel: "_select-pseudo-label"
            };
            this._this = this;
            if (this.config.init) {
                const selectItems = data ? document.querySelectorAll(data) : document.querySelectorAll("select");
                if (selectItems.length) {
                    this.selectsInit(selectItems);
                    this.setLogging(`Прокинувся, построїв селектов: (${selectItems.length})`);
                } else this.setLogging("Сплю, немає жодного select");
            }
        }
        getSelectClass(className) {
            return `.${className}`;
        }
        getSelectElement(selectItem, className) {
            return {
                originalSelect: selectItem.querySelector("select"),
                selectElement: selectItem.querySelector(this.getSelectClass(className))
            };
        }
        selectsInit(selectItems) {
            selectItems.forEach(((originalSelect, index) => {
                this.selectInit(originalSelect, index + 1);
            }));
            document.addEventListener("click", function(e) {
                this.selectsActions(e);
            }.bind(this));
            document.addEventListener("keydown", function(e) {
                this.selectsActions(e);
            }.bind(this));
            document.addEventListener("focusin", function(e) {
                this.selectsActions(e);
            }.bind(this));
            document.addEventListener("focusout", function(e) {
                this.selectsActions(e);
            }.bind(this));
        }
        selectInit(originalSelect, index) {
            const _this = this;
            let selectItem = document.createElement("div");
            selectItem.classList.add(this.selectClasses.classSelect);
            originalSelect.parentNode.insertBefore(selectItem, originalSelect);
            selectItem.appendChild(originalSelect);
            originalSelect.hidden = true;
            index ? originalSelect.dataset.id = index : null;
            if (this.getSelectPlaceholder(originalSelect)) {
                originalSelect.dataset.placeholder = this.getSelectPlaceholder(originalSelect).value;
                if (this.getSelectPlaceholder(originalSelect).label.show) {
                    const selectItemTitle = this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement;
                    selectItemTitle.insertAdjacentHTML("afterbegin", `<span class="${this.selectClasses.classSelectLabel}">${this.getSelectPlaceholder(originalSelect).label.text ? this.getSelectPlaceholder(originalSelect).label.text : this.getSelectPlaceholder(originalSelect).value}</span>`);
                }
            }
            selectItem.insertAdjacentHTML("beforeend", `<div class="${this.selectClasses.classSelectBody}"><div hidden class="${this.selectClasses.classSelectOptions}"></div></div>`);
            this.selectBuild(originalSelect);
            originalSelect.dataset.speed = originalSelect.dataset.speed ? originalSelect.dataset.speed : this.config.speed;
            this.config.speed = +originalSelect.dataset.speed;
            originalSelect.addEventListener("change", (function(e) {
                _this.selectChange(e);
            }));
        }
        selectBuild(originalSelect) {
            const selectItem = originalSelect.parentElement;
            selectItem.dataset.id = originalSelect.dataset.id;
            originalSelect.dataset.classModif ? selectItem.classList.add(`select_${originalSelect.dataset.classModif}`) : null;
            originalSelect.multiple ? selectItem.classList.add(this.selectClasses.classSelectMultiple) : selectItem.classList.remove(this.selectClasses.classSelectMultiple);
            originalSelect.hasAttribute("data-checkbox") && originalSelect.multiple ? selectItem.classList.add(this.selectClasses.classSelectCheckBox) : selectItem.classList.remove(this.selectClasses.classSelectCheckBox);
            this.setSelectTitleValue(selectItem, originalSelect);
            this.setOptions(selectItem, originalSelect);
            originalSelect.hasAttribute("data-search") ? this.searchActions(selectItem) : null;
            originalSelect.hasAttribute("data-open") ? this.selectAction(selectItem) : null;
            this.selectDisabled(selectItem, originalSelect);
        }
        selectsActions(e) {
            const targetElement = e.target;
            const targetType = e.type;
            if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelect)) || targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag))) {
                const selectItem = targetElement.closest(".select") ? targetElement.closest(".select") : document.querySelector(`.${this.selectClasses.classSelect}[data-id="${targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag)).dataset.selectId}"]`);
                const originalSelect = this.getSelectElement(selectItem).originalSelect;
                if (targetType === "click") {
                    if (!originalSelect.disabled) if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag))) {
                        const targetTag = targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag));
                        const optionItem = document.querySelector(`.${this.selectClasses.classSelect}[data-id="${targetTag.dataset.selectId}"] .select__option[data-value="${targetTag.dataset.value}"]`);
                        this.optionAction(selectItem, originalSelect, optionItem);
                    } else if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTitle))) this.selectAction(selectItem); else if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectOption))) {
                        const optionItem = targetElement.closest(this.getSelectClass(this.selectClasses.classSelectOption));
                        this.optionAction(selectItem, originalSelect, optionItem);
                    }
                } else if (targetType === "focusin" || targetType === "focusout") {
                    if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelect))) targetType === "focusin" ? selectItem.classList.add(this.selectClasses.classSelectFocus) : selectItem.classList.remove(this.selectClasses.classSelectFocus);
                } else if (targetType === "keydown" && e.code === "Escape") this.selectsСlose();
            } else this.selectsСlose();
        }
        selectsСlose(selectOneGroup) {
            const selectsGroup = selectOneGroup ? selectOneGroup : document;
            const selectActiveItems = selectsGroup.querySelectorAll(`${this.getSelectClass(this.selectClasses.classSelect)}${this.getSelectClass(this.selectClasses.classSelectOpen)}`);
            if (selectActiveItems.length) selectActiveItems.forEach((selectActiveItem => {
                this.selectСlose(selectActiveItem);
            }));
        }
        selectСlose(selectItem) {
            const originalSelect = this.getSelectElement(selectItem).originalSelect;
            const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
            if (!selectOptions.classList.contains("_slide")) {
                selectItem.classList.remove(this.selectClasses.classSelectOpen);
                _slideUp(selectOptions, originalSelect.dataset.speed);
                setTimeout((() => {
                    selectItem.style.zIndex = "";
                }), originalSelect.dataset.speed);
            }
        }
        selectAction(selectItem) {
            const originalSelect = this.getSelectElement(selectItem).originalSelect;
            const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
            const selectOpenzIndex = originalSelect.dataset.zIndex ? originalSelect.dataset.zIndex : 3;
            this.setOptionsPosition(selectItem);
            if (originalSelect.closest("[data-one-select]")) {
                const selectOneGroup = originalSelect.closest("[data-one-select]");
                this.selectsСlose(selectOneGroup);
            }
            setTimeout((() => {
                if (!selectOptions.classList.contains("_slide")) {
                    selectItem.classList.toggle(this.selectClasses.classSelectOpen);
                    _slideToggle(selectOptions, originalSelect.dataset.speed);
                    if (selectItem.classList.contains(this.selectClasses.classSelectOpen)) selectItem.style.zIndex = selectOpenzIndex; else setTimeout((() => {
                        selectItem.style.zIndex = "";
                    }), originalSelect.dataset.speed);
                }
            }), 0);
        }
        setSelectTitleValue(selectItem, originalSelect) {
            const selectItemBody = this.getSelectElement(selectItem, this.selectClasses.classSelectBody).selectElement;
            const selectItemTitle = this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement;
            if (selectItemTitle) selectItemTitle.remove();
            selectItemBody.insertAdjacentHTML("afterbegin", this.getSelectTitleValue(selectItem, originalSelect));
            originalSelect.hasAttribute("data-search") ? this.searchActions(selectItem) : null;
        }
        getSelectTitleValue(selectItem, originalSelect) {
            let selectTitleValue = this.getSelectedOptionsData(originalSelect, 2).html;
            if (originalSelect.multiple && originalSelect.hasAttribute("data-tags")) {
                selectTitleValue = this.getSelectedOptionsData(originalSelect).elements.map((option => `<span role="button" data-select-id="${selectItem.dataset.id}" data-value="${option.value}" class="_select-tag">${this.getSelectElementContent(option)}</span>`)).join("");
                if (originalSelect.dataset.tags && document.querySelector(originalSelect.dataset.tags)) {
                    document.querySelector(originalSelect.dataset.tags).innerHTML = selectTitleValue;
                    if (originalSelect.hasAttribute("data-search")) selectTitleValue = false;
                }
            }
            selectTitleValue = selectTitleValue.length ? selectTitleValue : originalSelect.dataset.placeholder ? originalSelect.dataset.placeholder : "";
            let pseudoAttribute = "";
            let pseudoAttributeClass = "";
            if (originalSelect.hasAttribute("data-pseudo-label")) {
                pseudoAttribute = originalSelect.dataset.pseudoLabel ? ` data-pseudo-label="${originalSelect.dataset.pseudoLabel}"` : ` data-pseudo-label="Заповніть атрибут"`;
                pseudoAttributeClass = ` ${this.selectClasses.classSelectPseudoLabel}`;
            }
            this.getSelectedOptionsData(originalSelect).values.length ? selectItem.classList.add(this.selectClasses.classSelectActive) : selectItem.classList.remove(this.selectClasses.classSelectActive);
            if (originalSelect.hasAttribute("data-search")) return `<div class="${this.selectClasses.classSelectTitle}"><span${pseudoAttribute} class="${this.selectClasses.classSelectValue}"><input autocomplete="off" type="text" placeholder="${selectTitleValue}" data-placeholder="${selectTitleValue}" class="${this.selectClasses.classSelectInput}"></span></div>`; else {
                const customClass = this.getSelectedOptionsData(originalSelect).elements.length && this.getSelectedOptionsData(originalSelect).elements[0].dataset.class ? ` ${this.getSelectedOptionsData(originalSelect).elements[0].dataset.class}` : "";
                return `<button type="button" class="${this.selectClasses.classSelectTitle}"><span${pseudoAttribute} class="${this.selectClasses.classSelectValue}${pseudoAttributeClass}"><span class="${this.selectClasses.classSelectContent}${customClass}">${selectTitleValue}</span></span></button>`;
            }
        }
        getSelectElementContent(selectOption) {
            const selectOptionData = selectOption.dataset.asset ? `${selectOption.dataset.asset}` : "";
            const selectOptionDataHTML = selectOptionData.indexOf("img") >= 0 ? `<img src="${selectOptionData}" alt="">` : selectOptionData;
            let selectOptionContentHTML = ``;
            selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectRow}">` : "";
            selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectData}">` : "";
            selectOptionContentHTML += selectOptionData ? selectOptionDataHTML : "";
            selectOptionContentHTML += selectOptionData ? `</span>` : "";
            selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectText}">` : "";
            selectOptionContentHTML += selectOption.textContent;
            selectOptionContentHTML += selectOptionData ? `</span>` : "";
            selectOptionContentHTML += selectOptionData ? `</span>` : "";
            return selectOptionContentHTML;
        }
        getSelectPlaceholder(originalSelect) {
            const selectPlaceholder = Array.from(originalSelect.options).find((option => !option.value));
            if (selectPlaceholder) return {
                value: selectPlaceholder.textContent,
                show: selectPlaceholder.hasAttribute("data-show"),
                label: {
                    show: selectPlaceholder.hasAttribute("data-label"),
                    text: selectPlaceholder.dataset.label
                }
            };
        }
        getSelectedOptionsData(originalSelect, type) {
            let selectedOptions = [];
            if (originalSelect.multiple) selectedOptions = Array.from(originalSelect.options).filter((option => option.value)).filter((option => option.selected)); else selectedOptions.push(originalSelect.options[originalSelect.selectedIndex]);
            return {
                elements: selectedOptions.map((option => option)),
                values: selectedOptions.filter((option => option.value)).map((option => option.value)),
                html: selectedOptions.map((option => this.getSelectElementContent(option)))
            };
        }
        getOptions(originalSelect) {
            const selectOptionsScroll = originalSelect.hasAttribute("data-scroll") ? `data-simplebar` : "";
            const customMaxHeightValue = +originalSelect.dataset.scroll ? +originalSelect.dataset.scroll : null;
            let selectOptions = Array.from(originalSelect.options);
            if (selectOptions.length > 0) {
                let selectOptionsHTML = ``;
                if (this.getSelectPlaceholder(originalSelect) && !this.getSelectPlaceholder(originalSelect).show || originalSelect.multiple) selectOptions = selectOptions.filter((option => option.value));
                selectOptionsHTML += `<div ${selectOptionsScroll} ${selectOptionsScroll ? `style="max-height: ${customMaxHeightValue}px"` : ""} class="${this.selectClasses.classSelectOptionsScroll}">`;
                selectOptions.forEach((selectOption => {
                    selectOptionsHTML += this.getOption(selectOption, originalSelect);
                }));
                selectOptionsHTML += `</div>`;
                return selectOptionsHTML;
            }
        }
        getOption(selectOption, originalSelect) {
            const selectOptionSelected = selectOption.selected && originalSelect.multiple ? ` ${this.selectClasses.classSelectOptionSelected}` : "";
            const selectOptionHide = selectOption.selected && !originalSelect.hasAttribute("data-show-selected") && !originalSelect.multiple ? `hidden` : ``;
            const selectOptionClass = selectOption.dataset.class ? ` ${selectOption.dataset.class}` : "";
            const selectOptionLink = selectOption.dataset.href ? selectOption.dataset.href : false;
            const selectOptionLinkTarget = selectOption.hasAttribute("data-href-blank") ? `target="_blank"` : "";
            let selectOptionHTML = ``;
            selectOptionHTML += selectOptionLink ? `<a ${selectOptionLinkTarget} ${selectOptionHide} href="${selectOptionLink}" data-value="${selectOption.value}" class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelected}">` : `<button ${selectOptionHide} class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelected}" data-value="${selectOption.value}" type="button">`;
            selectOptionHTML += this.getSelectElementContent(selectOption);
            selectOptionHTML += selectOptionLink ? `</a>` : `</button>`;
            return selectOptionHTML;
        }
        setOptions(selectItem, originalSelect) {
            const selectItemOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
            selectItemOptions.innerHTML = this.getOptions(originalSelect);
        }
        setOptionsPosition(selectItem) {
            const originalSelect = this.getSelectElement(selectItem).originalSelect;
            const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
            const selectItemScroll = this.getSelectElement(selectItem, this.selectClasses.classSelectOptionsScroll).selectElement;
            const customMaxHeightValue = +originalSelect.dataset.scroll ? `${+originalSelect.dataset.scroll}px` : ``;
            const selectOptionsPosMargin = +originalSelect.dataset.optionsMargin ? +originalSelect.dataset.optionsMargin : 10;
            if (!selectItem.classList.contains(this.selectClasses.classSelectOpen)) {
                selectOptions.hidden = false;
                const selectItemScrollHeight = selectItemScroll.offsetHeight ? selectItemScroll.offsetHeight : parseInt(window.getComputedStyle(selectItemScroll).getPropertyValue("max-height"));
                const selectOptionsHeight = selectOptions.offsetHeight > selectItemScrollHeight ? selectOptions.offsetHeight : selectItemScrollHeight + selectOptions.offsetHeight;
                const selectOptionsScrollHeight = selectOptionsHeight - selectItemScrollHeight;
                selectOptions.hidden = true;
                const selectItemHeight = selectItem.offsetHeight;
                const selectItemPos = selectItem.getBoundingClientRect().top;
                const selectItemTotal = selectItemPos + selectOptionsHeight + selectItemHeight + selectOptionsScrollHeight;
                const selectItemResult = window.innerHeight - (selectItemTotal + selectOptionsPosMargin);
                if (selectItemResult < 0) {
                    const newMaxHeightValue = selectOptionsHeight + selectItemResult;
                    if (newMaxHeightValue < 100) {
                        selectItem.classList.add("select--show-top");
                        selectItemScroll.style.maxHeight = selectItemPos < selectOptionsHeight ? `${selectItemPos - (selectOptionsHeight - selectItemPos)}px` : customMaxHeightValue;
                    } else {
                        selectItem.classList.remove("select--show-top");
                        selectItemScroll.style.maxHeight = `${newMaxHeightValue}px`;
                    }
                }
            } else setTimeout((() => {
                selectItem.classList.remove("select--show-top");
                selectItemScroll.style.maxHeight = customMaxHeightValue;
            }), +originalSelect.dataset.speed);
        }
        optionAction(selectItem, originalSelect, optionItem) {
            const selectOptions = selectItem.querySelector(`${this.getSelectClass(this.selectClasses.classSelectOptions)}`);
            if (!selectOptions.classList.contains("_slide")) {
                if (originalSelect.multiple) {
                    optionItem.classList.toggle(this.selectClasses.classSelectOptionSelected);
                    const originalSelectSelectedItems = this.getSelectedOptionsData(originalSelect).elements;
                    originalSelectSelectedItems.forEach((originalSelectSelectedItem => {
                        originalSelectSelectedItem.removeAttribute("selected");
                    }));
                    const selectSelectedItems = selectItem.querySelectorAll(this.getSelectClass(this.selectClasses.classSelectOptionSelected));
                    selectSelectedItems.forEach((selectSelectedItems => {
                        originalSelect.querySelector(`option[value = "${selectSelectedItems.dataset.value}"]`).setAttribute("selected", "selected");
                    }));
                } else {
                    if (!originalSelect.hasAttribute("data-show-selected")) setTimeout((() => {
                        if (selectItem.querySelector(`${this.getSelectClass(this.selectClasses.classSelectOption)}[hidden]`)) selectItem.querySelector(`${this.getSelectClass(this.selectClasses.classSelectOption)}[hidden]`).hidden = false;
                        optionItem.hidden = true;
                    }), this.config.speed);
                    originalSelect.value = optionItem.hasAttribute("data-value") ? optionItem.dataset.value : optionItem.textContent;
                    this.selectAction(selectItem);
                }
                this.setSelectTitleValue(selectItem, originalSelect);
                this.setSelectChange(originalSelect);
            }
        }
        selectChange(e) {
            const originalSelect = e.target;
            this.selectBuild(originalSelect);
            this.setSelectChange(originalSelect);
        }
        setSelectChange(originalSelect) {
            if (originalSelect.hasAttribute("data-validate")) formValidate.validateInput(originalSelect);
            if (originalSelect.hasAttribute("data-submit") && originalSelect.value) {
                let tempButton = document.createElement("button");
                tempButton.type = "submit";
                originalSelect.closest("form").append(tempButton);
                tempButton.click();
                tempButton.remove();
            }
            const selectItem = originalSelect.parentElement;
            this.selectCallback(selectItem, originalSelect);
        }
        selectDisabled(selectItem, originalSelect) {
            if (originalSelect.disabled) {
                selectItem.classList.add(this.selectClasses.classSelectDisabled);
                this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement.disabled = true;
            } else {
                selectItem.classList.remove(this.selectClasses.classSelectDisabled);
                this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement.disabled = false;
            }
        }
        searchActions(selectItem) {
            this.getSelectElement(selectItem).originalSelect;
            const selectInput = this.getSelectElement(selectItem, this.selectClasses.classSelectInput).selectElement;
            const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
            const selectOptionsItems = selectOptions.querySelectorAll(`.${this.selectClasses.classSelectOption} `);
            const _this = this;
            selectInput.addEventListener("input", (function() {
                selectOptionsItems.forEach((selectOptionsItem => {
                    if (selectOptionsItem.textContent.toUpperCase().includes(selectInput.value.toUpperCase())) selectOptionsItem.hidden = false; else selectOptionsItem.hidden = true;
                }));
                selectOptions.hidden === true ? _this.selectAction(selectItem) : null;
            }));
        }
        selectCallback(selectItem, originalSelect) {
            document.dispatchEvent(new CustomEvent("selectCallback", {
                detail: {
                    select: originalSelect
                }
            }));
        }
        setLogging(message) {
            this.config.logging ? functions_FLS(`[select]: ${message} `) : null;
        }
    }
    modules_flsModules.select = new SelectConstructor({});
    class ScrollWatcher {
        constructor(props) {
            let defaultConfig = {
                logging: true
            };
            this.config = Object.assign(defaultConfig, props);
            this.observer;
            !document.documentElement.classList.contains("watcher") ? this.scrollWatcherRun() : null;
        }
        scrollWatcherUpdate() {
            this.scrollWatcherRun();
        }
        scrollWatcherRun() {
            document.documentElement.classList.add("watcher");
            this.scrollWatcherConstructor(document.querySelectorAll("[data-watch]"));
        }
        scrollWatcherConstructor(items) {
            if (items.length) {
                this.scrollWatcherLogging(`Прокинувся, стежу за об'єктами (${items.length})...`);
                let uniqParams = uniqArray(Array.from(items).map((function(item) {
                    return `${item.dataset.watchRoot ? item.dataset.watchRoot : null}|${item.dataset.watchMargin ? item.dataset.watchMargin : "0px"}|${item.dataset.watchThreshold ? item.dataset.watchThreshold : 0}`;
                })));
                uniqParams.forEach((uniqParam => {
                    let uniqParamArray = uniqParam.split("|");
                    let paramsWatch = {
                        root: uniqParamArray[0],
                        margin: uniqParamArray[1],
                        threshold: uniqParamArray[2]
                    };
                    let groupItems = Array.from(items).filter((function(item) {
                        let watchRoot = item.dataset.watchRoot ? item.dataset.watchRoot : null;
                        let watchMargin = item.dataset.watchMargin ? item.dataset.watchMargin : "0px";
                        let watchThreshold = item.dataset.watchThreshold ? item.dataset.watchThreshold : 0;
                        if (String(watchRoot) === paramsWatch.root && String(watchMargin) === paramsWatch.margin && String(watchThreshold) === paramsWatch.threshold) return item;
                    }));
                    let configWatcher = this.getScrollWatcherConfig(paramsWatch);
                    this.scrollWatcherInit(groupItems, configWatcher);
                }));
            } else this.scrollWatcherLogging("Сплю, немає об'єктів для стеження. ZzzZZzz");
        }
        getScrollWatcherConfig(paramsWatch) {
            let configWatcher = {};
            if (document.querySelector(paramsWatch.root)) configWatcher.root = document.querySelector(paramsWatch.root); else if (paramsWatch.root !== "null") this.scrollWatcherLogging(`Эмм... батьківського об'єкта ${paramsWatch.root} немає на сторінці`);
            configWatcher.rootMargin = paramsWatch.margin;
            if (paramsWatch.margin.indexOf("px") < 0 && paramsWatch.margin.indexOf("%") < 0) {
                this.scrollWatcherLogging(`йой, налаштування data-watch-margin потрібно задавати в PX або %`);
                return;
            }
            if (paramsWatch.threshold === "prx") {
                paramsWatch.threshold = [];
                for (let i = 0; i <= 1; i += .005) paramsWatch.threshold.push(i);
            } else paramsWatch.threshold = paramsWatch.threshold.split(",");
            configWatcher.threshold = paramsWatch.threshold;
            return configWatcher;
        }
        scrollWatcherCreate(configWatcher) {
            this.observer = new IntersectionObserver(((entries, observer) => {
                entries.forEach((entry => {
                    this.scrollWatcherCallback(entry, observer);
                }));
            }), configWatcher);
        }
        scrollWatcherInit(items, configWatcher) {
            this.scrollWatcherCreate(configWatcher);
            items.forEach((item => this.observer.observe(item)));
        }
        scrollWatcherIntersecting(entry, targetElement) {
            if (entry.isIntersecting) {
                !targetElement.classList.contains("_watcher-view") ? targetElement.classList.add("_watcher-view") : null;
                this.scrollWatcherLogging(`Я бачу ${targetElement.classList}, додав клас _watcher-view`);
            } else {
                targetElement.classList.contains("_watcher-view") ? targetElement.classList.remove("_watcher-view") : null;
                this.scrollWatcherLogging(`Я не бачу ${targetElement.classList}, прибрав клас _watcher-view`);
            }
        }
        scrollWatcherOff(targetElement, observer) {
            observer.unobserve(targetElement);
            this.scrollWatcherLogging(`Я перестав стежити за ${targetElement.classList}`);
        }
        scrollWatcherLogging(message) {
            this.config.logging ? functions_FLS(`[Спостерігач]: ${message}`) : null;
        }
        scrollWatcherCallback(entry, observer) {
            const targetElement = entry.target;
            this.scrollWatcherIntersecting(entry, targetElement);
            targetElement.hasAttribute("data-watch-once") && entry.isIntersecting ? this.scrollWatcherOff(targetElement, observer) : null;
            document.dispatchEvent(new CustomEvent("watcherCallback", {
                detail: {
                    entry
                }
            }));
        }
    }
    modules_flsModules.watcher = new ScrollWatcher({});
    class Parallax {
        constructor(elements) {
            if (elements.length) this.elements = Array.from(elements).map((el => new Parallax.Each(el, this.options)));
        }
        destroyEvents() {
            this.elements.forEach((el => {
                el.destroyEvents();
            }));
        }
        setEvents() {
            this.elements.forEach((el => {
                el.setEvents();
            }));
        }
    }
    Parallax.Each = class {
        constructor(parent) {
            this.parent = parent;
            this.elements = this.parent.querySelectorAll("[data-prlx]");
            this.animation = this.animationFrame.bind(this);
            this.offset = 0;
            this.value = 0;
            this.smooth = parent.dataset.prlxSmooth ? Number(parent.dataset.prlxSmooth) : 15;
            this.setEvents();
        }
        setEvents() {
            this.animationID = window.requestAnimationFrame(this.animation);
        }
        destroyEvents() {
            window.cancelAnimationFrame(this.animationID);
        }
        animationFrame() {
            const topToWindow = this.parent.getBoundingClientRect().top;
            const heightParent = this.parent.offsetHeight;
            const heightWindow = window.innerHeight;
            const positionParent = {
                top: topToWindow - heightWindow,
                bottom: topToWindow + heightParent
            };
            const centerPoint = this.parent.dataset.prlxCenter ? this.parent.dataset.prlxCenter : "center";
            if (positionParent.top < 30 && positionParent.bottom > -30) switch (centerPoint) {
              case "top":
                this.offset = -1 * topToWindow;
                break;

              case "center":
                this.offset = heightWindow / 2 - (topToWindow + heightParent / 2);
                break;

              case "bottom":
                this.offset = heightWindow - (topToWindow + heightParent);
                break;
            }
            this.value += (this.offset - this.value) / this.smooth;
            this.animationID = window.requestAnimationFrame(this.animation);
            this.elements.forEach((el => {
                const parameters = {
                    axis: el.dataset.axis ? el.dataset.axis : "v",
                    direction: el.dataset.direction ? el.dataset.direction + "1" : "-1",
                    coefficient: el.dataset.coefficient ? Number(el.dataset.coefficient) : 5,
                    additionalProperties: el.dataset.properties ? el.dataset.properties : ""
                };
                this.parameters(el, parameters);
            }));
        }
        parameters(el, parameters) {
            if (parameters.axis == "v") el.style.transform = `translate3D(0, ${(parameters.direction * (this.value / parameters.coefficient)).toFixed(2)}px,0) ${parameters.additionalProperties}`; else if (parameters.axis == "h") el.style.transform = `translate3D(${(parameters.direction * (this.value / parameters.coefficient)).toFixed(2)}px,0,0) ${parameters.additionalProperties}`;
        }
    };
    if (document.querySelectorAll("[data-prlx-parent]")) modules_flsModules.parallax = new Parallax(document.querySelectorAll("[data-prlx-parent]"));
    let addWindowScrollEvent = false;
    function pageNavigation() {
        document.addEventListener("click", pageNavigationAction);
        document.addEventListener("watcherCallback", pageNavigationAction);
        function pageNavigationAction(e) {
            if (e.type === "click") {
                const targetElement = e.target;
                if (targetElement.closest("[data-goto]")) {
                    const gotoLink = targetElement.closest("[data-goto]");
                    const gotoLinkSelector = gotoLink.dataset.goto ? gotoLink.dataset.goto : "";
                    const noHeader = gotoLink.hasAttribute("data-goto-header") ? true : false;
                    const gotoSpeed = gotoLink.dataset.gotoSpeed ? gotoLink.dataset.gotoSpeed : 500;
                    const offsetTop = gotoLink.dataset.gotoTop ? parseInt(gotoLink.dataset.gotoTop) : 0;
                    if (modules_flsModules.fullpage) {
                        const fullpageSection = document.querySelector(`${gotoLinkSelector}`).closest("[data-fp-section]");
                        const fullpageSectionId = fullpageSection ? +fullpageSection.dataset.fpId : null;
                        if (fullpageSectionId !== null) {
                            modules_flsModules.fullpage.switchingSection(fullpageSectionId);
                            document.documentElement.classList.contains("menu-open") ? menuClose() : null;
                        }
                    } else gotoblock_gotoBlock(gotoLinkSelector, noHeader, gotoSpeed, offsetTop);
                    e.preventDefault();
                }
            } else if (e.type === "watcherCallback" && e.detail) {
                const entry = e.detail.entry;
                const targetElement = entry.target;
                if (targetElement.dataset.watch === "navigator") {
                    document.querySelector(`[data-goto]._navigator-active`);
                    let navigatorCurrentItem;
                    if (targetElement.id && document.querySelector(`[data-goto="#${targetElement.id}"]`)) navigatorCurrentItem = document.querySelector(`[data-goto="#${targetElement.id}"]`); else if (targetElement.classList.length) for (let index = 0; index < targetElement.classList.length; index++) {
                        const element = targetElement.classList[index];
                        if (document.querySelector(`[data-goto=".${element}"]`)) {
                            navigatorCurrentItem = document.querySelector(`[data-goto=".${element}"]`);
                            break;
                        }
                    }
                    if (entry.isIntersecting) navigatorCurrentItem ? navigatorCurrentItem.classList.add("_navigator-active") : null; else navigatorCurrentItem ? navigatorCurrentItem.classList.remove("_navigator-active") : null;
                }
            }
        }
        if (getHash()) {
            let goToHash;
            if (document.querySelector(`#${getHash()}`)) goToHash = `#${getHash()}`; else if (document.querySelector(`.${getHash()}`)) goToHash = `.${getHash()}`;
            goToHash ? gotoblock_gotoBlock(goToHash, true, 500, 20) : null;
        }
    }
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    class DynamicAdapt {
        constructor(type) {
            this.type = type;
        }
        init() {
            this.оbjects = [];
            this.daClassname = "_dynamic_adapt_";
            this.nodes = [ ...document.querySelectorAll("[data-da]") ];
            this.nodes.forEach((node => {
                const data = node.dataset.da.trim();
                const dataArray = data.split(",");
                const оbject = {};
                оbject.element = node;
                оbject.parent = node.parentNode;
                оbject.destination = document.querySelector(`${dataArray[0].trim()}`);
                оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
                оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
                оbject.index = this.indexInParent(оbject.parent, оbject.element);
                this.оbjects.push(оbject);
            }));
            this.arraySort(this.оbjects);
            this.mediaQueries = this.оbjects.map((({breakpoint}) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)).filter(((item, index, self) => self.indexOf(item) === index));
            this.mediaQueries.forEach((media => {
                const mediaSplit = media.split(",");
                const matchMedia = window.matchMedia(mediaSplit[0]);
                const mediaBreakpoint = mediaSplit[1];
                const оbjectsFilter = this.оbjects.filter((({breakpoint}) => breakpoint === mediaBreakpoint));
                matchMedia.addEventListener("change", (() => {
                    this.mediaHandler(matchMedia, оbjectsFilter);
                }));
                this.mediaHandler(matchMedia, оbjectsFilter);
            }));
        }
        mediaHandler(matchMedia, оbjects) {
            if (matchMedia.matches) оbjects.forEach((оbject => {
                this.moveTo(оbject.place, оbject.element, оbject.destination);
            })); else оbjects.forEach((({parent, element, index}) => {
                if (element.classList.contains(this.daClassname)) this.moveBack(parent, element, index);
            }));
        }
        moveTo(place, element, destination) {
            element.classList.add(this.daClassname);
            if (place === "last" || place >= destination.children.length) {
                destination.append(element);
                return;
            }
            if (place === "first") {
                destination.prepend(element);
                return;
            }
            destination.children[place].before(element);
        }
        moveBack(parent, element, index) {
            element.classList.remove(this.daClassname);
            if (parent.children[index] !== void 0) parent.children[index].before(element); else parent.append(element);
        }
        indexInParent(parent, element) {
            return [ ...parent.children ].indexOf(element);
        }
        arraySort(arr) {
            if (this.type === "min") arr.sort(((a, b) => {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) return 0;
                    if (a.place === "first" || b.place === "last") return -1;
                    if (a.place === "last" || b.place === "first") return 1;
                    return 0;
                }
                return a.breakpoint - b.breakpoint;
            })); else {
                arr.sort(((a, b) => {
                    if (a.breakpoint === b.breakpoint) {
                        if (a.place === b.place) return 0;
                        if (a.place === "first" || b.place === "last") return 1;
                        if (a.place === "last" || b.place === "first") return -1;
                        return 0;
                    }
                    return b.breakpoint - a.breakpoint;
                }));
                return;
            }
        }
    }
    const da = new DynamicAdapt("max");
    da.init();
    document.getElementsByClassName("headerbg");
    const headerBackgrounds = document.getElementsByClassName("headerbg");
    function handleScroll() {
        if (document.documentElement.scrollTop > 0) for (const header of headerBackgrounds) header.classList.add("active"); else for (const header of headerBackgrounds) header.classList.remove("active");
    }
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("DOMContentLoaded", (function() {
        const spollersTitles = document.querySelectorAll(".spollers__row");
        spollersTitles.forEach((function(title, index) {
            title.addEventListener("click", (function() {
                if (!title.classList.contains("spl-active")) {
                    spollersTitles.forEach((function(otherTitle) {
                        otherTitle.classList.remove("spl-active");
                    }));
                    if (index < spollersTitles.length - 1) title.classList.add("spl-active");
                } else title.classList.remove("spl-active");
            }));
        }));
    }));
    window.addEventListener("load", (function() {
        new Swiper(".swiper--about", {
            loop: true,
            grabCursor: true,
            effect: "creative",
            slidesPerView: 1,
            centerInsufficientSlides: true,
            initialSlide: 1,
            loopAdditionalSlides: 2,
            centeredSlides: true,
            aotoheight: false,
            creativeEffect: {
                prev: {
                    shadow: false,
                    translate: [ 70, 0, -200 ],
                    origin: "right center"
                },
                next: {
                    translate: [ 140, 0, -400 ],
                    origin: "right center"
                }
            },
            navigation: {
                nextEl: ".swiper-next",
                prevEl: ".swiper-prev"
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true
            }
        });
    }));
    window["FLS"] = true;
    isWebp();
    menuInit();
    spollers();
    pageNavigation();
})();