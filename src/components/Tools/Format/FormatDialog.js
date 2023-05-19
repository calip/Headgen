import { Button, Modal } from 'react-bootstrap'
import i18n from '../../../utils/i18n'
import './FormatDialog.scss'
import FormatType from './FormatType'
import { useState } from 'react'
import CarouselImage from '../Carousel/CarouselImage'

function FormatDialog(props) {
  const { actionfn, ...others } = props

  const [formatType, setFormatType] = useState()
  const [sizeIndex, setSizeIndex] = useState()

  const availableFormat = others.format //others.config.wordpress.active ? others.products : others.config.format
  console.log(availableFormat)

  const onSelectFormat = (value) => {
    const format = others.config.format.find((item) => item.id === value)
    setFormatType(format)
  }

  const onSelectSize = (value) => {
    setSizeIndex(value)
  }

  const handleClose = () => {
    setFormatType()
    setSizeIndex()
    others.onHide()
  }

  const handleBack = () => {
    setFormatType()
    setSizeIndex()
  }

  const handleChoose = (format, index) => {
    setFormatType()
    setSizeIndex()
    others.onHide()
    actionfn(format, index)
  }

  return (
    <Modal
      className="format-modal"
      {...others}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">{others.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="format-pages">
          {formatType ? (
            <div className="format-page">
              <CarouselImage format={formatType} onSelectSize={onSelectSize} />
            </div>
          ) : (
            <div className="format-page">
              <FormatType format={availableFormat} onSelectFormat={onSelectFormat} />
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleBack}
          style={{ visibility: formatType ? '' : 'hidden' }}>
          {i18n.t('Back')}
        </Button>
        {formatType && sizeIndex >= 0 ? (
          <Button onClick={() => handleChoose(formatType, sizeIndex)}>{i18n.t('Choose')}</Button>
        ) : (
          <></>
        )}
      </Modal.Footer>
    </Modal>
  )
}

export default FormatDialog
