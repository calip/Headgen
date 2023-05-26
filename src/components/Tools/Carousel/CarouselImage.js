import { Button, Carousel, Col, Container, Row } from 'react-bootstrap'
import './CarouselImage.scss'
import { useState } from 'react'

function CarouselImage(props) {
  const [activeVariation, setActiveVariation] = useState()

  const handleSelectVariation = (variation) => {
    setActiveVariation(variation)
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
