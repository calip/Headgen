import { Overlay, Tooltip } from 'react-bootstrap'

function Tooltips(props) {
  return (
    <Overlay target={props.target} show={props.show} placement={props.position}>
      <Tooltip>{props.description}</Tooltip>
    </Overlay>
  )
}

export default Tooltips
