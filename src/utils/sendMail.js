const sendMail = async (url, data) => {
  return fetch(url, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify(data),
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    }
  })
    .then((res) => res.json())
    .then((post) => {
      return post
    })
    .catch(() => {
      return false
    })
}
export default sendMail
