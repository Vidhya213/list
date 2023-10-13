const form = document.querySelector(".grocery-form");
const alert = document.querySelector(".alert");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

let editElement;
let editFlag = false;
let editID = "";

form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);
window.addEventListener("DOMContentLoaded", setupItems);

function addItem(e) {
  e.preventDefault();
  const value = grocery.value;
  const id = new Date().getTime().toString();

  if (value !== "" && !editFlag) {
    const element = createGroceryElement(id, value);

    list.appendChild(element);
    displayAlert("Item added to the list", "success");
    container.classList.add("show-container");
    addToLocalStorage(id, value);
    setBackToDefault();
  } else if (value !== "" && editFlag) {
    editElement.innerHTML = value;
    displayAlert("Value changed", "success");
    editLocalStorage(editID, value);
    setBackToDefault();
  } else {
    displayAlert("Please enter a value", "danger");
  }
}

function createGroceryElement(id, value) {
  const element = document.createElement("article");
  element.setAttribute("data-id", id);
  element.classList.add("grocery-item");
  element.innerHTML = `
    <p class="title">${value}</p>
    <div class="btn-container">
      <button type="button" class="edit-btn">
        <i class="fas fa-edit"></i>
      </button>
      <button type="button" class="delete-btn">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `;

  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);
  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem);

  return element;
}

function displayAlert(text, action) {
  alert.textContent = text;
  alert.className = alert`alert-${action}`;
  setTimeout(() => {
    alert.textContent = "";
    alert.className = "alert";
  }, 2000);
}

function clearItems() {
  const items = document.querySelectorAll(".grocery-item");
  items.forEach((item) => list.removeChild(item));
  container.classList.remove("show-container");
  displayAlert("Empty list", "danger");
  setBackToDefault();
  localStorage.removeItem("list");
}

function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.getAttribute("data-id");
  list.removeChild(element);
  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }
  displayAlert("Item removed", "danger");
  setBackToDefault();
  removeFromLocalStorage(id);
}

function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  editElement = e.currentTarget.parentElement.previousElementSibling;
  grocery.value = editElement.textContent;
  editFlag = true;
  editID = element.getAttribute("data-id");
  submitBtn.textContent = "edit";
}

function setBackToDefault() {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "submit";
}

function addToLocalStorage(id, value) {
  const grocery = { id, value };
  const items = getLocalStorage();
  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

function removeFromLocalStorage(id) {
  const items = getLocalStorage();
  const updatedItems = items.filter((item) => item.id !== id);
  localStorage.setItem("list", JSON.stringify(updatedItems));
}

function editLocalStorage(id, value) {
  const items = getLocalStorage();
  items.forEach((item) => {
    if (item.id === id) {
      item.value = value;
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
}

function setupItems() {
  const items = getLocalStorage();
  if (items.length > 0) {
    items.forEach((item) => createListItem(item.id, item.value));
    container.classList.add("show-container");
  }
}

function createListItem(id, value) {
  const element = createGroceryElement(id, value);
  list.appendChild(element);
}
