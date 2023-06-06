import { Button, Carousel, Col, Container, Row } from 'react-bootstrap'
import './CarouselImage.scss'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTag } from '@fortawesome/free-solid-svg-icons'

function CarouselImage(props) {
  const [activeVariation, setActiveVariation] = useState()
  const [price, setPrice] = useState(props.initPrice)

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
                <FontAwesomeIcon icon={faTag} /> {price}
              </div>
            ) : (
              <></>
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
                  {variation?.height}x{variation?.width}
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
