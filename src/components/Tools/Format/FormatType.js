import { Col, Container, Row } from 'react-bootstrap'
import './FormatType.scss'

function FormatType(props) {
  return (
    <Container fluid>
      <Row>
        {props.format.map((item) => {
          return (
            <Col key={item.id} onClick={() => props.onSelectFormat(item.id)}>
              <div className="format-type-content">
                <img
                  src={item.preview}
                  alt="preview"
                  className="img-fluid mx-auto mx-lg-0 h-100 col-8 col-sm-6 col-md-4 col-lg-1 my-auto"
                />
                <p>{item.name}</p>
              </div>
            </Col>
          )
        })}
      </Row>
    </Container>
  )
}

export default FormatType
