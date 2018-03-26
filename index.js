#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const pkg = require('./package.json');
const createProject = require('./createProject')


let projectName = ''
let gitRepository = ''

program
  .usage('<project-name> [git-repository]')
  .arguments('<project-name> [git-repository]')
  .action(function(name, repository) {
    projectName = name;
    gitRepository = repository;
  })
  .on('-h, --help', () => {
    console.log(` ${chalk.green('<project-directory>')} is required.`);
    console.log(` ${chalk.green('<git-repository>')} is required.`);
  })
  .parse(process.argv)


if (!projectName) {
  console.log('Please specify the project directory')
  process.exit(0)
}

if (!gitRepository) {
  console.log('Please specify the git repository')
  process.exit(0)
}
const httpReg = /^\s*(http(s?):\/\/)\w?/
if (!httpReg.test(gitRepository)) {
  console.log('Please specify a git repository that starts with http or https')
  process.exit()
}

createProject(projectName, gitRepository)

