# jtrpc

A json rpc server framework.

## install

```
$ npm install typedi koa koa-bodyparser @jtrpc/core @jtrpc/koa
```

## quick start

```typescript
import { Service } from 'typedi';
import * as Koa from 'koa';
import * as bodyparser from 'koa-bodyparser';
import jtrpc from '@jtrpc/koa';
import { MethodInstance } from '@jtrpc/core';

const app = new Koa();
app.use(bodyparser());
app.use(jtrpc());

@Service('ping')
class Ping extends MethodInstance {
  execute() {
    return 'pong';
  }

  validateParameters() {
    return true;
  }
}

app.listen(3000, () => console.log('server up'));
```
