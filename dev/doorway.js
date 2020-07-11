(function(){
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

	Doorway = function(){
		var config = {
			header: '[data-doorway]',
			pusher: '[data-doorway-push]'
		}
		return {
			init: function(options) {

				//define header and pusher from optional config
				if(options !== undefined) {
					if (options.hasOwnProperty('header')) {
						if(typeof options.header === 'string') {
							config.header = document.querySelector(options.header);
						} else {
							config.header = options.header
						}
					}
					if (options.hasOwnProperty('pusher')) {
						if(typeof options.pusher === 'string') {
							config.pusher = document.querySelector(options.pusher);
						} else {
							config.pusher = options.pusher
						}
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
				airborne = false;

				//values
				var hi = config.header.getBoundingClientRect().height,
				scrollTop = 0,
				delta = 0,
				y = 0,
				offset = (!config.pusher) ? 0 : config.pusher.getBoundingClientRect().top - hi,
				pinTop = 0;

				//scroll event
				document.addEventListener('scroll', function (evt) {
					//determine delta
					delta = scrollTop;
					scrollTop = (getScrollTop() < 0) ? 0 : getScrollTop();
					delta = scrollTop - delta;
					
					//determine state
					if (scrollTop > offset) {
						airborne = true;
					} else {
						airborne = false;
						pinTop = offset;
					}
					
					if (airborne && delta > 0) {
			
						if (revealed) {
							revealed = false;
							hiding = true;
							pinTop = scrollTop;
						}
			
						if (hiding) {
							y = map(scrollTop, pinTop, pinTop + hi, 0, -hi);
							if (y == -hi) {
								hidden = true;
								hiding = false;
							}
						} else if (revealing) {
							y = map(scrollTop, pinTop - hi, pinTop, 0, -hi);
							if (y == -hi) {
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
							y = map(scrollTop, pinTop - hi, pinTop, 0, -hi);
							if (y == 0) {
								revealed = true;
								revealing = false;
							}
						} else if (hiding) {
							y = map(scrollTop, pinTop, pinTop + hi, 0, -hi);
							if (y == 0) {
								revealed = true;
								revealing = false;
								hiding = false;
							}
						}
			
					}
			
					config.header.style.top = y;
				});
			}
		}
	}
})();