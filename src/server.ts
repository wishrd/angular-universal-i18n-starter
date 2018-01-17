import 'reflect-metadata';
import 'zone.js/dist/zone-node';
import { renderModuleFactory } from '@angular/platform-server';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import { enableProdMode } from '@angular/core';
import * as express from 'express';
import { join } from 'path';
import { readFileSync } from 'fs';

enableProdMode();

const PORT = process.env.PORT || 4200;
const DIST_FOLDER = join(process.cwd(), 'dist');

const LOCALES = [
  {
    id: 'es-es',
    template: readFileSync(join(DIST_FOLDER, 'browser', 'es-es', 'index.html')).toString(),
    serverModule: require('main.server.es-es').AppServerModuleNgFactory,
    lazyModuleMap: require('main.server.es-es').LAZY_MODULE_MAP
  },
  {
    id: 'en-gb',
    template: readFileSync(join(DIST_FOLDER, 'browser', 'en-gb', 'index.html')).toString(),
    serverModule: require('main.server.en-gb').AppServerModuleNgFactory,
    lazyModuleMap: require('main.server.en-gb').LAZY_MODULE_MAP
  },
  {
    id: 'en-us',
    template: readFileSync(join(DIST_FOLDER, 'browser', 'en-us', 'index.html')).toString(),
    serverModule: require('main.server.en-us').AppServerModuleNgFactory,
    lazyModuleMap: require('main.server.en-us').LAZY_MODULE_MAP
  }
];

const app = express();

app.engine('html', (_, options, callback) => {
  const opts = {
    document: options.template,
    url: options.req.url,
    extraProviders: [provideModuleMap(options.lazyModuleMap)]
  };

  renderModuleFactory(options.serverModule, opts)
    .then(html => callback(null, html));
});

app.set('view engine', 'html');
app.set('views', 'src');

app.get('*.*', express.static(join(DIST_FOLDER, 'browser')));


// Locales
LOCALES.forEach(locale => {
  app.get(`/${locale.id}/*`, (req, res) => {
    res.render('index', { req, template: locale.template, serverModule: locale.serverModule, lazyModuleMap: locale.lazyModuleMap });
  });
});

// Redirect to default locale keeping requested path
app.get('*', (req, res) => {
  res.redirect(`/es-es${req.url}`.replace(/\/+/g, '/'));
});

app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}!`);
});
