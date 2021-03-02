'use strict';
var __assign =
	(this && this.__assign) ||
	function() {
		__assign =
			Object.assign ||
			function(t) {
				for (var s, i = 1, n = arguments.length; i < n; i++) {
					s = arguments[i];
					for (var p in s)
						if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
				}
				return t;
			};
		return __assign.apply(this, arguments);
	};
exports.__esModule = true;
exports.MarkdownField = void 0;
var React = require('react');
var slate_react_1 = require('slate-react');
var slate_1 = require('slate');
var slate_history_1 = require('slate-history');
var SHORTCUTS = {
	'*': 'list-item',
	'-': 'list-item',
	'+': 'list-item',
	'>': 'block-quote',
	'#': 'heading-one',
	'##': 'heading-two',
	'###': 'heading-three',
	'####': 'heading-four',
	'#####': 'heading-five',
	'######': 'heading-six',
};
exports.MarkdownField = function(props) {
	var renderElement = React.useCallback(function(props) {
		return React.createElement(Element, __assign({}, props));
	}, []);
	var editor = React.useMemo(function() {
		return withShortcuts(
			slate_react_1.withReact(
				slate_history_1.withHistory(slate_1.createEditor()),
			),
		);
	}, []);
	return React.createElement(
		slate_react_1.Slate,
		{
			editor: editor,
			value: props.content,
			onChange: function(value) {
				return props.setContent(value);
			},
		},
		React.createElement(slate_react_1.Editable, {
			renderElement: renderElement,
			placeholder: 'Write some markdown...',
			spellCheck: true,
			autoFocus: true,
		}),
	);
};
var withShortcuts = function(editor) {
	var deleteBackward = editor.deleteBackward,
		insertText = editor.insertText;
	editor.insertText = function(text) {
		var selection = editor.selection;
		if (text === ' ' && selection && slate_1.Range.isCollapsed(selection)) {
			var anchor = selection.anchor;
			var block = slate_1.Editor.above(editor, {
				match: function(n) {
					return slate_1.Editor.isBlock(editor, n);
				},
			});
			var path = block ? block[1] : [];
			var start = slate_1.Editor.start(editor, path);
			var range = { anchor: anchor, focus: start };
			var beforeText = slate_1.Editor.string(editor, range);
			var type = SHORTCUTS[beforeText];
			if (type) {
				slate_1.Transforms.select(editor, range);
				slate_1.Transforms['delete'](editor);
				var newProperties = {
					type: type,
				};
				slate_1.Transforms.setNodes(editor, newProperties, {
					match: function(n) {
						return slate_1.Editor.isBlock(editor, n);
					},
				});
				if (type === 'list-item') {
					var list = { type: 'bulleted-list', children: [] };
					slate_1.Transforms.wrapNodes(editor, list, {
						match: function(n) {
							return (
								!slate_1.Editor.isEditor(n) &&
								slate_1.Element.isElement(n) &&
								n.type === 'list-item'
							);
						},
					});
				}
				return;
			}
		}
		insertText(text);
	};
	editor.deleteBackward = function() {
		var args = [];
		for (var _i = 0; _i < arguments.length; _i++) {
			args[_i] = arguments[_i];
		}
		var selection = editor.selection;
		if (selection && slate_1.Range.isCollapsed(selection)) {
			var match = slate_1.Editor.above(editor, {
				match: function(n) {
					return slate_1.Editor.isBlock(editor, n);
				},
			});
			if (match) {
				var block = match[0],
					path = match[1];
				var start = slate_1.Editor.start(editor, path);
				if (
					!slate_1.Editor.isEditor(block) &&
					slate_1.Element.isElement(block) &&
					block.type !== 'paragraph' &&
					slate_1.Point.equals(selection.anchor, start)
				) {
					var newProperties = {
						type: 'paragraph',
					};
					slate_1.Transforms.setNodes(editor, newProperties);
					if (block.type === 'list-item') {
						slate_1.Transforms.unwrapNodes(editor, {
							match: function(n) {
								return (
									!slate_1.Editor.isEditor(n) &&
									slate_1.Element.isElement(n) &&
									n.type === 'bulleted-list'
								);
							},
							split: true,
						});
					}
					return;
				}
			}
			deleteBackward.apply(void 0, args);
		}
	};
	return editor;
};
var Element = function(_a) {
	var attributes = _a.attributes,
		children = _a.children,
		element = _a.element;
	switch (element.type) {
		case 'block-quote':
			return React.createElement(
				'blockquote',
				__assign({}, attributes),
				children,
			);
		case 'bulleted-list':
			return React.createElement('ul', __assign({}, attributes), children);
		case 'heading-one':
			return React.createElement('h1', __assign({}, attributes), children);
		case 'heading-two':
			return React.createElement('h2', __assign({}, attributes), children);
		case 'heading-three':
			return React.createElement('h3', __assign({}, attributes), children);
		case 'heading-four':
			return React.createElement('h4', __assign({}, attributes), children);
		case 'heading-five':
			return React.createElement('h5', __assign({}, attributes), children);
		case 'heading-six':
			return React.createElement('h6', __assign({}, attributes), children);
		case 'list-item':
			return React.createElement('li', __assign({}, attributes), children);
		default:
			return React.createElement('p', __assign({}, attributes), children);
	}
};
