const form = document.getElementById("regForm");
const live = document.getElementById("live");
const cards = document.getElementById("cards");
const summaryBody = document.querySelector("#summary tbody");

// --- Get Search Bar from HTML ---
const searchInput = document.getElementById("search-bar");

// Email validation function
function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// Load saved students from localStorage
function loadStudents() {
  const data = JSON.parse(localStorage.getItem("students")) || [];
  data.forEach(student => addStudent(student));
}

// Save students to localStorage
function saveStudents() {
  const rows = Array.from(summaryBody.querySelectorAll("tr"));
  const data = rows.map(row => {
    const cells = row.querySelectorAll("td");
    return {
      first: cells[0].dataset.first,
      last: cells[0].dataset.last,
      email: cells[0].dataset.email,
      prog: cells[1].textContent,
      year: cells[2].textContent,
      interests: cells[0].dataset.interests,
      photo: cells[0].dataset.photo,
      gender: cells[0].dataset.gender
    };
  });
  localStorage.setItem("students", JSON.stringify(data));
}

// Add student (card + table row)
function addStudent(data) {
  const { first, last, email, prog, year, interests, photo, gender } = data;

  // --- Decide default photo if none provided ---
  let finalPhoto = photo;
  if (!finalPhoto) {
    if (gender === "male") {
      finalPhoto = "Images/default-male.png";
    } else if (gender === "female") {
      finalPhoto = "Images/default-female.png";
    } else {
      finalPhoto = "Images/other.png";
    }
  }

  // --- Create Profile Card (visual only) ---
  const card = document.createElement("div");
  card.className = "card-person";
  card.innerHTML = `
    <img src="${finalPhoto}" alt="${first} ${last}">
    <h3>${first} ${last}</h3>
    <p>${prog} - Year ${year}</p>
    <p>${interests || "No interests listed"}</p>
  `;
  cards.prepend(card);

  // --- Create Table Row with Edit/Remove ---
  const row = document.createElement("tr");
  row.innerHTML = `
    <td data-first="${first}" data-last="${last}" data-email="${email}" 
        data-interests="${interests}" data-photo="${finalPhoto}" data-gender="${gender}">
        ${first} ${last}
    </td>
    <td>${prog}</td>
    <td>${year}</td>
    <td>
      <button class="edit-btn">Edit</button>
      <button class="remove-btn">Remove</button>
    </td>
  `;
  summaryBody.prepend(row);

  // --- Remove Functionality ---
  const remove = () => {
    card.remove();
    row.remove();
    saveStudents();
  };
  row.querySelector(".remove-btn").addEventListener("click", remove);

  // --- Edit Functionality ---
  const edit = () => {
    document.getElementById("first").value = first;
    document.getElementById("last").value = last;
    document.getElementById("email").value = email;
    document.getElementById("prog").value = prog;
    document.querySelector(`input[name='year'][value='${year}']`).checked = true;
    document.getElementById("interests").value = interests;
    document.getElementById("photo").value = photo;
    document.querySelector(`input[name='gender'][value='${gender}']`).checked = true;

    remove(); // remove old entry before resubmitting
  };
  row.querySelector(".edit-btn").addEventListener("click", edit);

  saveStudents();
}

// Form submission handler
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const first = document.getElementById("first").value.trim();
  const last = document.getElementById("last").value.trim();
  const email = document.getElementById("email").value.trim();
  const prog = document.getElementById("prog").value.trim();
  const year = form.year.value;
  const interests = document.getElementById("interests").value.trim();
  let photo = document.getElementById("photo").value.trim();
  const gender = form.gender.value;

  // Clear previous errors
  document.querySelectorAll(".error").forEach(err => err.textContent = "");
  live.textContent = "";

  let valid = true;
  if (!first) { document.getElementById("err-first").textContent = "First name is required"; valid = false; }
  if (!last) { document.getElementById("err-last").textContent = "Last name is required"; valid = false; }
  if (!email || !validateEmail(email)) { document.getElementById("err-email").textContent = "Valid email required"; valid = false; }
  if (!prog) { document.getElementById("err-prog").textContent = "Programme is required"; valid = false; }
  if (!year) { document.getElementById("err-year").textContent = "Select a year"; valid = false; }
  if (!gender) { document.getElementById("err-gender").textContent = "Select a gender"; valid = false; }

  if (!valid) {
    live.textContent = "Please fill in the required information";
    return;
  }

  live.textContent = "Form validated successfully!";

  // Add student
  addStudent({ first, last, email, prog, year, interests, photo, gender });

  // Reset form after successful submission
  form.reset();
});

// --- Search Functionality ---
searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase();
  Array.from(summaryBody.querySelectorAll("tr")).forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(term) ? "" : "none";
  });
  Array.from(cards.querySelectorAll(".card-person")).forEach(card => {
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(term) ? "" : "none";
  });
});

// Load saved students on page load
window.addEventListener("DOMContentLoaded", loadStudents);
