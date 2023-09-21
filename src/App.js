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

  const exampleFontData = {
    'Comfortaa-Wordpix': { weight: 'normal' },
    'Italianno-Wordpix': { weight: 'normal' },
    'MarqueeMoon-Wordpix': { weight: 'normal' },
    'Mexcellent-Wordpix': { weight: 'normal' },
    'Stripey-Wordpix': { weight: 'normal' }
  }

  let observers = []

  // Make one observer for each font,
  // by iterating over the data we already have
  Object.keys(exampleFontData).forEach((family) => {
    var data = exampleFontData[family]
    var obs = new FontFaceObserver(family, data)
    observers.push(obs.load())
  })

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

  useEffect(() => {
    setLoading(true)
    Promise.all(observers).then(() => {
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
                      const publishedProduct = response.data.filter((pro) => {
                        const pixgenProduct = Helpers.getMetaProduct(
                          pro.meta_data,
                          'disable_product_pixgen'
                        )
                        const disableProduct = pixgenProduct
                          ? Helpers.stringValueToBool(pixgenProduct.value)
                          : false
                        if (!disableProduct) {
                          return pro
                        }
                      })

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
                                    setProducts(publishedProduct)
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
                        setProducts(publishedProduct)
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
