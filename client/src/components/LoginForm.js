import {useState} from 'react'
import {useData} from '../api/store'

const LoginForm = () => {
	const [email, setEmail] = useState('test@test.com')
	const [password, setPassword] = useState('123')
	const {signIn, signUp} = useData()

	return (
		<div>
			<input
				onChange={e => setEmail(e.target.value)}
				value={email}
				type='email'
				placeholder='Email'
			/>
			<input
				onChange={e => setPassword(e.target.value)}
				value={password}
				type='password'
				placeholder='Пароль'
			/>
			<div>
				<button onClick={() => signIn(email, password)}>Вход</button>
				<button onClick={() => signUp(email, password)}>Регистрация</button>
			</div>
		</div>
	)
}

export default LoginForm
