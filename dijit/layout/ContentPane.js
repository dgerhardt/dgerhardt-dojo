define(
	[
		"dojo/_base/declare",
		"dojo/Evented",
		"dijit/layout/ContentPane"
	],
	function (declare, Evented, ContentPane) {
		"use strict";

		return declare("ContentPane", [ContentPane, Evented], {
			resize: function () {
				ContentPane.prototype.resize.apply(this, arguments);
				var w = arguments[0] ? arguments[0].w : -1;
				var h = arguments[0] ? arguments[0].h : -1;
				this.emit("resize", {
					bubbles: false,
					cancelable: false,
					w: w,
					h: h
				});
			}
		});
	}
);
