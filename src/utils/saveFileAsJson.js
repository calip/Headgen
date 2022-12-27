const saveFileAsJson = async (data, filename) => {
  delete data['[object Object]']
  const fileData = JSON.stringify(data)
  const blob = new Blob([fileData], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)

  const fakeLink = window.document.createElement('a')
  fakeLink.style = 'display:none;'
  fakeLink.download = `${filename}.json`

  fakeLink.href = url

  document.body.appendChild(fakeLink)
  fakeLink.click()
  document.body.removeChild(fakeLink)

  fakeLink.remove()
}

export default saveFileAsJson
