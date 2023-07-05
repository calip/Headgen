import { useEffect, useState } from 'react'
import './Panel.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCogs, faEraser, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames'
import {
  Button,
  Card,
  Col,
  Dropdown,
  DropdownButton,
  FormCheck,
  FormControl,
  FormGroup,
  FormLabel,
  Row
} from 'react-bootstrap'
import Dialog from '../Dialog/Dialog'
import Helpers from '../../utils/Helpers'
import i18n from '../../utils/i18n'
import FormatDialog from '../Tools/Format/FormatDialog'

function Panel({
  toggle,
  isOpen,
  layout,
  items,
  template,
  config,
  format,
  admin,
  wp,
  selectItem,
  currency,
  resetSession,
  showTutorial
}) {
  const currentTemplate = config.templates.find((item) => item.id === items.inputItem.template)
  const currentWidth = items.inputItem.width
  const currentHeight = items.inputItem.height
  const currentFormat = items.inputItem.format
  const currentvariation = items.inputItem.variation

  const [show, setShow] = useState(false)
  const [showFormat, setShowFormat] = useState(false)

  const min = 1000
  const max = 10000
  const minPadding = 0
  const maxPadding = 100

  useEffect(() => {
    if (items.initFormat) {
      if (selectItem.selectedProduct && selectItem.selectedVariation) {
        selectFormat(selectItem.selectedProduct, selectItem.selectedVariation)
        selectItem.setSelectedProduct(null)
        selectItem.setSelectedVariation(null)
      } else {
        setShowFormat(true)
      }
    }
  })

  const onTextWidthBlur = (event) => {
    let value = Math.max(Number(min), Math.min(Number(max), Number(event.target.value)))
    layout.setLayoutWidth(value)

    let temp = items.inputItem
    temp.width = Math.abs(value)
    Helpers.saveInputToLocalStorage(items, config, temp.items)
  }

  const onTextHeightBlur = (event) => {
    let value = Math.max(Number(min), Math.min(Number(max), Number(event.target.value)))
    layout.setLayoutHeight(value)

    let temp = items.inputItem
    temp.height = Math.abs(value)
    Helpers.saveInputToLocalStorage(items, config, temp.items)
  }

  const onLayoutWidthChange = (event) => {
    layout.setLayoutWidth(event.target.value)

    let temp = items.inputItem
    temp.width = Math.abs(event.target.value)
    Helpers.saveInputToLocalStorage(items, config, temp.items)
  }

  const onLayoutHeightChange = (event) => {
    layout.setLayoutHeight(event.target.value)

    let temp = items.inputItem
    temp.height = Math.abs(event.target.value)
    Helpers.saveInputToLocalStorage(items, config, temp.items)
  }

  const onLayoutDpcChange = (event) => {
    layout.setLayoutDpc(event.target.value)
  }

  const onLayoutPaddingChange = (event) => {
    layout.setLayoutPadding(event.target.value)
  }

  const onPaddingBlur = (event) => {
    let value = Math.max(
      Number(minPadding),
      Math.min(Number(maxPadding), Number(event.target.value))
    )
    layout.setLayoutPadding(value)
  }

  const onBorderChange = (event) => {
    layout.setLayoutBorder(event.target.checked)
  }

  const showDialog = () => {
    setShow((show) => !show)
  }

  const showFormatDialog = () => {
    setShowFormat((showFormat) => !showFormat)
  }

  const clearSession = () => {
    resetSession()
    setShow(false)
  }

  const selectFormat = (inputFormat, variation) => {
    layout.setLayoutFormat(inputFormat.id)
    layout.setLayoutWidth(variation.width)
    layout.setLayoutHeight(variation.height)
    items.setInitFormat(false)

    let temp = items.inputItem
    temp.format = inputFormat
    temp.variation = variation
    temp.width = variation.width
    temp.height = variation.height
    showTutorial()
    Helpers.saveInputToLocalStorage(items, config, temp.items)
  }

  const onTemplateChange = (eventkey) => {
    const temp = template.templates.find((i) => i.id === Math.abs(eventkey))
    template.setInputTemplate(temp)
    let input = items.inputItem
    input.template = temp.id

    Helpers.saveInputToLocalStorage(items, config, temp.items)
  }

  return (
    <div className={classNames('pixgen-panel', { 'is-open': isOpen })}>
      <div className="panel-button">
        <button onClick={toggle}>
          <FontAwesomeIcon icon={faCogs} />
        </button>
      </div>
      <div className="panel-nav flex-column p-3">
        <h6 className="mb-3">{i18n.t('Layout')}</h6>
        <div className="panel-container">
          <Row>
            <Col>
              <FormGroup className="mb-3">
                <Card className="format-card" onClick={showFormatDialog}>
                  <Card.Body className="format-body">
                    <div className="format-title">
                      {Helpers.getSelectedFormat(format, currentFormat?.id)?.name}
                    </div>
                    <div className="format-content">
                      <img src={Helpers.getSelectedFormat(format, currentFormat?.id)?.preview} />
                      {currentvariation?.price ? (
                        <div className="format-price" key={currentvariation?.price}>
                          {currency.currencyPosition === 'left_space' ? (
                            <span
                              dangerouslySetInnerHTML={{
                                __html: `${currency.currencySymbol}${currentvariation?.price}`
                              }}
                            />
                          ) : (
                            <span
                              dangerouslySetInnerHTML={{
                                __html: `${currentvariation?.price}${currency.currencySymbol}`
                              }}
                            />
                          )}
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </Card.Body>
                  <Card.Footer className="format-footer">
                    {Helpers.showFormatSize(currentWidth, currentHeight)}
                  </Card.Footer>
                </Card>
              </FormGroup>
            </Col>
          </Row>
          {admin.isAdmin ? (
            <>
              <Row>
                <Col>
                  <FormGroup className="mb-3">
                    <FormLabel>
                      {i18n.t('Height')} ({currentvariation?.unit})
                    </FormLabel>
                    <FormControl
                      className="form-control-sm"
                      type="number"
                      name="height"
                      value={currentHeight}
                      onBlur={onTextHeightBlur}
                      onChange={onLayoutHeightChange}
                      placeholder="100"
                      aria-label="100"
                    />
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup className="mb-3">
                    <FormLabel>
                      {i18n.t('Width')} ({currentvariation?.unit})
                    </FormLabel>
                    <FormControl
                      className="form-control-sm"
                      type="number"
                      name="width"
                      min={1000}
                      max={10000}
                      value={currentWidth}
                      onBlur={onTextWidthBlur}
                      onChange={onLayoutWidthChange}
                      placeholder="100"
                      aria-label="100"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormGroup className="mb-3">
                    <FormLabel>
                      {i18n.t('Padding')} ({currentvariation?.unit})
                    </FormLabel>
                    <FormControl
                      className="form-control-sm"
                      type="number"
                      name="padding"
                      value={layout.layoutPadding}
                      onBlur={onPaddingBlur}
                      onChange={onLayoutPaddingChange}
                      placeholder="100"
                      aria-label="100"
                    />
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup className="mb-3">
                    <FormLabel>{i18n.t('Border')}</FormLabel>
                    <FormCheck
                      type="switch"
                      checked={layout.layoutBorder}
                      onChange={onBorderChange}
                      label={i18n.t('Border')}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </>
          ) : (
            <></>
          )}
        </div>
        {admin.isAdmin ? (
          <>
            <h6 className="mb-3">{i18n.t('Resolution')}</h6>
            <div className="panel-container">
              <Row>
                <Col>
                  <FormGroup className="mb-3">
                    <FormLabel>{i18n.t('DPC')}</FormLabel>
                    <FormControl
                      className="form-control-sm"
                      type="number"
                      name="dpc"
                      defaultValue={layout.layoutDpc}
                      onChange={onLayoutDpcChange}
                      placeholder="100"
                      aria-label="100"
                    />
                  </FormGroup>
                </Col>
                <Col></Col>
              </Row>
            </div>
          </>
        ) : (
          <></>
        )}
        <hr />
        <h6 className="mb-3">{i18n.t('Template')}</h6>
        <div className="panel-container">
          <DropdownButton
            variant="outline-dark"
            className={'font-style-dropdown ps-1'}
            disabled={currentTemplate == null}
            id="font-space"
            title={currentTemplate.name ?? 'Templates'}
            onSelect={onTemplateChange}>
            {template.templates.map((temp) => (
              <Dropdown.Item eventKey={temp.id} key={temp.id}>
                <label className={temp.id}>
                  {temp.name} {JSON.stringify(temp.layout)}
                </label>
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </div>
        <hr />
        <div className="panel-container">
          <Button variant="outline-secondary" onClick={showDialog}>
            <FontAwesomeIcon icon={faEraser} /> {i18n.t('ClearSession')}
          </Button>
        </div>
        <hr />
        <div className="panel-container">
          <Button variant="outline-secondary" onClick={showTutorial}>
            <FontAwesomeIcon icon={faInfoCircle} /> {i18n.t('ShowTutorial')}
          </Button>
        </div>
      </div>
      <Dialog
        show={show}
        dialogFn={showDialog}
        title={i18n.t('ClearSession')}
        description={i18n.t('ClearConfirmation')}
        actionFn={clearSession}
      />
      <FormatDialog
        show={showFormat}
        config={config}
        wp={wp}
        currency={currency}
        format={format}
        onHide={() => setShowFormat(false)}
        title={i18n.t('Format')}
        description={i18n.t('FormatSelection')}
        actionfn={selectFormat}
      />
    </div>
  )
}

export default Panel
