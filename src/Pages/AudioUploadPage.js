import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
} from "reactstrap";
import { Redirect, useHistory } from "react-router-dom";
import MusicImg from "../Static/MusicItem.png";
import UploadImg from "../Static/uploader.png";
import PlayImg from "../Static/play.png";
import PauseImg from "../Static/pause.png";
import firebase from "firebase/compat/app";
import { v4 } from "uuid";
import { toast } from "react-toastify";
import { UserContext } from "../Context/UserContext";
import Plyr from "plyr";

function AudioUploadPage() {
  const Context = useContext(UserContext);
  const [fileTitle, setFileTitle] = useState(null);
  const [mid,setMid] = useState();
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [storedPath,setStoredPath] = useState()
  const [isPublic, setIsPublic] = useState(false);

  const [progress, setProgress] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [isRefUsed, setIsRefUsed] = useState(false);
  const [playerImg, setPlayerImg] = useState(PlayImg);
  const myRef = useRef(null);
  const history = useHistory();

  const uploadAudio = (e) => {
    try {
      const file = e.target.files[0];
      var metadata = {
        contentType: file.type,
      };
      console.log(file.duration);
      setFileTitle((file.name).slice(0,50));
      setSelectedFile(e.target.files[0]);
      setIsFilePicked(true);
      setMid(v4())
      console.log(file);

      // setStoredFileName(file.name + v4());

      //firebase storage part
      const storageRef = firebase.storage().ref();
      var uploadTask = storageRef
        .child(`audios/${Context.user?.uid}/${file.name + mid}`)
        .put(file, metadata);

      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          setIsUploading(true);
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);

          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED:
              toast("Something wents wrong! Upload is paused.", {
                type: "error",
                theme: "colored",
              });
              setIsUploading(false);
              break;

            case firebase.storage.TaskState.RUNNING:
              console.log("Uploading in progress ");
              break;

            case firebase.storage.TaskState.SUCCESS:
              break;
          }
          if (progress === 100) {
            setIsUploading(false);
            setIsUploaded(true);
          }
        },
        (error) => {
          toast("Something is wrong! File can't upload", {
            type: "error",
            theme: "colored",
          });
        },
        () => {
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then((downLoadUrl) => {
              setDownloadUrl(downLoadUrl);
              // myRef.current.src = window.URL.createObjectURL(selectedFile);
            })
            .catch((err) => {
              console.error(err);
            });
            setStoredPath(uploadTask.snapshot.ref.fullPath);
            console.log('stored path here :> ',uploadTask.snapshot.ref.fullPath);
        }
      );
    } catch (error) {
      toast("Something went wrong! " + error.message, {
        type: "error",
        theme: "colored",
      });
    }
  };

  const addAudioToUserLibrary = () => {
    try {
      firebase
        .database()
        .ref(`audiolibrary/${Context.user?.uid}/audios/${mid}`)
        .set({
          mid,
          isPublic,
          fileTitle,
          downloadUrl,
          storedPath,
          date: new Date().toLocaleString(),
        });

    } catch (error) {
      console.log(error);
    }
    console.log(`audiolibrary/${Context.user?.uid}/audios/${[mid]}`);
  };
  const handleSubmitToDb = () => {
    if (isUploaded === true && fileTitle != null) {
      addAudioToUserLibrary();
      toast(`${fileTitle} successfully added to library`, {
        type: "success",
        theme: "colored",
      });
      history.push("/library");
    } else {
      console.log(isUploaded);
      console.log(fileTitle);
      console.log("from handlesubmittodb");
      toast(`something wents wrong`, { type: "error", theme: "colored" });
    }
  };

  const playAudio = () => {
    console.log("is ref used",isRefUsed);
    if (isUploaded === true) {
      if (isRefUsed === false) {
        myRef.current.src = window.URL.createObjectURL(selectedFile);
        myRef.current.play()
        setIsRefUsed(true);
        setIsPlaying(true);
        isPlaying ? setPlayerImg(PlayImg) : setPlayerImg(PauseImg);
      } else {
        setIsPlaying(!isPlaying);
      console.log(isPlaying);
      isPlaying ? myRef.current.pause() : myRef.current.play();
      isPlaying ? setPlayerImg(PlayImg) : setPlayerImg(PauseImg);
      }

      
      // myRef.current.play();
    }
  };


  return (
    <>
      <Container fluid>
        <Row className="musicUploaderHolder">
          <Col className="d-flex flex-column align-items-center justify-content-center">
            {isUploaded || isUploading ? (
              <h6 className="text-light">{fileTitle}</h6>
            ) : (
              <h6 className="text-light">Click To Upload</h6>
            )}

            <div className="uploadAudioHolder">
              <label htmlFor={isUploaded ? "audio-player" : "audiopicker"}>
                <img
                  onClick={playAudio}
                  className={
                    isUploading
                      ? "uploadImg uploadingImg"
                      : isUploaded
                      ? "uploadedImg"
                      : "uploadImg"
                  }
                  htmlFor="audiopicker"
                  src={isUploaded ? playerImg : UploadImg}
                  alt="musicImg"
                />

                <img
                  onClick={playAudio}
                  className="musicImg"
                  src={MusicImg}
                  alt="musicImg"
                />
                <input
                  type="file"
                  name="audio"
                  id="audiopicker"
                  accept="audio/*"
                  multiple={false}
                  onChange={(e) => uploadAudio(e)}
                  hidden
                />
              </label>

              {isUploading || isUploaded ? (
                <div
                  className="progress mt-1 w-100"
                  style={{ backgroundColor: "#39363c" }}
                >
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: "#ae00f2",
                    }}
                    aria-valuenow="75"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              ) : (
                ""
              )}

              {isFilePicked ? (
                <div className="text-light mt-2">
                  {/* <p>Filename: {selectedFile.name}</p>
                  <p>Filetype: {selectedFile.type}</p>
                  <p>Size in bytes: {selectedFile.size}</p>
                  <p>
                    lastModifiedDate:{" "}
                    {selectedFile.lastModifiedDate.toLocaleDateString()}
                  </p> */}

                  <div>
                    <audio style={{display:'none'}}
                      ref={myRef}
                      id="audio-player"
                      src=""
                      onClick={playAudio}
                      controls
                      type="audio/mp3"
                      loop
                    />
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </Col>
          <Col className="d-flex align-items-center text-light">
            <Card className="bg-transparent w-75 border-0">
              <Input
                type="text"
                className="bg-dark border-success mx-5 my-2 musicdetails text-light"
                placeholder="Title"
                value={fileTitle}
                onChange={(e) => setFileTitle(e.target.value)}
              />
              {/* public */}
              <InputGroup className="mb-3 ms-5">
                <InputGroupText className="bg-dark border-success">
                  <Input
                    type="radio"
                    name="visibility"
                    aria-label="raido for public"
                    checked={isPublic === true}
                    onChange={(e) => setIsPublic(e.target.checked)}
                  />
                </InputGroupText>
                <InputGroupText className="bg-dark text-light border-success">
                  Public
                </InputGroupText>

                {/* private */}
                <InputGroupText className="bg-dark ms-3 border-right-0 border-success ">
                  <Input
                    type="radio"
                    name="visibility"
                    aria-label="radio for private "
                    checked={isPublic === false}
                    onChange={(e) => setIsPublic(!e.target.checked)}
                  />
                </InputGroupText>
                <InputGroupText className="bg-dark text-light border-success">
                  Private
                </InputGroupText>
              </InputGroup>
              {isUploaded ? (
                <Button
                  className="ms-5 bg-success w-50"
                  onClick={handleSubmitToDb}
                >
                  Add audio to library
                </Button>
              ) : (
                <Button
                  className="ms-5 bg-secondary w-50"
                  onClick={handleSubmitToDb}
                  disabled
                >
                  Add audio to library
                </Button>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default AudioUploadPage;

// import {useState, useRef, useEffect} from 'react'

// function AudioUploadPage(){
//   const [selectedFile, setSelectedFile] = useState();
//   const [isFilePicked, setIsFilePicked] = useState(false);
//   const myRef = useRef(null)

//   const changeHandler = (event) => {
//     setSelectedFile(event.target.files[0]);
//     setIsFilePicked(true);
//   };

//   const playAudio = () => {
//     myRef.current.src = window.URL.createObjectURL(selectedFile)
//     myRef.current.play()
//   }

//   return(
//     <div>
//       <input type="file" name="file" onChange={changeHandler} />
//         {isFilePicked ? (
//           <div>
//                 <p>Filename: {selectedFile.name}</p>
//                 <p>Filetype: {selectedFile.type}</p>
//                 <p>Size in bytes: {selectedFile.size}</p>
//                 <p>
//                     lastModifiedDate:{' '}
//                     {selectedFile.lastModifiedDate.toLocaleDateString()}
//                 </p>
//                 <div>
//                 <button onClick={playAudio}>
//                     <span>Play Audio</span>
//                 </button>
//                 <audio ref={myRef} id="audio-element" src="" controls type="audio/mp3" />
//             </div>
//             </div>
//         ) : (
//             <p>Select a file to show details</p>
//         )}
//     </div>
// )
// }

// export default AudioUploadPage;
