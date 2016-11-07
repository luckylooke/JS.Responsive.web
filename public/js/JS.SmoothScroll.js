(function ($) {
	
	var html = $('html'),
		touch = html.is('.touch'),
		$doc = $(document),
		$win = $(window);
	
	var distance = 80,
		time = 300,
		delta = 0,
		scrolledTo = $win.scrollTop(),
		elementAnimating = false,
		easing = 'linear',
		registeredFns = [];
	
	if (!window.JS)
		window.JS = {};
	
	if ($.ui)
		easing = 'easeOutCirc';
	//easing = 'easeOutQuad';
	
	var $C = JS.SmoothScroll = function() 
	{	
		//constructor
	};
	
	var $p = $C.prototype;
	
	$C.init = function(element) {		
		this._element = element; // beztak je default na celý web, tzn. element = body, html;

		var $this = this;
		
		if (window.addEventListener) window.addEventListener('DOMMouseScroll', this._wheel, false);		
		window.onmousewheel = document.onmousewheel = function(e) { $this._wheel(e); };		
		
		$(window).scroll( function() {
			for (var i=0; i<registeredFns.length; i++) {
				registeredFns[i]($win.scrollTop());
			}
		});
		
		return this;
	};
	
	$C.register = function(fn) {
		if (typeof(fn) == "function")
			registeredFns.push(fn);	
		fn(0);
	}
	
	$C._wheel = function(event) {
		
		if (event.wheelDelta) delta = event.wheelDelta / 160;
		else if (event.detail) delta = -event.detail / 3; {	
			$C._handle();
		}
		if (event.preventDefault) event.preventDefault();
		event.returnValue = false;
		
	}
	
	$C._getScrollTopPosition = function() {
		return Math.max($(window).scrollTop(), $('html').scrollTop(), $('body').scrollTop());
	};
	
	$C._handle = function() {
		
		scrolledTo = scrolledTo - (distance * delta);
		if (scrolledTo < 0) scrolledTo = 0;
		if (scrolledTo > $doc.height() - $win.height()) scrolledTo = $doc.height() - $win.height();
		
		this._smootScroll();
		
		/*var timeScroll = $win.scrollTop() - scrolledTo;
		if (timeScroll < 0) timeScroll = timeScroll*(-1);
		timeScroll = timeScroll + 200;
		
		$('html, body').stop().animate({
			scrollTop: scrolledTo
		}, {
			duration: timeScroll, 
			easing: easing
		}); */
	};
	
	var actualPos = $C._getScrollTopPosition(),
		isScrolling = false,
		scrollKoef = 0.05,
		minScrollStep = 0.01,
		scrollProcess = null;
	
	$C._smootScroll = function() {
		var scrollStep = (scrolledTo - actualPos)*scrollKoef;
		
		clearTimeout( scrollProcess );
		isScrolling = true;
		// hotovo, doscrolloval som
		if (Math.abs(scrollStep)<0.1)
			return;
		
		if (Math.abs(scrollStep)<minScrollStep)
			scrollStep = minScrollStep * (scrollStep>0 ? 1 : -1);
	
		actualPos += scrollStep;
			
		//console.log(actualPos, scrolledTo, scrollStep)
		$('html, body').scrollTop( actualPos );
		
		var $this = this,
			$fn = arguments.callee;
		
		if (parseInt(Math.abs(actualPos-scrolledTo))!=0)
			scrollProcess = setTimeout( function() { $fn.call($this); }, 15 );
		else
			isScrolling = false;
	};
	
	
	// aktualizujem si scroll poziciu
	setInterval(function(){
		if (!isScrolling) {
			scrolledTo = $win.scrollTop();
			actualPos = scrolledTo;
		}
	}, 250);
	
})(jQuery);
