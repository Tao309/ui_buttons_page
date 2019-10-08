var eventF = {
	addEvent: function(el, type, fn) {
		if(typeof addEventListener !== "undefined") {
			el.addEventListener(type, fn, false);
		} else if(typeof attachEvent !== "undefined") {
			el.attachEvent('on'+type, fn);
		} else {
			el['on'+type] = fn;
		}
	},
	removeEvent: function(el, type, fn) {
		if(typeof removeEventListener !== "undefined") {
			el.removeEventListener(type, fn, false);
		} else if(typeof detachEvent !== "undefined") {
			el.detachEvent('on'+type, fn);
		} else {
			el['on'+type] = null;
		}
	},
	getTarget: function(e) {
		if(typeof e.target !== 'undefined') {
			return e.target;
		} else {
			return e.srcElement;
		}
	},
	preventDefault: function(e) {
		if(typeof e.preventDefault !== 'undefined') {
			e.preventDefault();
		} else {
			e.returnValue = false;
		}
	},
};