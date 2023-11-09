const jwt = require("jsonwebtoken");
const sqlQuery = require("../utils/mysql");

function authentificationMiddleWare(req, res, next) {
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
            if(err) {
                if(err.name === 'TokenExpiredError') {
                    res.send('Expired token');
                    return;
                }
            }
            let query = `SELECT display_name as name, email, id FROM user WHERE id = ${payload.id}`;
            try {
                sqlQuery(query, (err, results) => {
                    if(!results.length) {
                        res.status(401);
                        res.send('Unauthorized');
                        return;
                    }
                    req.user = results[0];
                    next();
                })
            } catch (err) {
                res.status(401);
                res.send('Access Denied');
            }
        });
    } else {
        res.status(401);
        res.send('Unauthorized');
    }
}

module.exports = {
    authentificationMiddleWare
}