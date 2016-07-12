const fs = require('fs');
const path = require('path');
const Koa = require('koa');
const app = new Koa();
const scssToJson = require('scss-to-json');
const sass = require('node-sass');

app.use(function*(next) {
  let method = this.method;
  let module = this.path;
  yield next;
  this.set('Access-Control-Allow-Origin', '*')
  this.body = getModule(module);
});

app.listen(3000);

function distHtml(content, css) {
  let html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>ui kit</title>
    <meta name="viewport" content="width=device-width, user-scalable=yes, initial-scale=1.0">
    <meta name="format-detection" content="telephone=no" />
    <!-- Webkit HTML5内核>双核浏览器webkit内核>双核浏览器IE内核>IE标准内核>IE兼容内核 -->
    <meta name="renderer" content="webkit|ie-stand|ie-comp">
    <meta name="force-rendering" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <style>
    ${css}
    </style>
  </head>
  <body>
  ${content}
  </body>
</html>`;
  return html;
}

function getCss(module) {
  try {
    return sass.renderSync({
      file: `modules/${module}/${module}.scss`,
      includePaths: ['configs/default'],
      outputStyle: 'expanded'
    }).css.toString()
  } catch (err) {
    console.log('Not CSS: '+module)
    return null;
  }
}

function getCssConfig(module) {
  try {
    return scssToJson(`configs/default/${module}.config.scss`);
  } catch (err) {
    console.log('Not Config: '+module);
    return null;
  }
}

function getHtml(module) {
  try {
    return fs.readFileSync(path.join('modules', module, module + '.html')).toString();
  } catch (err) {
    console.log('Not HTML: '+module);
    return null;
  }
}

function getModule(module) {
  let moduleObj = {}
  moduleObj.name = module.replace('/', '');
  moduleObj.html = getHtml(module);
  moduleObj.css = getCss(module);
  moduleObj.cssConfig = getCssConfig(module)
  return moduleObj;
}


// function getCssConfig(module){
//   return scssToJson(path.join('modules', module, 'config.scss'));
// }
