import React, { useContext, useEffect, useState, useRef } from "react";
import { Container, Button } from "reactstrap";
import AudioListItem from "../Components/AudioListItem";
import MusicImg from "../Static/bubbleBg.png";
import albumArt from "../Static/MusicItem.png";
import firebase from "firebase/compat/app";
import { UserContext } from "../Context/UserContext";
import Plyr from "plyr";
import { CurrentContext } from "../Context/CurrentContect";
import { FaArrowUp, FaChevronDown, FaChevronUp, FaLeaf } from "react-icons/fa";
import { Link } from "react-router-dom";

function AudioLibraryPage() {
  const audioRef = useRef();
  const [audioList, setAudioList] = useState("loading");
  const [currentPlay, setCurrentPlay] = useState({
    mid: "Loading...",
    downloadUrl:
      "https://firebasestorage.googleapis.com/v0/b/musicify-3a482.appspot.com/o/audios%2Fmusicify-speech-audio.mp3?alt=media&token=2aebd038-a6a6-4e3c-9aca-eb5033aded52",
  });
  const { user } = useContext(UserContext);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const GetAudioList = async () => {
    const audioLibraryRef = firebase
      .database()
      .ref(`audiolibrary/${user.uid}/audios/`);
    audioLibraryRef.on("value", (snapshot) => {
      setAudioList(snapshot.val());
      console.log(snapshot.val());
    });
  };

  useEffect(() => {
    GetAudioList();
  }, []);

  const handleCurrentPlay = (value) => {
    if (currentPlay !== value) {
      setCurrentPlay(value);
      // setSource(value.downloadUrl);
      // console.log("this handle current call");
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.load();
        audioRef.current.play();
      }
    }
  };
  const someMethod = () => {
    console.log("SomeMethod Called");
  };

  // console.log("audiolist :>", audioList);

  const player = new Plyr("#player");

  // console.log('usvll',Context.audioList);
  return (
    <CurrentContext.Provider value={{ currentPlay }}>
      <Container fluid>
        <div className="myContainer h-90vh dis-flex fd-rowWS">
          <div
            className={
              currentPlay
                ? isExpanded
                  ? "expand-player-holder  player-holder h-100 dis-flex fd-col"
                  : "player-holder player-holder-img-none d-flex flex-row-reverse"
                : "player-holder h-100 d-none dis-flex fd-col"
            }
          >
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              className="ms-auto me-2 mt-1  d-md-none"
            >
              {isExpanded ? <FaChevronDown /> : <FaChevronUp />}{" "}
            </Button>

            <div className="audio-player dis-flex jc-center fd-col">
              <img
                className="musicImg mb-3"
                style={{ cursor: "unset" }}
                src={albumArt}
                alt="musicImg"
              />
              <audio id="player" controls ref={audioRef}>
                <source src={currentPlay ? currentPlay.downloadUrl : ""} />
              </audio>
            </div>
          </div>

          <div className="playlist-holder">
            <div style={{ height: "90vh" }}>
              <div className="w-100 d-flex ">
                <Button tag={Link} to="/upload" className="ms-auto me-2 mt-1">
                  <FaArrowUp className="me-1" />
                  Upload Audio
                </Button>
              </div>
              {audioList === "loading" ? (
                <div className="loader">Loading...</div>
              ) : audioList === null ? (
                <div className="text-light d-flex text-center justify-content-center align-items-center w-100 h-50">
                  <h1>No audio files found.</h1>
                </div>
              ) : (
                Object.entries(audioList).map(([key, value]) => (
                  <div key={key}>
                    <AudioListItem
                      oneAudio={value}
                      handleCurrentPlay={() => handleCurrentPlay(value)}
                    />{" "}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </Container>
    </CurrentContext.Provider>
  );
}

export default AudioLibraryPage;
