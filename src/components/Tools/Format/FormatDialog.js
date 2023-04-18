import { Button, Modal } from 'react-bootstrap'
import i18n from '../../../utils/i18n'
import './FormatDialog.scss'
import FormatType from './FormatType'
import { useState } from 'react'
import CarouselImage from '../Carousel/CarouselImage'

function FormatDialog(props) {
  const { actionfn, ...others } = props

  const [formatType, setFormatType] = useState('')

  const onSelectFormat = (value) => {
    const format = others.config.format.find((item) => item.id === value)
    setFormatType(format)
  }

  const handleClose = () => {
    setFormatType('')
    others.onHide()
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
        <p>
          <strong>{formatType.title}</strong>
        </p>
        {formatType ? (
          <CarouselImage images={formatType.images} />
        ) : (
          <FormatType format={others.config.format} onSelectFormat={onSelectFormat} />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleClose}>{i18n.t('Close')}</Button>
        <Button onClick={actionfn}>{i18n.t('OK')}</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default FormatDialog
