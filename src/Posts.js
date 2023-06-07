import React, { useState, useEffect } from 'react';
import {useParams} from 'react-router-dom';
import "./Posts.css"

function Posts() {
  let {userid}=useParams();

  const [posts, setPosts] = useState([]);
  const [findPosts, setFindPosts] = useState(true);
  const [currentPost,setCurrentPost]=useState();
  const [currentComments,setCurrentComments]=useState()
  const [selectedComments,setSelectedComments]=useState(false)
  
   const selectedPost = (postId) => {
    setCurrentPost(postId)
    setSelectedComments(null)

}


  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userid}`)
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch(() => setFindPosts(false));
  },[]);

  const displayComments=()=>{
    debugger
    if(selectedComments){
        setSelectedComments(null)
    }
    else{
    fetch(`https://jsonplaceholder.typicode.com/comments?postId=${currentPost}`)
      .then((response) => response.json())
      .then((data) => setCurrentComments(
        (data.map((comment)=>
        (<div key={comment.id}>
            <h3>{comment.name}</h3>
            <p>{comment.body}</p>
        </div>))
        )))
      .catch(() => setCurrentComments("there aren't comments"));
      setSelectedComments(currentPost)
    }
};
  

  if (findPosts) {
    let postsHtml = posts.map((post) =>(
    <div key={post.id}>
     <button className={ post.id === currentPost?'selectedPost':'post'} key={post.id} onClick={() => selectedPost(post.id)}>
     <h3>{post.title}</h3>
     <p>{post.body}</p>
     </button>


     <div  style={{ visibility: post.id === currentPost ? 'visible' : 'collapse',display:post.id === currentPost ? 'flex' : 'none' }}>
      <button onClick={displayComments}> 
        comments
      </button> 
      <div style={{ visibility: post.id === selectedComments ? 'visible' : 'collapse' ,display:post.id === selectedComments ? 'flex' : 'none'}}>
        {currentComments}
      </div>
     </div>
    </div>));
    return (
      <div>
        {postsHtml}
      </div>
    );
  }
  else
  {return (<h2>There are no posts</h2>);}
}

export default Posts;
