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
  const [minMaxPrice, setMinMaxPrice] = useState('')

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
            const resData = response.data.map(({ id, attributes, price, meta_data }) => ({
              id,
              attributes,
              price,
              meta_data
            }))
            const minPrice = resData.reduce((prev, curr) => {
              return parseFloat(prev.price) < parseFloat(curr.price) ? prev : curr
            })
            const maxPrice = resData.reduce((prev, curr) => {
              return parseFloat(prev.price) > parseFloat(curr.price) ? prev : curr
            })
            const strMinPrice =
              props.currency.currencyPosition === 'left_space'
                ? `${props.currency.currencySymbol}${minPrice.price}`
                : `${minPrice.price}${props.currency.currencySymbol}`
            const strMaxPrice =
              props.currency.currencyPosition === 'left_space'
                ? `${props.currency.currencySymbol}${maxPrice.price}`
                : `${maxPrice.price}${props.currency.currencySymbol}`
            setMinMaxPrice(`${strMinPrice} - ${strMaxPrice}`)
            const variationData = Helpers.extractVariationAttributes(
              resData,
              others.config.wordpress.attributeSlug
            )
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
                  <CarouselImage
                    layout={others.config.layout}
                    format={formatType}
                    currency={others.currency}
                    onSelectVariation={onSelectVariation}
                    initPrice={minMaxPrice}
                  />
                </div>
              ) : (
                <div className="format-page">
                  <FormatType
                    format={others.format}
                    layout={others.config.layout}
                    onSelectFormat={onSelectFormat}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        {formatType ? (
          <div className="pixgen-mobile-price me-auto">
            {selectedVariation?.price ? (
              <>
                {others.currency.currencyPosition === 'left_space' ? (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: `${others.currency.currencySymbol}${selectedVariation?.price}`
                    }}
                  />
                ) : (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: `${selectedVariation?.price}${others.currency.currencySymbol}`
                    }}
                  />
                )}
              </>
            ) : (
              <span dangerouslySetInnerHTML={{ __html: `${minMaxPrice}` }} />
            )}
          </div>
        ) : (
          <></>
        )}
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
