const header = document.querySelector("#header")
const gamesTable = document.querySelector("#gamesTable")
const addGame = document.querySelector("#addGame")
const gamesSec = document.querySelector("#gamesSec")

// It renders a list of games
function renderGames() {
    fetch("/games")
        .then(res => res.json())
        .then(games => {
            const tbody = gamesTable.querySelector('tbody')
            tbody.innerHTML = ''
            games.forEach(game => {
                tbody.innerHTML += `
                <tr id="row-${game._id}" class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap">
                        <img class="h-10 w-10 rounded object-cover" src="${game.cover}" alt="Cover">
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">${game.name}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-gray-500">${game.genre}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-gray-500">${game.size}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button class="text-blue-600 cursor-pointer hover:text-blue-900 font-medium mr-4 transition-colors" onclick="editGame('${game._id}', '${game.name}', '${game.genre}', '${game.size}', '${game.cover}')">Edit</button>
                        <button class="text-red-600 cursor-pointer hover:text-red-900 font-medium transition-colors" onclick="deleteGame('${game._id}')">Delete</button>
                    </td>
                </tr>`
            })
        })
} renderGames()

const userInfo = getCookie('userInfo');
if (userInfo) {
    try {
        const user = JSON.parse(decodeURIComponent(userInfo))
        user.username = user.username.charAt(0).toUpperCase() + user.username.slice(1)

        header.innerHTML = `
            <a href="/" class="text-xl font-bold tracking-tight text-gray-900 hover:opacity-80 transition-opacity z-10">
                Baixaki<span class="text-stone-500">2</span>
            </a>

            <div class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span class="font-bold text-gray-900 text-lg tracking-tight">Admin Area</span>
            </div>

            <p class="font-medium text-gray-600 z-10">
                You are logged in as <span class="text-black font-bold">${user.username}</span>
            </p>
        `;
    } catch (e) {
        console.error("Error parsing user cookie", e)
    }
}

const tableContainer = document.querySelector("#gamesTable").parentElement
const addGameBtnContainer = document.querySelector("#addGame").parentElement

// It is the function to add a game
addGame.onclick = function () {
    tableContainer.style.display = 'none'
    addGameBtnContainer.style.display = 'none'

    let formContainer = document.querySelector("#addGameFormContainer")

    if (!formContainer) {
        formContainer = document.createElement("div")
        formContainer.id = "addGameFormContainer"
        formContainer.className = "bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-2xl mx-auto"

        formContainer.innerHTML = `
            <div class="flex justify-between items-center mb-8">
                <h2 class="text-xl font-bold text-gray-900">Add New Game</h2>
                <button type="button" id="cancelAdd" class="text-gray-500 hover:text-gray-700 font-medium text-sm transition-colors cursor-pointer">Cancel</button>
            </div>
            
            <form action="/games/add" method="post" class="space-y-6">
                <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Game Name</label>
                    <input type="text" name="name" id="name" required
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                        placeholder="e.g. Minecraft">
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label for="genre" class="block text-sm font-medium text-gray-700 mb-2">Genre</label>
                        <input type="text" name="genre" id="genre" required
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                            placeholder="e.g. Adventure">
                    </div>
                    <div>
                        <label for="size" class="block text-sm font-medium text-gray-700 mb-2">Size</label>
                        <input type="text" name="size" id="size" required
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                            placeholder="e.g. 2GB">
                    </div>
                </div>

                <div>
                    <label for="cover" class="block text-sm font-medium text-gray-700 mb-2">Cover Image URL</label>
                    <input type="url" name="cover" id="cover" required
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                        placeholder="https://...">
                </div>

                <div class="pt-4 flex justify-end gap-3">
                    <button type="submit" class="bg-black text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-sm cursor-pointer">
                        Save Game
                    </button>
                </div>
            </form>
        `
        gamesSec.appendChild(formContainer)

        formContainer.querySelector("#cancelAdd").onclick = function () {
            formContainer.style.display = 'none'
            tableContainer.style.display = 'block'
            addGameBtnContainer.style.display = 'flex'
        }
    } else {
        formContainer.style.display = 'block'
    }
}

