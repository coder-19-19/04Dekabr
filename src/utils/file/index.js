export const getFileFullUrl = (path) => {
    return `${import.meta.env.VITE_APP_BASE_URL}${path}`
}

export const getProfileFileUrl = (path) => {
    return `${import.meta.env.VITE_APP_BASE_URL}/storage/${path}`
}
