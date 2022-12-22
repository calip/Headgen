import { Button, Modal } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import '../../utils/i18n'

function Dialog({ show, dialogFn, actionFn }) {
  const { t } = useTranslation()

  return (
    <>
      <Modal show={show} onHide={dialogFn}>
        <Modal.Header closeButton>
          <Modal.Title>{t('ClearSession')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{t('ClearConfirmation')}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={dialogFn}>
            {t('No')}
          </Button>
          <Button variant="primary" onClick={actionFn}>
            {t('Yes')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Dialog
