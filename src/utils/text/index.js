export const getUserShortName = (user) => {
    const name = user?.name
    const arr = name?.split(' ')
    return `${arr?.[0]?.[0]}${arr?.[1]?.[0]}`

}
