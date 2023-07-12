import { useEffect, useRef } from 'react'
import i18n from '../utils/i18n'
import { Tooltip } from 'react-bootstrap'

const Helpers = {
  storeInputItem: (config, item) => {
    localStorage.setItem(`inputs-${config.appId}`, JSON.stringify(item))
  },
  clearInputItem: () => {
    localStorage.clear()
  },
  getInputItem: (config) => {
    const items = JSON.parse(localStorage.getItem(`inputs-${config.appId}`))
    return items
  },
  getIconForButton: (icons, icon) => {
    const data = icons.find((i) => i.name === icon)
    return data.file
  },
  getSelectedFormat: (format, selected) => {
    const f = format.find((item) => item.id === parseInt(selected))
    return f
  },
  showFormatSize: (width, height, unit) => {
    return `${height} ${unit} x ${width} ${unit}`
  },
  getQuery: () => {
    return new URLSearchParams(window.location.search)
  },
  saveInputToLocalStorage: (items, config, value) => {
    items.setInputItem((prevState) => {
      return { ...prevState, [items]: value }
    })
    Helpers.storeInputItem(config, items.inputItem)
  },
  fetchJson: async (url) => {
    const response = await fetch(url, {
      method: 'GET'
    })
    const data = await response.json()
    return data
  },
  isTouchScreenDevice: () => {
    try {
      document.createEvent('TouchEvent')
      return true
    } catch (e) {
      return false
    }
  },
  clearUrlHistory: (config) => {
    const url = `${window.location.origin}`
    const path = config.admin ? `${url}/apps/pixgen` : `${url}/pixeditor`
    window.history.pushState({ path: url }, '', path)
  },
  extractProducts: (products) => {
    return products.map((item) => {
      const images = item.images.map((img) => img.src)
      const data = {
        id: item.id,
        name: item.name,
        slug: item.slug,
        images: images,
        preview: images[0],
        variations: []
      }
      return data
    })
  },
  extractProduct: (product) => {
    const images = product.images.map((img) => img.src)
    const data = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      images: images,
      preview: images[0],
      variations: product.variations
    }
    return data
  },
  extractVariationAttributes: (variations) => {
    return variations
      .map((item) => {
        const attribute = item.attributes.find((attr) => attr.id === 1)
        let data = null
        if (attribute && attribute.option) {
          const option = attribute.option.split('x')
          const secOption = option[1].split(' ')

          const height = parseInt(option[0])
          const width = parseInt(secOption[0])
          const unit = secOption[1] ? secOption[1] : 'px'
          data = {
            id: item.id,
            height: height,
            width: width,
            unit: unit,
            price: item.price
          }
        }
        return data
      })
      .sort((a, b) => {
        const va = Math.abs(a.width * a.height)
        const vb = Math.abs(b.width * b.height)
        return va - vb
      })
  },
  extractVariation: (variation) => {
    const attribute = variation.attributes.find((attr) => attr.id === 1)
    let data = null
    if (attribute && attribute.option) {
      const option = attribute.option.split('x')
      const secOption = option[1].split(' ')

      const height = parseInt(option[0])
      const width = parseInt(secOption[0])
      const unit = secOption[1] ? secOption[1] : 'px'
      data = {
        id: variation.id,
        height: height,
        width: width,
        unit: unit,
        price: variation.price
      }
    }
    return data
  },
  getRandomId() {
    return Math.floor(Math.random() * 1000000)
  },
  getLabelForFontStyle(style) {
    switch (style) {
      case 'comfortaa':
        return 'Comfortaa'
      case 'italianno':
        return 'Italianno'
      case 'marqueemoon':
        return 'MarqueeMoon'
      case 'mexcellent':
        return 'Mexcellent'
      case 'stripey':
        return 'Stripey'
      default:
        return i18n.t('FontFamily')
    }
  },
  getIconSizeForFontStyle(font) {
    switch (font) {
      case 'comfortaa':
        return '100%'
      case 'italianno':
        return '50%'
      case 'marqueemoon':
        return '100%'
      case 'mexcellent':
        return '100%'
      case 'stripey':
        return '100%'
      default:
        return '100%'
    }
  },
  getLabelForFontSpacing(space) {
    switch (space) {
      case '0':
        return i18n.t('NoSpacing')
      case '2':
        return '1'
      case '5':
        return '2'
      case '10':
        return '3'
      case '15':
        return '4'
      case '20':
        return '5'
      default:
        return i18n.t('Spacing')
    }
  },
  setData: (unit, width, height) => {
    let id = Helpers.getRandomId()
    const data = {
      id: id,
      title: '',
      font: '',
      fontPadding: 0,
      fontSpacing: '',
      template: 1,
      format: null,
      height: height,
      width: width,
      unit: unit,
      placeholder: false,
      variation: null,
      items: [Helpers.setItems()]
    }
    return data
  },
  setItems: () => {
    let id = Helpers.getRandomId()
    const item = {
      id: id,
      headline: false,
      realText: '',
      spokenText: '',
      icon: '',
      font: '',
      fontPadding: 0,
      fontTransition: '',
      fontSpacing: '',
      iconDisplay: '',
      order: 0
    }
    return item
  },
  encodeJsonData: (data) => {
    const params = JSON.stringify(data)
    const object = window.btoa(params)
    return object
  },
  decodeJsonData: (data) => {
    const decoded = window.atob(data)
    const object = JSON.parse(decoded)
    return object
  },
  useHasChanged: (val) => {
    const prevVal = Helpers.usePrevious(val)
    return prevVal !== val
  },
  usePrevious: (value) => {
    const ref = useRef()
    useEffect(() => {
      ref.current = value
    })
    return ref.current
  },
  renderTooltip: (title) => {
    return <Tooltip id="button-tooltip">{title}</Tooltip>
  },
  cmToPxConversion: (size, dpc) => {
    const dpi = Math.round(dpc / 0.3937008)
    const cm = Math.round(dpi / 2.54)
    const px = Math.round(size * cm)
    return px
  }
}

export default Helpers
