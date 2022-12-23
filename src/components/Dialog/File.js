import { useState } from 'react'
import { Button, FormControl, FormGroup, Modal } from 'react-bootstrap'

function File({ show, dialogFn, actionFn, setJson }) {
  const [disable, setDisable] = useState(false)
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file.type != 'application/json') {
      alert('Only Json are valid.')
      setDisable(true)
      return
    }
    setDisable(false)
    const fileReader = new FileReader()
    fileReader.readAsText(e.target.files[0], 'UTF-8')
    fileReader.onload = (e) => {
      setJson(e.target.result)
    }
  }

  return (
    <>
      <Modal show={show} onHide={dialogFn}>
        <Modal.Header closeButton>
          <Modal.Title>Load JSON file</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup controlId="jsonFile" className="mb-3">
            <FormControl type="file" onChange={handleFileChange} />
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={dialogFn}>
            Cancel
          </Button>
          <Button variant="primary" onClick={actionFn} disabled={disable}>
            Load
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default File
