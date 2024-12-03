import {createContext, useContext, useState} from 'react'
import {$api, $axios, AxiosInterceptor} from './api'

const DataContext = createContext()

export const useData = () => useContext(DataContext)

export const DataProvider = ({children}) => {
	const [token, setToken] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')
	const signIn = async (email, password) => {
		setError('')
		try {
			const {data} = await $api.post('/signin', {email, password})
			setToken(data.token)
		} catch (e) {
			setError(e.response?.data)
		}
	}
	const signUp = async (email, password) => {
		setError('')
		try {
			const {data} = await $api.post('/signup', {email, password})
			setToken(data.token)
		} catch (e) {
			setError(e.response?.data)
		}
	}
	const isAuth = async () => {
		setIsLoading(true)
		setError('')
		try {
			const {data} = await $axios.get('/refresh')
			setToken(data.token)
    } catch (e) {
      logOut()
    } finally {
			setIsLoading(false)
		}
	}
  const logOut = async () => {
		setError('')
		try {
			await $api.post('/logout')
      setToken('')
		} catch (e) {
			setError(e.response?.data)
		}
	}
	const getMe = async () => {
		setError('')
		try {
			const {data} = await $api.get('/me')
			return data
		} catch (e) {
			setError(e.response?.data)
		}
	}
	return (
		<DataContext.Provider value={{token, setToken, isLoading, error, signIn, signUp, isAuth, logOut, getMe}}>
			<AxiosInterceptor>{children}</AxiosInterceptor>
		</DataContext.Provider>
	)
}
