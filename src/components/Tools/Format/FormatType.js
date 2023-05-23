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
                <img src={item.preview} alt="preview" className="img-fluid" />
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
