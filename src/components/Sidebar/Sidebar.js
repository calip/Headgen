import React, { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSave,
  faCloud,
  faMinus,
  faPlus,
  faQuestion,
  faTimes
} from '@fortawesome/free-solid-svg-icons'
import { Nav, Button, InputGroup, FormControl, Spinner, Dropdown } from 'react-bootstrap'
import classNames from 'classnames'
import Helpers from '../../utils/Helpers'
import File from '../Dialog/File'
import './Sidebar.scss'
import i18n from '../../utils/i18n'
import { useDebouncedCallback } from 'use-debounce'
import Dialog from '../Dialog/Dialog'
import saveFileAsJson from '../../utils/saveFileAsJson'
import ErrorDialog from '../Dialog/ErrorDialog'

function SideBar({ toggle, isOpen, items, icons, template, config, selectText, loadJsonData }) {
  const [showLoad, setShowLoad] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [canSave, setCanSave] = useState(false)
  const [json, setJson] = useState('')
  const scrollRef = useRef()

  const realRefs = useRef([])
  const spokenRefs = useRef([])
  const titleRef = useRef()

  useEffect(() => {
    const content = Helpers.getInputItem(config)
    if (content) {
      setCanSave(true)
    }
  })

  useEffect(() => {
    const real = realRefs.current[selectText.textItem]
    const spoken = spokenRefs.current[selectText.textItem]
    if (real && spoken) {
      real.classList.add('input-focus')
      spoken.classList.add('input-focus')
      selectText.setClickItem(false)
      selectText.setClickTitle(false)
    }
  })

  useEffect(() => {
    if (selectText.clickTitle) {
      const title = titleRef.current
      title.classList.add('input-focus')
      selectText.setClickItem(false)
    }
  })

  const inputTitleClicked = () => {
    selectText.setClickItem(false)
    selectText.setTextItem()
    selectText.setClickTitle(true)
  }

  const showFileDialog = () => {
    setShowLoad((showLoad) => !showLoad)
  }

  const showConfirmDialog = () => {
    setShowDialog((showDialog) => !showDialog)
  }

  const saveJson = () => {
    const items = Helpers.getInputItem(config)
    if (items) {
      saveFileAsJson(items, 'pixdata')
      setShowDialog(false)
    }
  }

  const loadJson = () => {
    const data = JSON.parse(json)
    loadJsonData(data)
    setShowLoad((showLoad) => !showLoad)
  }

  const handleRealTextChange = useDebouncedCallback((value, index) => {
    let temp = items.inputItem
    let tempItems = temp.items.map((i) => i)
    tempItems[index].realText = value
    if (tempItems[index].font.length <= 0) {
      tempItems[index].font = template.inputTemplate.fonts[0]
    }
    const filteredIcons = icons.filter((element) =>
      element.tags.some((subElement) =>
        subElement.includes(tempItems[index].realText.toLowerCase())
      )
    )
    if (filteredIcons.length <= 0 || tempItems[index].realText === '') {
      tempItems[index].icon = ''
    }
    tempItems[index].loading = false
    temp.items = tempItems
    items.setInputItem((prevState) => {
      return { ...prevState, [items]: temp.items }
    })
    Helpers.storeInputItem(config, items.inputItem)
  }, 1000)

  const handleSpokenTextChange = useDebouncedCallback((value, index) => {
    let temp = items.inputItem
    let tempItems = temp.items.map((i) => i)
    tempItems[index].spokenText = value
    if (tempItems[index].font.length <= 0) {
      tempItems[index].font = template.inputTemplate.fonts[0]
    }
    temp.items = tempItems
    items.setInputItem((prevState) => {
      return { ...prevState, [items]: temp.items }
    })
    Helpers.storeInputItem(config, items.inputItem)
  }, 1000)

  const onIconChange = (index) => (event) => {
    let temp = items.inputItem
    let tempItems = temp.items.map((i) => i)
    tempItems[index].icon = event
    temp.items = tempItems
    items.setInputItem((prevState) => {
      return { ...prevState, [items]: temp.items }
    })
    Helpers.storeInputItem(config, items.inputItem)
  }

  const handleTitleChange = useDebouncedCallback((value) => {
    let temp = items.inputItem
    if (temp.font.length <= 0) {
      temp.font = template.inputTemplate.fontTitle
    }
    temp.title = value
    items.setInputItem((prevState) => {
      return { ...prevState, [items]: temp.items }
    })
    Helpers.storeInputItem(config, items.inputItem)
  }, 1000)

  const setScrollFocus = () => {
    const divElement = scrollRef.current
    divElement.scrollTo({ top: divElement.scrollHeight, behavior: 'smooth' })
  }

  const addInputItem = () => {
    const font =
      template.inputTemplate.fonts[
        items.inputItem.items.length % template.inputTemplate.fonts.length
      ]
    const max = config.input.max
    const currentLength = Math.max(...items.inputItem.items.map((e) => e.order)) + 1

    let setItem = Helpers.setItems()
    setItem.font = font
    setItem.order = currentLength
    const item = setItem

    const inputItem = [...items.inputItem.items, item]
    const temp = items.inputItem
    temp.items = inputItem

    if (max) {
      if (currentLength <= max) {
        items.setInputItem((prevState) => {
          return { ...prevState, [items]: temp.items }
        })
        setScrollFocus()
      }
    } else {
      items.setInputItem((prevState) => {
        return { ...prevState, [items]: temp.items }
      })
      setScrollFocus()
    }
  }

  const removeInputItem = (id) => () => {
    const reducedItems = items.inputItem.items && items.inputItem.items.filter((r) => r.id !== id)

    const temp = items.inputItem
    temp.items = reducedItems
    items.setInputItem((prevState) => {
      return { ...prevState, [items]: temp.items }
    })
    Helpers.storeInputItem(config, items.inputItem)
  }

  const renderDropdownIcon = (index) => {
    let filteredIcons = []
    if (items.inputItem.items[index].realText.length > 0) {
      filteredIcons = icons.filter((element) =>
        element.tags.some((subElement) =>
          subElement.includes(items.inputItem.items[index].realText.toLowerCase())
        )
      )
    }

    const defaultIcons = icons.filter((icon) => config.input.defaultIcon.includes(icon.name))
    let expectedIcons = filteredIcons.concat(defaultIcons)
    expectedIcons = expectedIcons.filter((item, index) => {
      return expectedIcons.indexOf(item) == index
    })

    return (
      <>
        {expectedIcons.map((icon, index) => (
          <Dropdown.Item eventKey={icon.name} key={index}>
            <img src={Helpers.getIconForButton(icons, icon.name)} width="60" alt={icon.name} />
          </Dropdown.Item>
        ))}
      </>
    )
  }

  const loadSpinner = (index) => {
    let temp = items.inputItem
    let tempItems = temp.items.map((i) => i)
    tempItems[index].loading = true
    temp.items = tempItems
    items.setInputItem((prevState) => {
      return { ...prevState, [items]: temp.items }
    })
  }

  return (
    <div className={classNames('sidebar', { 'is-open': isOpen })}>
      <div className="sidebar-header p-3">
        <Button variant="link" onClick={toggle} style={{ color: '#6c757d', margin: 0 }}>
          <FontAwesomeIcon icon={faTimes} pull="right" size="xs" />
        </Button>
        <h3>{config.appName}</h3>
      </div>

      <Nav className="flex-column p-2">
        <div className="flex-column p-1">
          <FormControl
            ref={titleRef}
            type="text"
            key={items.inputItem.title}
            className={`pix-input ${selectText.clickTitle ? '' : 'greyed-out'}`}
            placeholder={`${i18n.t('Title')}...`}
            defaultValue={items.inputItem.title}
            onClick={inputTitleClicked}
            onChange={(e) => handleTitleChange(e.target.value)}
          />
        </div>
        <div className="input-container" ref={scrollRef}>
          {items.inputItem.items
            .sort((a, b) => a.order - b.order)
            .map((item, index) => {
              return (
                <div className="flex-column p-1" key={item.id}>
                  <InputGroup>
                    <Button variant="outline-default" onClick={removeInputItem(item.id)}>
                      <FontAwesomeIcon icon={faMinus} />
                    </Button>
                    <>
                      <FormControl
                        type="text"
                        className={`pix-input ${
                          item.id !== selectText.textItem ? 'greyed-out' : ''
                        }`}
                        ref={(el) => (realRefs.current[item.id] = el)}
                        placeholder={`${i18n.t('TypeHere')}...`}
                        defaultValue={item.realText}
                        key={item.id}
                        data-index={item.id}
                        onKeyDown={() => loadSpinner(index)}
                        onClick={() => selectText.setTextItem(item.id)}
                        onChange={(e) => handleRealTextChange(e.target.value, index)}
                      />
                    </>
                    <div className="list-icon">
                      {item.loading ? (
                        <button
                          type="button"
                          id="icon-spinner"
                          aria-expanded="false"
                          className="btn btn-outline-dark icon-input btn-icon-spinner">
                          <Spinner animation="border" size="sm" />
                        </button>
                      ) : (
                        <Dropdown onSelect={onIconChange(index)}>
                          <Dropdown.Toggle variant="outline-white" id="icon-style">
                            {item.icon === '' ? (
                              <div className="icon-placeholder">
                                <FontAwesomeIcon icon={faQuestion} />
                              </div>
                            ) : (
                              <img
                                src={Helpers.getIconForButton(icons, item.icon)}
                                width="60"
                                alt={item.icon}
                              />
                            )}
                          </Dropdown.Toggle>
                          <Dropdown.Menu popperConfig={{ strategy: 'fixed' }}>
                            {renderDropdownIcon(index)}
                          </Dropdown.Menu>
                        </Dropdown>
                      )}
                    </div>
                    <>
                      <FormControl
                        type="text"
                        className={`pix-input ${
                          item.id !== selectText.textItem ? 'greyed-out' : ''
                        }`}
                        ref={(el) => (spokenRefs.current[item.id] = el)}
                        placeholder={`${i18n.t('TypeHere')}...`}
                        key={item.id}
                        defaultValue={item.spokenText}
                        data-index={item.id}
                        onClick={() => selectText.setTextItem(item.id)}
                        onChange={(e) => handleSpokenTextChange(e.target.value, index)}
                      />
                    </>
                  </InputGroup>
                </div>
              )
            })}
        </div>
        <Button variant="outline-primary" onClick={addInputItem}>
          <FontAwesomeIcon icon={faPlus} /> {i18n.t('Add')}
        </Button>
        <hr />
        {config.admin ? (
          <>
            <Button variant="outline-primary" onClick={showConfirmDialog} className="mb-2">
              <FontAwesomeIcon icon={faSave} /> {i18n.t('Save')}
            </Button>
            <Button variant="outline-primary" onClick={showFileDialog}>
              <FontAwesomeIcon icon={faCloud} /> {i18n.t('Load')}
            </Button>
          </>
        ) : (
          <></>
        )}
      </Nav>
      {canSave ? (
        <Dialog
          show={showDialog}
          dialogFn={showConfirmDialog}
          title={i18n.t('SaveToFile')}
          description={i18n.t('SaveFileDescription')}
          actionFn={saveJson}
        />
      ) : (
        <ErrorDialog
          show={showDialog}
          dialogFn={showConfirmDialog}
          title={i18n.t('CannotSave')}
          description={i18n.t('ContentIsEmpty')}
        />
      )}
      <File show={showLoad} dialogFn={showFileDialog} actionFn={loadJson} setJson={setJson} />
    </div>
  )
}

export default SideBar
