import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Upload from './Upload'
import VideoPlayer from '../Videos'




function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Upload/>
      {/* <VideoPlayer/> */}
    </>
  )
}

export default App
