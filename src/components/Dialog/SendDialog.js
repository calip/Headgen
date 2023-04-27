import { Button, Modal } from 'react-bootstrap'
import i18n from '../../utils/i18n'
import './SendDialog.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboard, faClipboardCheck } from '@fortawesome/free-solid-svg-icons'
import { useRef, useState } from 'react'
import Tooltips from '../Tools/Tooltips/Tooltips'
import copyToClipboard from '../../utils/copyToClipboard'

function SendDialog(props) {
  const [isCopied, setIsCopied] = useState(false)
  const targetTooltip = useRef(null)

  const handleClipboard = async () => {
    setIsCopied((isCopied) => !isCopied)
    try {
      await copyToClipboard(props.data)
      setTimeout(() => {
        setIsCopied(false)
      }, 1500)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <Modal show={props.show} onHide={props.dialogFn} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="code-preview">
            <code>{props.data}</code>
            <button ref={targetTooltip} className="copy-button" onClick={handleClipboard}>
              <FontAwesomeIcon icon={isCopied ? faClipboardCheck : faClipboard} />
            </button>
            <Tooltips
              show={isCopied}
              position="left"
              target={targetTooltip.current}
              description={i18n.t('CopyToClipboard')}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.dialogFn}>
            {i18n.t('Cancel')}
          </Button>
          <Button variant="primary" onClick={props.actionFn}>
            {i18n.t('Send')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default SendDialog
