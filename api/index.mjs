import worker from '../dist/server/index.js';

// All routes, including dashboard JS/data, pass through server authentication.
export default {
  fetch(request) {
    return worker.fetch(request, {
      AUTH_USERNAME: process.env.AUTH_USERNAME,
      AUTH_PASSWORD: process.env.AUTH_PASSWORD,
      SESSION_SECRET: process.env.SESSION_SECRET,
    });
  },
};
