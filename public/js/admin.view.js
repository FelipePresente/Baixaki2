// Header component for the admin page
export function renderAdminHeader(userName) {
    return `
        <a href="/" class="text-xl font-bold tracking-tight text-gray-900 hover:opacity-80 transition-opacity z-10">
            Baixaki<span class="text-stone-500">2</span>
        </a>
        <div class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <span class="font-bold text-gray-900 text-lg tracking-tight">Admin Area</span>
        </div>
        <p class="font-medium text-gray-600 z-10">
            You are logged in as <span class="text-black font-bold">${userName}</span>
        </p>`
}

// Table row template for game information
export function renderGameRow(game) {
    return `
        <tr class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap">
                <img class="h-10 w-10 rounded object-cover" src="${game.cover}" alt="Cover">
            </td>
            <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">${game.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-500">${game.genre}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-500">${game.size}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                <button class="text-blue-600 cursor-pointer btn-edit" 
                    onclick="handleEdit('${game._id}', '${game.name}', '${game.genre}', '${game.size}', '${game.cover}')">Edit</button>
                <button class="text-red-600 cursor-pointer ml-4" onclick="handleDelete('${game._id}')">Delete</button>
            </td>
        </tr>`
}