import { installDartAndFriends } from './install-dart';
import { createLambda, download, BuildOptions, FileFsRef } from '@now/build-utils';
import path from 'path';
import execa from 'execa';

export const version = 3 

export const mergeEnvPath = (paths: string[], options: any) => {
  const { PATH } = process.env
  let _paths = [...paths]

  if (options.cwd) {
    _paths = _paths.map((basePath) => {
      return path.join(options.cwd, basePath)
    })
  }

  return {
		...process.env,
		PATH: `${_paths.join(':')}:${PATH}`
	}
}

export async function build({ files, entrypoint, workPath, meta, config }: BuildOptions) {	
	const sdk = await installDartAndFriends({ files, entrypoint, workPath, meta, config });
  const downloadedFiles = await download(files, workPath);
  const entrypointPath = path.dirname(downloadedFiles[entrypoint].fsPath);
  const env = mergeEnvPath(['/bin'], { cwd: sdk.path })

  console.log('Build env')
  console.log('Dart Sdk:', sdk.path)
  console.log('Entrypoint:', entrypoint);
  console.log('Config:', config);
  console.log('Work path:', workPath);
  console.log('Meta:', meta);
  console.log('User files:', Object.keys(files));
  
  await execa.shell(`pub get --no-precompile`, { env, cwd: workPath,  stdio: 'inherit' });

  await execa.shell(`ls -la ${entrypointPath}`, { stdio: 'inherit' });
  await execa.shell(`ls -la ${workPath}`, { stdio: 'inherit' });
  await execa.shell(`ls -la ${__dirname}`, { stdio: 'inherit' });

  console.log('Create lambda')  
  const lambda = await createLambda({
    files: {
      ...files,
      ...sdk.files,
      'runtime.js': new FileFsRef({
        fsPath: path.join(__dirname, 'runtime.js'),
      }),
      'bootstrap': new FileFsRef({
        mode: 0o755,
        fsPath: path.join(__dirname, 'bootstrap'),
      })
    },
    handler: 'bootstrap',
		runtime: 'provided',
    environment: {
      NOW_ENTRYPOINT: entrypoint,
      NOW_DART_SDK_PATH: sdk.path
    },
  });

	return { output: lambda };
}

export { shouldServe } from "@now/build-utils";
