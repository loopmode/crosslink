"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = bootstrap;

var _globPromise = _interopRequireDefault(require("glob-promise"));

var _path = _interopRequireDefault(require("path"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

function bootstrap(_x) {
  return _bootstrap.apply(this, arguments);
}

function _bootstrap() {
  _bootstrap = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(file) {
    var _ref,
        _ref$cwd,
        cwd,
        _ref$dryRun,
        dryRun,
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
            _ref = _args.length > 1 && _args[1] !== undefined ? _args[1] : {}, _ref$cwd = _ref.cwd, cwd = _ref$cwd === void 0 ? process.cwd() : _ref$cwd, _ref$dryRun = _ref.dryRun, dryRun = _ref$dryRun === void 0 ? false : _ref$dryRun;

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
            return parseConfig(file);

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
              link(def, {
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

function link(_x2) {
  return _link.apply(this, arguments);
}

function _link() {
  _link = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(definition) {
    var _ref2,
        cwd,
        _ref2$dryRun,
        dryRun,
        _definition$split,
        _definition$split2,
        fromDef,
        targetDef,
        sourceDirs,
        sourcePackages,
        targetFolders,
        _iteratorNormalCompletion2,
        _didIteratorError2,
        _iteratorError2,
        _iterator2,
        _step2,
        source,
        _iteratorNormalCompletion3,
        _didIteratorError3,
        _iteratorError3,
        _iterator3,
        _step3,
        target,
        _args2 = arguments;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _ref2 = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : {}, cwd = _ref2.cwd, _ref2$dryRun = _ref2.dryRun, dryRun = _ref2$dryRun === void 0 ? false : _ref2$dryRun;
            // console.log('bootstrap:', def);
            _definition$split = definition.split(' -> '), _definition$split2 = _slicedToArray(_definition$split, 2), fromDef = _definition$split2[0], targetDef = _definition$split2[1];
            fromDef = _path.default.resolve("".concat(cwd, "/").concat(fromDef, "/package.json"));
            targetDef = _path.default.resolve("".concat(cwd, "/").concat(targetDef)); //
            // prepare a list of sources for the symlinks
            // use all folders in the target that have a package.json
            //

            _context2.next = 6;
            return (0, _globPromise.default)(fromDef);

          case 6:
            sourceDirs = _context2.sent;
            _context2.next = 9;
            return getValidSources(sourceDirs);

          case 9:
            sourcePackages = _context2.sent;
            _context2.next = 12;
            return (0, _globPromise.default)(targetDef);

          case 12:
            targetFolders = _context2.sent;

            if (!(!targetFolders.length && targetDef.indexOf('*') === -1)) {
              _context2.next = 18;
              break;
            }

            if (dryRun) {
              _context2.next = 17;
              break;
            }

            _context2.next = 17;
            return _fsExtra.default.ensureDir(targetDef);

          case 17:
            targetFolders = [targetDef];

          case 18:
            //
            // now create the actual symlinks
            //
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context2.prev = 21;
            _iterator2 = sourcePackages[Symbol.iterator]();

          case 23:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context2.next = 61;
              break;
            }

            source = _step2.value;
            _iteratorNormalCompletion3 = true;
            _didIteratorError3 = false;
            _iteratorError3 = undefined;
            _context2.prev = 28;
            _iterator3 = targetFolders[Symbol.iterator]();

          case 30:
            if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
              _context2.next = 44;
              break;
            }

            target = _step3.value;

            if (!source.scope) {
              _context2.next = 39;
              break;
            }

            if (dryRun) {
              _context2.next = 36;
              break;
            }

            _context2.next = 36;
            return _fsExtra.default.ensureDir("".concat(target, "/").concat(source.scope));

          case 36:
            target = _path.default.resolve("".concat(target, "/").concat(source.scope, "/").concat(source.name));
            _context2.next = 40;
            break;

          case 39:
            target = _path.default.resolve("".concat(target, "/").concat(source.name));

          case 40:
            if (dryRun) {
              // const drySource = path.resolve(source.dirname);
              // let dryTarget = path.resolve(target + '/' + source.name);
              console.log('[linkspace] dryRun:', source.dirname, '→', target);
            } else {
              try {
                if (_fsExtra.default.existsSync(target)) {
                  console.log('[linkspace] found:', source.dirname, '→', target);
                } else {
                  _fsExtra.default.symlinkSync(source.dirname, target, 'junction');

                  console.log('[linkspace] created:', source.dirname, '→', target);
                } // const symlinks = await makeSymlinks(source.dirname,target, { dryRun });
                // for (let symlink of symlinks) {
                //     let finalPath = symlink.path;
                //     if (source.scope) {
                //         finalPath = finalPath.replace(new RegExp(`${path.basename(finalPath)}$`), source.name);
                //         // await fs.move(symlink.path, finalPath);
                //     }
                //     console.log('[linkspace.created] symlink:', finalPath, '→', symlink.target);
                // }

              } catch (error) {
                console.warn(error);
              }
            }

          case 41:
            _iteratorNormalCompletion3 = true;
            _context2.next = 30;
            break;

          case 44:
            _context2.next = 50;
            break;

          case 46:
            _context2.prev = 46;
            _context2.t0 = _context2["catch"](28);
            _didIteratorError3 = true;
            _iteratorError3 = _context2.t0;

          case 50:
            _context2.prev = 50;
            _context2.prev = 51;

            if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
              _iterator3.return();
            }

          case 53:
            _context2.prev = 53;

            if (!_didIteratorError3) {
              _context2.next = 56;
              break;
            }

            throw _iteratorError3;

          case 56:
            return _context2.finish(53);

          case 57:
            return _context2.finish(50);

          case 58:
            _iteratorNormalCompletion2 = true;
            _context2.next = 23;
            break;

          case 61:
            _context2.next = 67;
            break;

          case 63:
            _context2.prev = 63;
            _context2.t1 = _context2["catch"](21);
            _didIteratorError2 = true;
            _iteratorError2 = _context2.t1;

          case 67:
            _context2.prev = 67;
            _context2.prev = 68;

            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }

          case 70:
            _context2.prev = 70;

            if (!_didIteratorError2) {
              _context2.next = 73;
              break;
            }

            throw _iteratorError2;

          case 73:
            return _context2.finish(70);

          case 74:
            return _context2.finish(67);

          case 75:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this, [[21, 63, 67, 75], [28, 46, 50, 58], [51,, 53, 57], [68,, 70, 74]]);
  }));
  return _link.apply(this, arguments);
}

function getPackageInfo(_x3) {
  return _getPackageInfo.apply(this, arguments);
}
/**
 * Takes the path to either a `{"linkspace":['a -> b', 'a -> c']}` json file
 * or a text file with one `a -> b` crosslink definition per line
 * @param {string} filepath - path to a linkspace config file
 * @return {array} - An array of crosslink definitions
 */


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
            return _fsExtra.default.readJson("".concat(dirname, "/package.json"));

          case 2:
            pkg = _context3.sent;

            if (!(pkg.name[0] === '@')) {
              _context3.next = 6;
              break;
            }

            _pkg$name$split = pkg.name.split('/'), _pkg$name$split2 = _slicedToArray(_pkg$name$split, 2), scope = _pkg$name$split2[0], name = _pkg$name$split2[1];
            return _context3.abrupt("return", {
              scope: scope,
              name: name
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

function parseConfig(filepath) {
  return new Promise(function (resolve, reject) {
    _fsExtra.default.readFile(_path.default.resolve(filepath), function (err, data) {
      if (err) {
        reject(err);
      } else {
        try {
          var str = data.toString();

          if (str[0] === '{') {
            var config = JSON.parse(str);
            resolve(config.linkspace);
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