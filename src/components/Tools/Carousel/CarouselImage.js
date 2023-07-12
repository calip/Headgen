import { Button, Carousel, Col, Container, Row } from 'react-bootstrap'
import './CarouselImage.scss'
import { useState } from 'react'

function CarouselImage(props) {
  const [activeVariation, setActiveVariation] = useState()
  const [price, setPrice] = useState()

  const handleSelectVariation = (variation) => {
    setActiveVariation(variation)
    setPrice(variation.price)
    props.onSelectVariation(variation)
  }

  return (
    <Container fluid>
      <Row>
        <Col>
          <div className="carousel-content">
            <Carousel variant="dark">
              {props.format.images.map((item, index) => {
                return (
                  <Carousel.Item key={index}>
                    <img className="carousel-img" src={item} alt="carousel image" />
                  </Carousel.Item>
                )
              })}
            </Carousel>
            {price ? (
              <div className="carousel-tags">
                {props.currency.currencyPosition === 'left_space' ? (
                  <span
                    dangerouslySetInnerHTML={{ __html: `${props.currency.currencySymbol}${price}` }}
                  />
                ) : (
                  <span
                    dangerouslySetInnerHTML={{ __html: `${price}${props.currency.currencySymbol}` }}
                  />
                )}
              </div>
            ) : (
              <div className="carousel-tags">
                <span dangerouslySetInnerHTML={{ __html: `${props.initPrice}` }} />
              </div>
            )}
          </div>
          <div className="carousel-option">
            {props.format.variations.map((variation) => {
              return (
                <Button
                  variant="outline-dark"
                  active={variation?.id === activeVariation?.id}
                  size="sm"
                  key={variation?.id}
                  onClick={() => handleSelectVariation(variation)}>
                  {variation?.height}
                  {variation?.unit} x {variation?.width}
                  {variation?.unit}
                </Button>
              )
            })}
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default CarouselImage
