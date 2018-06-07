"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = link;

var _globPromise = _interopRequireDefault(require("glob-promise"));

var _path = _interopRequireDefault(require("path"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

function link(_x) {
  return _link.apply(this, arguments);
}

function _link() {
  _link = _asyncToGenerator(function* (definition, {
    cwd,
    dryRun = false
  } = {}) {
    definition = definition.replace(/ -> /, '->');
    let [fromDef, targetDef] = definition.split('->');
    fromDef = _path.default.resolve(`${cwd}/${fromDef}/package.json`);
    targetDef = _path.default.resolve(`${cwd}/${targetDef}`); //
    // prepare a list of sources for the symlinks
    // use all folders in the target that have a package.json
    //

    const sourceDirs = yield (0, _globPromise.default)(fromDef); // console.log({ sourceDirs });

    const sourcePackages = yield getValidSources(sourceDirs); //
    // prepare a list of valid target folders
    // we will create a symlink to all sourcePackages in each target
    //

    let targetFolders = yield (0, _globPromise.default)(targetDef);

    if (!targetFolders.length && targetDef.indexOf('*') === -1) {
      if (!dryRun) yield _fsExtra.default.ensureDir(targetDef);
      targetFolders = [targetDef];
    } //
    // now create the actual symlinks
    //


    for (let source of sourcePackages) {
      for (let target of targetFolders) {
        if (source.scope) {
          if (!dryRun) {
            yield _fsExtra.default.ensureDir(`${target}/${source.scope}`);
          }

          target = _path.default.resolve(`${target}/${source.scope}/${source.name}`);
        } else {
          target = _path.default.resolve(`${target}/${source.name}`);
        }

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
      }
    }
  });
  return _link.apply(this, arguments);
}

function getValidSources(_x2) {
  return _getValidSources.apply(this, arguments);
}

function _getValidSources() {
  _getValidSources = _asyncToGenerator(function* (sources) {
    let result = [];

    for (let source of sources) {
      const dirname = _path.default.dirname(source);

      const exists = yield _fsExtra.default.pathExists(dirname);

      if (exists) {
        const {
          scope,
          name
        } = yield getPackageInfo(dirname); // console.log({ dirname, exists, scope, name });

        result.push({
          dirname,
          scope,
          name
        });
      }
    }

    return result;
  });
  return _getValidSources.apply(this, arguments);
}

function getPackageInfo(_x3) {
  return _getPackageInfo.apply(this, arguments);
}

function _getPackageInfo() {
  _getPackageInfo = _asyncToGenerator(function* (dirname) {
    const pkg = yield _fsExtra.default.readJson(`${dirname}/package.json`);

    if (pkg.name[0] === '@') {
      const [scope, name] = pkg.name.split('/');
      return {
        scope,
        name
      };
    }

    return {
      scope: undefined,
      name: pkg.name
    };
  });
  return _getPackageInfo.apply(this, arguments);
}