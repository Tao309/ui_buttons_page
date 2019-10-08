$.fn.swipe = function(options,callback) {
var config = {
		min_x: 20, //минимальный свайп по горизонтали для элемента
		max_x: 40, //максимальный свайп по горизонтали для элемента
		min_y: 20, //минимальный свайп по вертикали для элемента
		max_y: 40, //максимальный свайп по вертикали для элемента
		swipeLeft: function() { },//обработка если свайп влево
		swipeRight: function() { },//обработка если свайп вправо
		swipeUp: function() { },//обработка если свайп вверх
		swipeDown: function() { },//обработка если свайп вниз
	},
	options = $.extend(config, options);
	
	var sw = {};
	sw.sX = 0;
	sw.sY = 0;
	sw.eX = 0;
	sw.eY = 0;
	
var touchDown = false,//нажата ли кнопка мыши или палец на экране
	pos = null,
	direction = "",
	length = "0";
	
	var el = $(this);
	if(!el.length) {return;}
	
	var getPointerEvent = function(event) {
        return event.targetTouches ? event.targetTouches[0] : event;
    };
	var setListener = function (elm,events,callback) {
        var eventsArray = events.split(' '),
            i = eventsArray.length;
        while(i--){
            elm.addEventListener( eventsArray[i], callback, false );
        }
    };
	
	setListener(el[0],"touchstart", function (e) {//mousedown
		touchDown = true;
		e.preventDefault();
		//var t = e.touches[0];
		var t = getPointerEvent(e);
		sw.sX = t.screenX;
		sw.sY = t.screenY;
		//console.log("Начало: "+sw.sX+":"+sw.sY);
	},false);
	setListener(el[0],"touchmove", function (e) {//mousemove
		if(!touchDown) {return false;}
		e.preventDefault();
		var t = getPointerEvent(e);
		sw.eX = t.screenX; 
		sw.eY = t.screenY;  
		//console.log("Конец "+sw.eX+":"+sw.eY);
	},false);
	setListener(el[0],"touchend", function (e) {//mouseup
		e.preventDefault();
		touchDown = false;
		//Определение по горизонтали
		if ((((sw.eX - options.min_x > sw.sX) || (sw.eX + options.min_x < sw.sX)) && ((sw.eY < sw.sY + options.max_y) && (sw.sY > sw.eY - options.max_y)))) {
			if(sw.eX > sw.sX) {
				direction = "right"; 
				length = sw.eX - sw.sX; 
				config.swipeRight();
			} else {
				direction = "left";
				length = sw.sX - sw.eX;
				config.swipeLeft();
			}
		}
		//Определение по вертикали
		if ((((sw.eY - options.min_y > sw.sY) || (sw.eY + options.min_y < sw.sY)) && ((sw.eX < sw.sX + options.max_x) && (sw.sX > sw.eX - options.max_x)))) {
			if(sw.eY > sw.sY) {
				direction = "down";
				length = sw.eY - sw.sY;
				config.swipeDown();
			} else {
				direction = "up";
				length = sw.sY - sw.eY;
				config.swipeUp();
			}
		}
		//console.log("Направление: "+direction+", на расстояние "+length+" px");
		if (direction != "") {if(typeof callback == 'function') callback(el,direction,length);}
		direction = "";
	},false);
};