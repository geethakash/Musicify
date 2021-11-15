import {useState, useRef, useEffect} from 'react'

function FileUploadPage(){
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const myRef = useRef(null)

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
  };

  const playAudio = () => {
    myRef.current.src = window.URL.createObjectURL(selectedFile)
    myRef.current.play()
  }

  return(
    <div>
      <input type="file" name="file" onChange={changeHandler} />
        {isFilePicked ? (
          <div>
                <p>Filename: {selectedFile.name}</p>
                <p>Filetype: {selectedFile.type}</p>
                <p>Size in bytes: {selectedFile.size}</p>
                <p>
                    lastModifiedDate:{' '}
                    {selectedFile.lastModifiedDate.toLocaleDateString()}
                </p>
                <div>
                <button onClick={playAudio}>
                    <span>Play Audio</span>
                </button>
                <audio ref={myRef} id="audio-element" src="" controls type="audio/mp3" />
            </div>
            </div>
        ) : (
            <p>Select a file to show details</p>
        )}
    </div>
)
}