import { renderGameCard, renderUserHeader, renderGuestHeader } from './home.view.js'
import { checkSession } from './utils.js';

const gamesGrid = document.querySelector("#gamesGrid")
const header = document.querySelector("#header")

function renderGames() {
    fetch('/games')
        .then(res => res.json())
        .then(games => {
            games.forEach(game => {
                gamesGrid.innerHTML += renderGameCard(game)
            })
        });
} renderGames()

const user = checkSession()

function renderUser() {
    if (!user) return header.innerHTML += renderGuestHeader()

    user.username = user.username.charAt(0).toUpperCase() + user.username.slice(1)

    header.innerHTML += renderUserHeader(user)

    const logoutBtn = document.getElementById("logout")

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            window.location.href = '/users/logout'
        })
    }
} renderUser()