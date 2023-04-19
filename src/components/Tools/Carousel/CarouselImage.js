import { Button, Carousel, Col, Container, Row } from 'react-bootstrap'
import './CarouselImage.scss'
import { useState } from 'react'

function CarouselImage(props) {
  const [activeSize, setActiveSize] = useState()

  const handleSelectSize = (size) => {
    setActiveSize(size)
    props.onSelectSize(size)
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
                    <img className="d-block w-100" src={item} alt="carousel image" />
                  </Carousel.Item>
                )
              })}
            </Carousel>
          </div>
          <div className="carousel-option">
            {props.format.sizes.map((size, index) => {
              return (
                <Button
                  variant="outline-dark"
                  active={index === activeSize}
                  size="sm"
                  key={index}
                  onClick={() => handleSelectSize(index)}>
                  {size.width}x{size.height}
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
