# flow doc

## API

* getCss(module)
* getCssConfig(module)
* getJs(module)
* getHtml(module)
* setCss(module)
* setCssConfig(module)
* setJs(module)
* setHtml(module)

## RESTAPI

| 操作      | HTTP 动作        | Koa 方法      |
| :-------- | :-------------  | :----------  |
| 列出模块   | GET /modules    | ModulesController#index |
| 查看模块   | GET /modules/52 | ModulesController#show  |
