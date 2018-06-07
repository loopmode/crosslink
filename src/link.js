import glob from 'glob-promise';
import path from 'path';
import fs from 'fs-extra';

export default async function link(definition, { cwd, dryRun = false } = {}) {
    definition = definition.replace(/ -> /, '->');

    let [fromDef, targetDef] = definition.split('->');

    fromDef = path.resolve(`${cwd}/${fromDef}/package.json`);
    targetDef = path.resolve(`${cwd}/${targetDef}`);

    //
    // prepare a list of sources for the symlinks
    // use all folders in the target that have a package.json
    //
    const sourceDirs = await glob(fromDef);
    // console.log({ sourceDirs });
    const sourcePackages = await getValidSources(sourceDirs);

    //
    // prepare a list of valid target folders
    // we will create a symlink to all sourcePackages in each target
    //
    let targetFolders = await glob(targetDef);
    if (!targetFolders.length && targetDef.indexOf('*') === -1) {
        if (!dryRun) await fs.ensureDir(targetDef);
        targetFolders = [targetDef];
    }

    //
    // now create the actual symlinks
    //
    for (let source of sourcePackages) {
        for (let target of targetFolders) {
            if (source.scope) {
                if (!dryRun) {
                    await fs.ensureDir(`${target}/${source.scope}`);
                }
                target = path.resolve(`${target}/${source.scope}/${source.name}`);
            } else {
                target = path.resolve(`${target}/${source.name}`);
            }

            if (dryRun) {
                console.log('[crosslink] dryRun:', source.dirname, '→', target);
            } else {
                try {
                    await ensureSymlink(source.dirname, target);
                } catch (error) {
                    console.warn(error);
                }
            }
        }
    }
}

async function ensureSymlink(source, target) {
    let exists = fs.existsSync(target);
    if (!exists) {
        try {
            const stats = await lstat(target);
            exists = !!stats;
        } catch (error) {
            /* silent fail */
        }
    }
    if (!exists) {
        try {
            const link = await readlink(target);
            exists = !!link;
        } catch (error) {
            /* silent fail */
        }
    }

    if (exists) {
        console.log('[crosslink] found:', source, '→', target);
    } else {
        fs.symlinkSync(source, target, 'junction');
        console.log('[crosslink] created:', source, '→', target);
    }
}

function lstat(target) {
    return new Promise((resolve, reject) => {
        fs.lstat(target, (error, stats) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(stats);
        });
    });
}
function readlink(target) {
    return new Promise((resolve, reject) => {
        fs.readlink(target, (error, linkString) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(linkString);
        });
    });
}

async function getValidSources(sources) {
    let result = [];
    for (let source of sources) {
        const dirname = path.dirname(source);
        const exists = await fs.pathExists(dirname);
        if (exists) {
            const { scope, name } = await getPackageInfo(dirname);
            // console.log({ dirname, exists, scope, name });
            result.push({
                dirname,
                scope,
                name
            });
        }
    }
    return result;
}

async function getPackageInfo(dirname) {
    const pkg = await fs.readJson(`${dirname}/package.json`);
    if (pkg.name[0] === '@') {
        const [scope, name] = pkg.name.split('/');
        return { scope, name };
    }
    return { scope: undefined, name: pkg.name };
}
