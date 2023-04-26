import { Toast, ToastContainer } from 'react-bootstrap'
import i18n from '../../../utils/i18n'
import './EmailToast.scss'

function EmailToast(props) {
  return (
    <ToastContainer position="top-end" className="p-3">
      <Toast bg="success" onClose={props.onClose} show={props.showToast} delay={3000} autohide>
        <Toast.Header>
          <strong className="me-auto">{props.title}</strong>
          <small className="text-muted">{i18n.t('JustNow')}</small>
        </Toast.Header>
        <Toast.Body>{props.description}</Toast.Body>
      </Toast>
    </ToastContainer>
  )
}

export default EmailToast
