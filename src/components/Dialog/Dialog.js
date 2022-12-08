import { Button, Modal } from 'react-bootstrap'

function Dialog({ show, dialogFn, actionFn }) {
  return (
    <>
      <Modal show={show} onHide={dialogFn}>
        <Modal.Header closeButton>
          <Modal.Title>Clear Session</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to clear your session?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={dialogFn}>
            No
          </Button>
          <Button variant="primary" onClick={actionFn}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Dialog
