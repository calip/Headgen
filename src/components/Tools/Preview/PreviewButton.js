import React from 'react'
import './PreviewButton.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowCircleRight } from '@fortawesome/free-solid-svg-icons'
import { Button, ButtonGroup } from 'react-bootstrap'
import i18n from '../../../utils/i18n'

function PreviewButton({ previewFn }) {
  return (
    <div className="preview-button">
      <ButtonGroup>
        <Button variant="outline-primary" onClick={previewFn}>
          {i18n.t('Preview')} <FontAwesomeIcon icon={faArrowCircleRight} />
        </Button>
      </ButtonGroup>
    </div>
  )
}

export default PreviewButton
