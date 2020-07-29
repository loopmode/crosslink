import path from 'path';
import fs from 'fs-extra';

import link from './link';

export default async function bootstrap(
    file,
    { cwd = process.cwd(), dryRun = false, propname, overwrite = false } = {}
) {
    if (!file) {
        throw new Error('No definitions file specified');
    }
    if (!fs.existsSync(path.resolve(file))) {
        throw new Error('Definitions file not found');
    }

    const definitions = await parseConfig(file, { propname });

    if (!definitions) {
        // e.g. used recursive glob to package.json files as definitionFiles
        // and this package.json was just some node_module without "crosslink" property
        // ignore
        return;
    }

    for (let def of definitions) {
        link(def, { cwd, dryRun, overwrite });
    }
}

/**
 * Takes the path to either a `{"crosslink":['a -> b', 'a -> c']}` json file
 * or a text file with one `a -> b` crosslink definition per line
 * @param {string} filepath - path to a crosslink config file
 * @return {array} - An array of crosslink definitions
 */
function parseConfig(filepath, { propname = 'crosslink' } = {}) {
    return new Promise((resolve, reject) => {
        fs.readFile(path.resolve(filepath), (err, data) => {
            if (err) {
                reject(err);
            } else {
                try {
                    const str = data.toString();

                    if (str[0] === '{') {
                        const config = JSON.parse(str);
                        resolve(config[propname]);
                    } else {
                        const lines = str
                            .split('\n')
                            .filter(v => !!v)
                            .map(v => v.trim());
                        resolve(lines);
                    }
                } catch (error) {
                    reject(error);
                }
            }
        });
    });
}
