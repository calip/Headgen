import { Button, Modal } from 'react-bootstrap'
import './PreviewDialog.scss'
import i18n from '../../../utils/i18n'

function PreviewDialog(props) {
  return (
    <>
      <Modal className="preview-modal" show={props.show} onHide={props.dialogFn}>
        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>Preview</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.dialogFn}>
            {i18n.t('Close')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default PreviewDialog
