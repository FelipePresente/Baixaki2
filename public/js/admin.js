import { checkSession } from "./utils.js"
import { renderAdminHeader, renderGameRow } from "./admin.view.js"

const header = document.querySelector("#header")
const gamesTable = document.querySelector("#gamesTable")
const addBtn = document.querySelector("#addGame")

const addBtnContainer = document.querySelector("#addBtnContainer")
const tableContainer = document.querySelector("#tableContainer")
const addFormContainer = document.querySelector("#addGameFormContainer")
const editFormContainer = document.querySelector("#editGameFormContainer")

// Render Header
const user = checkSession()
if (user) {
    const formattedUsername = user.username.charAt(0).toUpperCase() + user.username.slice(1)
    header.innerHTML = renderAdminHeader(formattedUsername)
}

// Fetch and Show Games
async function listGames() {
    const res = await fetch("/games")
    const games = await res.json()
    const tbody = gamesTable.querySelector("tbody")
    tbody.innerHTML = ""

    games.forEach(game => {
        tbody.innerHTML += renderGameRow(game)
    })
}
listGames()

// Show View Helper
function showSection(id) {
    [tableContainer, addBtnContainer, addFormContainer, editFormContainer].forEach(el => el.classList.add("hidden"))
    document.querySelector(`#${id}`).classList.remove("hidden")
    if (id === 'tableContainer') addBtnContainer.classList.remove("hidden")
}

// Add Game
addBtn.onclick = () => showSection('addGameFormContainer')

// Cancel Buttons
document.querySelectorAll(".btn-cancel").forEach(btn => {
    btn.onclick = () => showSection('tableContainer')
})

// Edit Game logic
window.handleEdit = (id, name, genre, size, cover) => {
    showSection('editGameFormContainer')
    document.querySelector("#edit-id").value = id
    document.querySelector("#edit-name").value = name
    document.querySelector("#edit-genre").value = genre
    document.querySelector("#edit-size").value = size
    document.querySelector("#edit-cover").value = cover
}

document.querySelector("#editGameForm").onsubmit = async (e) => {
    e.preventDefault()

    const id = document.querySelector("#edit-id").value
    const data = {
        name: document.querySelector("#edit-name").value,
        genre: document.querySelector("#edit-genre").value,
        size: document.querySelector("#edit-size").value,
        cover: document.querySelector("#edit-cover").value
    }

    await fetch(`/games/${id}`, {
        method: 'PATCH',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    window.location.reload()
}

// Delete Game logic
const deleteModal = document.querySelector("#deleteModal")
window.handleDelete = (id) => {
    deleteModal.classList.remove("hidden")
    document.querySelector("#delete-id").value = id
}

document.querySelector("#cancelDelete").onclick = () => deleteModal.classList.add("hidden")

document.querySelector("#deleteGameForm").onsubmit = async (e) => {
    e.preventDefault()
    const id = document.querySelector("#delete-id").value

    await fetch(`/games/${id}`, {
        method: 'DELETE'
    })
    window.location.reload()
}