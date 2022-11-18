const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports = {
    create,
    login,
    checkToken,
}

async function create(req, res) {
    //sending back JSON data : DELETE
    try {
        // add the user to the database
        const user = await User.create(req.body);
        const token = createJWT(user);
        //respond back to the client
        //the client code needs to take into consideration 
        //that it is receiving a json string 
        res.json(token);
    } catch (err) {
        // Client will check for non-2xx status code
        // 400 = Bad Request 
        res.status(400).json(err);
    }
} 

async function login(req, res) {
    try {
        //mongoose model function 
        const user = await User.findOne({
            email: req.body.email
        });
        //if: to stop flow and jump to catch
        if (!user) throw new Error();
        // comparing plaintextpassword and -
        // hash pw that is stored in User Database
        const match = await bcrypt.compare(req.body.password, user.password);
        if(!match) throw new Error();
        const token = createJWT(user);
        res.json(token);
    } catch (err) {
        res.status(400).json(err)
    }
}

function checkToken(req, res) {
    console.log("req.user", req.user);
    res.json(req.exp);
}

/*-- Helper Functions --*/

function createJWT(user) {
    // sign method is in the jsonwebtoken library -
    // - used to create JWTs
    return jwt.sign(
        // data payload
        { user },
        // used to sign the JWT
        process.env.SECRET, 
        { expiresIn: "24h" }
    );
}