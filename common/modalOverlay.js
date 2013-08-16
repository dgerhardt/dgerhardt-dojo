define(
	[
		"dojo/on",
		"dojo/keys",
		"dojo/dom",
		"dojo/dom-construct",
		"dojo/dom-style",
		"dijit/a11yclick"
	],
	function (on, keys, dom, domConstruct, domStyle, a11yclick) {
		"use strict";

		var
			self = null,

			/* DOM */
			modalNode = null,
			overlayNode = null
		;

		self = {
			show: function (_modalNode, cancelable, onHide) {
				modalNode = _modalNode;

				overlayNode = domConstruct.create("div", {id: "modalOverlay", tabindex: 0}, document.body);
				domConstruct.place(modalNode, overlayNode);

				if (cancelable) {
					on(overlayNode, a11yclick, function () {
						self.hide();
					});
					on(overlayNode, "keydown", function (event) {
						if (keys.ESCAPE === event.keyCode) {
							self.hide();
						}
					});
				}

				self.onHide = onHide;

				/* event capture phase not yet supported by dojo/on */
				document.addEventListener("focus", self.onFocus, true);
				overlayNode.focus();
			},

			hide: function () {
				if (self.onHide) {
					self.onHide();
				}
				document.removeEventListener("focus", self.onFocus, true);
				domConstruct.destroy(overlayNode);
			},

			onFocus: function (event) {
				/* event.target is not supported by IE < 9 */
				if (overlayNode !== event.target && !dom.isDescendant(event.target, modalNode)) {
					event.stopPropagation();
					var focusElement = overlayNode;
					focusElement.focus();
				}
			}
		};

		return self;
	}
);
