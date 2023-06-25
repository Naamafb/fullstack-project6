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
    const [isEditing,setIsEditing]=useState(false);
    const [editingComment, setEditingComment] = useState(null);
    const [isAddComment,setIsAddComment]=useState(false);

    
    const selectedPost = (postId) => {
      setCurrentPost(postId)
      setSelectedComments(null)
      setIsAddComment(false)
    }

  const handleNewPostTitle = (e)=>{
    setNewPostTitle(e.target.value);
  }

  const handleNewPostBody = (e)=>{
    setNewPostBody(e.target.value);
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
            debugger;
            console.log(sortedPosts);
            setPosts(sortedPosts);
            localStorage.setItem('postsList', JSON.stringify(sortedPosts));
            setNewPostTitle("");
            setNewPostBody("");
          })
          .catch(() => setFindPosts(false));
  }
  const addNewComment = () =>{
    const url = `http://localhost:3000/users/${userid}/posts/${currentPost}`;
    var userJson=localStorage.getItem("user");
    var user=JSON.parse(userJson);
    const userEmail=user.email;
    
      const requestNewComment = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPostTitle,newPostBody,userEmail }),
      };
    
      fetch(url, requestNewComment)
          .then((response) => response.json())
          .then((data) => {
            const updatedComments = data.filter((comment) => comment.deleted === 0);
          localStorage.setItem(`commentsForPostId=${currentPost}`, JSON.stringify(updatedComments));
          setCurrentComments(updatedComments);
          setIsAddComment(false);
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
    const updatedComments = currentComments.map((comment) => {
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
          const commentsAfterDelete=updatedComments.filter((comment) => comment.deleted === 0);
          setCurrentComments(commentsAfterDelete);  
          localStorage.setItem(`commentsForPostId=${currentPost}`, JSON.stringify(commentsAfterDelete));
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
      setCurrentComments(commentsFromLocal);
      console.log(currentComments)
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
            setSelectedComments(currentPost)
            return;
          }
          const updatedComments = data.filter((comment) => comment.deleted === 0);
          const sortedComments = [...updatedComments].sort((a, b) => a.id - b.id);
          localStorage.setItem(`commentsForPostId=${currentPost}`, JSON.stringify(sortedComments));
          setCurrentComments(sortedComments);
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
          localStorage.setItem('postsList', JSON.stringify(updatedPosts));
        } else {
          console.log('Failed to delete post');
        }
      })
      .catch(error => {
        console.error('An error occurred:', error);
      });

  }
  const handleSaveClick = () =>{
    const url = `http://localhost:3000/users/${userid}/posts/${currentPost}`;

      const requestEditPost = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newPostTitle, body: newPostBody }),
      };

      fetch(url, requestEditPost)
        .then((response) => {
          const updatedPosts = posts.map((post) => {
            if (post.id === currentPost) {
              return { ...post, title: newPostTitle, body: newPostBody };
            }
            return post;
          });
          setPosts(updatedPosts);
          localStorage.setItem('postsList', JSON.stringify(updatedPosts));
          setNewPostTitle('');
          setNewPostBody('');
          setIsEditing(false);
        })
        .catch(() => {
          console.log('Error editing post');
        });

  }
  const handleEditClick = (postId,postTitle,postBody)=>{
    debugger
      setCurrentPost(postId);
      setNewPostTitle(postTitle);
      setNewPostBody(postBody);
      setIsEditing(true);
  }

  const editComment = (commentId) => {
    setEditingComment(commentId);
  };
  const addComment =()=>{
    setIsAddComment(true);
  }

  const handleCommentNameChange = (commentId, value) => {
    const updatedComments = currentComments.map((comment) => {
      if (comment.id === commentId) {
        return { ...comment, name: value };
      }
      return comment;
    });
    setCurrentComments(updatedComments);
      
  };

  const handleCommentBodyChange = (commentId, value) => {
    const updatedComments = currentComments.map((comment) => {
      if (comment.id === commentId) {
        return { ...comment, body: value };
      }
      return comment;
    });
  
    setCurrentComments(updatedComments);
  };

  const saveEditedComment = (commentId) => {
    const url = `http://localhost:3000/users/${userid}/posts/${currentPost}/comments/${commentId}`;
    const comment = currentComments.find((comment) => comment.id === commentId);
    const commentName=comment.name;
    const commentBody=comment.body;
    const requestEditComment = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({commentName,commentBody}),
    };

    fetch(url, requestEditComment)
      .then((response) => {
        if (response.status === 200) {
          console.log('Comment edited successfully');
          setEditingComment(null);
          localStorage.setItem(`commentsForPostId=${currentPost}`, JSON.stringify(currentComments));
        } else {
          console.log('Failed to edit comment');
        }
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });
  };


    

    if (findPosts) {
      let postsHtml = posts.map((post) =>{
        if (post.deleted === 0){
          return(
            <div key={post.id}>
            <button className={ post.id === currentPost?'selectedPost':'post'} key={post.id} onClick={() => selectedPost(post.id)}>
            
              {isEditing && currentPost === post.id ? (
                <div>
                  <input type="text" value={newPostTitle} onChange={handleNewPostTitle} />
                  <textarea value={newPostBody} onChange={handleNewPostBody}></textarea>
                </div>
              ) : (
                <div>
                  <h3>{post.title}</h3>
                  <p>{post.body}</p>
                </div>
              )}
            </button>
            
            <div className='postButtons' style={{ visibility: post.id === currentPost ? 'visible' : 'collapse', display: post.id === currentPost ? 'flex' : 'none' }}>
            {isEditing && currentPost === post.id ? (
              <button onClick={handleSaveClick}>Save</button>
              ) : (
                  <button onClick={() => handleEditClick(post.id, post.title, post.body)}>
                    Edit Post
                  </button>
              )}
              <button className="delete-button" onClick={deletePost}>
                Delete Post
              </button>
              <button className="add-comment" onClick={addComment}>Add comment</button>
            </div>
            <div className='postButtons' style={{ visibility: post.id === currentPost ? 'visible' : 'collapse',display:post.id === currentPost ? 'flex' : 'none' }}>
              <button className='showCommentsButton'  onClick={displayComments}> 
                Show comments
              </button> 
              <div style={{ visibility: post.id === selectedComments ? 'visible' : 'collapse', display: post.id === selectedComments ? 'flex' : 'none' }}>
                {currentComments.length>0 ?
                  (currentComments.map((comment) => (
                    <div key={comment.id}>
                      {editingComment === comment.id ? (
                        <div>
                          <input type="text" value={comment.name} onChange={(e) => handleCommentNameChange(comment.id, e.target.value)} />
                          <textarea value={comment.body} onChange={(e) => handleCommentBodyChange(comment.id, e.target.value)}></textarea>
                          <button onClick={() => saveEditedComment(comment.id)}>Save</button>
                        </div>
                      ) : (
                        <div>
                          <h3>{comment.name}</h3>
                          <p>{comment.body}</p>
                          {editingComment !== null ? (
                              <button disabled>Edit </button>
                            ) : (
                              <button onClick={() => editComment(comment.id)}>Edit comment</button>
                          )}
                          <button onClick={() => deleteComment(comment.id)}>Delete comment</button>
                        </div>
                      )}
                    </div>
                  ))):
                  (<p>there is no comments to this post</p>)
                }
                {/* {currentComments&& <div>{currentComments}</div>} */}
                
              </div>
            </div>
            </div>
            )}
            return null});
      return (
        <div>
          <div>
            {isAddComment ?
              (<div className='addPostContainer'>
                <h2>Create New comment to post number {currentPost}</h2>
                <form>
                  <input 
                  value={newPostTitle}
                  placeholder='add name'
                  onChange={handleNewPostTitle}
                  />
                  <textarea 
                  value={newPostBody}
                  placeholder='add body'
                  onChange={handleNewPostBody}
                  />
                  <button onClick={addNewComment}>add comment</button>
                </form>
              </div>):
              (<div className='addPostContainer'>
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
              </div>)
            }
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
