
function save() {
    sessionStorage.setItem("session:login", "true")
}

function clear() {
    sessionStorage.clear()
}

function isAuthenticated() {
    return !!sessionStorage.getItem("session:login")
}

export default {
    save, clear, isAuthenticated
}