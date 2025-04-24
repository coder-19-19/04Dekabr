export const getUserShortName = (user) => {
    const fullname = user?.name
    const arr = fullname?.split(' ')
    const name = arr?.[0]?.[0] || ''
    const surname = arr?.[1]?.[0] || ''
    return `${name}${surname}`

}

export const getReadTime = text => {
    const WORDS_PER_MINUTE = 225
    const time = text?.split(' ')?.length / WORDS_PER_MINUTE
    return Math.ceil(time)
}

export const cutText = text => {
    return text?.length > 50 ? `${text.substring(0, 50)}...` : text
}
