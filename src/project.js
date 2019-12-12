const inquirer = require('inquirer');
const fse = require('fs-extra');
const download = require('download-git-repo');
const {
  TEMPLATE_GIT_REPO,
  INJECT_FILES
} = require('./constants');
const chalk = require('chalk');
const ora = require('ora');
const path = require('path');
const memFs = require('mem-fs');
const editor = require('mem-fs-editor');
const {
  getDirFileName
} = require('./utils');
const {
  exec
} = require('child_process');

function Project(options) {
  this.config = Object.assign({
    projectName: '',
    description: ''
  }, options);
  const store = memFs.create();
  this.memFsEditor = editor.create(store);
}

Project.prototype.create = function () {
  this.inquire()
    .then((answer) => {
      this.config = Object.assign(this.config, answer);
      this.generate();
    });
};

Project.prototype.inquire = function () {
  const prompts = [];
  const {
    projectName,
    description
  } = this.config;
  if (typeof projectName !== 'string') {
    prompts.push({
      type: 'input',
      name: 'projectName',
      message: 'Please enter the project name:',
      validate(input) {
        if (!input) {
          return 'Project name cannot be empty.';
        }
        if (fse.existsSync(input)) {
          return 'An item with the same name already exists in the current directory. Please change the item name.';
        }
        return true;
      }
    });
  } else if (fse.existsSync(projectName)) {
    prompts.push({
      type: 'input',
      name: 'projectName',
      message: 'An item with the same name already exists in the current directory. Please change the item name.',
      validate(input) {
        if (!input) {
          return 'Project name cannot be empty.';
        }
        if (fse.existsSync(input)) {
          return 'An item with the same name already exists in the current directory. Please change the item name.';
        }
        return true;
      }
    });
  }

  if (typeof description !== 'string') {
    prompts.push({
      type: 'input',
      name: 'description',
      message: 'Please enter project description'
    });
  }

  return inquirer.prompt(prompts);
};

/**
 * 模板替换
 * @param {string} source 源文件路径
 * @param {string} dest 目标文件路径
 * @param {object} data 替换文本字段
 */
Project.prototype.injectTemplate = function (source, dest, data) {
  this.memFsEditor.copyTpl(
    source,
    dest,
    data
  );
}

Project.prototype.generate = function () {
  const {
    projectName,
    description
  } = this.config;
  const projectPath = path.join(process.cwd(), projectName);
  const downloadPath = path.join(projectPath, '__download__');

  const downloadSpinner = ora('Downloading template...');
  downloadSpinner.start();
  // 下载git repo
  download(TEMPLATE_GIT_REPO, downloadPath, {
    clone: true
  }, (err) => {
    if (err) {
      downloadSpinner.color = 'red';
      downloadSpinner.fail(err.message);
      return;
    }

    downloadSpinner.color = 'green';
    downloadSpinner.succeed('Download successful.');

    // 复制文件
    console.log();
    const copyFiles = getDirFileName(downloadPath);

    copyFiles.forEach((file) => {
      fse.copySync(path.join(downloadPath, file), path.join(projectPath, file));
      console.log(`${chalk.green('✔ ')}${chalk.grey(`Establish: ${projectName}/${file}`)}`);
    });

    INJECT_FILES.forEach((file) => {
      this.injectTemplate(path.join(downloadPath, file), path.join(projectName, file), {
        projectName,
        description
      });
    });

    this.memFsEditor.commit(() => {
      INJECT_FILES.forEach((file) => {
        console.log(`${chalk.green('✔ ')}${chalk.grey(`Establish: ${projectName}/${file}`)}`);
      })

      fse.remove(downloadPath);

      process.chdir(projectPath);

      // git 初始化
      console.log();
      const gitInitSpinner = ora(`cd ${chalk.green.bold(projectName)} catalog, execute ${chalk.green.bold('git init')}`);
      gitInitSpinner.start();

      const gitInit = exec('git init');
      gitInit.on('close', (code) => {
        if (code === 0) {
          gitInitSpinner.color = 'green';
          gitInitSpinner.succeed(gitInit.stdout.read());
        } else {
          gitInitSpinner.color = 'red';
          gitInitSpinner.fail(gitInit.stderr.read());
        }

        // 安装依赖
        console.log();
        const installSpinner = ora(`Installation project dependency ${chalk.green.bold('yarn install')}, Please wait a moment...`);
        installSpinner.start();
        exec('yarn install', (error, stdout, stderr) => {
          if (error) {
            installSpinner.color = 'red';
            installSpinner.fail(chalk.red('Failed to install project dependency. Please reinstall yourself!'));
            console.log(error);
          } else {
            installSpinner.color = 'green';
            installSpinner.succeed('Installation of dependency succeeded.');
            console.log(`${stderr}${stdout}`);

            console.log();
            console.log(chalk.green('Project created successfully!'));
            console.log(chalk.green('Let\'s Coding吧！嘿嘿😝'));
          }
        })
      })
    });
  });
}

module.exports = Project;