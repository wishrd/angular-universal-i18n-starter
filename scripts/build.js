const execSync = require('child_process').execSync;
const path = require('path');
const project = require(path.join(process.cwd(), 'project.json'));
const args = require('yargs').argv;

const locales = Object.keys(project.locales);
const baseCommand = args.server === 'true' ? project.server.command : project.client.command;
const folder = args.server === 'true' ? project.server.output : project.client.output;

function buildCommand(command, locale, output, needFile) {
  command += ` --output-path dist/${output}/${locale.toLowerCase()} --deploy-url /${locale.toLowerCase()}/ --base-href /${locale.toLowerCase()}/ --locale=${locale}`;

  if (needFile) {
    command += ` --i18n-file=src/locale/messages.${locale.toLowerCase()}.xlf --i18n-format=xlf`;
  }

  return command;
}

for (let i = 0; i < locales.length; i++) {
  execSync(buildCommand(baseCommand, locales[i], folder, project.locales[locales[i]]), { cwd: process.cwd() });
}

process.exit(0);
