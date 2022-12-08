import { Button, Modal } from 'react-bootstrap'

function File({ show, dialogFn, actionFn }) {
  return (
    <>
      <Modal show={show} onHide={dialogFn}>
        <Modal.Header closeButton>
          <Modal.Title>Load JSON file</Modal.Title>
        </Modal.Header>
        <Modal.Body>load file from json?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={dialogFn}>
            Cancel
          </Button>
          <Button variant="primary" onClick={actionFn}>
            Load
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default File
