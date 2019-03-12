import Handlebars from 'handlebars';
import { handlebarsInit } from './handerHelper';
import assert from 'assert';
import { join } from 'path';
import { readFileSync, existsSync } from 'fs';
import { outputFileSync, removeSync } from 'fs-extra';


export function getTemplate(name, type, themeName) {

  handlebarsInit();

  const filePath = themeName ? join(__dirname, `../boilerplates/handlebars/${type}/${themeName}/${name}.handlebars`) : join(__dirname, `../boilerplates/handlebars/${type}/${name}.handlebars`);
  assert(existsSync(filePath), `getTemplate: file ${name} not fould`);
  const source = readFileSync(filePath, 'utf-8');
  return Handlebars.compile(source);
}

export function readFile(filePath) {
  return readFileSync(filePath, 'utf-8');
}

export function writeFile(filePath, source) {
  outputFileSync(filePath, source, 'utf-8');
}

export function removeFile(filePath) {
  removeSync(filePath);
}
