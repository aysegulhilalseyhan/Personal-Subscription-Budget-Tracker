const app = require('./app');
const env = require('./config/env');

app.listen(env.port, env.host, () => {
  console.log(`Personal Subscription Budget Tracker is running on http://${env.host}:${env.port}`);
  console.log(`Swagger API docs are available at http://${env.host}:${env.port}/api-docs`);
});
