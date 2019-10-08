;(function($) {
$.fn.tCarousel = function(options) {
		
	var defaults = {
		buttons:1,//показывать ли кнопки
		disabledButtonHide:0,//кнопки не disabled, а скрывать через добавление класса hide
		scrollItem: 1,//кол-во элементов при прокрутке
		handle:'line',//тип прокрутки
		/*
			line - влево и вправо до конца только
			infinite - бесконечная прокрутка влево и вправо
		*/
		onButtonLeft:function(options) {},//callback после нажатия на кнопку влево
		onButtonRight:function(options) {},//callback после нажатия на кнопку вправо
		readyCallback:function(options) {},//callback перед готовностью к инициализации модуля
		loadedCallback:function(options) {},//callback после заврешения обработки модуля карусели
		lazy:0,//отложенная загрузка картинок
		lazyForce:0,//принудательно заменять source  у картинок для пред-загрузки
		lazyDelay:180,//задержка при показе
		lazy_img_name:'lazy_image',//класс с картинкой, который будет отложен дял показа
		justMobile:0,//указывается максимальная ширина экрана, при которой активируется модуль
	};
	var options = $.extend(defaults, options);
	
return this.each(function(e) {

var mainObject = $(this),
	opt = {},//данные по длинам и т.п.
	method = {
		init:function(o) {
			options.readyCallback(options);
			var that = o[0];
			if(typeof o[0] == 'undefined') {return false;}
			
			var ul = that.children[0],
				tag = ul.tagName,
				oClass = that.className,
				li = that.getElementsByTagName('li');
			
			if(tag == 'UL' || tag == 'ul') {
				
				if(options.lazy>0) {
					if(typeof $.fn.lazyload != 'function') {options.lazy = 0;}
				}
				
				that.style.height = 'auto';
				that.style.position = 'relative';
				
				ul.className = ul.className+" tcarousel-list";
				ul.style.overflow = 'hidden';
				ul.style.position = 'relative';
				ul.style.margin = '0px';
				ul.style.padding = '0px';
				ul.style.listStyle = 'none';
				ul.style.display = 'block';
				ul.style.top = '0px';
				ul.style.left = '0px';
				
				var container = document.createElement("div");
				//container.style.position = 'relative';
				container.style.overflow = 'hidden';
				container.className = 'tcarousel-clip';
				container.appendChild(ul);
				o.append(container);
				
				opt.ul = ul;
				
				opt.containerWidth = container.offsetWidth;
				
				that.className = oClass+" tcarousel-container";
				
				if(li!='undefined' && li.length>0) {
					opt.li = li;
					var length = 0,
						computedStyle = [],
						itemLength = 0,
						img = [];
					
					for(var i=0;i<li.length;i++) {
						li[i].className = li[i].className+" tcarousel-item tcarousel-item-"+(i+1);
						li[i].style.cssFloat = 'left';
						li[i].style.listStyle = 'none';
						//li[i].style.overflow = 'hidden';
						
						if(options.lazy>0) {
							img[i] = $(li[i]).find('img.'+options.lazy_img_name);
							if(img[i].length) {
								img[i].addClass('lazy_notloaded');
								if(options.lazyForce>0) {
									var src = img[i].attr('src');
									img[i].attr({
									'data-original':src,
									'src':'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC'
									});
								}
							}
						}
						if(itemLength==0) {
							computedStyle[i] = li[i].currentStyle || window.getComputedStyle(li[i], null);
							itemLength = li[i].offsetWidth + parseInt(computedStyle[i].marginLeft,10) + parseInt(computedStyle[i].marginRight,10);
							opt.itemLength = itemLength;
						}
						length = (length + itemLength);
					}
					ul.style.width = length+'px';
					opt.listWidth = length;
					
					if(options.buttons>0) {
						var buttonLeft = document.createElement("button");
						buttonLeft.className = 'tcarousel-button tcarousel-left';
						var buttonRight = document.createElement("button");
						buttonRight.className = 'tcarousel-button tcarousel-right';
					
						that.appendChild(buttonLeft);
						that.appendChild(buttonRight);
						
						$(buttonLeft).on('click',function() {
							method.move('left',that,ul);
						});
						$(buttonRight).on('click',function() {
							method.move('right',that,ul);
						});
						
						opt.buttonLeft = buttonLeft;
						opt.buttonRight = buttonRight;
						method.checkButtons();
						/*
						eventF.addEvent(buttonLeft, 'mouseover', function() {
							method.ButtonHover('left',buttonLeft);
						});
						eventF.addEvent(buttonRight, 'mouseover', function() {
							method.ButtonHover('right',buttonRight);
						});
						*/
					}
					options.loadedCallback(options);
					if(options.lazy>0) {
						var img = $(ul).find('li img.'+options.lazy_img_name+'.lazy_notloaded');
						method.loadLazy(img,'load');
					}
					
					window.onresize = function(e) {
						ul.style.left = "0px";
						method.checkButtons();
						opt.containerWidth = container.offsetWidth;
					};
					opt.moving = false;
								
					if(typeof $.fn.swipe !== 'undefined') {
						$(that).find('.tcarousel-clip').swipe({
							min_x: 0,
							max_x: 80,
							min_y: 40,
							max_y: 80,
							swipeLeft:function(length) {
								method.move('right',that,ul);
							},
							swipeRight:function(length) {
								method.move('left',that,ul);
							},
							swipeStart:function(e) {
								if(options.handle == 'line') {
									//$(e.target).off('click').on('click', function(e){e.preventDefault();});
								}
							},
							swipeEnd:function(e,lengthX,lengthY) {
								if(options.handle == 'line') {
									//$(e.target).off('click');
									opt.moving = false;
									$(ul).removeClass('moving');
									//$(ul).off("mousedown");
								}
							},
							swipeMove:function(event,lengthX,lengthY) {
								if(options.handle == 'line') {
									if(!opt.moving) {
										computedStyleUL = ul.currentStyle || window.getComputedStyle(ul, null);
										var left = parseInt(computedStyleUL.left,10);
										opt.left = left;
										$(ul).addClass('moving');
									}
									opt.moving = true;
									var newLeft = (opt.left-lengthX);
									
									if(newLeft>0) {return false;}
									var res = (newLeft+opt.listWidth-opt.containerWidth);
									if(res<=0) {return false;}
									
									ul.style.left = newLeft+"px";
								}
							},
						});
					}
				} else {return false;}
			} else {return false;}
		},
		move:function(direction,that,ul) {
			computedStyleUL = ul.currentStyle || window.getComputedStyle(ul, null);
			var marginLeft = parseInt(computedStyleUL.marginLeft,10),
				left = parseInt(computedStyleUL.left,10),
				li = opt.li;
			
			if(options.lazy>0) {
				var img = $(ul).find('li img.'+options.lazy_img_name+'.lazy_notloaded');
				method.loadLazy(img,'scroll');
			}
			if(direction == 'left') {
				if(options.handle == 'line') {
					if(opt.moving) {
						var move = -left;
						var n  = -(Math.round(move/opt.itemLength));
						left = (n*opt.itemLength)-opt.itemLength;
					}
					
					if(left >= 0) {
						return false;
					} else if((left*-1)<=opt.itemLength*options.scrollItem) {
						//ul.style.marginLeft = "0px";
						ul.style.left = "0px";
					} else {
						//ul.style.marginLeft = (marginLeft+options.itemLength*options.scrollItem)+"px";
						if(opt.moving) {
							ul.style.left = (left+opt.itemLength)+"px";
						} else {
							ul.style.left = (left+opt.itemLength*options.scrollItem)+"px";
						}
					}
				} else if(options.handle == 'infinite') {
					ul.style.marginLeft = marginLeft-(options.scrollItem*opt.itemLength)+"px";
					for(var i=li.length;i>(li.length-options.scrollItem);i--) {$(ul).prepend($(li[li.length-1]));}
					ul.style.left = (left+opt.itemLength*options.scrollItem)+"px";
				}
				options.onButtonLeft(options);
			} else if(direction == 'right') {
				var res = (left+opt.listWidth-opt.containerWidth);
				if(options.handle == 'line') {
					
					if(opt.moving) {
						var move = -left;
						var n  = -(Math.round(move/opt.itemLength));
						if(res<opt.itemLength*options.scrollItem) {
							
						} else {
							left = (n*opt.itemLength)+opt.itemLength;
						}
					}
					
					if(res<=0) {
						return false;
					} else if(res<opt.itemLength*options.scrollItem) {
						ul.style.left = (left-res)+"px";
					} else {
						if(opt.moving) {
							ul.style.left = (left-opt.itemLength)+"px";
						} else {
							ul.style.left = (left-opt.itemLength*options.scrollItem)+"px";
						}
					}
				} else if(options.handle == 'infinite') {
					ul.style.marginLeft = marginLeft+(options.scrollItem*opt.itemLength)+"px";
					for(var i=0;i<(options.scrollItem);i++) {$(ul).append($(li[0]));}
					ul.style.left = (left-opt.itemLength*options.scrollItem)+"px";
				}
				options.onButtonRight(options);
			}
			
			method.checkButtons();
		},
		checkButtons:function() {
			var ul = opt.ul,
				li = opt.li,
				//marginLeft = parseInt(ul.style.marginLeft,10),
				left = parseInt(ul.style.left,10),
				res = (left+opt.listWidth-opt.containerWidth);
			
			if(options.handle == 'line') {
				if(left >= 0) {
					if(options.disabledButtonHide>0) {
						$(opt.buttonLeft).addClass('hide');
					} else {
						opt.buttonLeft.disabled = true;
					}
				} else {
					if(options.disabledButtonHide>0) {
						$(opt.buttonLeft).removeClass('hide');
					} else {
						opt.buttonLeft.disabled = false;
					}
				}
				if(res<=0) {
					if(options.disabledButtonHide>0) {
						$(opt.buttonRight).addClass('hide');
					} else {
						opt.buttonRight.disabled = true;
					}
				} else {
					if(options.disabledButtonHide>0) {
						$(opt.buttonRight).removeClass('hide');
					} else {
						opt.buttonRight.disabled = false;
					}
				}
			} else if(options.handle == 'infinite') {
				if(li.length>1 && li.length>options.scrollItem && opt.listWidth>opt.containerWidth) {
					opt.infinite = 1;
				} else {
					opt.infinite = 0;
					if(options.disabledButtonHide>0) {
						$(opt.buttonLeft).addClass('hide');
						$(opt.buttonRight).addClass('hide');
					} else {
						opt.buttonLeft.disabled = true;
						opt.buttonRight.disabled = true;
					}
				}
			}
		},
		loadLazy:function(img,type) {
			//if(type == 'load') {
				img.lazyload({delay:options.lazyDelay, effect: "fadeIn",event: 'scroll',
					load: function(self, elements_left, settings) {
						$(this).removeClass("lazy_notloaded").addClass('lazy_loaded');
					}
				});
			//} else if(type == 'scroll') {
			//	$(li).lazyload({delay:options.lazyDelay, effect: "fadeIn",event: 'scroll',
			//		load: function(self, elements_left, settings) {
			//			$(this).removeClass("lazy_notloaded").addClass('lazy_loaded');
			//		}
			//	});
			//}
		},
		ButtonHover:function(type,button) {
			
			var ul = $(options.ul);
			if(type == 'left') {
				ul.addClass('hoverLeft');
			} else if(type='right') {
				ul.addClass('hoverRight');
			}
			eventF.addEvent(button, 'mouseout', function() {
				method.ButtonOut(type,button);
			});
		},
		ButtonOut:function(type,button) {
			var ul = $(options.ul);
			if(type == 'left') {
				ul.removeClass('hoverLeft');
			} else if(type='right') {
				ul.removeClass('hoverRight');
			}
		},
	};
	
	if(!mainObject.hasClass('tcarousel-container')) {
		if(options.justMobile>0) {
			var widthClient = window.innerWidth;
			if(options.justMobile>=widthClient) {method.init(mainObject);}
		} else {
			method.init(mainObject);
		}
	}
});
};
})($);