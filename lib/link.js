"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = link;

var _globPromise = _interopRequireDefault(require("glob-promise"));

var _path = _interopRequireDefault(require("path"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

function link(_x) {
  return _link.apply(this, arguments);
}

function _link() {
  _link = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(definition) {
    var _ref,
        cwd,
        _ref$dryRun,
        dryRun,
        _definition$split,
        _definition$split2,
        fromDef,
        targetDef,
        sourceDirs,
        sourcePackages,
        targetFolders,
        _iteratorNormalCompletion,
        _didIteratorError,
        _iteratorError,
        _iterator,
        _step,
        source,
        _iteratorNormalCompletion2,
        _didIteratorError2,
        _iteratorError2,
        _iterator2,
        _step2,
        target,
        _args = arguments;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _ref = _args.length > 1 && _args[1] !== undefined ? _args[1] : {}, cwd = _ref.cwd, _ref$dryRun = _ref.dryRun, dryRun = _ref$dryRun === void 0 ? false : _ref$dryRun;
            definition = definition.replace(/ -> /, '->');
            _definition$split = definition.split('->'), _definition$split2 = _slicedToArray(_definition$split, 2), fromDef = _definition$split2[0], targetDef = _definition$split2[1];
            fromDef = _path.default.resolve(`${cwd}/${fromDef}/package.json`);
            targetDef = _path.default.resolve(`${cwd}/${targetDef}`); //
            // prepare a list of sources for the symlinks
            // use all folders in the target that have a package.json
            //

            _context.next = 7;
            return (0, _globPromise.default)(fromDef);

          case 7:
            sourceDirs = _context.sent;
            _context.next = 10;
            return getValidSources(sourceDirs);

          case 10:
            sourcePackages = _context.sent;
            _context.next = 13;
            return (0, _globPromise.default)(targetDef);

          case 13:
            targetFolders = _context.sent;

            if (!(!targetFolders.length && targetDef.indexOf('*') === -1)) {
              _context.next = 19;
              break;
            }

            if (dryRun) {
              _context.next = 18;
              break;
            }

            _context.next = 18;
            return _fsExtra.default.ensureDir(targetDef);

          case 18:
            targetFolders = [targetDef];

          case 19:
            //
            // now create the actual symlinks
            //
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 22;
            _iterator = sourcePackages[Symbol.iterator]();

          case 24:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 62;
              break;
            }

            source = _step.value;
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context.prev = 29;
            _iterator2 = targetFolders[Symbol.iterator]();

          case 31:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context.next = 45;
              break;
            }

            target = _step2.value;

            if (!source.scope) {
              _context.next = 40;
              break;
            }

            if (dryRun) {
              _context.next = 37;
              break;
            }

            _context.next = 37;
            return _fsExtra.default.ensureDir(`${target}/${source.scope}`);

          case 37:
            target = _path.default.resolve(`${target}/${source.scope}/${source.name}`);
            _context.next = 41;
            break;

          case 40:
            target = _path.default.resolve(`${target}/${source.name}`);

          case 41:
            if (dryRun) {
              // const drySource = path.resolve(source.dirname);
              // let dryTarget = path.resolve(target + '/' + source.name);
              console.log('[crosslink] dryRun:', source.dirname, '→', target);
            } else {
              try {
                if (_fsExtra.default.existsSync(target)) {
                  console.log('[crosslink] found:', source.dirname, '→', target);
                } else {
                  _fsExtra.default.symlinkSync(source.dirname, target, 'junction');

                  console.log('[crosslink] created:', source.dirname, '→', target);
                }
              } catch (error) {
                console.warn(error);
              }
            }

          case 42:
            _iteratorNormalCompletion2 = true;
            _context.next = 31;
            break;

          case 45:
            _context.next = 51;
            break;

          case 47:
            _context.prev = 47;
            _context.t0 = _context["catch"](29);
            _didIteratorError2 = true;
            _iteratorError2 = _context.t0;

          case 51:
            _context.prev = 51;
            _context.prev = 52;

            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }

          case 54:
            _context.prev = 54;

            if (!_didIteratorError2) {
              _context.next = 57;
              break;
            }

            throw _iteratorError2;

          case 57:
            return _context.finish(54);

          case 58:
            return _context.finish(51);

          case 59:
            _iteratorNormalCompletion = true;
            _context.next = 24;
            break;

          case 62:
            _context.next = 68;
            break;

          case 64:
            _context.prev = 64;
            _context.t1 = _context["catch"](22);
            _didIteratorError = true;
            _iteratorError = _context.t1;

          case 68:
            _context.prev = 68;
            _context.prev = 69;

            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }

          case 71:
            _context.prev = 71;

            if (!_didIteratorError) {
              _context.next = 74;
              break;
            }

            throw _iteratorError;

          case 74:
            return _context.finish(71);

          case 75:
            return _context.finish(68);

          case 76:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[22, 64, 68, 76], [29, 47, 51, 59], [52,, 54, 58], [69,, 71, 75]]);
  }));
  return _link.apply(this, arguments);
}

