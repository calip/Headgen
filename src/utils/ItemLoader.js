import React from 'react'
import styled from 'styled-components'

// styles
const Dots = styled.div`
  display: inline-block;
  justify-content: center;
  font-family: monospace;
  clip-path: inset(0 3ch 0 0);
  animation: l 1s steps(4);

  @keyframes l {
    to {
      clip-path: inset(0 -1ch 0 0);
    }
  }
`

// return
const ItemLoader = (props) => {
  return <Dots>{props.data.length > 0 ? '...' : ''}</Dots>
}

export default ItemLoader
