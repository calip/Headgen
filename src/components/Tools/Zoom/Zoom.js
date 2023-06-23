import React from 'react'
import './Zoom.scss'
import { Button, OverlayTrigger } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCompress, faExpand } from '@fortawesome/free-solid-svg-icons'
import i18n from '../../../utils/i18n'
import Helpers from '../../../utils/Helpers'

function Zoom({ zoomSize, setZoomSize }) {
  const handleRangeChange = (e) => {
    setZoomSize(e.target.value)
  }

  const handlePlusButton = (value) => {
    value = value + 10
    const zoom = Math.round(value / 10) * 10
    if (zoom >= 100) {
      setZoomSize(100)
    } else {
      setZoomSize(zoom)
    }
  }

  const handleMinusButton = (value) => {
    value = value - 10
    const zoom = Math.round(value / 10) * 10
    if (zoom <= 0) {
      setZoomSize(0)
    } else {
      setZoomSize(zoom)
    }
  }

  const handleFitToWindow = () => {
    setZoomSize(90)
  }

  const handleRealSize = () => {
    setZoomSize(null)
  }

  const curentSize = zoomSize ? parseFloat(zoomSize) : 0
  const numSize = `${curentSize <= 0 ? 1 : Math.round(curentSize)}%`

  return (
    <div className="zoom-wrapper">
      <div className="zoom-container">
        <div className="zoom-label">
          <OverlayTrigger
            placement="top"
            delay={{ show: 250, hide: 400 }}
            overlay={Helpers.renderTooltip(i18n.t('FitToWindow'))}>
            <Button
              className="zoom-tools"
              variant="link"
              title={i18n.t('FitToWindow')}
              onClick={() => handleFitToWindow()}>
              <FontAwesomeIcon icon={faExpand} />
            </Button>
          </OverlayTrigger>
          <OverlayTrigger
            placement="top"
            delay={{ show: 250, hide: 400 }}
            overlay={Helpers.renderTooltip(i18n.t('RealSize'))}>
            <Button
              className="zoom-tools"
              variant="link"
              title={i18n.t('RealSize')}
              onClick={() => handleRealSize()}>
              <FontAwesomeIcon icon={faCompress} />
            </Button>
          </OverlayTrigger>
        </div>
        <div className="zoom-label">
          <Button
            className="zoom-button"
            variant="outline-primary"
            onClick={() => handleMinusButton(parseFloat(curentSize))}>
            -
          </Button>
        </div>
        <div className="zoom-range">
          <input
            type="range"
            min="0"
            max="100"
            step="10"
            value={curentSize}
            onChange={handleRangeChange}
          />
        </div>
        <div className="zoom-label">
          <Button
            className="zoom-button"
            variant="outline-primary"
            onClick={() => handlePlusButton(parseFloat(curentSize))}>
            +
          </Button>
        </div>
        <div className="zoom-description">{numSize}</div>
      </div>
    </div>
  )
}

export default Zoom
