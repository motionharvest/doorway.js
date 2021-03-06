;(function(){
	//supporting methods
	function normalize ($value, $min, $max) {
		return ($value - $min) / ($max - $min);
	}

	function interpolate ($normValue, $min, $max) {
		return $min + ($max - $min) * $normValue;
	}

	function map ($value, $min1, $max1, $min2, $max2) {
			if ($value < $min1) {
				$value = $min1;
			}
			if ($value > $max1) {
				$value = $max1;
			}
			return interpolate(normalize($value, $min1, $max1), $min2, $max2);
	}

	function getScrollTop() {
		if (window.pageYOffset != undefined) {
			return pageYOffset;
		} else {
			var sy, d = document,
				r = d.documentElement,
				b = d.body;
			sy = r.scrollTop || b.scrollTop || 0;
			return sy;
		}
	}

	function outerHeight(el) {
		var height = el.offsetHeight;
		var style = getComputedStyle(el);

		height += parseInt(style.marginTop) + parseInt(style.marginBottom);
		return height;
	}

	Doorway = function(options){
		
		var config = {
			header: '[data-doorway]',
			pusher: '[data-doorway-push]',
			scrub: function(offset) {
				//blank
			}
		}
		
		//define header and pusher from optional config
		if(options !== undefined) {
			if(options.hasOwnProperty('scrub')) {
				config.scrub = options.scrub;
			}
			if (options.hasOwnProperty('header')) {
				if(typeof options.header === 'string') {
					config.header = document.querySelector(options.header);
				} else {
					config.header = options.header
				}
			} else {
				config.header = document.querySelector(config.header);
			}
			if (options.hasOwnProperty('pusher')) {
				if(typeof options.pusher === 'string') {
					config.pusher = document.querySelector(options.pusher);
				} else {
					config.pusher = options.pusher
				}
			} else {
				config.pusher = document.querySelector(config.pusher);
			}
		} else {
			config.header = document.querySelector(config.header);
			config.pusher = document.querySelector(config.pusher);
		}

		// flags
		var revealing = false,
		revealed = true,
		hiding = false,
		hidden = false,
		airborne = true;

		//values
		var hi = outerHeight(config.header),
		scrollTop = getScrollTop(),
		delta = 0,
		y,
		deadZone = (!config.pusher) ? 0 : (config.pusher.getBoundingClientRect().top + getScrollTop()) - hi,
		pinTop = 0;

		//scroll event
		document.addEventListener('scroll', function (evt) {
			//determine delta
			delta = scrollTop;
			scrollTop = (getScrollTop() < 0) ? 0 : getScrollTop();
			delta = scrollTop - delta;
			
			//determine state
			if (scrollTop > deadZone) {
				airborne = true;
			} else {
				airborne = false;
				pinTop = deadZone;
			}
			
			if (airborne && delta > 0) {
	
				if (revealed) {
					revealed = false;
					hiding = true;
					pinTop = scrollTop;
				}
	
				if (hiding) {
					y = map(scrollTop, pinTop, pinTop + hi, 0, 1);
					config.scrub(y);
					if (y == 1) {
						hidden = true;
						hiding = false;
					}
				} else if (revealing) {
					y = map(scrollTop, pinTop - hi, pinTop, 0, 1);
					config.scrub(y);
					if (y == 1) {
						hidden = true;
						hiding = false;
						revealing = false;
					}
				}
	
			} else if (delta < 0) {
	
				if (hidden) {
					revealing = true;
					hidden = false;
					pinTop = scrollTop;
				}
	
				if (revealing) {
					y = map(scrollTop, pinTop - hi, pinTop, 0, 1);
					config.scrub(y);
					if (y == 0) {
						revealed = true;
						revealing = false;
					}
				} else if (hiding) {
					y = map(scrollTop, pinTop, pinTop + hi, 0, 1);
					config.scrub(y);
					if (y == 0) {
						revealed = true;
						revealing = false;
						hiding = false;
					}
				}
	
			}
			
			config.header.style.transform = "translateY(" + (y * -hi) + "px)";
		});

		return {
			refresh: function() {
				hi = outerHeight(config.header);
				deadZone = (!config.pusher) ? 0 : (config.pusher.getBoundingClientRect().top + getScrollTop()) - hi;
				
				document.dispatchEvent(new Event('scroll'));
			}
		}
	}
})();