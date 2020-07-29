import program from 'commander';
import glob from 'glob-promise';
import path from 'path';

import bootstrap from './bootstrap';
import link from './link';

const pkg = require(path.resolve(__dirname, '../package.json'));

program.version(pkg.version);

let runDefault = true;

// ----------------------------------------
//
// default command
// crosslink ./target
//
// ----------------------------------------
program
    .usage('[target]')
    .option('-f, --filename [filename]', 'specify name of definition files', '{.crosslink,package.json}')
    .option('-p, --propname [propname]', 'specify name of property in JSON definitions', 'crosslink')
    .option('-r, --recursive [recursive]', 'scan for definition files recursively', false)
    .option('-o, --overwrite [overwrite]', 'overwrite existing target', false)
    .option('-d, --dry [dry]', 'perform a dry run and report, do not create symlinks', false)
    .on('--help', () => {
        console.log('');
        console.log('  Arguments:');
        console.log('');
        console.log('     target                      The directory in which to operate (default: .)');
    });

// ----------------------------------------
//
// link command
// crosslink link ./a/*->./b
//
// ----------------------------------------
program
    .command('link <definition>')
    .option('-o, --overwrite [overwrite]', 'overwrite existing target', false)
    .option('-d, --dry [dry]', 'perform a dry run and report, do not create symlinks', false)
    .on('--help', () => {
        console.log('');
        console.log('  Arguments:');
        console.log('');
        console.log('     definition                  A definition in the format source->target');
    })
    .action(definition => {
        runDefault = false;
        link(definition, { cwd: getCwd(), dryRun: program.dry, overwrite: program.overwrite });
    });

program.parse(process.argv);

if (runDefault) {
    // instead of using program.action(run), we just execute our run function manually
    // (otherwise we wouldn't run at all due to https://github.com/tj/commander.js/issues/729)
    const [target = '.'] = program.args;
    run(target);
}

async function run(target) {
    const cwd = getCwd(target);
    const recursiveGlob = program.recursive ? '/**' : '';

    const targetGlob = path.resolve(`${cwd}${recursiveGlob}/${program.filename}`);
    let definitionFiles = [];
    try {
        definitionFiles = await glob(targetGlob);
    } catch (error) {
        console.warn('[crosslink] Unable to resolve glob', targetGlob);
    }

    if (definitionFiles.length === 0) {
        console.warn('[crosslink] No definition files found for', targetGlob);
    }

    for (let file of definitionFiles) {
        try {
            await bootstrap(path.resolve(file), {
                cwd: path.dirname(path.resolve(file)),
                dryRun: program.dry,
                propname: program.propname,
                overwrite: program.overwrite
            });
        } catch (error) {
            console.warn('[crosslink] Unable to bootstrap', file);
        }
    }
}

function getCwd(target) {
    const cwd = process.cwd();
    if (target) {
        if (target[0] === '.') {
            return path.resolve(cwd, target);
        } else {
            return path.resolve(target);
        }
    }
    return path.resolve(cwd);
}
