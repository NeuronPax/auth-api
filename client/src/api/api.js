import {useEffect} from 'react'
import axios from 'axios'
import {useData} from './store'

export const API_URL = 'http://localhost:5000/auth'

export const $axios = axios.create({
	withCredentials: true,
	baseURL: API_URL
})

export const $api = axios.create({
	withCredentials: true,
	baseURL: API_URL
})

export const AxiosInterceptor = ({children}) => {
	const {token, setToken, logOut} = useData()
	useEffect(() => {
		const requestIntercept = $api.interceptors.request.use(
			config => {
				config.headers.Authorization = `Bearer ${token}`
				return config
			},
			error => Promise.reject(error)
		)
		const responseIntercept = $api.interceptors.response.use(
			config => config,
			async error => {
				const prevRequest = error.config
				if (error.response.status === 401 && !prevRequest.sent) {
					prevRequest.sent = true
          try {
            const {data} = await $axios.get('/refresh')
            setToken(data.token)
            prevRequest.headers.Authorization = `Bearer ${data.token}`
            return $axios(prevRequest)
          } catch (e) {
            logOut()
          }
				}
				return Promise.reject(error)
			}
		)
		return () => {
			$api.interceptors.request.eject(requestIntercept)
			$api.interceptors.response.eject(responseIntercept)
		}
	}, [token, setToken, logOut])
	return children
}
