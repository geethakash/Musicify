import React, { useEffect, useContext } from "react";
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Button,
} from "reactstrap";
import albumArt from "../Static/MusicItem.png";
import { FaEllipsisV } from "react-icons/fa";
import { useState } from "react/cjs/react.development";
import { CurrentContext } from "../Context/CurrentContect";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

function AudioListItem({ oneAudio, key, handleCurrentPlay }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [oneAudioState, setOneAudioState] = useState({ mid: "Loading..." });
  const currentcontext = useContext(CurrentContext);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const history = useHistory();

  useEffect(() => {
    setOneAudioState(oneAudio);
  }, [currentcontext.currentPlay]);

  const handleDelete = () => {
    console.log("handleDelete running");
    var deleteItem = oneAudio.mid ;
    <CurrentContext.Provider value={deleteItem} />
    history.push('/delete')
  };

  return (
    <>
      {oneAudioState ? (
        <div
          className={
            oneAudioState.mid === currentcontext.currentPlay.mid
              ? "playlist-item selected-item dis-flex fd-row"
              : "playlist-item bg-l-pink dis-flex fd-row"
          }
        >
          <div className="album-art-holder bg-dark" onClick={handleCurrentPlay}>
            <img src={albumArt} style={{ width: "100%" }} />
          </div>
          <div className="playlist-item-title" onClick={handleCurrentPlay}>
            <span>{oneAudio.fileTitle}</span>
          </div>
          <div className="audio-options">
            <Dropdown
              direction="left"
              group
              isOpen={dropdownOpen}
              toggle={toggle}
            >
              <DropdownToggle className="bg-transparent text-dark border-0">
                <FaEllipsisV />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem>Edit</DropdownItem>
                <DropdownItem tag={Link} to={{pathname:"/delete",data:oneAudio}}>Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default AudioListItem;
