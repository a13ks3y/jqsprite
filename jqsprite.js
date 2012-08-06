/**
 * Just sprite animation plugin for jQuery. No more
 * @author   : yezhyk dev.dzyu@gmail.com
 */
(function (window, $) {
	"use strict";

	$.fn.sprite = (function() {

		// Default sprite options
		var defaultData = {
			// Sprite image src
			image: null,
			// Current animation
			animation: null,
			// Current frame left offset
			x: 0,
			// Current frame top offset
			y: 0,
			// Current animation width
			width: 0,
			// Current animation height
			height: 0,
			// setInterval id
			intervalId: null,
			// Current frame. If null it means animations is stopped
			frame: 0,
			// Number of ids in animation
			animationLastIndex: null,
			// Fps
			fps: 12,
			// Is animation paused
			paused: true,
			// Loop or don't loop
			loop: false,
			// Was sprite on this element initialized or wasn't
			initialized: false
		};

		/**
		 * Initialize animation
		 * @param {HTMLElement} element
		 */
		function update(element, options) {
			element = $(element);

			// If sprite in this element was initialized previously it has some data
			var oldData = element.data('sprite'),
				// New data
				data;

			// Extend default data with old data, sprite descriptor and options
			data = $.extend(null, defaultData, oldData, options);

			// Save new data to the element
			element.data('sprite', data);

			// update element's style
			element.css({
				width: data.width,
				height: data.height,
				backgroundImage: 'url(' + data.sprite.image + ')',
				backgroundPosition: -data.x + 'px ' + -data.y + 'px',
				backgroundRepeat: 'no'
			});

			if(options.animation) {
				setAnimation(element, data, data.animation);
			}

			// If don't initialized now and bindings are allowed
			if(!data.initialized || !data.nobind) {
				// pause
				element.bind('pause', function() {
					pause(element, element.data('sprite'));
				});
				// stop
				element.bind('stop', function() {
					stop(element, element.data('sprite'));
				});
				// play
				element.bind('play', function() {
					play(element, element.data('sprite'));
				});
				// update options
				element.bind('set', function(event, options) {
					update(element, options);
				});
				// update options
				element.bind('render', function(event, options) {
					$.extend(data, options);
					render(element, data);
				});
				// update options
				element.bind('animation', function(event, animation) {
					setAnimation(element, data, animation);
				});
				// update options
				element.bind('destroy', function(event, full) {
					destroy(element, data, full);
				});
			}
			if(!data.paused) {
				play(element, data);
			}

			data.initialized = true;
		}

		/**
		 *
		 * @param {HTMLElement} element
		 * @param {Object} data
		 * @param {Boolean} full (optional) Do full remove with dom elements
		 */
		function destroy(element, data, full) {
			element = $(element);
			stop(element, data);
			element.data('sprite', null);
			if(full) {
				element.detach();
				return;
			}
			element.css({
				backgroundImage: 'none',
				backgroundPosition: '0px 0px'
			});
			element.removeClass('sprite');
		}

		/**
		 * Set animation
		 * @param {HTMLElement} element
		 * @param {Object} data
		 * @param {String} animationName
		 */
		function setAnimation(element, data, animationName) {
			var animation = data.sprite.animations[animationName],
				frameset;
			if(animation) {
				frameset = data.sprite.framesets[animation.frameset];
				data.animation = animation.frames;
				data.animationLastIndex = data.animation.length;
				data.frame = 0;
				data.width = frameset.width;
				data.height = frameset.height;

				renderFrame(element, data);
			}
		}

		/**
		 * Render frame with params
		 * @param {HTMLElement} element
		 * @param {Object} data
		 */
		function render(element, data) {
			console.log(data);
			$(element).css({
				width	: data.width,
				height	: data.height,
				backgroundPosition: -data.x + 'px ' + -data.y + 'px'
			});
		}

		/**
		 * Render sprite by current frame and animations
		 */
		function renderFrame(element, data) {
			if(!data.animation) {
				return;
			}

			element = $(element);

			data.x = data.animation[data.frame] * data.width;
			element.css({
				width: data.width,
				height: data.height,
				backgroundPosition: -data.x + 'px ' + -data.y + 'px'
			})
		}

		/**
		 * Go to the next frame
		 * @param {HTMLElement} element
		 * @param {Object} data
		 */
		function nextFrame(element, data) {
			if(!data.animation || !data.animationLastIndex) {
				return;
			}
			element = $(element);

			if(data.frame === 0) {
				element.trigger('begun');
			}

			data.frame++;
			if(data.frame >= data.animationLastIndex) {
				if(data.loop) {
					data.frame = 0;
					element.trigger('begun');
				} else {
					pause(element, data);
				}
				element.trigger('finished');
			} else {
				renderFrame(element, data);
				element.trigger('nextFrame', data.frame);
			}
			data.intervalId = setTimeout(function() {
				nextFrame(element, data);
			}, data.speed);
		}

		/**
		 *
		 * @param {HTMLElement} element
		 * @param {Object} data
		 * @param {Number} frame
		 */
		function frame(element, data, frame) {
			data.frame = (typeof frame === 'number') ? frame : data.frame;
			renderFrame(element, data);
		}

		/**
		 * Play animation
		 * @param {HTMLElement} element
		 * @param {Object} data
		 */
		function play(element, data) {
			pause(element, data);
			data.speed = Math.floor(1000 / data.fps);
			data.intervalId = setTimeout(function() {
				nextFrame(element, data);
			}, data.speed);
			$(element).trigger('started', data.frame);
		}

		/**
		 * Play animation
		 * @param {HTMLElement} element
		 * @param {Object} data
		 */
		function pause(element, data) {
			clearTimeout(data.intervalId);
			$(element).trigger('paused');
		}

		/**
		 * Stop animation
		 * @param {HTMLElement} element
		 * @param {Object} data
		 */
		function stop(element, data) {
			clearTimeout(data.intervalId);
			data.frame = 0;
			renderFrame(element, data);
			$(element).trigger('stopped', data.frame);
		}

		/**
		 * Public function
		 * @return {jQuery.Object}
		 */
		return function(options, additionalOptions) {
			// Init each element
			this.each(function(index, element) {
				if(typeof options === 'string') {
					var data = $(element).data('sprite');
					if(!data.initialized) {
						return;
					}
					switch(options) {
						case 'animation': {
							setAnimation(element, data, additionalOptions);
							break;
						}
						case 'play': {
							play(element, data);
							break;
						}
						case 'pause': {
							pause(element, data);
							break;
						}
						case 'stop': {
							stop(element, data);
							break;
						}
						case 'render': {
							render(element, data);
							break;
						}
						case 'frame': {
							frame(element, data, additionalOptions);
							break;
						}
						case 'destroy': {
							destroy(element, data, additionalOptions);
							break;
						}
					}
				} else {
					update(element, options);
				}
			});
			return this;
		};
	}());

}(window, window.jQuery));