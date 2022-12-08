import { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles.css'

import Editor from './components/Editor/Editor'
import Loader from './components/Loader/Loader'
import Helpers from './utils/Helpers'
import FontFaceObserver from 'fontfaceobserver'

function App() {
  const [config, setConfig] = useState({})
  const [loading, setLoading] = useState(true)

  const fontComfortaa = new FontFaceObserver('Comfortaa-Wordpix')
  const fontItalianno = new FontFaceObserver('Italianno-Wordpix')
  const fontMarqueeMoon = new FontFaceObserver('MarqueeMoon-Wordpix')
  const fontMexcellent = new FontFaceObserver('Mexcellent-Wordpix')
  const fontStripey = new FontFaceObserver('Stripey-Wordpix')

  useEffect(() => {
    setLoading(true)
    Helpers.fetchJson('config/config.json').then((result) => {
      setConfig(result)
      Promise.all([
        fontComfortaa.load(),
        fontItalianno.load(),
        fontMarqueeMoon.load(),
        fontMexcellent.load(),
        fontStripey.load()
      ]).then(function () {
        setLoading(false)
      })
    })
  }, [])

  return <div className="App">{loading ? <Loader /> : <Editor config={config} />}</div>
}

export default App
