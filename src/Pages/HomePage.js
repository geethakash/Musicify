import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "reactstrap";
import { UserContext } from "../Context/UserContext";
import Girl from "../Static/landing-page-girl.png";
import Logo from "../Static/Musicify.png";

function HomePage() {
  const Context = useContext(UserContext);

  if (!Context.user?.uid) {
  }
  return (
    <>
      <Container>
        <Row className="homepageContainer">
          <Col className="landing-page-girl-col">
            <img src={Girl} className="" alt="Feel Girls" />
          </Col>
          <Col className="logoContainer md-d-flex">
            <div className="logoContDiv pt-md-5" >
            <img src={Logo} className="" alt="Logo" />
            <p>Store Your Personal Audio Library With us</p>
            {Context.user?.uid ? (
              <Button tag={Link} to="/library" className="btn btn-info">
                Goto Library
              </Button>
            ) : (
              <Button tag={Link} to="/register" className="btn btn-info">
                Join Now
              </Button>
            )}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default HomePage;
