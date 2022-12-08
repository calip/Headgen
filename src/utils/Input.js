import Helpers from './Helpers'

const Input = {
  title: '',
  font: '',
  fontPadding: 0,
  fontSpacing: '',
  template: 1,
  items: [
    {
      id: Helpers.getRandomId(),
      loading: false,
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
  ]
}

export default Input
