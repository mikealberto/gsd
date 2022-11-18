import * as usersAPI from "./users-api";

export async function signUp(userData) {
    // Delegate the network request code to the users-api.js API module
    // which will ultimately return a JSON web token (JWT)
    const token = await usersAPI.signUp(userData);
    //Put token into local storage "Persist the token"
    localStorage.setItem("token", token); //string
    return getUser();
}

export async function login(userData) {
    const token = await usersAPI.login(userData);
    localStorage.setItem("token", token);
    return getUser();
}

export function getToken() {
    // getItem returns null if there is no string 
    const token = localStorage.getItem("token");
    if (!token) return null;
    //obtain payload of the token 
    // atob : decode
    const payload = JSON.parse(atob(token.split(".")[1]));
    // JSON wbe token is expressed in seconds, not milliseconds 
    if (payload.exp < Date.now() / 1000) {
        // Token has expired - remove it from local storage 
        localStorage.removeItem("token");
        return null;
    }
    return token;
}

export function getUser() {
    const token = getToken();
    // If there's a token, return the user in the payload, otherwise return null
    return token ? JSON.parse(atob(token.split(".")[1])).user : null;
}

export function logOut() {
    localStorage.removeItem("token");
}

export function checkToken() {
    // checkToken returns a string, but let's
    // make it a Data object for more flexibility 
    return usersAPI.checkToken().then(dateStr => new Date(dateStr));
}