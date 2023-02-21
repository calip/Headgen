import React from 'react'
import './Zoom.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlassMinus, faMagnifyingGlassPlus } from '@fortawesome/free-solid-svg-icons'
import { Button, ButtonGroup } from 'react-bootstrap'

function Zoom() {
  return (
    <div className="zoom-button">
      <ButtonGroup>
        <Button variant="outline-primary">
          <FontAwesomeIcon icon={faMagnifyingGlassPlus} />
        </Button>
        <Button variant="outline-primary">
          <FontAwesomeIcon icon={faMagnifyingGlassMinus} />
        </Button>
      </ButtonGroup>
    </div>
  )
}

export default Zoom
