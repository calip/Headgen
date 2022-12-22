import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloud, faMinus, faPlus, faQuestion, faTimes } from '@fortawesome/free-solid-svg-icons'
import {
  Nav,
  Button,
  InputGroup,
  FormControl,
  Spinner,
  DropdownButton,
  Dropdown
} from 'react-bootstrap'
import classNames from 'classnames'
import Helpers from '../../utils/Helpers'
import File from '../Dialog/File'
import './Sidebar.scss'
import i18n from '../../utils/i18n'
import { useDebouncedCallback } from 'use-debounce'

function SideBar({ toggle, isOpen, items, icons, template, config }) {
  const [showLoad, setShowLoad] = useState(false)

  const showDialog = () => {
    setShowLoad((showLoad) => !showLoad)
  }

  const loadJson = () => {
    console.log('load json')
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

  const addInputItem = () => {
    const font =
      template.inputTemplate.fonts[
        items.inputItem.items.length % template.inputTemplate.fonts.length
      ]
    const max = config.input.max
    const currentLength = Math.max(...items.inputItem.items.map((e) => e.order)) + 1
    let id = Helpers.getRandomId()
    const item = {
      id: id,
      headline: false,
      realText: '',
      spokenText: '',
      icon: '',
      font: font,
      fontPadding: 0,
      fontTransition: '',
      fontSpacing: '',
      iconDisplay: '',
      order: currentLength
    }

    const inputItem = [...items.inputItem.items, item]
    const temp = items.inputItem
    temp.items = inputItem

    if (max) {
      if (currentLength <= max) {
        items.setInputItem((prevState) => {
          return { ...prevState, [items]: temp.items }
        })
      }
    } else {
      items.setInputItem((prevState) => {
        return { ...prevState, [items]: temp.items }
      })
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
            type="text"
            className="pix-input"
            placeholder={`${i18n.t('Title')}...`}
            defaultValue={items.inputItem.title}
            onChange={(e) => handleTitleChange(e.target.value)}
          />
        </div>
        {items.inputItem.items
          .sort((a, b) => a.order - b.order)
          .map((item, index) => {
            return (
              <div className="flex-column p-1" key={item.id}>
                <InputGroup>
                  <Button variant="outline-default" onClick={removeInputItem(item.id)}>
                    <FontAwesomeIcon icon={faMinus} />
                  </Button>
                  <FormControl
                    type="text"
                    className="pix-input"
                    placeholder={`${i18n.t('TypeHere')}...`}
                    defaultValue={item.realText}
                    data-index={item.id}
                    onKeyDown={() => loadSpinner(index)}
                    onChange={(e) => handleRealTextChange(e.target.value, index)}
                  />
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
                      <DropdownButton
                        variant="outline-white"
                        id="icon-style"
                        data-index={item.id}
                        title={
                          item.icon === '' ? (
                            <div className="icon-placeholder">
                              <FontAwesomeIcon icon={faQuestion} />
                            </div>
                          ) : (
                            <img
                              src={Helpers.getIconForButton(icons, item.icon)}
                              width="60"
                              alt={item.icon}
                            />
                          )
                        }
                        onSelect={onIconChange(index)}>
                        {renderDropdownIcon(index)}
                      </DropdownButton>
                    )}
                  </div>
                  <FormControl
                    type="text"
                    className="pix-input"
                    placeholder={`${i18n.t('TypeHere')}...`}
                    defaultValue={item.spokenText}
                    data-index={item.id}
                    onChange={(e) => handleSpokenTextChange(e.target.value, index)}
                  />
                </InputGroup>
              </div>
            )
          })}
        <Button variant="outline-primary" onClick={addInputItem}>
          <FontAwesomeIcon icon={faPlus} /> {i18n.t('Add')}
        </Button>
        <hr />
        <Button variant="outline-primary" onClick={showDialog}>
          <FontAwesomeIcon icon={faCloud} /> {i18n.t('Load')}
        </Button>
      </Nav>
      <File show={showLoad} dialogFn={showDialog} actionFn={loadJson} />
    </div>
  )
}

export default SideBar
