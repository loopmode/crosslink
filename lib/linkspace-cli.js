"use strict";

var _commander = _interopRequireDefault(require("commander"));

var _globPromise = _interopRequireDefault(require("glob-promise"));

var _path = _interopRequireDefault(require("path"));

var _linkspaceBootstrap = _interopRequireWildcard(require("./linkspace-bootstrap"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var pkg = require(_path.default.resolve(__dirname, '../package.json'));

_commander.default.version(pkg.version); // ----------------------------------------
//
// default command
// linkspace ./target
//
// ----------------------------------------


_commander.default.usage('[target]').option('-f, --filename [filename]', 'specify name of definition files', '.linkspace').option('-p, --propname [propname]', 'specify name of property in JSON definitions', 'linkspace').option('-r, --recursive [recursive]', 'scan for definition files recursively', false).option('-d, --dry [dry]', 'perform a dry run and report, do not create symlinks', false).on('--help', function () {
  console.log('');
  console.log('  Arguments:');
  console.log('');
  console.log('     target                      The directory in which to operate (default: .)');
}); // ----------------------------------------
//
// link command
// linkspace link ./a/*->./b
//
// ----------------------------------------


_commander.default.action('link <definition>').option('-d, --dry [dry]', 'perform a dry run and report, do not create symlinks', false).on('--help', function () {
  console.log('');
  console.log('  Arguments:');
  console.log('');
  console.log('     definition                  A definition in the format source->target');
}).action(function (definition) {
  definition = definition.replace(/->/, ' -> ');
  (0, _linkspaceBootstrap.link)(definition, {
    cwd: getCwd(),
    dryRun: _commander.default.dry
  });
});

_commander.default.parse(process.argv); // instead of using program.action(run), we just execute our run function manually
// (otherwise we wouldn't run at all due to https://github.com/tj/commander.js/issues/729)


var _program$args = _slicedToArray(_commander.default.args, 1),
    _program$args$ = _program$args[0],
    target = _program$args$ === void 0 ? '.' : _program$args$;

run(target);

function run(_x) {
  return _run.apply(this, arguments);
}

function _run() {
  _run = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(target) {
    var cwd, recursiveGlob, targetGlob, definitionFiles, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, file;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            cwd = getCwd(target);
            recursiveGlob = _commander.default.recursive ? '/**' : '';
            targetGlob = _path.default.resolve("".concat(cwd).concat(recursiveGlob, "/").concat(_commander.default.filename));
            definitionFiles = [];
            _context.prev = 4;
            _context.next = 7;
            return (0, _globPromise.default)(targetGlob);

          case 7:
            definitionFiles = _context.sent;
            _context.next = 13;
            break;

          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](4);
            console.warn('[linkspace] Unable to resolve glob', targetGlob);

          case 13:
            if (definitionFiles.length === 0) {
              console.warn('[linkspace] No definition files found for', targetGlob);
            }

            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 17;
            _iterator = definitionFiles[Symbol.iterator]();

          case 19:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 32;
              break;
            }

            file = _step.value;
            _context.prev = 21;
            _context.next = 24;
            return (0, _linkspaceBootstrap.default)(_path.default.resolve(file), {
              cwd: _path.default.dirname(_path.default.resolve(file)),
              dryRun: _commander.default.dry
            });

          case 24:
            _context.next = 29;
            break;

          case 26:
            _context.prev = 26;
            _context.t1 = _context["catch"](21);
            console.warn('[linkspace] Unable to bootstrap', file);

          case 29:
            _iteratorNormalCompletion = true;
            _context.next = 19;
            break;

          case 32:
            _context.next = 38;
            break;

          case 34:
            _context.prev = 34;
            _context.t2 = _context["catch"](17);
            _didIteratorError = true;
            _iteratorError = _context.t2;

          case 38:
            _context.prev = 38;
            _context.prev = 39;

            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }

          case 41:
            _context.prev = 41;

            if (!_didIteratorError) {
              _context.next = 44;
              break;
            }

            throw _iteratorError;

          case 44:
            return _context.finish(41);

          case 45:
            return _context.finish(38);

          case 46:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[4, 10], [17, 34, 38, 46], [21, 26], [39,, 41, 45]]);
  }));
  return _run.apply(this, arguments);
}

function getCwd(target) {
  var cwd = process.cwd();

  if (target) {
    if (target[0] === '.') {
      return _path.default.resolve(cwd, target);
    } else {
      return _path.default.resolve(target);
    }
  }

  return _path.default.resolve(cwd);
}