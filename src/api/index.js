import axios from 'axios'

const baseURL = import.meta.env.VITE_APP_BASE_API_URL

const insatance = axios.create({
    baseURL
})

export default insatance
