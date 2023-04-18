import { Carousel, Col, Container, Row } from 'react-bootstrap'
import './CarouselImage.scss'

function CarouselImage(props) {
  return (
    <Container fluid>
      <Row>
        <Col>
          <div className="carousel-content">
            <Carousel variant="dark">
              {props.images.map((item, index) => {
                return (
                  <Carousel.Item key={index}>
                    <img className="d-block w-100" src={item} alt="carousel image" />
                  </Carousel.Item>
                )
              })}
            </Carousel>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default CarouselImage
