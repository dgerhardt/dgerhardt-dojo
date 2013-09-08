define(
	[
		"dojo/dom-construct",
		"dijit/form/Button",
		"dijit/Dialog"
	],
	function (domConstruct, Button, Dialog) {
		"use strict";

		var dialog = null;
		var createButton = function (label, onClickFunc) {
			return new Button({
				label: label,
				onClick: function () {
					if (onClickFunc) {
						/* run callback function */
						onClickFunc();
					}
					dialog.hide();
				}
			});
		};

		return {
			confirm: function (title, message, buttons, cancelFunc) {
				var confirmContentNode = domConstruct.create("div", {"class": "confirmDialogContent", innerHTML: message});
				var buttonWrapperNode = domConstruct.create("div", {"class": "confirmDialogButtons"}, confirmContentNode);
				for (var button in buttons) {
					if (buttons.hasOwnProperty(button)) {
						createButton(button, buttons[button]).placeAt(buttonWrapperNode).startup();
					}
				}
				cancelFunc = cancelFunc || function () {};
				(dialog = new Dialog({
					title: title,
					content: confirmContentNode,
					onCancel: cancelFunc
				})).show();
			}
		};
	}
);
