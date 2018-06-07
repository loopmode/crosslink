"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bootstrap = bootstrap;

var _globPromise = _interopRequireDefault(require("glob-promise"));

var _path = _interopRequireDefault(require("path"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

function bootstrap(_x, _x2) {
  return _bootstrap.apply(this, arguments);
} // async function init() {
//     let packages = await (glob(path.resolve(__dirname, '../node_modules/**/package.json')))
//     packages = packages.map(filename => path.dirname(filename) )
//     console.log(packages)
// }
// init();


function _bootstrap() {
  _bootstrap = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(configFile, _ref) {
    var cwd, dryRun, definitions, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, def, _def$split, _def$split2, fromDef, targetDef, sourceDirs, sourcePackages, targetFolders, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, source, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, target;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            cwd = _ref.cwd, dryRun = _ref.dryRun;
            console.log("\n\u250E\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\u2503\n\u2503   crosslinks\n\u2503   config: ".concat(configFile, "\n\u2503\n\u2516\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n        "));
            _context.next = 4;
            return parseConfig(configFile);

          case 4:
            definitions = _context.sent;
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 8;
            _iterator = definitions[Symbol.iterator]();

          case 10:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 89;
              break;
            }

            def = _step.value;
            // console.log('bootstrap:', def);
            _def$split = def.split(' -> '), _def$split2 = _slicedToArray(_def$split, 2), fromDef = _def$split2[0], targetDef = _def$split2[1];
            fromDef = _path.default.resolve("".concat(cwd, "/").concat(fromDef, "/package.json"));
            targetDef = _path.default.resolve("".concat(cwd, "/").concat(targetDef)); //
            // prepare a list of sources for the symlinks
            // use all folders in the target that have a package.json
            //

            _context.next = 17;
            return (0, _globPromise.default)(fromDef);

          case 17:
            sourceDirs = _context.sent;
            _context.next = 20;
            return getValidSources(sourceDirs);

          case 20:
            sourcePackages = _context.sent;
            _context.next = 23;
            return (0, _globPromise.default)(targetDef);

          case 23:
            targetFolders = _context.sent;

            if (!(!targetFolders.length && targetDef.indexOf('*') === -1)) {
              _context.next = 29;
              break;
            }

            if (dryRun) {
              _context.next = 28;
              break;
            }

            _context.next = 28;
            return _fsExtra.default.ensureDir(targetDef);

          case 28:
            targetFolders = [targetDef];

          case 29:
            //
            // now create the actual symlinks
            //
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context.prev = 32;
            _iterator2 = sourcePackages[Symbol.iterator]();

          case 34:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context.next = 72;
              break;
            }

            source = _step2.value;
            _iteratorNormalCompletion3 = true;
            _didIteratorError3 = false;
            _iteratorError3 = undefined;
            _context.prev = 39;
            _iterator3 = targetFolders[Symbol.iterator]();

          case 41:
            if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
              _context.next = 55;
              break;
            }

            target = _step3.value;

            if (!source.scope) {
              _context.next = 50;
              break;
            }

            if (dryRun) {
              _context.next = 47;
              break;
            }

            _context.next = 47;
            return _fsExtra.default.ensureDir("".concat(target, "/").concat(source.scope));

          case 47:
            target = _path.default.resolve("".concat(target, "/").concat(source.scope, "/").concat(source.name));
            _context.next = 51;
            break;

          case 50:
            target = _path.default.resolve("".concat(target, "/").concat(source.name));

          case 51:
            if (dryRun) {
              // const drySource = path.resolve(source.dirname);
              // let dryTarget = path.resolve(target + '/' + source.name);
              console.log('[dry] symlink: ', source.dirname, '→', target);
            } else {
              try {
                if (_fsExtra.default.existsSync(target)) {
                  console.log('[found]', source.dirname, '→', target);
                } else {
                  _fsExtra.default.symlinkSync(source.dirname, target, 'junction');

                  console.log('[created]', source.dirname, '→', target);
                } // const symlinks = await makeSymlinks(source.dirname,target, { dryRun });
                // for (let symlink of symlinks) {
                //     let finalPath = symlink.path;
                //     if (source.scope) {
                //         finalPath = finalPath.replace(new RegExp(`${path.basename(finalPath)}$`), source.name);
                //         // await fs.move(symlink.path, finalPath);
                //     }
                //     console.log('[created] symlink:', finalPath, '→', symlink.target);
                // }

              } catch (error) {
                console.warn(error);
              }
            }

          case 52:
            _iteratorNormalCompletion3 = true;
            _context.next = 41;
            break;

          case 55:
            _context.next = 61;
            break;

          case 57:
            _context.prev = 57;
            _context.t0 = _context["catch"](39);
            _didIteratorError3 = true;
            _iteratorError3 = _context.t0;

          case 61:
            _context.prev = 61;
            _context.prev = 62;

            if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
              _iterator3.return();
            }

          case 64:
            _context.prev = 64;

            if (!_didIteratorError3) {
              _context.next = 67;
              break;
            }

            throw _iteratorError3;

          case 67:
            return _context.finish(64);

          case 68:
            return _context.finish(61);

          case 69:
            _iteratorNormalCompletion2 = true;
            _context.next = 34;
            break;

          case 72:
            _context.next = 78;
            break;

          case 74:
            _context.prev = 74;
            _context.t1 = _context["catch"](32);
            _didIteratorError2 = true;
            _iteratorError2 = _context.t1;

          case 78:
            _context.prev = 78;
            _context.prev = 79;

            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }

          case 81:
            _context.prev = 81;

            if (!_didIteratorError2) {
              _context.next = 84;
              break;
            }

            throw _iteratorError2;

          case 84:
            return _context.finish(81);

          case 85:
            return _context.finish(78);

          case 86:
            _iteratorNormalCompletion = true;
            _context.next = 10;
            break;

          case 89:
            _context.next = 95;
            break;

          case 91:
            _context.prev = 91;
            _context.t2 = _context["catch"](8);
            _didIteratorError = true;
            _iteratorError = _context.t2;

          case 95:
            _context.prev = 95;
            _context.prev = 96;

            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }

          case 98:
            _context.prev = 98;

            if (!_didIteratorError) {
              _context.next = 101;
              break;
            }

            throw _iteratorError;

          case 101:
            return _context.finish(98);

          case 102:
            return _context.finish(95);

          case 103:
            if (dryRun) {
              console.log("\n\u250E\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\u2503\n\u2503   (Use the --run flag actually create the symlinks)\n\u2503\n\u2516\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n        ");
            }

          case 104:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[8, 91, 95, 103], [32, 74, 78, 86], [39, 57, 61, 69], [62,, 64, 68], [79,, 81, 85], [96,, 98, 102]]);
  }));
  return _bootstrap.apply(this, arguments);
}

