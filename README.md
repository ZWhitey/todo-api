# 需求

1. Todo API

   - 取得所有 Todo (需支援分頁, 篩選, 對應Items)
     - GET `/todos`
   - 取得單一 Todo by Id (需支援取得其對應Items)
     - GET `/todos/{id}`
   - 新增 Todo (需支援同時新增 Todo 與其 Items)
     - POST `/todos`
   - 更新 Todo by Id
     - PATCH `/todos/{id}`
   - 刪除 Todo by Id
     - DELETE `/todos/{id}`

2. Item API
   - 取得某Todo下所有 Items (需支援篩選)
     - GET `/todos/{id}/todo-items`
   - 取得單一 Item by Id
     - GET `/todo-items/{id}`
   - 新增 Item
     - POST `/todos/{id}/todo-items`
   - 更新 Item by Id
     - PATCH `/todo-items/{id}`
   - 刪除 Item by Id
     - DELETE `/todo-items/{id}`

# 環境設定

## 需求

- mysql 8
- node 20

## 設定流程

1.  設定 mysql 資訊

    1. 編輯 `src\datasources\db.datasource.ts` 中的 config，把 mysql 連線資訊設定完成

2.  安裝套件 `npm install`
3.  建立 db schema `npm run migrate`
4.  啟動伺服器 `npm start`

# todo

This application is generated using [LoopBack 4 CLI](https://loopback.io/doc/en/lb4/Command-line-interface.html) with the
[initial project layout](https://loopback.io/doc/en/lb4/Loopback-application-layout.html).

## Install dependencies

By default, dependencies were installed when this application was generated.
Whenever dependencies in `package.json` are changed, run the following command:

```sh
npm install
```

To only install resolved dependencies in `package-lock.json`:

```sh
npm ci
```

## Run the application

```sh
npm start
```

You can also run `node .` to skip the build step.

Open http://127.0.0.1:3000 in your browser.

## Rebuild the project

To incrementally build the project:

```sh
npm run build
```

To force a full build by cleaning up cached artifacts:

```sh
npm run rebuild
```

## Fix code style and formatting issues

```sh
npm run lint
```

To automatically fix such issues:

```sh
npm run lint:fix
```

## Other useful commands

- `npm run migrate`: Migrate database schemas for models
- `npm run openapi-spec`: Generate OpenAPI spec into a file
- `npm run docker:build`: Build a Docker image for this application
- `npm run docker:run`: Run this application inside a Docker container

## Tests

```sh
npm test
```

## What's next

Please check out [LoopBack 4 documentation](https://loopback.io/doc/en/lb4/) to
understand how you can continue to add features to this application.

[![LoopBack](<https://github.com/loopbackio/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)
