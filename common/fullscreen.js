define(
	[
		"dojo/on",
		"dojo/keys",
		"dojo/dom-construct",
		"dojo/dom-style",
		"dojo/domReady!"
	],
	function (on, keys, domConstruct, domStyle) {
		"use strict";

		var
			mode = null,
			pageNode = null,
			fsElement = null,
			listeners = [],
			escapeKeyListener = null,
			infoDomNode = null,
			infoTimeout = null
		;

		if (document.documentElement.requestFullscreen) {
			mode = "w3c";
		} else if (document.documentElement.webkitRequestFullscreen) {
			mode = "webkit";
		} else if (document.documentElement.mozRequestFullScreen) {
			mode = "moz";
		} else if (document.documentElement.msRequestFullscreen) {
			mode = "ms";
		}
		console.debug("Full screen mode support: " + (mode ? mode : "none"));

		var fullScreen = {
			setPageNode: function (node) {
				pageNode = node;
			},

			isSupported: function () {
				return !!mode;
			},

			isEnabled: function () {
				return this.isSupported() && (document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled);
			},

			isActive: function () {
				if ((document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement)
					|| (fsElement && !this.isEnabled())
				) {
					return true;
				}

				return false;
			},

			request: function (element) {
				/* For compatibility reasons requestFullscreen is always called
				 * for document.documentElement instead of the specific element */
				var doc = document.documentElement;
				if (!element) {
					fsElement = doc;
				} else {
					fsElement = element;
					domStyle.set(pageNode, "display", "none");
					domStyle.set(fullScreenNode, "display", "block");
					domConstruct.place(element, fullScreenNode);
				}

				switch (mode) {
				case "w3c":
					doc.requestFullscreen();
					break;
				case "webkit":
					doc.webkitRequestFullScreen();
					break;
				case "moz":
					doc.mozRequestFullScreen();
					break;
				case "ms":
					doc.msRequestFullscreen();
					break;
				default:
					/* call onChange listeners manually */
					for (var i = 0; i < listeners.length; i++) {
						listeners[i](null, true);
					}
					startEscapeKeyListener();
					break;
				}
			},

			exit: function () {
				domStyle.set(fullScreenNode, "display", "none");
				domStyle.set(pageNode, "display", "block");
				if (escapeKeyListener) {
					escapeKeyListener.remove();
					for (var i = 0; i < listeners.length; i++) {
						listeners[i](null, false);
					}
				}
				fsElement = null;

				switch (mode) {
				case "w3c":
					document.exitFullscreen();
					break;
				case "webkit":
					document.webkitCancelFullScreen();
					break;
				case "moz":
					document.mozCancelFullScreen();
					break;
				case "ms":
					document.msCancelFullscreen();
					break;
				default:
					return false;
				}

				return true;
			},

			toggle: function (element) {
				return this.isActive() ? this.exit() : this.request(element);
			},

			onChange: function (listener) {
				var self = this;

				on(document, "fullscreenchange, webkitfullscreenchange, mozfullscreenchange, msfullscreenchange", function (event) {
					listener(event, self.isActive());
				});
				listeners.push(listener);
			},

			onError: function (listener) {
				on(document, "fullscreenerror, webkitfullscreenerror, mozfullscreenerror, msfullscreenerror", function (event) {
					listener(event);
				});
			},
		};

		var fullScreenNode = domConstruct.create("div", {id: "fullScreenWrapper"}, document.body);
		domStyle.set(fullScreenNode, "display", "none");
		domStyle.set(fullScreenNode, "width", "100%");
		domStyle.set(fullScreenNode, "height", "100%");

		infoDomNode = domConstruct.create("div", {id: "fullScreenInfo", innerHTML: "Full screen mode activated. Press ESC (or double tap) to exit."}, document.body);
		domStyle.set(infoDomNode, "display", "none");

		fullScreen.onChange(function (event, isActive) {
			if (!isActive) {
				domStyle.set(fullScreenNode, "display", "none");
				domStyle.set(pageNode, "display", "block");
				domStyle.set(infoDomNode, "display", "none");
				if (infoTimeout) {
					clearTimeout(infoTimeout);
				}
				fsElement = null;
			}
		});

		fullScreen.onError(function () {
			/* call onChange listeners manually */
			for (var i = 0; i < listeners.length; i++) {
				listeners[i](null, true);
			}
			startEscapeKeyListener();
			showFullScreenInfo();
		});

		on(fullScreenNode, "dblclick", function () {
			fullScreen.exit();
		});

		var startEscapeKeyListener = function () {
			if (escapeKeyListener) {
				escapeKeyListener.remove();
			}
			escapeKeyListener = on(document, "keydown", function (event) {
				if (keys.ESCAPE === event.keyCode) {
					fullScreen.exit();
				}
			});
		};

		var showFullScreenInfo = function () {
			domStyle.set(infoDomNode, "display", "block");
			infoTimeout = setTimeout(function () {
				domStyle.set(infoDomNode, "display", "none");
			}, 5000);
		};

		return fullScreen;
	}
);
