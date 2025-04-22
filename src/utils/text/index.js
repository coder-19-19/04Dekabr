export const getUserShortName = (user) => {
    const fullname = user?.name
    const arr = fullname?.split(' ')
    const name = arr?.[0]?.[0] || ''
    const surname = arr?.[1]?.[0] || ''
    return `${name}${surname}`

}
