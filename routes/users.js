const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcrypt');
const {log} = require("debug");
const sqlQuery = require('../utils/mysql');
const {User} = require("../models/user");
const {hash} = require("bcrypt");

function generateToken(id) {
  return jwt.sign({id:id}, process.env.JWT_SECRET, {expiresIn: '1d'});
}

/* GET users listing. */
router.post('/signup', function (req, res, next) {
  let data = req.body;
   if(data.password.length > 8) {
     bcrypt.hash(data.password, 12).then(hash => {
       data.password = hash;
       //   bcrypt.hash(data.password, 12).then(hash => {
       //     data.password = hash;
       //     let query = `INSERT INTO user (email, password, display_name) VALUES ('${data.email}', '${data.password}', '${data.display_name}')`;
       //     try {
       //       sqlQuery(query, (err, result) => {
       //         delete data.password;
       //         res.json(data);
       //         res.status(200);
       //       })
       //     } catch (err) {
       //       res.send(err);
       //       res.status(500);
       //     }
       //   }).catch(error => {
       //     res.send(error);
       //     res.status(500);
       //   });
       // } else {
       //   res.send('Invalid password length');
       //   res.status(500);
       // }
       try {
         const user = async () => {
           await User.create({
             email: data.email,
             password: data.password,
             display_name: data.display_name
           });
         }
         res.json('post');
         res.status(201);
         return user();
       } catch (error) {
         res.status(error.status);
       }
     });
   }else {
     res.send('Invalid password length');
     res.status(500);
   }
});

/* GET users listing. */
router.post('/login', function(req, res, next) {
  let data = req.body;
    // try {
    //   if(data) {
    //     sqlQuery(`SELECT * FROM user WHERE email = "${data.email}" LIMIT 1`, (err, results) => {
    //         log(results);
    //       if(results.length !== 0) {
    //         const user = results[0];
    //         bcrypt.compare(data.password, user.password).then(isOk => {
    //           if(!isOk) {
    //             res.status(400);
    //             res.send('Invalid credentials');
    //           } else {
    //             delete user.password;
    //             // GENERATE JWT Token
    //             res.status(200);
    //             let userToken = generateToken(user.id);
    //             res.setHeader('Authorization', 'bearer ' + userToken);
    //             return res.json( {
    //               "userToken" : userToken,
    //               "user" : user
    //             })
    //           }
    //         })
    //       }
    //     })
    //   } else {
    //     res.send('Invalid password or username');
    //     res.status(500);
    //   }
    // } catch(error) {
    //   res.status(500);
    // }
  try {
    const user = async () => {
      await User.findOne({ where: { email: data.email } }).then(user => {
        if(user) {
          bcrypt.compare(data.password, user.password).then(isOk => {
            if(!isOk) {
              res.status(400);
              res.send('Invalid credentials');
            } else {
              delete user.password;
              // GENERATE JWT Token
              res.status(200);
              let userToken = generateToken(user.id);
              res.setHeader('Authorization', 'bearer ' + userToken);
              return res.json( {
                "userToken" : userToken,
                "user" : user
              })
            }
          })
        }
      });
    }
    return user();
  } catch(error) {
    res.status(500);
  }
});

/* GET users listing. */
router.get('/token-test', function(req, res, next) {
  const headers = req.headers;
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    let token = headers.authorization.replace('Bearer', '').trim();
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if(err) {
        res.status(401);
        if(err.name === 'TokenExpiredError') {
          res.send('Expired token');
        }
      }
      let query = `SELECT display_name as name FROM user WHERE id = ${payload.id}`;
      try {
        sqlQuery(query, (err, results) => {
          if(!results.length) {
            res.status(401);
            res.send('Unauthorized');
            return;
          }
          res.json(results);
          res.status(200);
        })
      } catch (err) {
        res.status(401);
        res.send('Access Denied');
      }
    });
  } else {
    res.status(500);
    res.send('Unauthorized');
  }
});

module.exports = router;
