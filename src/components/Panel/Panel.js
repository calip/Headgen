import { Fragment, useEffect, useState } from 'react'
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
  InputGroup,
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
  const currentVariation = items.inputItem.variation
  const currentUnit = items.inputItem.unit
  const currentBackgroundColor = items.inputItem.backgroundColor
  const currentFontColor = items.inputItem.fontColor

  const [show, setShow] = useState(false)
  const [showFormat, setShowFormat] = useState(false)

  const min = 1
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

  const onBackgroundColorChange = (event) => {
    layout.setLayoutBackgroundColor(event.target.value)

    let temp = items.inputItem
    temp.backgroundColor = event.target.value
    Helpers.saveInputToLocalStorage(items, config, temp.items)
  }

  const onResetBackgroundColor = () => {
    layout.setLayoutBackgroundColor(config.layout.backgroundColor)

    let temp = items.inputItem
    temp.backgroundColor = config.layout.backgroundColor
    Helpers.saveInputToLocalStorage(items, config, temp.items)
  }

  const onFontColorChange = (event) => {
    layout.setLayoutFontColor(event.target.value)

    let temp = items.inputItem
    temp.fontColor = event.target.value
    Helpers.saveInputToLocalStorage(items, config, temp.items)
  }

  const onResetFontColor = () => {
    layout.setLayoutFontColor(config.layout.fontColor)

    let temp = items.inputItem
    temp.fontColor = config.layout.fontColor
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
    const productTemplate = Helpers.getMetaProduct(variation.metadata, 'pixgen_template_select')
    const selectedProductTemplate = productTemplate ? Math.abs(productTemplate.value) : 1
    const selectTemplate = template.templates.find((i) => i.id === selectedProductTemplate)
    const productFonts = Helpers.getMetaProduct(variation.metadata, 'pixgen_font_select')
    const selectedProductFonts = productFonts ? productFonts.value : config.fonts
    const productFont = Helpers.getMetaProduct(variation.metadata, 'pixgen_font_check')
    const selectedProductFont = productFont
      ? Helpers.stringValueToBool(productFont.value)
      : config.toolbar.fontFamily
    const productSpace = Helpers.getMetaProduct(variation.metadata, 'pixgen_space_check')
    const selectedProductSpace = productSpace
      ? Helpers.stringValueToBool(productSpace.value)
      : config.toolbar.fontSpacing

    template.setInputTemplate(selectTemplate)
    layout.setLayoutFormat(inputFormat.id)
    layout.setLayoutWidth(variation.width)
    layout.setLayoutHeight(variation.height)
    layout.setLayoutUnit(variation.unit)
    items.setInitFormat(false)

    let temp = items.inputItem
    temp.format = inputFormat
    temp.variation = variation
    temp.width = variation.width
    temp.height = variation.height
    temp.unit = variation.unit
    temp.placeholder = true
    temp.template = selectTemplate.id
    temp.fonts = selectedProductFonts
    temp.fontSelection = selectedProductFont
    temp.spaceSelection = selectedProductSpace
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
                      {currentVariation?.price ? (
                        <div className="format-price" key={currentVariation?.price}>
                          {currency.currencyPosition === 'left_space' ? (
                            <span
                              dangerouslySetInnerHTML={{
                                __html: `${currency.currencySymbol}${currentVariation?.price}`
                              }}
                            />
                          ) : (
                            <span
                              dangerouslySetInnerHTML={{
                                __html: `${currentVariation?.price}${currency.currencySymbol}`
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
                    {Helpers.showFormatSize(currentWidth, currentHeight, currentUnit)}
                  </Card.Footer>
                </Card>
              </FormGroup>
            </Col>
          </Row>
          {admin.isAdmin ? (
            <Fragment key={currentUnit}>
              <Row>
                <Col>
                  <FormGroup className="mb-3">
                    <FormLabel>
                      {i18n.t('Height')} ({currentUnit})
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
                      {i18n.t('Width')} ({currentUnit})
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
                      {i18n.t('Padding')} ({currentUnit})
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
            </Fragment>
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
        <h6 className="mb-3">Color</h6>
        <div className="panel-container">
          <Row>
            <Col>
              <FormGroup className="mb-3">
                <FormLabel>{i18n.t('Background')}</FormLabel>
                <InputGroup className="mb-3">
                  <FormControl
                    className={`form-control-sm ${
                      currentBackgroundColor === 'transparent' ? 'crossed' : ''
                    }`}
                    type="color"
                    value={currentBackgroundColor}
                    onChange={onBackgroundColorChange}
                  />
                  <Button variant="outline-secondary" size="sm" onClick={onResetBackgroundColor}>
                    x
                  </Button>
                </InputGroup>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup className="mb-3">
                <FormLabel>{i18n.t('Font')}</FormLabel>
                <InputGroup className="mb-3">
                  <FormControl
                    className="form-control-sm"
                    type="color"
                    value={currentFontColor}
                    onChange={onFontColorChange}
                  />
                  <Button variant="outline-secondary" size="sm" onClick={onResetFontColor}>
                    x
                  </Button>
                </InputGroup>
              </FormGroup>
            </Col>
          </Row>
        </div>
        <hr />
        <h6 className="mb-3">{i18n.t('Template')}</h6>
        <div className="panel-container">
          <DropdownButton
            variant="outline-dark"
            className={'font-style-dropdown ps-1'}
            disabled={currentTemplate == null}
            id="font-space"
            size="sm"
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
          <Button variant="outline-secondary" size="sm" onClick={showDialog}>
            <FontAwesomeIcon icon={faEraser} /> {i18n.t('ClearSession')}
          </Button>
        </div>
        <hr />
        <div className="panel-container">
          <Button variant="outline-secondary" size="sm" onClick={showTutorial}>
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
