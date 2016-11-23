import auth from './auth'

const fetchAuthorizationBody = (api, form, token) => fetch(api, {
 method: 'post',
 headers: {
   'Content-Type': 'application/json',
   'Authorization': `Bearer ${token}`,
 },
 body: JSON.stringify(form)
}).then(res => res.ok ? res.json() : res.json().then(err => Promise.reject(err)))

const fetchPresentArticles = (api, token) => fetch(api, {
  method: 'get',
  headers: {
    'accept': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
}).then(res => res.ok ? res.json() : res.json().then(err => Promise.reject(err)))

const fetchOlderArticles = (api, token) => fetch(api, {
  method: 'get',
  headers: {
    'accept': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
}).then(res => res.ok ? res.json() : res.json().then(err => Promise.reject(err)))

const postAPI = {
  createPost(post) {
    return fetchAuthorizationBody('http://localhost:3000/v1/posts', post, auth.getToken())
  },
  findPresentPost() {
    return fetchPresentArticles('http://localhost:3000/v1/posts/findPresent', auth.getToken())
  },
  findOlderPost(postID) {
    return fetchOlderArticles(`http://localhost:3000/v1/posts/findOlder/?postID=${postID}`, auth.getToken())
  },
}

export default postAPI
