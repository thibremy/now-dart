
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const tryExec = async (args: string, options?: any) => {
  let std

  try {
    console.log(`trying ${args}`)
    std = await exec(args, {
      ...options,
      env: process.env,
    })
    
    console.log(std.stdout)
  } catch (err) {
    console.error(err)
  }
}

async function serve(): Promise<void>{
  await tryExec('ls -la')
  await tryExec('./dart bin/basic_writer_server.dart')
 
  return new Promise((resolve) => {
    setTimeout(() => resolve(),  3000)
  })
}

async function main(event: any): Promise<any> {
  await serve()

  return { 
    statusCode: 200, 
    headers: {}, 
    body: Buffer.from(JSON.stringify({ event, env: process.env }), 'utf8').toString('base64'),
    encoding: 'base64' 
  }
}

export {
  main,
  serve
}
