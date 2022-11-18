// Rewrite the SignUpForm as a function component
import { useState } from "react";
import { signUp } from "../../utilities/users-service";

export default function SignUpForm({ setUser }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirm: "",
        error: ""
    })

    // this is defined everytime our componenet renders
    // component rerenders when the states are updated(onChange)
    const disable = formData.password !== formData.confirm;

    function handleChange(evt) {
        setFormData({
            ...formData,
            [evt.target.name]: evt.target.value,
            error: ""
        })
    }

    async function handleSubmit(evt) {
        evt.preventDefault();
        try {
            const formDataCopy = {...formData};
            delete formDataCopy.error;
            delete formDataCopy.confirm;
            // The promise returned by the signUp service method
            // will resolve to the user object included in the 
            // payload of the JSON Web Token (JWT)
            const user = await signUp(formDataCopy);
            setUser(user);
        } catch {
            //if somebody tries to sign up and something goes wrong 
            // all the inputs are going to retain everything it has
            setFormData({
                ...formData,
                error: "Sign Up Failed - Try Again"
            });
        }
    }

    return (
        <div>
            <div className="form-container">
              <form autoComplete="off" onSubmit={handleSubmit}>
                <label>Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                <label>Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                <label>Confirm</label>
                <input type="password" name="confirm" value={formData.confirm} onChange={handleChange} required />
                <button type="submit" disabled={disable}>SIGN UP</button>
              </form>
            </div>
            <p className="error-message">&nbsp;{formData.error}</p>
          </div>
    );

}