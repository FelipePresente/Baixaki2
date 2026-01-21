function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// This function verifies and saves the user cookie
export function checkSession() { 
    const loggedUserCookie = getCookie('userInfo')

    let user = null

    if (!loggedUserCookie) return null

        try {
            user = JSON.parse(decodeURIComponent(loggedUserCookie))
        } catch (error) {
            console.error("Error parsing cookie")
        }

    return user
}