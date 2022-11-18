import { getToken } from "./users-service";

//default because sendRequest is the main point of this module 
export default async function sendRequest(url, method = "GET", payload = null) {
    // Fetch(request to server) accepts an options object as the 2nd argument -
    // - used to include a data payload, set headers, etc.
    const options = { method }; //shorthand syntax creates key: value pair
    if (payload) {
        options.headers = { 'Content-Type': 'application/json' };
        // Fetch requires data payloads to be stringified -
        // - and assigned to be a body property on the options object -
        // - it gets converted back to an object at the other end
        // can only pass JSON strings to our servers
        options.body = JSON.stringify(payload);
    }
    // if there is a valid token in local storage -
    // - we will include it with the AJAX request in a header
    const token = getToken();
    if (token) {
        // if options.headers is truthy it wont do anything
        // if options.headers is falsy it will return the second argument {} -
        // - so that we could initialize it into an empty object 
        // updates only if options.headers is falsy 
        options.headers ||= {};
        // after making sure that headers exist 
        // add token to an authorization header
        // prefacing with "Bearer" is recommended in the HTTP specification 
        options.headers.Authorization = `Bearer ${token}`;
    }
    const res = await fetch(url, options);
    // res.json() will resolve to the JWT
    //res.ok will be false if the status code set to 4xx in the controller action
    if(res.ok) return res.json();
     // how to programatically create your own error 
    throw new Error("Bad Request");
}