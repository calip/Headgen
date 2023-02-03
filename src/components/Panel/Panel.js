import React, { useState } from 'react'
import './Panel.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCogs, faEraser } from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames'
import {
  Button,
  Col,
  Dropdown,
  DropdownButton,
  FormControl,
  FormGroup,
  FormLabel,
  Row
} from 'react-bootstrap'
import Dialog from '../Dialog/Dialog'
import Helpers from '../../utils/Helpers'
import i18n from '../../utils/i18n'

function Panel({ toggle, isOpen, layout, items, template, config, resetSession }) {
  const currentTemplate = config.templates.find((item) => item.id === items.inputItem.template)
  const [show, setShow] = useState(false)
  const min = 1000
  const max = 10000

  const minPadding = 0
  const maxPadding = 100

  const onTextWidthBlur = (event) => {
    let value = Math.max(Number(min), Math.min(Number(max), Number(event.target.value)))
    layout.setLayoutWidth(value)
  }

  const onTextHeightBlur = (event) => {
    let value = Math.max(Number(min), Math.min(Number(max), Number(event.target.value)))
    layout.setLayoutHeight(value)
  }

  const onLayoutWidthChange = (event) => {
    layout.setLayoutWidth(event.target.value)
  }

  const onLayoutHeightChange = (event) => {
    layout.setLayoutHeight(event.target.value)
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

  const showDialog = () => {
    setShow((show) => !show)
  }

  const clearSession = () => {
    resetSession()
    setShow(false)
  }

  const onTemplateChange = (eventkey) => {
    const temp = template.templates.find((i) => i.id === Math.abs(eventkey))
    template.setInputTemplate(temp)
    let input = items.inputItem
    input.template = temp.id
    items.setInputItem((prevState) => {
      return { ...prevState, [items]: input.items }
    })
    Helpers.storeInputItem(config, items.inputItem)
  }

  return (
    <div className={classNames('panel', { 'is-open': isOpen })}>
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
              <FormGroup className="mb-3" controlId="formGroupEmail">
                <FormLabel>{i18n.t('Width')} (px) </FormLabel>
                <FormControl
                  className="form-control-sm"
                  type="number"
                  name="width"
                  min={1000}
                  max={10000}
                  value={layout.layoutWidth}
                  onBlur={onTextWidthBlur}
                  onChange={onLayoutWidthChange}
                  placeholder="100"
                  aria-label="100"
                />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup className="mb-3" controlId="formGroupEmail">
                <FormLabel>{i18n.t('Height')} (px) </FormLabel>
                <FormControl
                  className="form-control-sm"
                  type="number"
                  name="height"
                  value={layout.layoutHeight}
                  onBlur={onTextHeightBlur}
                  onChange={onLayoutHeightChange}
                  placeholder="100"
                  aria-label="100"
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormGroup className="mb-3" controlId="formGroupEmail">
                <FormLabel>{i18n.t('Padding')} (px)</FormLabel>
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
            <Col></Col>
          </Row>
        </div>
        <h6 className="mb-3">{i18n.t('Resolution')}</h6>
        <div className="panel-container">
          <Row>
            <Col>
              <FormGroup className="mb-3" controlId="formGroupEmail">
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
      </div>
      <Dialog
        show={show}
        dialogFn={showDialog}
        title={i18n.t('ClearSession')}
        description={i18n.t('ClearConfirmation')}
        actionFn={clearSession}
      />
    </div>
  )
}

export default Panel