function getValidSources(_x2) {
  return _getValidSources.apply(this, arguments);
}

function _getValidSources() {
  _getValidSources = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(sources) {
    var result, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, source, dirname, exists, _ref2, scope, name;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            result = [];
            _iteratorNormalCompletion3 = true;
            _didIteratorError3 = false;
            _iteratorError3 = undefined;
            _context2.prev = 4;
            _iterator3 = sources[Symbol.iterator]();

          case 6:
            if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
              _context2.next = 22;
              break;
            }

            source = _step3.value;
            dirname = _path.default.dirname(source);
            _context2.next = 11;
            return _fsExtra.default.pathExists(dirname);

          case 11:
            exists = _context2.sent;

            if (!exists) {
              _context2.next = 19;
              break;
            }

            _context2.next = 15;
            return getPackageInfo(dirname);

          case 15:
            _ref2 = _context2.sent;
            scope = _ref2.scope;
            name = _ref2.name;
            // console.log({ dirname, exists, scope, name });
            result.push({
              dirname,
              scope,
              name
            });

          case 19:
            _iteratorNormalCompletion3 = true;
            _context2.next = 6;
            break;

          case 22:
            _context2.next = 28;
            break;

          case 24:
            _context2.prev = 24;
            _context2.t0 = _context2["catch"](4);
            _didIteratorError3 = true;
            _iteratorError3 = _context2.t0;

          case 28:
            _context2.prev = 28;
            _context2.prev = 29;

            if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
              _iterator3.return();
            }

          case 31:
            _context2.prev = 31;

            if (!_didIteratorError3) {
              _context2.next = 34;
              break;
            }

            throw _iteratorError3;

          case 34:
            return _context2.finish(31);

          case 35:
            return _context2.finish(28);

          case 36:
            return _context2.abrupt("return", result);

          case 37:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this, [[4, 24, 28, 36], [29,, 31, 35]]);
  }));
  return _getValidSources.apply(this, arguments);
}

function getPackageInfo(_x3) {
  return _getPackageInfo.apply(this, arguments);
}

function _getPackageInfo() {
  _getPackageInfo = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(dirname) {
    var pkg, _pkg$name$split, _pkg$name$split2, scope, name;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _fsExtra.default.readJson(`${dirname}/package.json`);

          case 2:
            pkg = _context3.sent;

            if (!(pkg.name[0] === '@')) {
              _context3.next = 6;
              break;
            }

            _pkg$name$split = pkg.name.split('/'), _pkg$name$split2 = _slicedToArray(_pkg$name$split, 2), scope = _pkg$name$split2[0], name = _pkg$name$split2[1];
            return _context3.abrupt("return", {
              scope,
              name
            });

          case 6:
            return _context3.abrupt("return", {
              scope: undefined,
              name: pkg.name
            });

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return _getPackageInfo.apply(this, arguments);
}