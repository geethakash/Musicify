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

function SigninPage() {
  const Context = useContext(UserContext)
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');

  const handleSignin = () => {
    firebase.auth().signInWithEmailAndPassword(email,password)
    .then((res) => {
      console.log(res);
      Context.setUser(res.user);
      localStorage.setItem('user',JSON.stringify(res.user))
      toast(`Signin successfully as ${email}`, {
        type: "success",
        theme:'dark'
      });
    })
    
    .catch((error) => {
      var errormg = error.message.replace('firebase:','')
      toast(errormg,{type:'error',theme:'colored'});
    })
  }
  
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSignin();
  }

  if (Context.user?.uid) {
    return <Redirect to="/" />
    
  }

  return (
    <Container className="text-center">
      <Row>
        <div lg={5} className="d-flex justify-content-center align-items-center md-mx-2 mt-5">
          {}
            <form onSubmit={handleSubmit} className="loginForm my-5" action="" method="post" autoComplete="off">
                <h2 className="loginFormH2">Log in</h2>
                <input className="txtInput" type="email" name="email" id="email" onChange={e => setEmail(e.target.value)} value={email} placeholder="Email"/>
                <input className="txtInput" type="password" name="username" id="password" onChange={e => setPassword(e.target.value)} value={password} placeholder="Password"/>
                <input className="btnLogin" type="submit" value="Log in" />
                <p className="haveacclbl">Need an account? <Link to="/register" className="reglink">Register</Link></p>
            </form>
        </div>
      </Row>
    </Container>
  );
}

export default SigninPage;
