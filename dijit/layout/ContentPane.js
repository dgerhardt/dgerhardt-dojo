define(
	[
		"dojo/_base/declare",
		"dojo/Evented",
		"dojo/dom-construct",
		"dojo/dom-class",
		"dojo/dom-style",
		"dijit/layout/ContentPane"
	],
	function (declare, Evented, domConstruct, domClass, domStyle, ContentPane) {
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
				this.positionOverlayMessage();
			},
			
			positionOverlayMessage: function () {
				if (this.overlayMsgNode && this._contentBox) {
					domStyle.set(this.overlayMsgNode, "left", (this._contentBox.w - this.overlayMsgNode.offsetWidth) / 2 + "px");
					domStyle.set(this.overlayMsgNode, "top", (this._contentBox.h - this.overlayMsgNode.offsetHeight) / 2 + "px");
				}
			},
			
			startup: function () {
				if (this._started) {
					return;
				}
				
				ContentPane.prototype.startup.call(this);
				this.overlayNode = domConstruct.create("div", {"class": "paneMessageOverlay"}, this.domNode);
				this.overlayMsgNode = domConstruct.create("div", null, this.overlayNode);
				domStyle.set(this.overlayNode, "display", "none");
				domStyle.set(this.overlayNode, "background", "rgba(0, 0, 0, 0.05)");
				domStyle.set(this.overlayNode, "position", "absolute");
				domStyle.set(this.overlayNode, "left", "0");
				domStyle.set(this.overlayNode, "top", "0");
				domStyle.set(this.overlayNode, "width", "100%");
				domStyle.set(this.overlayNode, "height", "100%");
				domStyle.set(this.overlayMsgNode, "position", "absolute");
				domStyle.set(this.overlayMsgNode, "width", "300px");
				domStyle.set(this.overlayMsgNode, "margin", "auto");
				domStyle.set(this.overlayMsgNode, "padding", "0.5em");
				domStyle.set(this.overlayMsgNode, "textAlign", "center");
			},
			
			showModalMessage: function (message, messageClass) {
				this.overlayMsgNode.textContent = message;
				domStyle.set(this.overlayNode, "display", "");
				if (messageClass) {
					domClass.replace(this.overlayMsgNode, messageClass);
				} else {
					domClass.replace(this.overlayMsgNode, "");
				}
				this.positionOverlayMessage();
			},
			
			hideModalMessage: function () {
				domStyle.set(this.overlayNode, "display", "none");
			}
		});
	}
);
