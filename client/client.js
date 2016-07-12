document.addEventListener('DOMContentLoaded', function() {
  var configs = {};

  /* ---------------------------------
   *              渲染模块
   * ---------------------------------*/
  (function() {
    var i = 0;
    var modules = 'demo reset button input column table tab label tip notice popup page form textarea link text '.split(' ')
    var xhr = new XMLHttpRequest();
    var container = document.getElementById('namespace-setting-container');
    var body = document.getElementById('namespace-uikit');
    // 渲染
    function render() {
      var module = modules[i];
      getData(module, function(data) {
        if (data.css) {
          var styleEle = document.createElement('style');
          styleEle.className = 'namespace-style-' + data.name;
          document.head.appendChild(styleEle);
          styleEle.textContent += data.css;
        }
        if (data.html) {
          var moduleEle = document.createElement('section');
          moduleEle.className = 'namespace-module-' + data.name;
          moduleEle.innerHTML = data.html; // 添加内容
          events(moduleEle, data.name); // 添加事件
          body.appendChild(moduleEle);
        }
        if (data.cssConfig) {
          configs[data.name] = data.cssConfig;
        }
        if (modules.length > ++i) {
          render();
        }
      });
    }

    // addEvent
    function events(element, module) {
      var ele = document.createElement('i');
      ele.textContent = '修改';
      element.querySelector('.demo-h2').appendChild(ele);
      element.querySelector('.demo-h2 i').addEventListener('click', function(event) {
        renderConfig(configs[module], module)
      }, false)
    }

    // 渲染
    function renderConfig(configs, module) {
      if(!setting.className.includes('namespace-setting-modify')){
        setting.className = 'namespace-setting-modify';
        body.className = 'namespace-uikit-modify';
      }
      var content = '<h2 class="namespace-setting-title">'+ module +'</h2>';
      content += '<h3 class="namespace-setting-label">'+ 'bases' +'</h3>'
      for (var config in configs) {
        var label = config.replace(/^\$[a-z]+-/, '');
        var value = configs[config].trim();
        if(configs.hasOwnProperty(config+'-doc')){
          var valueItem;
          value = value.replace(/\(/g,'').replace(/\)\s+/g,',').replace(/\)/,'').replace(/\,\s*/g,',').split(',');
          var table = '';
          var tableBody = '';
          var tableHead = '';
          var tableHeadValue = configs[config+'-doc'];
          tableHeadValue.split(' ').forEach(function(th){
            tableHead += '<th>'+ th +'</th>'
          })
          value.forEach(function(tr){
            tableBody += '<tr>';
            tr.split(' ').forEach(function(td){
              tableBody += '<td><textarea>' + td + '</textarea></td>'
            })
            tableBody += '</tr>';
          });
          table = '<table>' +'<tr>'+ tableHead + '</tr>' + tableBody + '</table>';
          content += '<h3 class="namespace-setting-label">'+ label +'</h3>'
          content += table;
        }else if(config.includes('-doc')){}else{
          content += '<label>' + label + '</label><textarea>' + value + '</textarea>'
        }
      }
      container.innerHTML = '<from>' + content + '</from>';
      initAreaH()
    }

    function getData(module, callback) {
      xhr.open('GET', 'http://localhost:3000/' + module);
      xhr.onload = function(event) {
        callback(JSON.parse(this.response))
      };
      xhr.send();
    }

    // 富文本自适应高度
    function initAreaH() {
      function autoArea(area) {
        area.style.height = '';
        area.style.height = area.scrollHeight - parseFloat(window.getComputedStyle(area).paddingTop) - parseFloat(window.getComputedStyle(area).paddingBottom) + 'px'
      }

      for (var i = 0; i < textareas.length; i++) {
        autoArea(textareas[i]);
        textareas[i].addEventListener('input', function() {
          autoArea(this)
        })
      };
    }



    render(modules);



    /* ---------------------------------
     *              设置
     * ---------------------------------*/
    var uikit = document.getElementById('namespace-uikit');
    var setting = document.getElementById('namespace-setting');
    var settingWidth = document.getElementById('namespace-setting-width');
    var textareas = setting.getElementsByTagName('textarea');


    // 改变设置面板宽度
    var changeSettingWidth = function(event) {
      var settingEnd = document.body.clientWidth - event.clientX + 'px';
      setting.style.width = settingEnd
      uikit.style.marginRight = settingEnd
    }
    settingWidth.addEventListener('mousedown', function(event) {
      document.addEventListener('mousemove', changeSettingWidth)
    })
    settingWidth.addEventListener('mouseup', function(event) {
      document.removeEventListener('mousemove', changeSettingWidth)
    })
  })();


})
