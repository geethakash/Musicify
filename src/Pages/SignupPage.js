import React, { useContext, useState } from "react";
import {
  Container,
  Row,
} from "reactstrap";
import firebase from "firebase/compat/app";
import { UserContext } from "../Context/UserContext";
import { toast } from "react-toastify";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";


function SignupPage() {

  const Context = useContext(UserContext);
  const [email,setEmail] = useState('');
  const [password, setPassword] = useState('')

  const handleSignup = () => {
    
    firebase.auth().createUserWithEmailAndPassword(email,password)
    .then((res) => {
      console.log(res);
      toast('Account created Successfully.',{type:"success",theme:"dark"})
      Context.setUser(res.user)
      localStorage.setItem('user',JSON.stringify(res.user))
      toast(`Signin successfully as ${email}`, {
        type: "success",
        theme:'colored'
      });
    })
    .catch((error) => {
      console.log('ERROR:> ',error);
      toast(error.message , {type:'error', theme:'dark'})
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSignup();
  }

  if (Context.user?.uid) {
    return <Redirect to="/" />
  }


  return (
    <Container className="text-center">
      <Row>
        <div lg={5} className="d-flex justify-content-center align-items-center md-mx-2 mt-5">
          
            <form onSubmit={handleSubmit} className="loginForm my-5" action="" method="post" autoComplete="off">
                <h2 className="loginFormH2">Register</h2>
                <input className="txtInput" type="email" name="email" id="email" onChange={e => setEmail(e.target.value)} value={email} placeholder="Email"/>
                <input className="txtInput mt-2" type="password" name="password" id="password" onChange={(e) => setPassword(e.target.value)} value={password} placeholder="Password"/>
                <input className="btnLogin" type="submit" name="submit" value="Create Account" />
                <p className="haveacclbl">Already have an account? <Link to="/login" className="reglink">Login</Link></p>
            </form>
            
          
        </div>
      </Row>
    </Container>
  );
}

export default SignupPage;
