const proxy = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(['/api', '/auth'], proxy({ target: 'http://localhost:8000' }));
};