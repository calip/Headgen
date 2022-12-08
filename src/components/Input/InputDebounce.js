import { useEffect, useState } from 'react'
import { FormControl } from 'react-bootstrap'

const InputDebounce = (props) => {
  const { onChange, ...otherProps } = props

  const [inputTimeout, setInputTimeout] = useState(null)

  useEffect(() => () => clearTimeout(inputTimeout), [inputTimeout])

  const inputOnChange = (value) => {
    if (inputTimeout) clearTimeout(inputTimeout)
    setInputTimeout(
      setTimeout(() => {
        if (onChange) onChange(value)
      }, 1000)
    )
  }

  return <FormControl {...otherProps} onChange={(e) => inputOnChange(e.target.value)} />
}

export default InputDebounce
