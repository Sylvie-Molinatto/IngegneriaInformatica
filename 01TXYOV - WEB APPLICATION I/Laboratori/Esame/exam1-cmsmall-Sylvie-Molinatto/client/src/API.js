import dayjs from 'dayjs';

const SERVER_URL = 'http://localhost:3001/api/';

/**
 * A utility function for parsing the HTTP response.
 */
function getJson(httpResponsePromise) {
    // server API always return JSON, in case of error the format is the following { error: <message> } 
    return new Promise((resolve, reject) => {
      httpResponsePromise
        .then((response) => {
          if (response.ok) {
  
           // the server always returns a JSON, even empty {}. Never null or non json, otherwise the method will fail
           response.json()
              .then( json => resolve(json) )
              .catch( err => reject({ error: "Cannot parse server response" }))
  
          } else {
            // analyzing the cause of error
            response.json()
              .then(obj => 
                reject(obj)
                ) // error msg in the response body
              .catch(err => reject({ error: "Cannot parse server response" })) // something else
          }
        })
        .catch(err => 
          reject({ error: "Cannot communicate"  })
        ) // connection error
    });
}

/**
 * Getting from the server side and returning the list of pages.
 * The list of pages could be filtered in the server-side through the optional parameter: filter.
 */
const getPages = async () => {
    return getJson(
        fetch(SERVER_URL+'pages', { credentials: 'include'})) 
    .then( json => {
      return json.map((page) => {
        const clientPage = {
          pageid: page.pageid,
          title: page.title,
          author: page.author,
        }
        if (page.creationDate)
          clientPage.creationDate = page.creationDate;

        if(page.publicationDate)
          clientPage.publicationDate = page.publicationDate;
        return clientPage;
      })
    })
}

const getPublishedPages = async () => {
  return getJson(
      fetch(SERVER_URL+'publishedPages', { credentials: 'include'})) 
  .then( json => {
    return json.map((page) => {
      const clientPage = {
        pageid: page.pageid,
        title: page.title,
        author: page.author,
      }
      if (page.creationDate)
        clientPage.creationDate = page.creationDate;

      if(page.publicationDate)
        clientPage.publicationDate = page.publicationDate;
      return clientPage;
    })
  })
}

const getPage = async (pageid) => {
  return getJson(
    fetch(SERVER_URL + 'pages/' + pageid,  { credentials: 'include'})
  )
    .then((page) => {
      const clientPage = {
        pageid: page.pageid,
        title: page.title,
        author: page.author,
        creationDate: page.creationDate,
        publicationDate: page.publicationDate,
      };
      return clientPage;
    });
};

const getPageBlocks = async(pageid) => {
  return getJson(
      fetch(SERVER_URL+'pages/'+pageid+'/blocks', { credentials: 'include'})) 
    .then( json => {
      return json.map((pageBlock) => {
        const clientPageBlock = {
          pageid: pageBlock.pageid,
          blockid: pageBlock.blockid,
          type: pageBlock.type,
          content: pageBlock.content,
          position: pageBlock.position
        }
        
        return clientPageBlock;
      })
    })
}

const getInfoUser = async (id) => {
  const response = await fetch(SERVER_URL + 'users/'+id, { credentials: 'include'});
  const user = await response.json();
  if (response.ok) {
    console.log('here');
    return user;
  } else {
    throw user;  // an object with the error coming from the server
  }
};

const getWebsiteName = async() => {
  const response = await fetch(SERVER_URL+'website-name', { credentials: 'include'});
  const name = await response.json();
  if(response.ok){
    return name;
  } else{
    throw name; // an object with the error coming from the server
  }
}

const createNewPage = async(page) => {
  const response = await fetch(SERVER_URL + "pages/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(page) 
  });
  if(!response.ok){
    throw new Error('Error creating new page');
  }
  const newPage = await response.json();
  return newPage;
}

const createBlock = async(pageid, block) => {
  return getJson(
    fetch(SERVER_URL + "pages/"+pageid+"/block", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(block) 
    })
  )
}

const updatePage = async(page) => {
  return getJson(
    fetch(SERVER_URL+"pages/"+page.pageid, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(page)
    })
  )
}

const updatePageBlock = async(block) => {
  return getJson(
    fetch(SERVER_URL+"pages/"+block.pageid+"/blocks/"+block.blockid, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(block)
    })
  )
}

const deletePage = async(pageid) => {
  return getJson(
    fetch(SERVER_URL+"pages/"+pageid, {
      method: 'DELETE',
      credentials: 'include',
    })
  )
}

const deletePageBlock = async(pageid, blockid) => {
  return getJson(
    fetch(SERVER_URL+"pages/"+pageid+"/blocks/"+blockid, {
      method: 'DELETE',
      credentials: 'include',
    })
  )
}

const deletePageBlocks = async(pageid) => {
  return getJson(
    fetch(SERVER_URL+"pages/"+pageid+"/blocks", {
      method: 'DELETE',
      credentials: 'include',
    })
  )
}

const getUsers = async () => {
  return getJson(
      fetch(SERVER_URL+'users', { credentials: 'include'})) 
  .then( json => {
    return json.map((user) => {
      const userClient = {
        id: user.id,
        email: user.email,
        name: user.name,
        surname: user.surname,
        role: user.role
      }
      return userClient;
    })
  })
}

const updateWebsiteName = async(name) => {
  return getJson(
    fetch(SERVER_URL+"website-name", {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({"name": name})
    })
  )
}

const logIn = async (credentials) => {
    const response = await fetch(SERVER_URL + 'sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });
    if(response.ok) {
      const user = await response.json();
      return user;
    }
    else {
      const errDetails = await response.text();
      throw errDetails;
    }
};

const getUserInfo = async () => {
    const response = await fetch(SERVER_URL + 'sessions/current', {
      credentials: 'include',
    });
    const user = await response.json();
    if (response.ok) {
      return user;
    } else {
      throw user;  // an object with the error coming from the server
    }
};

const logOut = async() => {
    const response = await fetch(SERVER_URL + 'sessions/current', {
      method: 'DELETE',
      credentials: 'include'
    });
    if (response.ok)
      return null;
  }
  
const API = { getPages, getPublishedPages, getPage, getPageBlocks, getInfoUser, getWebsiteName, createNewPage, createBlock, updatePage, updatePageBlock, deletePage, deletePageBlock, deletePageBlocks, getUsers, updateWebsiteName, logIn, getUserInfo, logOut };
export default API;
  