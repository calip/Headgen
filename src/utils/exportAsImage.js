import html2canvas from 'html2canvas'
import * as changedpi from 'changedpi'

const exportAsImage = async (element, dpc, title, quality) => {
  const scale = quality === 'high' ? 10 : 1
  const newDpc = quality === 'high' ? dpc : 28.346
  const imageType = quality === 'high' ? 'image/png' : 'image/jpeg'
  const newElement = element.cloneNode(true)
  newElement.style.transform = `scale(${scale}, ${scale}) translateX(100%)`
  newElement.style.transformorigin = '0 0'
  newElement.style.position = 'fixed'
  if (quality === 'low') {
    newElement.style.background = '#fff'
  }
  const borderElement = newElement.querySelector(`.pix-content`)
  if (borderElement) {
    borderElement.classList.remove('pix-content-selected')
  }
  const titleElement = newElement.querySelector(`.pix-title`)
  if (titleElement) {
    titleElement.classList.remove('pix-title-selected')
  }
  document.body.appendChild(newElement)

  const newWidth = Math.abs(newElement.clientWidth) * scale
  const newHeight = Math.abs(newElement.clientHeight) * scale
  const dpi = Math.round(newDpc / 0.3937008)

  const canvas = await html2canvas(newElement, {
    backgroundColor: null,
    scale: 1,
    width: newWidth,
    height: newHeight,
    logging: true,
    allowTaint: false
  })
  newElement.remove()
  const image = canvas.toDataURL(imageType, 1.0)
  const imageUrl = changedpi.changeDpiDataUrl(image, dpi)
  downloadImage(imageUrl, title)
}

const downloadImage = (blob, fileName) => {
  const fakeLink = window.document.createElement('a')
  fakeLink.style = 'display:none;'
  fakeLink.download = fileName

  fakeLink.href = blob

  document.body.appendChild(fakeLink)
  fakeLink.click()
  document.body.removeChild(fakeLink)

  fakeLink.remove()
}

export default exportAsImage
