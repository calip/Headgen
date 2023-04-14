import { Button, Modal } from 'react-bootstrap'
import i18n from '../../utils/i18n'

function ErrorDialog(props) {
  return (
    <>
      <Modal show={props.show} onHide={props.dialogFn}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: '#842029' }}>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.description}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={props.dialogFn}>
            {i18n.t('OK')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ErrorDialog
