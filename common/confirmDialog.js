define(
	[
		"dojo/dom-construct",
		"dijit/form/Button",
		"dijit/Dialog"
	],
	function(domConstruct, Button, Dialog) {
		"use strict";
		
		return {
			confirm: function(title, message, buttons) {
				var dialog = null;
				var confirmContentNode = domConstruct.create("div", {"class": "confirmDialogContent", innerHTML: message});
				var buttonWrapperNode = domConstruct.create("div", {"class": "confirmDialogButtons"}, confirmContentNode);
				for (var button in buttons) {
					(function(button) {
						new Button({
							label: button,
							onClick: function() {
								if (null != buttons[button]) {
									/* run callback function */
									buttons[button]();
								}
								dialog.hide();
							}
						}).placeAt(buttonWrapperNode).startup();
					})(button);
				}
				(dialog = new Dialog({
					title: title,
					content: confirmContentNode
				})).show();
			}
		};
	}
);
