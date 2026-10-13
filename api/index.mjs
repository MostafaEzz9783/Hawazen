import worker from '../dist/server/index.js';

// Keep Sites and Vercel serving the same dashboard.
export default {
  fetch(request) {
    return worker.fetch(request);
  },
};
