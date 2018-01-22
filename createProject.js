const fs = require('fs-extra');
const spawn = require('cross-spawn');
const chalk = require('chalk');
const path = require('path')

const template = 'template';


function createProject(projectName, gitRepository) {
  // 创建模板目录
  const templetIsExist = fs.existsSync(`./${template}`)
  if (!templetIsExist) {
    fs.mkdirSync(template)
  }
  
  cloneRepository(gitRepository).then((sourePath) => {
    const projectPath = path.resolve(process.cwd(), projectName)
    if (!fs.existsSync(projectPath)) {
      fs.mkdirSync(projectPath)
    }
    fs.copy(sourePath, projectPath, {
      filter: (src, dest) => {
        if (src.indexOf('.git') >= 0 && src.indexOf('.gitignore') !== 0) return false;
        return true
      }
    }, (error) => {
      if (error) return;
      console.log(chalk.green('create project successful'))
    })
  },(command) => {
    console.log(`exec ${chalk.red(command)} is failed`);
    process.exit(0);
  })
}


function cloneRepository(gitRepository) {
  const command = 'git'
  const cwd = `./${template}`
  const repositoryName = gitRepository.match(/([a-zA-z_\.-]*)\.git$/)[1]
  const respPath = `${cwd}/${repositoryName}`

  if (!repositoryName) {
    console.log('please specify a remote git repository');
    process.exit();
  }
  // 模板里面包含git仓库,执行git pull
  if (fs.existsSync(respPath)) {
    return new Promise((resolve, reject) => {
      const args = ['pull']
      const child = spawn(command, args, {
        stdio: 'inherit',
        cwd: respPath,
      })
      child.on('close', (code) => {
        if (code !== 0) {
          reject(`${command} ${args.join(' ')}`)
        }
        resolve(respPath)
      })
    })
  }

  return new Promise((resolve, reject) => {
    const args = ['clone', gitRepository]
    const child = spawn(command, args, { 
      stdio: 'inherit',
      cwd,
    })

    child.on('close', (code) => {
      if (code !== 0) {
        reject( `${command} ${args.join(' ')}`)
      }
      resolve(respPath)
    })
  })
}


module.exports = createProject


