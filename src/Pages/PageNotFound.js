import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container } from "reactstrap";
import { UserContext } from '../Context/UserContext';

function PageNotFound() {
    const usercontext =useContext(UserContext)
    return ( 
            <Container className="d-flex h-50 justify-content-center align-items-center d-flex flex-column align-items-center " fluid>
                
            </Container>
     );
}

export default PageNotFound;