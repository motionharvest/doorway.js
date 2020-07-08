//utils
var mathutils = {
	normalize: function ($value, $min, $max) {
		return ($value - $min) / ($max - $min);
	},

	interpolate: function ($normValue, $min, $max) {
		return $min + ($max - $min) * $normValue;
	},

	map: function ($value, $min1, $max1, $min2, $max2) {

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

document.getScrollTop = function () {
	if (window.pageYOffset != undefined) {
		return pageYOffset;
	} else {
		var sx, sy, d = document,
			r = d.documentElement,
			b = d.body;
		sy = r.scrollTop || b.scrollTop || 0;
		return sy;
	}
}

/**
 * Calculates the outer height for the given DOM element, including the 
 * contributions of padding, border, and margin.
 * 
 * @param el - the element of which to calculate the outer height
 */
function outerHeight(el) {
	var height = el.offsetHeight;
	var style = getComputedStyle(el);

	height += parseInt(style.marginTop) + parseInt(style.marginBottom);
	return height;
}


//ondocument load
window.addEventListener('DOMContentLoaded', function(event) {
	//need some elements
	var header = document.querySelector('[data-doorway]');
	var pusher = document.querySelector('[data-doorway-push]');
	
	var h = header,
		hi = h.getBoundingClientRect().height,
		scrollTop = 0,
		delta = 0,
		y = 0,
		airborne = false,
		offset = (!pusher) ? 0 : pusher.getBoundingClientRect().top - hi,
		pinTop = 0,
		revealing = false,
		revealed = true,
		hiding = false,
		hidden = false;

	console.log(offset);



	window.addEventListener('scroll', function (evt) {


		//figure out how far we've scrolled since the last scroll event
		delta = scrollTop;
		scrollTop = document.getScrollTop();
		scrollTop = (scrollTop < 0) ? 0 : scrollTop;
		delta = scrollTop - delta;

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
				y = mathutils.map(scrollTop, pinTop, pinTop + hi, 0, -hi);
				if (y == -hi) {
					hidden = true;
					hiding = false;
				}
			} else if (revealing) {
				y = mathutils.map(scrollTop, pinTop - hi, pinTop, 0, -hi);
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
				y = mathutils.map(scrollTop, pinTop - hi, pinTop, 0, -hi);
				if (y == 0) {
					revealed = true;
					revealing = false;
				}
			} else if (hiding) {
				y = mathutils.map(scrollTop, pinTop, pinTop + hi, 0, -hi);
				if (y == 0) {
					revealed = true;
					revealing = false;
					hiding = false;
				}
			}

		}

		h.style.top = y;

	});
});






