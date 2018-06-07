"use strict";

var _commander = _interopRequireDefault(require("commander"));

var _globPromise = _interopRequireDefault(require("glob-promise"));

var _path = _interopRequireDefault(require("path"));

var _bootstrap = _interopRequireDefault(require("./bootstrap"));

var _link = _interopRequireDefault(require("./link"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

const pkg = require(_path.default.resolve(__dirname, '../package.json'));

_commander.default.version(pkg.version);

let runDefault = true; // ----------------------------------------
//
// default command
// crosslink ./target
//
// ----------------------------------------

_commander.default.usage('[target]').option('-f, --filename [filename]', 'specify name of definition files', '.crosslink').option('-p, --propname [propname]', 'specify name of property in JSON definitions', 'crosslink').option('-r, --recursive [recursive]', 'scan for definition files recursively', false).option('-d, --dry [dry]', 'perform a dry run and report, do not create symlinks', false).on('--help', () => {
  console.log('');
  console.log('  Arguments:');
  console.log('');
  console.log('     target                      The directory in which to operate (default: .)');
}); // ----------------------------------------
//
// link command
// crosslink link ./a/*->./b
//
// ----------------------------------------


_commander.default.command('link <definition>').option('-d, --dry [dry]', 'perform a dry run and report, do not create symlinks', false).on('--help', () => {
  console.log('');
  console.log('  Arguments:');
  console.log('');
  console.log('     definition                  A definition in the format source->target');
}).action(definition => {
  runDefault = false;
  (0, _link.default)(definition, {
    cwd: getCwd(),
    dryRun: _commander.default.dry
  });
});

_commander.default.parse(process.argv);

if (runDefault) {
  // instead of using program.action(run), we just execute our run function manually
  // (otherwise we wouldn't run at all due to https://github.com/tj/commander.js/issues/729)
  const [target = '.'] = _commander.default.args;
  run(target);
}

function run(_x) {
  return _run.apply(this, arguments);
}

function _run() {
  _run = _asyncToGenerator(function* (target) {
    const cwd = getCwd(target);
    const recursiveGlob = _commander.default.recursive ? '/**' : '';

    const targetGlob = _path.default.resolve(`${cwd}${recursiveGlob}/${_commander.default.filename}`);

    let definitionFiles = [];

    try {
      definitionFiles = yield (0, _globPromise.default)(targetGlob);
    } catch (error) {
      console.warn('[crosslink] Unable to resolve glob', targetGlob);
    }

    if (definitionFiles.length === 0) {
      console.warn('[crosslink] No definition files found for', targetGlob);
    }

    for (let file of definitionFiles) {
      try {
        yield (0, _bootstrap.default)(_path.default.resolve(file), {
          cwd: _path.default.dirname(_path.default.resolve(file)),
          dryRun: _commander.default.dry,
          propname: _commander.default.propname
        });
      } catch (error) {
        console.warn('[crosslink] Unable to bootstrap', file);
      }
    }
  });
  return _run.apply(this, arguments);
}

function getCwd(target) {
  const cwd = process.cwd();

  if (target) {
    if (target[0] === '.') {
      return _path.default.resolve(cwd, target);
    } else {
      return _path.default.resolve(target);
    }
  }

  return _path.default.resolve(cwd);
}