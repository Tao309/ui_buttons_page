;(function() {
	$.fn.pageScroll = function(options) {
		var defaults = {
			timeout: 600,//задержка после совершеняи перехода (для синзронизации с css анимацией)
			navMenu: null,//объект с меню, внутри где ul, li, a
		};
		var options = $.extend(defaults, options),
			that = $(this),
			screenScroll = 0,
			sections = that.find(">div.section"),
			goScroll = false;
		
		that.find(">div.section:first-child").addClass('current');
		
		//Действия для меню навигации
		if(options.navMenu) {
			options.navMenu.find("ul>li:first-child").addClass('current');
			
			options.navMenu.find("ul>li>a").on('click',function(e) {
				e.preventDefault();
				action.showSection($(this).attr("href"));
				
				if($(".adaptive_menu_button[name='navMenu']").is(":visible")) {
					$("#navMenu").slideUp(240);
					$(".adaptive_menu_button[name='navMenu']").removeClass('click');
				}
			});
		}
		
		//Если в url есть хэш
		$(function() {
			action.showSection(window.location.hash);
		});
		
		//Нажимает кнопками направления
		window.onkeydown = function (event) {
			var currentSection = sections.filter(".current"),
				go = 0;
				
			if(!goScroll) {
				goScroll = true;
				if (event.keyCode == 37 || event.keyCode == 38) {//влево или вверх
					if(currentSection.prev().length) {
						screenScroll--;
						go = 1;
					}
				} else if (event.keyCode == 39 || event.keyCode == 40) {//вправо или вниз
					if(currentSection.next().length) {
						screenScroll++;
						go = 1;
					}
				}
			}
			if(go>0) {action.goToSection(screenScroll);}
			setTimeout(function() {goScroll = false;},options.timeout);
		};
		
		//необходима библиотека jQuery mousewheel
		$(window).on('mousewheel',function(e) {
			var currentSection = sections.filter(".current"),
				go = 0;
			if(!goScroll) {
				goScroll = true;
				if(e.deltaY>0) {//вверх
					if(currentSection.prev().length) {
						screenScroll--;
						go = 1;
					}
				} else {//вниз
					if(currentSection.next().length) {
						screenScroll++;
						go = 1;
					}
				}
			}
			if(go>0) {action.goToSection(screenScroll);}
			setTimeout(function() {goScroll = false;},options.timeout);
		});
		
		//при свайпе страницы
		if(typeof $.fn.swipe !== 'undefined') {
			$("#mainbody").swipe({
				min_x: 40,
				max_x: 80,
				min_y: 40,
				max_y: 80,
				swipeDown:function() {
					var currentSection = sections.filter(".current");
					if(currentSection.prev().length) {
						screenScroll--;
						action.goToSection(screenScroll);
						setTimeout(function() {goScroll = false;},options.timeout);
					}
				},
				swipeUp:function() {
					var currentSection = sections.filter(".current");
					if(currentSection.next().length) {
						screenScroll++;
						action.goToSection(screenScroll);
						setTimeout(function() {goScroll = false;},options.timeout);
					}
				},
			});
		}
		
		var action = {
			showSection:function(tab) {
				if(tab == '' || typeof tab == 'undefined') {
					var screen = 0;
				} else {
					var currentNum = tab.replace(/#/,''),
						section = sections.filter('.'+currentNum),
						screen = sections.index(section),
						screen = (screen>=0)?screen:0;
				}
				action.goToSection(screen);
				screenScroll = screen;
			},
			selectNavMenu:function(screen) {
				if(options.navMenu) {
					var li = options.navMenu.find("ul>li"),
						that = li.eq(screen).find(">a");
					
					that.closest('ul').find('li.current').removeClass('current');
					that.parent('li').addClass('current');
				}
			},
			goToSection:function(screen) {
				var position = (-screen * 100) + '%',
					curSection = sections.eq(screen);
				
				if(curSection.length) {
					curSection.addClass('current').siblings().removeClass('current');
					that.css('top',position);
					
					action.selectNavMenu(screen);
					
					window.location.hash = curSection.attr('data-section');
				}
			}
		};
		
	};
})();

$(document).ready(function() {
	$("#mainbody").pageScroll({
		timeout: 600,
		navMenu: $("#nav"),
	});
	$(".adaptive_menu_button[name!=topMenu]").each(function() {
		$(this).click(function() {
			if($(this).hasClass('click')) {
				$(this).removeClass('click');
			} else {
				$(this).addClass('click');
			}
			
			var name = $(this).attr("name");
			if(name=="" || typeof name == "undefined") {return false;}
			$("#"+name).slideToggle(240);
		});
	});
});