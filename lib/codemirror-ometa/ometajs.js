(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		/* AMD. Register as an anonymous module. */
		define(['exports', 'codemirror-ometa-highlighter', 'ometa-parsers'], factory);
	} else {
		/* Browser globals - dangerous */
		factory(root, root.codeMirrorOmetaBridgeHighlighter, root);
	}
}(this, function (exports, codeMirrorOmetaBridgeHighlighter, parsers) {
	codeMirrorOmetaBridgeHighlighter(parsers.BSOMetaJSParser, 'ometajs', 'text/ometajs', {disableReusingMemoizations: true});
}));
