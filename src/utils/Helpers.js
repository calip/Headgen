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
  getQuery: () => {
    return new URLSearchParams(window.location.search)
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
        return 'Font Family'
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
  }
}

export default Helpers
