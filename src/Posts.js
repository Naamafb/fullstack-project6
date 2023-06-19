import React, { useState, useEffect } from 'react';
import {useParams} from 'react-router-dom';
import "./Posts.css"

function Posts() {
  let {userid}=useParams();

  const [posts, setPosts] = useState([]);
  const [findPosts, setFindPosts] = useState(true);
  const [currentPost,setCurrentPost]=useState(null);
  const [currentComments,setCurrentComments]=useState([])
  const [selectedComments,setSelectedComments]=useState(null)
  const [newPostTitle,setNewPostTitle]=useState("")
  const [newPostBody,setNewPostBody]=useState("")

  
   const selectedPost = (postId) => {
    setCurrentPost(postId)
    setSelectedComments(null)

}
const handleNewPostBody = (e)=>{
  setNewPostBody(e.target.value);
}
const handleNewPostTitle = (e)=>{
  setNewPostTitle(e.target.value);
}
const addNewPost = () =>{
  debugger;
    const url = `http://localhost:3000/users/${userid}/posts`;
  
    const requestNewPost = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newPostTitle,newPostBody }),
    };
  
    fetch(url, requestNewPost)
        .then((response) => response.json())
        .then((data) => {
          const sortedPosts = [...data].sort((a, b) => a.id - b.id);
          console.log(sortedPosts);
          setPosts(sortedPosts);
          localStorage.setItem('PostsList', JSON.stringify(sortedPosts));
          setNewPostTitle("");
          setNewPostBody("");
        })
        .catch(() => setFindPosts(false));
}


useEffect(() => {
  const postsFromLocal = JSON.parse(localStorage.getItem('postsList'));
  if (Array.isArray(postsFromLocal)) {
    setPosts(postsFromLocal);
    setFindPosts(true);
  } else {
    const url = `http://localhost:3000/users/${userid}/posts`;

    const requestPosts = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    fetch(url, requestPosts)
      .then((response) => response.json())
      .then((data) => {
        const sortedPosts = [...data].sort((a, b) => a.id - b.id);
        setPosts(sortedPosts);
        localStorage.setItem('postsList', JSON.stringify(sortedPosts));
      })
      .catch(() => setFindPosts(false));
  }
}, []);

const deleteComment = (commentId) => {
  debugger;
  const commentsFromLocal = JSON.parse(localStorage.getItem(`commentsForPostId=${currentPost}`));
  const updatedComments = commentsFromLocal.map((comment) => {
    if (comment.id === commentId) {
      return { ...comment, deleted: !comment.deleted };
    }
    return comment;
  });

  const url = `http://localhost:3000/users/${userid}/posts/${currentPost}/comments/${commentId}`;
  const requestDeleteComment = {
    method: 'DELETE',
  };

  fetch(url, requestDeleteComment)
    .then((response) => {
      if (response.status === 200) {
        console.log('Comment deleted successfully');
        setCurrentComments(
          updatedComments.filter((comment) => comment.deleted === 0).map((comment) => (
            <div key={comment.id}>
              <h3>{comment.name}</h3>
              <p>{comment.body}</p>
              <button   className="deleteButton" onClick={() => deleteComment(comment.id)}>delete comment</button>
            </div>
          ))
        );
        localStorage.setItem(`commentsForPostId=${currentPost}`, JSON.stringify(updatedComments));
      } else {
        console.log('Failed to delete comment');
      }
    })
    .catch((error) => {
      console.error('An error occurred:', error);
    });
};


const displayComments = () => {
  debugger;
  if (selectedComments) {
    setSelectedComments(null);
    return;
  }

  const commentsFromLocal = JSON.parse(localStorage.getItem(`commentsForPostId=${currentPost}`));
  
  if (Array.isArray(commentsFromLocal)) {
    setCurrentComments(
      commentsFromLocal.filter((comment) => comment.deleted === 0).map((comment) => (
        <div key={comment.id}>
          <h3>{comment.name}</h3>
          <p>{comment.body}</p>
          <button onClick={() => deleteComment(comment.id)}>delete comment</button>
        </div>
      ))
    );
    console.log(currentComments);
    setSelectedComments(currentPost);
  } else {
    const url = `http://localhost:3000/users/${userid}/posts/${currentPost}`;

    const requestComments = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    fetch(url, requestComments)
      .then((response) => response.json())
      .then((data) => {
        if(data===null){
          setSelectedComments(<div><p>there is no comments</p></div>)
          return;
        }
        const updatedComments = data.filter((comment) => comment.deleted === 0);
        localStorage.setItem(`commentsForPostId=${currentPost}`, JSON.stringify(updatedComments));
        setCurrentComments(
          updatedComments.map((comment) => (
            <div key={comment.id}>
              <h3>{comment.name}</h3>
              <p>{comment.body}</p>
              <button onClick={() => deleteComment(comment.id)}>delete comment</button>
            </div>
          ))
        );
        setSelectedComments(currentPost);
      })
      .catch(() => setCurrentComments("There aren't any comments"));
  }
};

const deletePost = () =>{
  debugger;
  const updatedPosts = posts.map((post) => {
    if (post.id === currentPost) {
      return { ...posts, deleted: !post.deleted };
    }
    return post;
  });const url = `http://localhost:3000/users/${userid}/posts/${currentPost}`;

  const requestDeletePost = {
    method: 'DELETE',
  };

  fetch(url, requestDeletePost)
    .then(response => {
      if (response.status===200) {
        console.log('Post deleted successfully');
        setPosts(updatedPosts);
        localStorage.setItem('todosList', JSON.stringify(updatedPosts));
      } else {
        console.log('Failed to delete post');
      }
    })
    .catch(error => {
      console.error('An error occurred:', error);
    });

}
  

  if (findPosts) {
    let postsHtml = posts.map((post) =>{
      if (post.deleted === 0){
        return(
          <div key={post.id}>
          <button className={ post.id === currentPost?'selectedPost':'post'} key={post.id} onClick={() => selectedPost(post.id)}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
          </button>
          
          <div className='postButtons' style={{ visibility: post.id === currentPost ? 'visible' : 'collapse', display: post.id === currentPost ? 'flex' : 'none' }}>
            <button className="delete-button" onClick={deletePost}>
              delete
            </button>
          </div>
          <div className='postButtons' style={{ visibility: post.id === currentPost ? 'visible' : 'collapse',display:post.id === currentPost ? 'flex' : 'none' }}>
            <button onClick={displayComments}> 
              comments
            </button> 
            <div style={{ visibility: post.id === selectedComments ? 'visible' : 'collapse', display: post.id === selectedComments ? 'flex' : 'none' }}>
              {currentComments && <div>{currentComments}</div>}
            </div>
          </div>
          </div>
          )}
          return null});
    return (
      <div>
        <div className='addPostContainer'>
        <h2>Create a New Post</h2>
        <form>
          <input 
          value={newPostTitle}
          placeholder='add title'
          onChange={handleNewPostTitle}
          />
          <textarea 
          value={newPostBody}
          placeholder='add body'
          onChange={handleNewPostBody}
          />
          <button onClick={addNewPost}>add post</button>
        </form>
        </div>
        <h2>Posts</h2>
        {postsHtml}
      </div>
    );
  }
  else
  {return (<h2>There are no posts</h2>);}
}

export default Posts;