// It renders the container to edit a the game
function editGame(gameId, gameName, gameGenre, gameSize, gameCover) {

    fetch('/games')
        .then(res => res.json())
        .then(games => {

            tableContainer.style.display = 'none'
            addGameBtnContainer.style.display = 'none'

            let formContainer = document.querySelector("#editGameFormContainer")

            if (!formContainer) {
                formContainer = document.createElement("div")
                formContainer.id = "editGameFormContainer"
                formContainer.className = "bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-2xl mx-auto"

                formContainer.innerHTML = `
            <div class="flex justify-between items-center mb-8">
            <h2 class="text-xl font-bold text-gray-900">Edit Game</h2>
            <button type="button" id="cancelEdit" class="text-gray-500 hover:text-gray-700 font-medium text-sm transition-colors cursor-pointer">Cancel</button>
            </div>
            
            <form action="/games/edit" method="post" class="space-y-6">
            <div>
            <label for="edit-name" class="block text-sm font-medium text-gray-700 mb-2">Game Name</label>
            <input type="text" name="name" id="edit-name" required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all">
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
            <label for="edit-genre" class="block text-sm font-medium text-gray-700 mb-2">Genre</label>
            <input type="text" name="genre" id="edit-genre" required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all">
            </div>
            <div>
            <label for="edit-size" class="block text-sm font-medium text-gray-700 mb-2">Size</label>
            <input type="text" name="size" id="edit-size" required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all">
            </div>
            </div>
            
            <div>
            <label for="edit-cover" class="block text-sm font-medium text-gray-700 mb-2">Cover Image URL</label>
            <input type="url" name="cover" id="edit-cover" required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all">
            </div>
   
            <div class="pt-4 flex justify-end gap-3">
            <button type="submit" class="bg-black text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-sm cursor-pointer">
            Save Changes
            </button>
            </div>

            <input type='text' name="id" class="hidden" id="id">
            </form>
            `
                gamesSec.appendChild(formContainer)

                formContainer.querySelector("#cancelEdit").onclick = function () {
                    formContainer.style.display = 'none'
                    tableContainer.style.display = 'block'
                    addGameBtnContainer.style.display = 'flex'
                }
            } else {
                formContainer.style.display = 'block'
            }
            
            const id = document.querySelector("#id")
                const editName = document.querySelector("#edit-name")
                const editGenre = document.querySelector("#edit-genre")
                const editSize = document.querySelector("#edit-size")
                const editCover = document.querySelector("#edit-cover")

                id.value = gameId
                editName.value = gameName
                editGenre.value = gameGenre
                editSize.value = gameSize
                editCover.value = gameCover
        })
}

function deleteGame(gameId) {
    let modal = document.querySelector("#deleteConfirmModal")

    if (!modal) {
        modal = document.createElement("div")
        modal.id = "deleteConfirmModal"
        modal.className = "fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"

        modal.innerHTML = `
            <div class="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 border border-gray-100">
                <div class="text-center">
                    <h3 class="text-lg font-bold text-gray-900 mb-2">Delete Game</h3>
                    <p class="text-sm text-gray-500 mb-6">Are you sure you want to remove this game? This action is <span class="font-medium text-red-600">irreversible</span>.</p>
                    
                    <form action="/games/delete" method="post" class="flex justify-center gap-3">
                        <input type="hidden" name="id" id="idDelete">
                        <button type="button" id="cancelDelete" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                            Cancel
                        </button>
                        <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-sm transition-colors cursor-pointer">
                            Delete
                        </button>
                    </form>
                </div>
            </div>
        `
        document.body.appendChild(modal)

        modal.querySelector("#cancelDelete").onclick = function () {
            modal.style.display = 'none'
        }

        modal.onclick = function (e) {
            if (e.target === modal) modal.style.display = 'none'
        }
    }

    modal.style.display = 'flex'
    const idDelete = document.querySelector("#idDelete")

    idDelete.value = gameId
}