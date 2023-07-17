import { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles.css'

import Editor from './components/Editor/Editor'
import Loader from './components/Loader/Loader'
import Helpers from './utils/Helpers'
import FontFaceObserver from 'fontfaceobserver'
import Woocommerce from './utils/woocommerce'

function App() {
  const [config, setConfig] = useState({})
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [currencyCode, setCurrencyCode] = useState('EUR')
  const [currencySymbol, setCurrencySymbol] = useState('&euro;')
  const [currencyPosition, setCurrencyPosition] = useState('right_space')
  const [selectedProduct, setSelectedProduct] = useState()
  const [selectedVariation, setSelectedVariation] = useState()

  const fontComfortaa = new FontFaceObserver('Comfortaa-Wordpix')
  const fontItalianno = new FontFaceObserver('Italianno-Wordpix')
  const fontMarqueeMoon = new FontFaceObserver('MarqueeMoon-Wordpix')
  const fontMexcellent = new FontFaceObserver('Mexcellent-Wordpix')
  const fontStripey = new FontFaceObserver('Stripey-Wordpix')

  const selectItem = {
    selectedProduct: selectedProduct,
    setSelectedProduct: setSelectedProduct,
    selectedVariation: selectedVariation,
    setSelectedVariation: setSelectedVariation
  }

  const currency = {
    currencyCode: currencyCode,
    setCurrencyCode: setCurrencyCode,
    currencySymbol: currencySymbol,
    setCurrencySymbol: setCurrencySymbol,
    currencyPosition: currencyPosition,
    setCurrencyPosition: setCurrencyPosition
  }

  const timeout = (time) => {
    return new Promise((resolve, reject) => {
      setTimeout(reject, time)
    })
  }

  useEffect(() => {
    setLoading(true)
    Promise.race([
      fontComfortaa.load(),
      fontItalianno.load(),
      fontMarqueeMoon.load(),
      fontMexcellent.load(),
      fontStripey.load(),
      timeout(3000)
    ]).then(() => {
      Helpers.fetchJson(`${Helpers.getBaseUrl()}/config/config.json`).then((result) => {
        setConfig(result)
        if (result.wordpress.active) {
          const api = Woocommerce(result)
          api
            .get('system_status', {
              per_page: 20
            })
            .then((settings) => {
              if (settings.status === 200) {
                const wooSettings = settings.data
                api
                  .get('products', {
                    per_page: 20,
                    type: 'variable',
                    status: 'publish'
                  })
                  .then((response) => {
                    if (response.status === 200) {
                      const search = window.location.search
                      const params = new URLSearchParams(search)
                      const editor = params.get('editor')
                      if (editor) {
                        const param = Helpers.decodeJsonData(editor)
                        api
                          .get('products/' + param.product_id, {})
                          .then((resproduct) => {
                            if (resproduct.status === 200) {
                              const product = Helpers.extractProduct(resproduct.data)
                              api
                                .get(
                                  'products/' +
                                    param.product_id +
                                    '/variations/' +
                                    param.variation_id,
                                  {}
                                )
                                .then((res) => {
                                  if (res.status === 200) {
                                    const variation = Helpers.extractVariation(res.data)
                                    setSelectedProduct(product)
                                    setSelectedVariation(variation)
                                    setCurrencyCode(wooSettings.settings.currency)
                                    setCurrencySymbol(wooSettings.settings.currency_symbol)
                                    setCurrencyPosition(wooSettings.settings.currency_position)
                                    setProducts(response.data)
                                    setLoading(false)
                                    Helpers.clearUrlHistory(result)
                                  }
                                })
                                .catch((error) => {
                                  console.log(error)
                                })
                            }
                          })
                          .catch((error) => {
                            console.log(error)
                          })
                      } else {
                        setProducts(response.data)
                        setCurrencyCode(wooSettings.settings.currency)
                        setCurrencySymbol(wooSettings.settings.currency_symbol)
                        setCurrencyPosition(wooSettings.settings.currency_position)
                        setLoading(false)
                      }
                    }
                  })
                  .catch((error) => {
                    console.log(error)
                  })
              } else {
                setLoading(false)
              }
            })
            .catch((error) => {
              console.log(error)
            })
        } else {
          setLoading(false)
        }
      })
    })
  }, [])

  return (
    <div className="pixgen-wrapper">
      <div className="pixgen-container">
        {loading ? (
          <Loader />
        ) : (
          <Editor config={config} products={products} selectItem={selectItem} currency={currency} />
        )}
      </div>
    </div>
  )
}

export default App
