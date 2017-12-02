import 'reflect-metadata';
import 'zone.js/dist/zone-node';
import { renderModuleFactory } from '@angular/platform-server';
import { enableProdMode } from '@angular/core';
import * as express from 'express';
import { join } from 'path';
import { readFileSync } from 'fs';

enableProdMode();

const PORT = process.env.PORT || 4200;
const DIST_FOLDER = join(process.cwd(), 'dist');
const LOCALES = ['es-es', 'en-gb', 'en-us'];

const app = express();

app.engine('html', (_, options, callback) => {
  const template = readFileSync(join(DIST_FOLDER, 'browser', options.locale, 'index.html')).toString();
  const { AppServerModuleNgFactory } = getMainServer(options.locale);
  const opts = { document: template, url: options.req.url };
  renderModuleFactory(AppServerModuleNgFactory, opts)
    .then(html => callback(null, html));
});

app.set('view engine', 'html');
app.set('views', 'src');

app.get('*.*', express.static(join(DIST_FOLDER, 'browser')));


// Locales
LOCALES.forEach(locale => {
  app.get(`/${locale}/*`, (req, res) => {
    res.render('index', { req, locale: locale });
  });
});

// Redirect to default locale keeping requested path
app.get('*', (req, res) => {
  res.redirect(`/es-es${req.url}`.replace(/\/+/g, '/'));
});

app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}!`);
});


function getMainServer(locale: string): any {
  switch (locale) {
    case 'en-us':
      return require('main.server.en-us');
    case 'en-gb':
      return require('main.server.en-gb');
    case 'es-es':
      return require('main.server.es-es');
  }
}
