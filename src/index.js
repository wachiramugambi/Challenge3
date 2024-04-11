let url = "http://localhost:3000/films/";
let ulFilms = document.getElementById("films");
let idBuyticket = document.getElementById("buy-ticket")

let movieImg = document.getElementById("poster");
let idTitle = document.getElementById("title")
let idRuntime = document.getElementById("runtime")
let idFilmInfo = document.getElementById("film-info")
let idShowtime = document.getElementById("showtime")
let idTicketnum = document.getElementById("ticket-num")

// ours
let movieTitle = document.getElementById("title")
// let movieId = document.getElementById()


function grabMovie() {
    fetch(url)
    .then(res => res.json())
    .then(data => { 
        ulFilms.innerHTML = "";
        for(values of data){
             addMovie(values);
        }
        
        showMovie(data[0])
        }
    )
    .catch(e => console.log(e.message));
}

function showMovie(movie) {
  movieTitle.innerText = movie.title
  movieImg.src = movie.poster
  // attach the rest of the film details to the movie show section
}

function addMovie(movies){
    
  let remaining = movies.capacity - movies.tickets_sold;
  
    let movieTitle = movies.title
    // movieId = movies.id
    let liFilm = document.createElement("li");
    if(!remaining > 0)
    {  liFilm.className = "sold-out"
    }

    
    let movieSpan = document.createElement("span");
    movieSpan.innerText = movieTitle;
    liFilm.appendChild(movieSpan);
    
    let deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete"
  
  // add show button
    let showButton = document.createElement("button")
    showButton.innerText = "Show Details"

  liFilm.appendChild(deleteButton);
  liFilm.appendChild(showButton);
    
    ulFilms.appendChild(liFilm);
  
    deleteButton.addEventListener('click', () => {
        deleteMovie(movies)
    })
  
  showButton.addEventListener('click', () => {
      showMovie(movies)
    })
    movieSpan.addEventListener('click', () => {
        updateDom(movies);
    })
    if(movies.id === "1"){
        updateDom(movies);
    }
}

grabMovie();

function updateDom(movies){
    let remaining = movies.capacity - movies.tickets_sold;
    let movieId = movies.id;
    let availabiity;

    if(remaining > 0){
        availabiity = "Buy Ticket"
    }else {
        availabiity = "Sold out"
    }

    movieImg.src = movies.poster; 
    movieImg.alt = movies.title; 
    idTitle.innerText = movies.title;
    idRuntime.innerText = movies.runtime + " minutes";
    idFilmInfo.innerText = movies.description;
    idShowtime.innerText = movies.showtime;
    idTicketnum.innerText = remaining;

    // idBuyticket.onclick = () => {
    //     if(remaining > 0)
    //     { 
    //          buyTicket(movies)
    //     }else{
    //         console.log("You cannot buy tickets")
    //     }
    // };
    idBuyticket.dataset.movieId = movies.id;
    let button = document.querySelector("[data-movie-id='"+movieId+"']");
    button.innerText = availabiity;
}
function buyTicket(movies){

    movies.tickets_sold++
    let ticketsSold = movies.tickets_sold;
    let requestHeaders = {
        "Content-Type": "application/json"
    }
    let requestBody = {
        "tickets_sold": ticketsSold
    }
    fetch(url+movies.id,{
        method: "PATCH",
        headers: requestHeaders,    
        body: JSON.stringify(requestBody)
    })
    .then (res => res.json())
    .then (data => {
        updateDom(data);

        let numberOfTickets = (data.capacity - data.tickets_sold)

        if(!numberOfTickets > 0)
        { grabMovie()
        }

        let  RequestBodyTickets =  {
            "film_id": data.id,
            "number_of_tickets": numberOfTickets
         }

        fetch("http://localhost:3000/tickets",{
            method: "POST",
            headers: requestHeaders,    
            body: JSON.stringify(RequestBodyTickets)
        })
        .then (res => res.json())
        .then(data => data)
        .catch (e => console.log(e.message));

    })
    .catch (e => console.log(e.message));
}

function deleteMovie(movie){
    let requestHeaders = {
        "Content-Type": "application/json"
    }
    let requestBody = {
        "id": movie.id
    }
    fetch(url+movie.id, {
        method: "DELETE",
        headers: requestHeaders,    
        body: JSON.stringify(requestBody)
    })
    .then (res => res.json())
    .then (data => grabMovie())
    .catch (e => console.log(e.message));
}