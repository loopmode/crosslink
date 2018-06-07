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
 * Takes the path to either a `{"crosslink":['a -> b', 'a -> c']}` json file
 * or a text file with one `a -> b` crosslink definition per line
 * @param {string} filepath - path to a crosslink config file
 * @return {array} - An array of crosslink definitions
 */


function _bootstrap() {
  _bootstrap = _asyncToGenerator(function* (file, {
    cwd = process.cwd(),
    dryRun = false,
    propname
  } = {}) {
    if (!file) {
      throw new Error('No definitioons file specified');
    }

    if (!_fsExtra.default.existsSync(_path.default.resolve(file))) {
      throw new Error('Definitions file not found');
    }

    const definitions = yield parseConfig(file, {
      propname
    });

    if (!definitions) {
      // e.g. used recursive glob to package.json files as definitionFiles
      // and this package.json was just some node_module without "crosslink" property
      // ignore
      return;
    }

    for (let def of definitions) {
      (0, _link.default)(def, {
        cwd,
        dryRun
      });
    }
  });
  return _bootstrap.apply(this, arguments);
}

function parseConfig(filepath, {
  propname = 'crosslink'
} = {}) {
  return new Promise((resolve, reject) => {
    _fsExtra.default.readFile(_path.default.resolve(filepath), (err, data) => {
      if (err) {
        reject(err);
      } else {
        try {
          const str = data.toString();

          if (str[0] === '{') {
            const config = JSON.parse(str);
            resolve(config[propname]);
          } else {
            const lines = str.split('\n').filter(v => !!v).map(v => v.trim());
            resolve(lines);
          }
        } catch (error) {
          reject(error);
        }
      }
    });
  });
}