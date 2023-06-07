import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams,useNavigate } from "react-router-dom";
import "./Albums.css"

function Albums() {
  let {userid}=useParams();



  const [albums, setAlbums] = useState([]);
  const [findAlbums, setFindAlbums] = useState(true);
  const navigate=useNavigate(); 
  // const [findPhotos, setFindPhotos] = useState(true);

  // const [currentAlbum,setCurrentAlbum]=useState();
//   const [currentPhotos,setCurrentPhotos]=useState();
//   const [selectedComments,setSelectedComments]=useState(false);

  // const selectedAlbum = (albumId) => {
  //   // setCurrentAlbum(albumId);
  //   navigate(`/user/albums/${albumId}/photos`);
  // }


  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/albums?userId=${userid}`)
      .then((response) => response.json())
      .then((data) => setAlbums(data))
      .catch(() => setFindAlbums(false));
  },[userid]);

  if (findAlbums) {
    let albumsHtml = albums.map((album) => (<div><Link key={album.id} to={`/users/${userid}/albums/${album.id}/photos`}> {album.title}</Link><br></br></div>));
    return (
      <div className="albumsDiv">
        {albumsHtml}
      </div>
    );
  }

  return (
    <h2>There are no posts</h2>
  );
}

export default Albums;