function getValidSources(_x3) {
  return _getValidSources.apply(this, arguments);
}

function _getValidSources() {
  _getValidSources = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(sources) {
    var result, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, source, dirname, exists, _ref2, scope, name;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            result = [];
            _iteratorNormalCompletion4 = true;
            _didIteratorError4 = false;
            _iteratorError4 = undefined;
            _context2.prev = 4;
            _iterator4 = sources[Symbol.iterator]();

          case 6:
            if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
              _context2.next = 22;
              break;
            }

            source = _step4.value;
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
              dirname: dirname,
              scope: scope,
              name: name
            });

          case 19:
            _iteratorNormalCompletion4 = true;
            _context2.next = 6;
            break;

          case 22:
            _context2.next = 28;
            break;

          case 24:
            _context2.prev = 24;
            _context2.t0 = _context2["catch"](4);
            _didIteratorError4 = true;
            _iteratorError4 = _context2.t0;

          case 28:
            _context2.prev = 28;
            _context2.prev = 29;

            if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
              _iterator4.return();
            }

          case 31:
            _context2.prev = 31;

            if (!_didIteratorError4) {
              _context2.next = 34;
              break;
            }

            throw _iteratorError4;

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

function getPackageInfo(_x4) {
  return _getPackageInfo.apply(this, arguments);
}
/**
 * Takes the path to either a `{"crosslinks":['a -> b', 'a -> c']}` json file
 * or a text file with one `a -> b` crosslink definition per line
 * @param {string} filepath - path to a crosslinks config file
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
            resolve(config.crosslinks);
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