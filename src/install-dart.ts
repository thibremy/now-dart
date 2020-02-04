import execa from 'execa'
import { FileFsRef, BuildOptions } from '@now/build-utils'
import path from 'path'

interface DownloadDartOptions {
  version: 'stable',
  cwd: string,
}

async function downloadDartToolchain(options: DownloadDartOptions) {
  const { cwd } = options
  await execa.shell('yum -y install glibc.i686',  { stdio: 'inherit', cwd })
  await execa.shell('yum -y install wget',  { stdio: 'inherit', cwd })
  await execa.shell('yum -y install zip',  { stdio: 'inherit', cwd })
  console.log('download dartsdk')
  await execa.shell('wget -O dartsdk.zip https://storage.googleapis.com/dart-archive/channels/stable/release/2.7.1/sdk/dartsdk-linux-x64-release.zip',  { stdio: 'inherit', cwd })
  console.log('unzip')
  await execa.shell('unzip dartsdk.zip', { stdio: 'inherit', cwd })
}

export const installDartAndFriends = async (options: BuildOptions): Promise<any> => {
  const { workPath, meta } = options

  if (meta && meta.isDev) {
    await execa('which', ['dart', 'pub'], { stdio: 'inherit' });
  } else {
    await downloadDartToolchain({
      version: 'stable',
      cwd: workPath
    });
  }

  

  return {
    path: `${workPath}/dart-sdk`,
    files: {
      'dart': new FileFsRef({
        mode: 0o755,
        fsPath: path.join(workPath, '/dart-sdk/bin/dart'),
      }),
      'pub': new FileFsRef({
        mode: 0o755,
        fsPath: path.join(workPath, '/dart-sdk/bin/pub'),
      })
    }
  }
};

