//Load required libraries
const express = require('express');
const morgan = require('morgan');
const mysql2 = require('mysql2/promise');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const jwt = require('jsonwebtoken');
const cors = require('cors')

//SQL queries
const SQL_FIND_USER = "select user_id from user where user_id = ? and password = ? COLLATE utf8mb4_bin"


//configure passport with strategy 
passport.use(

    new LocalStrategy({

        usernameField: 'user_id',
        passwordField: 'password',
    }, async (username, password, done) => {
        //perform authentication
        console.info(`user: ${username}, password: ${password}`)
        const conn = await pool.getConnection();
        try{
            const [authResult,_] = await conn.query(SQL_FIND_USER, [username, password])
            //if auth is correct, authResult.length == 1, then !!authResult.length == true
            if (!!authResult.length) {
                done(null, {
                    //passport will generate a user object as below as req.user
                    username: username,
                    loginTime: (new Date()).toString(),
                    security: 2
                })
         
            }else{
                //incorrect credentials
                done('Incorrect username and/or password', false) 
            }
            
        }
        catch(e){console.log(e)}
        finally{conn.release()}
    })   
    
)

//token password
const TOKEN_SECRET = process.env.TOKEN_SECRET || "abcd1234" 

//configure port 
const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000;

//Instantiate an instance of express
const app = express()

//configure mysql pool
const pool = mysql2.createPool({

    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "paf2020",
    connectionLimit: 4,
    timezone: "+08:00",
    host: process.env.DB_HOST || "localhost"

});

//start app 
pool.getConnection().then(async conn => {

    await conn.ping();
    console.log(">>> Pinging databse...");
    app.listen(PORT, () => {
        console.log(`App started on port ${PORT} at ${new Date()}`)
    })
    conn.release()
}).catch(e => {console.log("Unable to connect to database. App not started.", e)})


//Configure express app (tell it what to use)
app.use(morgan('combined'))
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: true}))

//Initialise passport after app.use json and url.encoded
app.use(passport.initialize())

app.post('/login', //passport.authenticate('local', {session: false})

(req, res, next) => {

    //do something
    //console.info("user", req.user)
    //res.status(200).json({"message": `New login at ${new Date()}`})
    const f = passport.authenticate('local',
        (err, user, info) => {
            if (null !=err) {
                res.status(401).json({error: err})
                return
            }
            if (!user) {  //see LocalStrategy above. if either user_id or password is null, the verify function will not be called. user object will be null and error will NOT be thrown.
                res.status(401).json({error: info})
                return
            }
            req.user = user
            next()
        }    
    )
    f(req, res, next)

}, 
    (req, res) => {

        console.info("user:", req.user);
        //Generate jwt
        const issuedTimeInSeconds = (new Date().getTime()/1000)
        const token = jwt.sign({

            sub: req.user.user_id,
            iss: 'myapp',
            iat: issuedTimeInSeconds,
            nbf: issuedTimeInSeconds + 15,
            exp: issuedTimeInSeconds + 30  //token expires 30s after being issued
    
        }, TOKEN_SECRET)
        console.log(token)
        res.status(200).type('application/json').json({"message": `New login at ${new Date()}`, token})
    }

)

//Look for token in http header
app.get('/protected/secret', 

    (req, res, next) => {

        const auth = req.get('Authorization');
        if (null == auth){
            res.status(403)
            console.info("unauthorized access layer 1")
            res.json({"message": "Unauthorized access"})
            return
        }
        //Bearer authentication
        const terms = auth.split(' ');
        if ((terms.length != 2) || terms[0] != "Bearer") {
            res.status(403)
            console.info("unauthorized access layer 2")
            res.json({"message": "Unauthorized access"})
            return
        }

        const token = terms[1]
        try{
            const verified = jwt.verify(token, TOKEN_SECRET)
            req.token = verified
            next()
        }
        catch{
            res.status(401)
            console.info("unauthorized access layer 3")
            res.json({"message": "Unauthorized access"})
            return
        }

    },

    (req, res) => {

        res.status(200).type('application/json').json({"message": "I am Batman."})

    }

 )