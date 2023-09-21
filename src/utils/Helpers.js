import { useEffect, useRef } from 'react'
import i18n from './i18n.js'
import { Tooltip } from 'react-bootstrap'
import { env } from './env.js'

const Helpers = {
  getBaseUrl: () => {
    return env.REACT_APP_BASE ? env.REACT_APP_BASE : ''
  },
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
    const data = icons.find((i) => i.name.toLowerCase() === icon.toLowerCase())
    return data.file
  },
  getIcon: (icons, name) => {
    const data = icons.find((i) => i.name.toLowerCase() === name.toLowerCase())
    return data
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
  stringValueToBool: (value) => {
    return value.toLowerCase() === 'yes'
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
  getMetaProduct: (metadata, key) => {
    const meta = metadata.find((x) => x.key === key)
    return meta
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
            price: item.price,
            metadata: item.meta_data
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
        price: variation.price,
        metadata: variation.meta_data
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
  getLabelForFontSpacing(space) {
    switch (space) {
      case '0':
        return i18n.t('NoSpacing')
      case '0.3':
        return '1'
      case '0.5':
        return '2'
      case '0.7':
        return '3'
      case '1':
        return '4'
      case '1.3':
        return '5'
      default:
        return i18n.t('Spacing')
    }
  },
  setData: (unit, width, height, fontSelection, spaceSelection, fonts) => {
    let id = Helpers.getRandomId()
    const data = {
      id: id,
      title: '',
      font: '',
      fontPadding: 0,
      fontSpacing: '',
      template: 1,
      fonts: fonts,
      fontSelection: fontSelection,
      spaceSelection: spaceSelection,
      format: null,
      height: height,
      width: width,
      unit: unit,
      orientation: height > width ? 'portrait' : 'landscape',
      backgroundColor: 'transparent',
      fontColor: '#000000',
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
      previousIcon: null,
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
  },
  italiannoSpace: () => {
    return [
      {
        letter: 'A',
        leftSpace: 0,
        rightSpace: 2
      },
      {
        letter: 'B',
        leftSpace: 0,
        rightSpace: 1
      },
      {
        letter: 'C',
        leftSpace: 0,
        rightSpace: 1
      },
      {
        letter: 'D',
        leftSpace: 0,
        rightSpace: 1
      },
      {
        letter: 'E',
        leftSpace: 0,
        rightSpace: 1
      },
      {
        letter: 'F',
        leftSpace: 0,
        rightSpace: 2
      },
      {
        letter: 'G',
        leftSpace: 0,
        rightSpace: 1
      },
      {
        letter: 'H',
        leftSpace: 0,
        rightSpace: 1
      },
      {
        letter: 'I',
        leftSpace: 0,
        rightSpace: 2
      },
      {
        letter: 'J',
        leftSpace: 2,
        rightSpace: 2
      },
      {
        letter: 'K',
        leftSpace: 0,
        rightSpace: 2
      },
      {
        letter: 'M',
        leftSpace: 0,
        rightSpace: 1
      },
      {
        letter: 'N',
        leftSpace: 0,
        rightSpace: 2
      },
      {
        letter: 'O',
        leftSpace: 0,
        rightSpace: 1
      },
      {
        letter: 'P',
        leftSpace: 0,
        rightSpace: 1
      },
      {
        letter: 'Q',
        leftSpace: 0,
        rightSpace: 1
      },
      {
        letter: 'R',
        leftSpace: 0,
        rightSpace: 1
      },
      {
        letter: 'S',
        leftSpace: 0,
        rightSpace: 1
      },
      {
        letter: 'T',
        leftSpace: 0,
        rightSpace: 2
      },
      {
        letter: 'U',
        leftSpace: 0,
        rightSpace: 1
      },
      {
        letter: 'V',
        leftSpace: 0,
        rightSpace: 3
      },
      {
        letter: 'W',
        leftSpace: 0,
        rightSpace: 3
      },
      {
        letter: 'X',
        leftSpace: 1,
        rightSpace: 2
      },
      {
        letter: 'Y',
        leftSpace: 0,
        rightSpace: 2
      },
      {
        letter: 'Z',
        leftSpace: 0,
        rightSpace: 2
      },
      {
        letter: 'a',
        leftSpace: 0,
        rightSpace: 1
      },
      {
        letter: 'b',
        leftSpace: 0,
        rightSpace: 2
      },
      {
        letter: 'c',
        leftSpace: 0,
        rightSpace: 1
      },
      {
        letter: 'd',
        leftSpace: 0,
        rightSpace: 2
      },
      {
        letter: 'e',
        leftSpace: 0,
        rightSpace: 1
      },
      {
        letter: 'f',
        leftSpace: 2,
        rightSpace: 2
      },
      {
        letter: 'g',
        leftSpace: 2,
        rightSpace: 1
      },
      {
        letter: 'h',
        leftSpace: 0,
        rightSpace: 1
      },
      {
        letter: 'i',
        leftSpace: 0,
        rightSpace: 1
      },
      {
        letter: 'j',
        leftSpace: 3,
        rightSpace: 1
      },
      {
        letter: 'k',
        leftSpace: 0,
        rightSpace: 1
      },
      {
        letter: 'l',
        leftSpace: 0,
        rightSpace: 2
      },
      {
        letter: 'm',
        leftSpace: 0,
        rightSpace: 1
      },
      {
        letter: 'n',
        leftSpace: 0,
        rightSpace: 1
      },
      {
        letter: 'o',
        leftSpace: 0,
        rightSpace: 1
      },
      {
        letter: 'p',
        leftSpace: 2,
        rightSpace: 1
      },
      {
        letter: 'q',
        leftSpace: 0,
        rightSpace: 1
      },
      {
        letter: 'r',
        leftSpace: 0,
        rightSpace: 1
      },
      {
        letter: 's',
        leftSpace: 0,
        rightSpace: 1
      },
      {
        letter: 't',
        leftSpace: 0,
        rightSpace: 1
      },
      {
        letter: 'u',
        leftSpace: 0,
        rightSpace: 1
      },
      {
        letter: 'v',
        leftSpace: 0,
        rightSpace: 1
      },
      {
        letter: 'w',
        leftSpace: 0,
        rightSpace: 1
      },
      {
        letter: 'x',
        leftSpace: 0,
        rightSpace: 1
      },
      {
        letter: 'y',
        leftSpace: 1,
        rightSpace: 1
      },
      {
        letter: 'z',
        leftSpace: 0,
        rightSpace: 1
      }
    ]
  },
  getIconLetter: (font) => {
    switch (font) {
      case 'comfortaa':
        return 'a'
      case 'italianno':
        return 'O'
      case 'marqueemoon':
        return 'OO'
      case 'mexcellent':
        return 'W'
      case 'stripey':
        return 'W'
      default:
        return 'a'
    }
  },
  getIconStyle: (font) => {
    switch (font) {
      case 'marqueemoon':
        return `width: 100%; height: 100%; position: absolute; top: -1px; left: 0;`
      case 'mexcellent':
        return `width: 100%; height: 100%; position: absolute; top: -1px; left: 0;`
      default:
        return `width: 100%; height: 100%; position: absolute; top: 0; left: 0;`
    }
  }
}

export default Helpers
