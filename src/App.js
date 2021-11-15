import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
// import "./Static/plyr.css";
import { UserContext } from "./Context/UserContext";
import { useContext, useEffect, useState } from "react";

// route things
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// Pages
import Header from "./Pages/Layouts/Header";
import HomePage from "./Pages/HomePage";
import SignupPage from "./Pages/SignupPage";
import LoginPage from "./Pages/LoginPage";
import PageNotFound from "./Pages/PageNotFound";

//firebase
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/storage";
import "firebase/compat/database";

//initialize firebase using conifg file
import firebaseConfig from "./Config/Config";
import MusicUploadPage from "./Pages/AudioUploadPage";
import AudioLibraryPage from "./Pages/AudioLibraryPage";
import DeletePage from "./Pages/DeletePage";
firebase.initializeApp(firebaseConfig);

function App() {
  var Context = useContext(UserContext);
  var localUser;
  if (localStorage.getItem("user")) {
    localUser = JSON.parse(localStorage.getItem("user"));
  } else {
    localUser = null;
  }
  const [user, setUser] = useState(localUser);

  console.log("Info:> user =", user);

  return (
    <Router>
      <div className="App">
        <UserContext.Provider value={{ user, setUser }}>
          <Header />
          <ToastContainer />
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/register" component={SignupPage} />
            <Route exact path="/login" component={LoginPage} />
            {user !== null ? (
              <>
                <Route exact path="/upload" component={MusicUploadPage} />
                <Route exact path="/library" component={AudioLibraryPage} />
                <Route exact path="/delete" component={DeletePage} />
              </>
            ) : (
              ""
            )}

            <Route exact path="*" component={PageNotFound} />
          </Switch>
        </UserContext.Provider>
      </div>
    </Router>
  );
}

export default App;
