import { Button, Modal } from 'react-bootstrap'
import i18n from '../../../utils/i18n'
import './FormatDialog.scss'
import FormatType from './FormatType'
import { useState } from 'react'
import CarouselImage from '../Carousel/CarouselImage'
import Woocommerce from '../../../utils/woocommerce'
import Helpers from '../../../utils/Helpers'

function FormatDialog(props) {
  const { actionfn, ...others } = props

  const [formatType, setFormatType] = useState()
  const [selectedVariation, setSelectedVariation] = useState()

  const onSelectFormat = (value) => {
    const format = others.format.find((item) => item.id === value)
    if (others.config.wordpress.active) {
      const api = Woocommerce(others.config)
      api
        .get(`products/${value}/variations`, {
          per_page: 20,
          status: 'publish'
        })
        .then((response) => {
          if (response.status === 200) {
            console.log(response)
            const resData = response.data.map(({ id, attributes, price }) => ({
              id,
              attributes,
              price
            }))
            console.log(resData)
            const variationData = Helpers.extractVariationAttributes(resData)
            format.variations = variationData
            setFormatType(format)
          }
        })
        .catch((error) => {
          console.log(error)
        })
    } else {
      setFormatType(format)
    }
  }

  const onSelectVariation = (value) => {
    setSelectedVariation(value)
  }

  const handleClose = () => {
    setFormatType()
    setSelectedVariation()
    others.onHide()
  }

  const handleBack = () => {
    setFormatType()
    setSelectedVariation()
  }

  const handleChoose = (format, variation) => {
    setFormatType()
    setSelectedVariation()
    others.onHide()
    actionfn(format, variation)
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
          {others.wp.loadWordpress ? (
            <h4 className="text-center">{i18n.t('PleaseWait')}...</h4>
          ) : (
            <>
              {formatType ? (
                <div className="format-page">
                  <CarouselImage format={formatType} onSelectVariation={onSelectVariation} />
                </div>
              ) : (
                <div className="format-page">
                  <FormatType format={others.format} onSelectFormat={onSelectFormat} />
                </div>
              )}
            </>
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
        {formatType && selectedVariation ? (
          <Button onClick={() => handleChoose(formatType, selectedVariation)}>
            {i18n.t('Choose')}
          </Button>
        ) : (
          <></>
        )}
      </Modal.Footer>
    </Modal>
  )
}

export default FormatDialog
