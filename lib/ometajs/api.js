var ometajs = require('../ometajs'),
    uglify = require('uglify-js'),
    vm = require('vm'),
    Module = require('module'),
    compressor = uglify.Compressor({
        sequences: false,
        unused: false // We need this off for OMeta
    }),
    clone = function clone(obj) {
      var o = {};

      Object.keys(obj).forEach(function(key) {
        o[key] = obj[key];
      });

      return o;
    };

//
// ### function wrapModule(module)
// #### @code {String} javascript code to wrap
// Wrap javascript code in ometajs.core context
//
function wrapModule(code, options) {
  var requirePath = (options.root || ometajs.root || 'ometa-core'),
      start =
        "(function (root, factory) {\
          if (typeof define === 'function' && define.amd) {\
            /* AMD. Register as an anonymous module. */\
            define(['exports', 'ometa-core'], factory);\
          } else if (typeof exports === 'object') {\
            /* CommonJS */\
            factory(exports, require('" + requirePath + "'));\
          } else {\
            /* Browser globals - dangerous */\
            factory(root, root.OMeta);\
          }\
        }(this, function (exports, OMeta) {",
      end = "}));"

  return start + code + end;
};

//
// ### function translateCode(code)
// #### @code {String} source code
// Translates .ometajs code into javascript
//
function translateCode(source, options) {
  options || (options = {});
  var tree = ometajs.BSOMetaJSParser.matchAll(source, "topLevel"),
      js = ometajs.BSOMetaJSTranslator.match(tree, "trans"),
      // Beautify code
      ast = uglify.parse(js);
  ast.figure_out_scope();
  ast = ast.transform(compressor);
  js = ast.print_to_string({
    beautify: true
  });

  if (options.noContext) return js;

  return wrapModule(js, options);
};
exports.translateCode = translateCode;

//
// ### function evalCode(code, filename)
// #### @code {String} source code
// #### @filename {String} filename for stack traces
// Translates and evaluates ometajs code
//
function evalCode(code, filename, options) {
  options || (options = {});
  options.noContext = true;

  code = translateCode(code, options);
  return vm.runInNewContext('var exports = {};' + code + '\n;exports',
                            clone(ometajs.core),
                            filename || 'ometa');
};
exports.evalCode = evalCode;

// Allow users to `require(...)` ometa files
require.extensions['.ometajs'] = require.extensions['.ojs'] = require.extensions['.ometa'] = function(module, filename) {
  var code = translateCode(require('fs').readFileSync(filename).toString());

  module._compile(code, filename);
};
