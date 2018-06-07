"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = bootstrap;

var _path = _interopRequireDefault(require("path"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _link = _interopRequireDefault(require("./link"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

function bootstrap(_x) {
  return _bootstrap.apply(this, arguments);
}
/**
 * Takes the path to either a `{"cross-link":['a -> b', 'a -> c']}` json file
 * or a text file with one `a -> b` crosslink definition per line
 * @param {string} filepath - path to a cross-link config file
 * @return {array} - An array of crosslink definitions
 */


function _bootstrap() {
  _bootstrap = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(file) {
    var _ref,
        _ref$cwd,
        cwd,
        _ref$dryRun,
        dryRun,
        propname,
        definitions,
        _iteratorNormalCompletion,
        _didIteratorError,
        _iteratorError,
        _iterator,
        _step,
        def,
        _args = arguments;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _ref = _args.length > 1 && _args[1] !== undefined ? _args[1] : {}, _ref$cwd = _ref.cwd, cwd = _ref$cwd === void 0 ? process.cwd() : _ref$cwd, _ref$dryRun = _ref.dryRun, dryRun = _ref$dryRun === void 0 ? false : _ref$dryRun, propname = _ref.propname;

            if (file) {
              _context.next = 3;
              break;
            }

            throw new Error('No definitioons file specified');

          case 3:
            if (_fsExtra.default.existsSync(_path.default.resolve(file))) {
              _context.next = 5;
              break;
            }

            throw new Error('Definitions file not found');

          case 5:
            _context.next = 7;
            return parseConfig(file, {
              propname: propname
            });

          case 7:
            definitions = _context.sent;

            if (definitions) {
              _context.next = 10;
              break;
            }

            return _context.abrupt("return");

          case 10:
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 13;

            for (_iterator = definitions[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              def = _step.value;
              (0, _link.default)(def, {
                cwd: cwd,
                dryRun: dryRun
              });
            }

            _context.next = 21;
            break;

          case 17:
            _context.prev = 17;
            _context.t0 = _context["catch"](13);
            _didIteratorError = true;
            _iteratorError = _context.t0;

          case 21:
            _context.prev = 21;
            _context.prev = 22;

            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }

          case 24:
            _context.prev = 24;

            if (!_didIteratorError) {
              _context.next = 27;
              break;
            }

            throw _iteratorError;

          case 27:
            return _context.finish(24);

          case 28:
            return _context.finish(21);

          case 29:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[13, 17, 21, 29], [22,, 24, 28]]);
  }));
  return _bootstrap.apply(this, arguments);
}

function parseConfig(filepath) {
  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref2$propname = _ref2.propname,
      propname = _ref2$propname === void 0 ? 'cross-link' : _ref2$propname;

  return new Promise(function (resolve, reject) {
    _fsExtra.default.readFile(_path.default.resolve(filepath), function (err, data) {
      if (err) {
        reject(err);
      } else {
        try {
          var str = data.toString();

          if (str[0] === '{') {
            var config = JSON.parse(str);
            resolve(config[propname]);
          } else {
            var lines = str.split('\n').filter(function (v) {
              return !!v;
            }).map(function (v) {
              return v.trim();
            });
            resolve(lines);
          }
        } catch (error) {
          reject(error);
        }
      }
    });
  });
}