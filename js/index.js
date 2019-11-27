function generateBookList(json){
    let listPanel = document.querySelector("#list")
    json.forEach(function(book){
        let bookLi = document.createElement('li')
        bookLi.innerText = `${book.title}`
        bookLi.dataset.id = `${book.id}`
        listPanel.append(bookLi)
    })
}

function generateBookInfo(book){
    let showPanel = document.querySelector("#show-panel")
    showPanel.innerHTML = `
        <h2>${book.title}</h2>
        <img src="${book.img_url}">
        <p>${book.description}</p>
        <ul></ul>
    `
    let likers = book.users
    let showPanelUl = showPanel.querySelector('ul')
    likers.forEach(function(user){
        let userLi = document.createElement('li')
        userLi.innerText = user.username
        userLi.dataset.userId = user.id
        showPanelUl.appendChild(userLi)
    })
    let likeButton = document.createElement('button')
    likeButton.innerText = 'Like this book!'
    likeButton.dataset.bookId = book.id
    likeButton.dataset.type = 'likeBtn'
    showPanel.appendChild(likeButton)
}

function appendLiker(){
    let showPanelUl = document.querySelector("#show-panel > ul")
    let hardCodedLi = document.createElement('li')
    hardCodedLi.innerText = "pouros"
    showPanelUl.appendChild(hardCodedLi)
}

function fetchBookList(){
    fetch('http://localhost:3000/books')
        .then(function(resp){
            return resp.json()
        })
        .then(function(json){
            generateBookList(json)
        })
}

function fetchBookInfo(id){
    fetch(`http://localhost:3000/books/${id}`)
        .then(function(resp){
            return resp.json()
        })
        .then(function(book){
            generateBookInfo(book)
        })
}

function persistLikers(id, likers){
    fetch(`http://localhost:3000/books/${id}`, { method: 'PATCH',
        headers: {
            "Content-Type": "application/json",
            accept: "application/json"
        },
        body: JSON.stringify({users: likers})
    })
    .then(function(resp){
        return resp.json()
    })
}

document.addEventListener("DOMContentLoaded", function() {
    console.log('Content has been loaded')
    fetchBookList()
    let listPanel = document.querySelector("#list")
    let showPanel = document.querySelector("#show-panel")
    listPanel.addEventListener('click', function(e){
        fetchBookInfo(e.target.dataset.id)
    })

    showPanel.addEventListener('click', function(e){
        if (e.target.dataset.type === 'likeBtn'){
            let likerLis = Array.from(document.querySelectorAll("#show-panel > ul > li"))
            let likers = []
            likerLis.forEach(function(likerli){
                likers.push({id: likerli.dataset.userId, username: likerli.innerText})
            })  
            likers.push({id: "1", username: "pouros"})
            console.log(likers)
            appendLiker()
            persistLikers(e.target.dataset.bookId, likers)
        }
    })
});
