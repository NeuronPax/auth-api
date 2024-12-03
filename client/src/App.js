import {useState, useEffect} from 'react'
import {useData} from './api/store'
import LoginForm from './components/LoginForm'
import ErrorMsg from './components/ErrorMsg'

const App = () => {
	const {token, isLoading, error, isAuth, logOut, getMe} = useData()
	const [user, setUser] = useState(null)
	const getUser = async () => {
		const data = await getMe()
		setUser(data)
	}
	useEffect(() => {
		isAuth()
	}, [])
	if (isLoading) return <div className='content'>Загрузка...</div>
	if (!token) {
		return (
			<div className='content'>
				<LoginForm />
				<div>
					<button onClick={getUser}>Пользователь</button>
				</div>
				{error && <ErrorMsg err={error} />}
			</div>
		)
	}
	return (
		<div className='content'>
			<div>
				<button onClick={logOut}>Выйти</button>
			</div>
			<div>
				<button onClick={getUser}>Пользователь</button>
			</div>
			{user && (
				<ul>
					{Object.values(user).map((el, i) =>
            <li key={i}>
              {((i === 0) && el) ||
                ((i === 1) && el.toUpperCase()) ||
                new Date(el).toLocaleString().replace(',', '')}
            </li>
          )}
				</ul>
			)}
			{error && <ErrorMsg err={error} />}
		</div>
	)
}

export default App
