// everytime you create middleware it is a good custom to add it to your config folder
 const jwt = require("jsonwebtoken");

 //next because with want the follow to continue after a middleware 
 module.exports = function(req, res, next) {
    // Check for the token being sent in a header or a query parameter
    let token = req.get("Authorization") || req.query.token;
    if (token) {
        // remove the "Bearer" if it was included in the token header
        token = token.replace("Bearer ", "");
        // check if token is valid and not expired
        jwt.verify(token, process.env.SECRET, function(err, decoded) {
            // If valid token, decoded will be the token's entire payload
            // If invalid token, err will be set
            req.user = err ? null : decoded.user;
            // if it truthy we want to see the experation date in milliseconds 
            // optional: we really don't need to know when the expiration will expire
            req.exp = err ? null : new Date(decoded.exp * 1000);
            return next();
        });
    } else {
        // No token was sent
        req.user = null;
        return next();
    }
 }