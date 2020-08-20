

// Бургер --------------------
let burger = document.querySelector(".header__burger");
let burgerBtn = document.querySelector(".header__button");

document.querySelector(".header__button").addEventListener("click", () => {
	burger.classList.toggle('active');
	burgerBtn.classList.toggle('active');
});
//----------------------------


// hover Details -------------
if (window.location.href == "http://localhost:8848/") {
	let detBtn = document.querySelector(".details__button");
	let detWrap = document.querySelector(".details__wrapper");

	detBtn.addEventListener("mouseover", () => {
		detWrap.classList.add('active');
	});
	detBtn.addEventListener("mouseout", () => {
		detWrap.classList.remove('active');
	});
}
//----------------------------


// hover FOOTER --------------
let fotNet = document.querySelectorAll(".footer__network");
let textLine = document.querySelector(".footer__text");

fotNet.forEach( function(element, index) {
	element.addEventListener("mouseover", () => {
		switch (index) {
			case 0:
				textLine.classList.add("fb");
				break;
			case 1:
				textLine.classList.add("tr");
				break;
			case 2:
				textLine.classList.add("ig");
				break;
		}
	});
});
fotNet.forEach( function(element, index) {
	element.addEventListener("mouseout", () => {
		switch (index) {
			case 0:
				textLine.classList.remove("fb");
				break;
			case 1:
				textLine.classList.remove("tr");
				break;
			case 2:
				textLine.classList.remove("ig");
				break;
		}
	});
});
//----------------------------


// select FOSUC --------------
if (window.location.href == "http://localhost:8848/booking.html") {
	let select = document.querySelector("select");
	let selectSp = document.querySelector(".booking__select span");

	select.onfocus = () => {
		selectSp.classList.add("active");
	}
	select.onblur = () => {
		selectSp.classList.remove("active");
	}
}
//----------------------------


// footer logo rand ----------

let footerLogo = document.querySelector(".footer__logo img");

footerLogo.onmouseover = () => {
	let rand = Math.floor(Math.random() * 2);
	
	if (rand == 0) {
		footerLogo.classList.add('left');
	}
	else {
		footerLogo.classList.add('right');
	}
}

footerLogo.onmouseout = function() {
	this.classList.remove("left", "right");
}


//----------------------------

$(document).ready(function(){
	$('.slider').slick({
		dots: true,
		slidesToShow: 1,
		centerMode: false,
		appendDots: $('.dots'),
		responsive:[
			{
				breakpoint: 578,
				settings: {
					arrows: false,
					dots: false,
					autoplay: true,
					autoplaySpeed: 3500,
				}
			}
		],
	});
});


$(window).resize(function(){
	$('.slider').slick('setPosition');
});

// Dynamic Adapt v.1
// HTML data-da="where(uniq class name),position(digi),when(breakpoint)"
// e.x. data-da="item,2,992"
// Andrikanych Yevhen 2020
// https://www.youtube.com/c/freelancerlifestyle

"use strict";

(function () {
	let originalPositions = [];
	let daElements = document.querySelectorAll('[data-da]');
	let daElementsArray = [];
	let daMatchMedia = [];
	//Заполняем массивы
	if (daElements.length > 0) {
		let number = 0;
		for (let index = 0; index < daElements.length; index++) {
			const daElement = daElements[index];
			const daMove = daElement.getAttribute('data-da');
			if (daMove != '') {
				const daArray = daMove.split(',');
				const daPlace = daArray[1] ? daArray[1].trim() : 'last';
				const daBreakpoint = daArray[2] ? daArray[2].trim() : '767';
				const daType = daArray[3] === 'min' ? daArray[3].trim() : 'max';
				const daDestination = document.querySelector('.' + daArray[0].trim())
				if (daArray.length > 0 && daDestination) {
					daElement.setAttribute('data-da-index', number);
					//Заполняем массив первоначальных позиций
					originalPositions[number] = {
						"parent": daElement.parentNode,
						"index": indexInParent(daElement)
					};
					//Заполняем массив элементов 
					daElementsArray[number] = {
						"element": daElement,
						"destination": document.querySelector('.' + daArray[0].trim()),
						"place": daPlace,
						"breakpoint": daBreakpoint,
						"type": daType
					}
					number++;
				}
			}
		}
		dynamicAdaptSort(daElementsArray);

		//Создаем события в точке брейкпоинта
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daBreakpoint = el.breakpoint;
			const daType = el.type;

			daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)"));
			daMatchMedia[index].addListener(dynamicAdapt);
		}
	}
	//Основная функция
	function dynamicAdapt(e) {
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daElement = el.element;
			const daDestination = el.destination;
			const daPlace = el.place;
			const daBreakpoint = el.breakpoint;
			const daClassname = "_dynamic_adapt_" + daBreakpoint;

			if (daMatchMedia[index].matches) {
				//Перебрасываем элементы
				if (!daElement.classList.contains(daClassname)) {
					let actualIndex = indexOfElements(daDestination)[daPlace];
					if (daPlace === 'first') {
						actualIndex = indexOfElements(daDestination)[0];
					} else if (daPlace === 'last') {
						actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length];
					}
					daDestination.insertBefore(daElement, daDestination.children[actualIndex]);
					daElement.classList.add(daClassname);
				}
			} else {
				//Возвращаем на место
				if (daElement.classList.contains(daClassname)) {
					dynamicAdaptBack(daElement);
					daElement.classList.remove(daClassname);
				}
			}
		}
		customAdapt();
	}

	//Вызов основной функции
	dynamicAdapt();

	//Функция возврата на место
	function dynamicAdaptBack(el) {
		const daIndex = el.getAttribute('data-da-index');
		const originalPlace = originalPositions[daIndex];
		const parentPlace = originalPlace['parent'];
		const indexPlace = originalPlace['index'];
		const actualIndex = indexOfElements(parentPlace, true)[indexPlace];
		parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
	}
	//Функция получения индекса внутри родителя
	function indexInParent(el) {
		var children = Array.prototype.slice.call(el.parentNode.children);
		return children.indexOf(el);
	}
	//Функция получения массива индексов элементов внутри родителя 
	function indexOfElements(parent, back) {
		const children = parent.children;
		const childrenArray = [];
		for (let i = 0; i < children.length; i++) {
			const childrenElement = children[i];
			if (back) {
				childrenArray.push(i);
			} else {
				//Исключая перенесенный элемент
				if (childrenElement.getAttribute('data-da') == null) {
					childrenArray.push(i);
				}
			}
		}
		return childrenArray;
	}
	//Сортировка объекта
	function dynamicAdaptSort(arr) {
		arr.sort(function (a, b) {
			if (a.breakpoint > b.breakpoint) { return -1 } else { return 1 }
		});
		arr.sort(function (a, b) {
			if (a.place > b.place) { return 1 } else { return -1 }
		});
	}
	//Дополнительные сценарии адаптации
	function customAdapt() {
		//const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	}
}());
AOS.init({
	disable: 'phone', // Не будет работать на: 'phone', 'tablet', 'mobile', boolean, expression or function
  // useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
  // disableMutationObserver: false, // disables automatic mutations' detections (advanced)
  // debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
  // throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)
  

  offset: 100, // Попав в поле зрения на *** пикселей, элемент появится
  // delay: 1000, // Задержка исполнения анимации в мс.
  duration: 1000, // Скорость анимации в мс.
  // easing: 'ease', // Тип анимации
  once: true, // При скролле обратно будет ли объект анимироваться снова (true == нет)
  // anchorPlacement: 'top-bottom', // Определяет, какая позиция элемента относительно окна должна запускать анимацию
});