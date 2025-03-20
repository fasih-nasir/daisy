import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import EventRegistrationForm from './form'
function App() {
  const [count, setCount] = useState(0)

  return (
<>
<EventRegistrationForm/>
</>
  )
}

export default App
