const gamesGrid = document.querySelector("#gamesGrid")
const header = document.querySelector("#header")

// This system renders the games in ('/') based on its characteristics in db.json
fetch('http://localhost:2000/games')
    .then(res => res.json())
    .then(games => {
        games.forEach(game => {
            gamesGrid.innerHTML += `
            <div class="flex items-start cursor-pointer gap-4 p-4 rounded-lg border border-gray-100 bg-white hover:border-stone-300 transition-colors group">
                <div class="w-16 h-16 shrink-0 bg-gray-50 rounded-lg flex items-center justify-center text-2xl border border-gray-100 group-hover:bg-stone-100 group-hover:text-stone-500 transition-colors bg-center bg-cover">
                    <img src ="${game.cover}">
                </div>
                
                <div class="flex-1 min-w-0">
                    <div class="flex justify-between items-start">
                        <div>
                            <h3 class="text-base font-semibold text-gray-900 truncate pr-4" title="${game.name}">
                                ${game.name}
                            </h3>
                            <p class="text-sm text-gray-500 capitalize">${game.genre}</p>
                        </div>
                    </div>
                    
                    <div class="mt-3 flex items-center gap-4 text-xs text-gray-400">
                        <span class="flex items-center gap-1">
                            ${game.size}
                        </span>
                    </div>
                </div>
                
                <button class="self-center ml-2 p-2 text-gray-400 hover:text-stone-500 hover:bg-stone-100 rounded-lg transition-colors" title="Download">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                </button>
            </div>`
        })
    });

// This is calling the cookie from server.js
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

const loggedUserCookie = getCookie('userCookie')

if (loggedUserCookie) {
    try {
        let decodeCookie = decodeURIComponent(loggedUserCookie);
        const user = JSON.parse(decodeCookie);

    header.innerHTML += `<div class ="flex justify-center items-center gap-3">
        <div class ="font-bold">Welcome, ${user.username}!</div>
        <div class ="px-4 py-2 text-sm font-bold text-white bg-stone-500 rounded-lg hover:bg-stone-600 transition-colors shadow-sm" id ="logout">Logout</div>
    </div>`

    } catch (error) {
        console.error("Error parsing user cookie:", error);
    }
} else {
    header.innerHTML += `<div class="flex items-center gap-4">
                <a href="/signin" class="text-sm font-medium text-gray-600 hover:text-stone-500 transition-colors">Sign in</a>
                <a href="/login" class="px-4 py-2 text-sm font-bold text-white bg-stone-500 rounded-lg hover:bg-stone-600 transition-colors shadow-sm">Login</a>
            </div>`
}