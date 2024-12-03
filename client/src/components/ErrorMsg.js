const ErrorMsg = ({err}) => {
  return (
    <div className='errMsg'>
      {err.message}
      <ul>
        {err.errors.map(e =>
          <li key={e.path}>
            {e.msg}
          </li>)
        }
      </ul>
    </div>
  )
}

export default ErrorMsg
