import React, { useContext, useEffect } from 'react';
import { Card, CardBody, CardHeader, CardSubtitle, CardText, CardTitle ,Button} from 'reactstrap';
import firebase from 'firebase/compat/app';
import { Redirect, useHistory, useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { CurrentContext } from '../Context/CurrentContect';
import { useState } from 'react/cjs/react.development';
import { toast } from 'react-toastify';
import { UserContext } from '../Context/UserContext';

function DeletePage() {
    const Context = useContext(UserContext);
    const [audioItem,setAudioItem] = useState();
    const { data } = useLocation();
    useEffect(()=> {

        setAudioItem(data);
    },[])
    
    const history = useHistory();

    const handeFirebaseDelete = () =>  {
        const storageRef = firebase.storage().ref(`${audioItem.storedPath}undifined.mp3`)
        storageRef.delete().then(() => {
            console.log("Deleted Audio Successfully.");
          })
          .catch((err) => console.log(err));
          


        const databaseRef = firebase.database().ref(`audiolibrary/${Context.user?.uid}/audios/${audioItem.mid}`)
        databaseRef.remove()
        .then(() => {
            toast("Deleted Audio Successfully.", { type: "info",theme:'colored' });
          })
          .catch((err) => console.log(err));
        //   console.log('database :> ',`audiolibrary/${Context.user?.uid}/audios/${audioItem.mid}`);
        // console.log('running delete')
        // console.log(audioItem)
        // console.log('stored path:> ',audioItem.storedPath);
        // console.log(audioItem.mid);
        history.push('/library')
        
        
    }

    return ( 
        <div className="deleteContainer">
            <Card className="w-50 bg-transparent">
                <CardHeader className="bg-transparent">
                    <CardTitle>
                        <h1 className="text-center text-danger fw-bold">Warning!</h1>
                    </CardTitle>
                    </CardHeader>
                <CardBody className="text-center">
                    <CardText className="text-light">
                        Are you sure do you want to delete?
                    </CardText>
                    <Button className="bg-primary" tag={Link} to="/library">No</Button><Button className="bg-danger ms-3" onClick={handeFirebaseDelete}>Yes</Button>
                </CardBody>
                </Card> 
        </div>
    );
}

export default DeletePage;