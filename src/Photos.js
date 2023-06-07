import React, { useState, useEffect, useRef } from 'react';
import {  useParams } from 'react-router-dom';

function Photos() {
  let {userid}=useParams();

  let { albumId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [findPhotos, setFindPhotos] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const photosContainerRef = useRef(null);

  const handleScroll = () => {
    const container = photosContainerRef.current;
    const containerHeight = container.offsetHeight;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;

    if (scrollHeight - scrollTop - containerHeight <= 10 && !isLoading && hasMore) {
      setIsLoading(true);
      setPage((prevPage) => prevPage + 1);
    }
  };
  useEffect(() => {
    fetchPhotos();
  },[userid,albumId,page]);

  const fetchPhotos = () => {
    fetch(`https://jsonplaceholder.typicode.com/photos?albumId=${albumId}&_page=${page}&_limit=8`)
      .then((response) => {
        const totalCount = response.headers.get('x-total-count');
        setHasMore(totalCount > page * 8);
        return response.json();
      })
      .then((data) => {
        setPhotos((prevPhotos) => [...prevPhotos, ...data]);
        setIsLoading(false);
      })
      .catch(() => setFindPhotos(false));
  };

  

  useEffect(() => {
    const container = photosContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);

      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  useEffect(() => {
    setPhotos([]);
    setPage(1);
    setHasMore(true);
    fetchPhotos();
  }, [albumId]);

  if (findPhotos) {
    let photosHtml = photos.map((photo) => (
      <div key={photo.id} style={{ margin: '10px' }}>
        <img alt={photo.title} src={photo.thumbnailUrl} style={{ maxWidth: '100%', height: 'auto' }} />
      </div>
    ));

    return (
      <div ref={photosContainerRef} style={{ height: '100vh', overflowY: 'scroll' , marginTop: '0'}}>
        <div style={{ minHeight: '100%' }}>
          {photosHtml}
        </div>
        {isLoading && <div>Loading more photos...</div>}
      </div>
    );
  }

  return <h2>There are no photos</h2>;
}

export default Photos;