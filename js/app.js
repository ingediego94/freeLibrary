import { routes } from "./routes.js";

const url = "http://localhost:3001/event"; 
const urlusers = "http://localhost:3001/admin";

// espera que cargue y verifica si existe datos en local Storage
window.addEventListener("DOMContentLoaded", async (e)=>{
  e.preventDefault();

  // const login = document.getElementById()
})

window.addEventListener("click", (e)=>{ // evento llamado popstate para navegar 
    e.preventDefault();
    if(e.target.matches("[data-link]")){
        e.preventDefault();
        console.log(e.target.getAttribute("href"));
        
        browser(e.target.getAttribute("href"));
}});




//funcion para el enrutamiento 

async function browser(params, id = NaN) {
    
    const rot = routes[params];
    console.log(rot);
    
    const html = await fetch(rot).then(response => response.text());
    document.getElementById('root').innerHTML = html;
    history.pushState({}, "", params);  // historia
    //render(params, id); // mostrar en el dom 
    
};







// Select DOM elements
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const resultsContainer = document.getElementById("results");

// Variables for pagination
let currentPage = 1;
let booksPerPage = 25; // 5 rows x 5 books
let booksData = [];


// Function to fetch books
async function fetchBooks(query) {
    const apiUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`;
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      booksData = data.docs;
      currentPage = 1; // Reset to first page on new search
      displayBooks();
      displayPagination();
    } catch (error) {
      resultsContainer.innerHTML = `<p>Error: ${error.message}</p>`;
    }
  }
  
  // Function to display books based on current page
  function displayBooks() {
    resultsContainer.innerHTML = "";
    const start = (currentPage - 1) * booksPerPage;
    const end = start + booksPerPage;
    const booksToShow = booksData.slice(start, end);
  
    if (booksToShow.length === 0) {
      resultsContainer.innerHTML = "<p>No books found.</p>";
      return;
    }
  
    booksToShow.forEach((book) => {
      const bookCover = book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : "https://via.placeholder.com/150x200?text=No+Image";
      const bookElement = document.createElement("div");
      bookElement.className = "book-card";
      bookElement.innerHTML = `
        <img src="${bookCover}" alt="Book Cover">
        <h3>${book.title}</h3>
        <p>${book.author_name ? book.author_name.join(", ") : "Unknown Author"}</p>
      `;
      resultsContainer.appendChild(bookElement);
    });
  }

// Function to display pagination controls
function displayPagination() {
    const totalPages = Math.ceil(booksData.length / booksPerPage);
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = "";
  
    // Previous button
    const prevButton = document.createElement("button");
    prevButton.textContent = "Previous";
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        displayBooks();
        displayPagination();
      }
    });
    paginationContainer.appendChild(prevButton);
  
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement("button");
      pageButton.textContent = i;
      pageButton.disabled = i === currentPage;
      pageButton.addEventListener("click", () => {
        currentPage = i;
        displayBooks();
        displayPagination();
      });
      paginationContainer.appendChild(pageButton);
    }
  
    // Next button
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        displayBooks();
        displayPagination();
      }
    });
    paginationContainer.appendChild(nextButton);
  }

// Event listener for search button
searchButton.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (!query) {
    resultsContainer.innerHTML = "<p>Please enter a search term.</p>";
    return;
  }
  fetchBooks(query);
});
