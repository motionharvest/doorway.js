(function(root, factory) {
	'use strict';

	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define([], factory);
	}
	else if (typeof exports === 'object') {
		// COMMONJS
		module.exports = factory();
	}
	else {
		// BROWSER
		root.Doorway = factory();
	}
}(this, function() {
	'use strict';

	function Doorway(elem, options){
		var options = (options !== undefined) ? options : {
				offset: 0
			},
			mathutils = {
				normalize: function($value, $min, $max) {
					return ($value - $min) / ($max - $min);
				},

				interpolate: function($normValue, $min, $max) {
					return $min + ($max - $min) * $normValue;
				},

				map: function($value, $min1, $max1, $min2, $max2) {

					if ($value < $min1) {
						$value = $min1;
					}

					if ($value > $max1) {
						$value = $max1;
					}

					var res = this.interpolate(this.normalize($value, $min1, $max1), $min2, $max2);
					return res;
				}
			};

		var h = elem,
			hi = h.outerHeight(),
			scrollTop = 0,
			delta = 0,
			y = 0,
			airborne = false,
			pinTop = options.offset,
			revealing = false,
			revealed = true,
			hiding = false,
			hidden = false;

		$(document).on('touchmove scroll', function(evt) {

			//figure out how far we've scrolled since the last scroll event
			delta = scrollTop;
			scrollTop = $(window).scrollTop();
			scrollTop = (scrollTop < 0)? 0 : scrollTop;
			delta = scrollTop - delta;

			if (scrollTop > options.offset) {
				airborne = true;
			} else {
				airborne = false;
				pinTop = options.offset;
			}

			if(airborne && delta > 0) {

				if(revealed) {
					revealed = false;
					hiding = true;
					pinTop = scrollTop;
				}

				if(hiding) {
					y = mathutils.map(scrollTop, pinTop, pinTop + hi, 0, -hi);
					if(y == -hi) {
						hidden = true;
						hiding = false;
						console.log("hidden");
						options.onUnpin();
					}
				}else if(revealing){
					y = mathutils.map(scrollTop, pinTop - hi, pinTop, 0, -hi);
					if(y == -hi) {
						hidden = true;
						hiding = false;
						revealing = false;
						console.log("hidden2");
						options.onUnpin();
					}
				}

			} else if (delta < 0) {

				if (hidden) {
					revealing = true;
					hidden = false;
					pinTop = scrollTop;
				}

				if (revealing) {
					y = mathutils.map(scrollTop, pinTop - hi, pinTop, 0, -hi);
					if (y == 0) {
						revealed = true;
						revealing = false;
						console.log("shown");
						options.onPin();
					}
				}else if(hiding){
					y = mathutils.map(scrollTop, pinTop, pinTop + hi, 0, -hi);
					if (y == 0) {
						revealed = true;
						revealing = false;
						hiding = false;
						console.log("shown2");
						options.onPin();
					}
				}

			}

			h.css("top", y);

		});
	}


	return Doorway;
}));



