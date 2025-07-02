const cors = require('cors');



module.exports = function corsMiddleware(app) {
    app.use(cors(corsOptions))

    return app;
}
