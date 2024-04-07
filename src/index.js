// Your code here
console.log("================================")


async function logMovies() {
    const response = fetch("http://localhost:3000/films");
    const movies = response
    console.log(movies);
}
  
window.onload = function() { 
    logMovies();
}