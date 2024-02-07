import React, { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationCircle, faMinus, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'
import { Nav, Button, InputGroup, FormControl, Dropdown, OverlayTrigger } from 'react-bootstrap'
import classNames from 'classnames'
import Helpers from '../../utils/Helpers'
import './Sidebar.scss'
import i18n from '../../utils/i18n'
import { useDebouncedCallback } from 'use-debounce'
import ErrorDialog from '../Dialog/ErrorDialog'
import EmailToast from '../Tools/Toast/EmailToast'
import SendDialog from '../Dialog/SendDialog'
import sendMail from '../../utils/sendMail'

function SideBar({
  toggle,
  isOpen,
  items,
  icons,
  template,
  config,
  admin,
  selectText,
  downloading
}) {
  const [showDialog, setShowDialog] = useState(false)
  const [canSave, setCanSave] = useState(false)
  const [emailDialog, setEmailDialog] = useState(false)
  const [showEmailToast, setShowEmailToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [dataUrl, setDataUrl] = useState()
  const [newItemAdded, setNewItemAdded] = useState(false)
  const [overlapCanvas, setOverlapCanvas] = useState(false)
  const [overlapIndex, setOverlapIndex] = useState(null)
  const [isNewRow, setIsNewRow] = useState(false)
  const [showInputError, setShowInputError] = useState(false)
  const scrollRef = useRef()
  const emailRef = useRef('')

  const dropdownRefs = useRef([])
  const realRefs = useRef([])
  const spokenRefs = useRef([])
  const titleRef = useRef()

  const currentTemplate = template.templates.find((item) => item.id === items.inputItem.template)

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

  const handleEmailChange = (value) => {
    const regex = /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,8}(.[a-z{2,8}])?/g
    if (regex.test(value)) {
      setEmailDialog(true)
    } else {
      setEmailDialog(false)
    }
  }

  const inputTitleClicked = () => {
    if (!items?.inputItem?.placeholder) {
      selectText.setClickTitle(true)
      selectText.setClickItem(false)
      selectText.setTextItem()
    }
  }

  const inputItemClicked = (id) => {
    selectText.setClickTitle(false)
    selectText.setClickItem(true)
    selectText.setTextItem(id)
  }

  const showConfirmDialog = () => {
    if (!showDialog) {
      const items = Helpers.getInputItem(config)
      if (items) {
        const url = `${
          config.wordpress.baseUrl
        }${Helpers.getBaseUrl()}/?pixgen=${Helpers.encodeJsonData(items)}`
        setDataUrl(url)
      }
    }
    setShowDialog((showDialog) => !showDialog)
  }

  const closeEmailToast = () => {
    setShowEmailToast(false)
  }

  const sendToEmail = () => {
    const email = emailRef.current.value
    const jsonData = {
      email: email,
      apikey: config.mail.apikey,
      subject: i18n.t('EmailSubject'),
      greeting: `${i18n.t('Greeting')} ${email}`,
      text: i18n.t('LinkDescription'),
      button: i18n.t('Open'),
      url: dataUrl
    }
    sendMail(config.mail.apiurl, jsonData).then((res) => {
      if (res.status) {
        setShowEmailToast(true)
        setToastMessage(res.message)
        emailRef.current.value = ''
        setDataUrl()
      }
    })
    setShowDialog(false)
  }

  const handleRealTextChange = useDebouncedCallback((value, index) => {
    let temp = items.inputItem
    let tempItems = temp.items.map((i) => i)
    tempItems[index].realText = value
    if (tempItems[index].font.length <= 0) {
      tempItems[index].font = currentTemplate.fonts[0]
    }

    let filteredIcons = []
    if (tempItems[index].realText.length > 0) {
      filteredIcons = icons
        .filter((element) => {
          const tags = element.tags.map((tag) => tag.toLowerCase())
          const arrName = element.name
            .toLowerCase()
            .includes(items.inputItem.items[index].realText.toLowerCase())
          const arrTags = tags.some((subElement) =>
            subElement.includes(items.inputItem.items[index].realText.toLowerCase())
          )
          return arrName || arrTags
        })
        .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
    }

    if (filteredIcons.length <= 0 || tempItems[index].realText === '') {
      tempItems[index].icon = ''
    }
    if (tempItems[index].realText === '') {
      tempItems[index].previousIcon = null
    }
    dropdownRefs.current[index].click()
    const selectedIcon = filteredIcons.length >= 1 ? filteredIcons[0]?.name : ''
    tempItems[index].previousIcon = tempItems[index].previousIcon
      ? tempItems[index].previousIcon
      : Helpers.getIcon(icons, selectedIcon)

    const previousIcon = tempItems[index].previousIcon ? tempItems[index].previousIcon.name : ''
    tempItems[index].icon = selectedIcon.length > 0 ? selectedIcon : previousIcon
    tempItems[index].previousIcon = Helpers.getIcon(icons, tempItems[index].icon)
    temp.items = tempItems
    Helpers.saveInputToLocalStorage(items, config, temp.items)
  }, 1000)

  const handleSpokenTextChange = useDebouncedCallback((value, index) => {
    let temp = items.inputItem
    let tempItems = temp.items.map((i) => i)
    tempItems[index].spokenText = value
    if (tempItems[index].font.length <= 0) {
      tempItems[index].font = currentTemplate.fonts[0]
    }

    temp.items = tempItems
    Helpers.saveInputToLocalStorage(items, config, temp.items)
  }, 1000)

  const onIconChange = (index) => (event) => {
    let temp = items.inputItem
    let tempItems = temp.items.map((i) => i)
    tempItems[index].icon = event
    const prevIcon = icons.find((i) => i.name.toLowerCase() === event.toLowerCase())
    tempItems[index].previousIcon = prevIcon
    temp.items = tempItems
    Helpers.saveInputToLocalStorage(items, config, temp.items)
  }

  const handleTitleChange = useDebouncedCallback((value) => {
    let temp = items.inputItem
    if (temp.font.length <= 0) {
      temp.font = currentTemplate.fontTitle
    }

    temp.title = value
    Helpers.saveInputToLocalStorage(items, config, temp.items)
  }, 1000)

  useEffect(() => {
    const divElement = scrollRef.current
    if (divElement && newItemAdded) {
      divElement.scrollTo({ top: divElement.scrollHeight, behavior: 'smooth' })
      setNewItemAdded(false)
    }
  }, [items.inputItem.items, newItemAdded])

  useEffect(() => {
    setTimeout(() => {
      const canvasElement = document.querySelector('.pixgen-canvas-container')
      const titleElement = document.querySelector('.pix-title-container')
      const itemElement = document.querySelectorAll(`.pix-item`)
      let totalItemHeight = 0
      let containerElement = 0
      let totalRenderElement = 0
      let overlapItem = 0
      let overIndex = []
      if (itemElement && titleElement && canvasElement) {
        containerElement = parseInt(canvasElement.getBoundingClientRect().height)
        itemElement.forEach((item) => {
          totalItemHeight += parseInt(item.getBoundingClientRect().height)
          overlapItem = parseInt(titleElement.getBoundingClientRect().height + totalItemHeight)
          if (overlapItem >= containerElement) {
            item.childNodes.forEach((i) => {
              overIndex.push(i.id)
            })
          }
        })
        setOverlapIndex(overIndex)
        totalRenderElement = parseInt(titleElement.getBoundingClientRect().height + totalItemHeight)
        const maxPercent = (totalRenderElement * 5) / 100
        const totalElementSize = totalRenderElement + Math.abs(maxPercent)
        setOverlapCanvas(totalElementSize >= containerElement)
      }
    }, 0)
  })

  useEffect(() => {
    const filterItems = items.inputItem.items.filter((e) => {
      return e.realText.length > 0 || e.icon.length > 0 || e.spokenText.length > 0
    })

    let content = []
    let newItemRow = false
    let start = 0
    let count = 0
    while (count < filterItems.length) {
      template.inputTemplate.layout.map((temp) => {
        count = count + temp
        const dataItems = filterItems.sort((a, b) => a.order - b.order).slice(start, count)
        start = start + temp
        const lastItem = filterItems[filterItems.length - 1]
        const filterLastItem = dataItems.filter((c) => c === lastItem)
        if (filterLastItem.length > 0) {
          newItemRow = dataItems.length === temp
        }
        if (dataItems.length > 0) {
          content.push(dataItems)
        }
      })
    }
    if (filterItems.length > count) {
      count = 0
    }
    setIsNewRow(newItemRow)
  }, [items.inputItem, overlapCanvas])

  const addInputItem = () => {
    setOverlapCanvas(false)
    const font = currentTemplate.fonts[items.inputItem.items.length % currentTemplate.fonts.length]
    const max = config.input.max
    const currentLength = Math.max(...items.inputItem.items.map((e) => e.order)) + 1

    let setItem = Helpers.setItems()
    setItem.font = font
    setItem.order = currentLength
    const newItem = setItem

    if (isNewRow && overlapCanvas) {
      setShowInputError(true)
      return
    }

    const currentInput = items.inputItem.items.sort((a, b) => a.order - b.order)
    const lastInput = currentInput[currentInput.length - 1]

    if (
      lastInput &&
      lastInput.realText.length <= 0 &&
      lastInput.icon.length <= 0 &&
      lastInput.spokenText.length <= 0 &&
      overlapCanvas
    ) {
      setShowInputError(true)
      return
    }

    if (max) {
      if (currentLength >= max) {
        return
      }
      const inputItem = [...items.inputItem.items, newItem]
      const newTemp = items.inputItem
      newTemp.items = inputItem
      items.setInputItem((prevState) => {
        return { ...prevState, items: newTemp.items }
      })
      setNewItemAdded(true)
    } else {
      const inputItem = [...items.inputItem.items, newItem]
      const newTemp = items.inputItem
      newTemp.items = inputItem
      items.setInputItem((prevState) => {
        return { ...prevState, items: newTemp.items }
      })
      setNewItemAdded(true)
    }
  }

  const removeInputItem = (id) => () => {
    const reducedItems = items.inputItem.items && items.inputItem.items.filter((r) => r.id !== id)

    setOverlapCanvas(false)
    const temp = items.inputItem
    temp.items = reducedItems
    Helpers.saveInputToLocalStorage(items, config, temp.items)
  }

  const renderDropdownIcon = (index) => {
    let filteredIcons = []
    if (items.inputItem.items[index].realText.length > 0) {
      filteredIcons = icons
        .filter((element) => {
          const tags = element.tags.map((tag) => tag.toLowerCase())
          const arrName = element.name
            .toLowerCase()
            .includes(items.inputItem.items[index].realText.toLowerCase())
          const arrTags = tags.some((subElement) =>
            subElement.includes(items.inputItem.items[index].realText.toLowerCase())
          )
          return arrName || arrTags
        })
        .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
    }
    const defaultIcons = icons.filter((icon) =>
      config.input.defaultIcon.includes(icon.name.toLowerCase())
    )

    let expectedIcons = filteredIcons.concat(defaultIcons)
    if (
      items.inputItem.items[index].previousIcon &&
      !expectedIcons.find((i) => i.name === items.inputItem.items[index].previousIcon.name)
    ) {
      expectedIcons.unshift(items.inputItem.items[index].previousIcon)
    }
    expectedIcons = expectedIcons.filter((item, index) => {
      return expectedIcons.indexOf(item) == index
    })

    return (
      <>
        {expectedIcons.map((icon, i) => (
          <Dropdown.Item eventKey={icon.name} key={i}>
            <img
              src={`${Helpers.getBaseUrl()}${decodeURI(
                Helpers.getIconForButton(icons, icon.name)
              )}`}
              width="30"
              alt={icon.name}
            />
            {config.input.showTitle
              ? findIconLabel(icon, items.inputItem.items[index]?.realText.toLowerCase())
              : ''}
          </Dropdown.Item>
        ))}
      </>
    )
  }

  const findIconLabel = (icon, text) => {
    const currentIcon = icon.tags.concat(icon.name)
    const tagName = currentIcon.find((subElement) =>
      subElement.toLowerCase().includes(text.toLowerCase())
    )
    return tagName ? tagName : icon.name
  }

  return (
    <div className={classNames('pixgen-sidebar shadow-sm', { 'is-open': isOpen })}>
      <div className="pixgen-sidebar-header p-3">
        <Button variant="link" size="sm" onClick={toggle} style={{ color: '#6c757d', margin: 0 }}>
          <FontAwesomeIcon icon={faTimes} pull="right" size="xs" />
        </Button>
        <h3>{config.appName}</h3>
      </div>

      <Nav className="flex-column p-2" style={{ height: '100%' }}>
        <div className="flex-column p-1">
          <FormControl
            ref={titleRef}
            type="text"
            key="title"
            className={`form-control-sm pixgen-word-entry ${
              selectText.clickTitle ? '' : 'greyed-out'
            }`}
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
                <div className="pix-field flex-column p-1" key={item.id}>
                  <InputGroup>
                    <Button
                      variant="outline-default"
                      className="pixremove-button"
                      onClick={removeInputItem(item.id)}>
                      <FontAwesomeIcon icon={faMinus} />
                    </Button>
                    <>
                      <FormControl
                        type="text"
                        className={`form-control-sm pixgen-word-entry ${
                          item.id !== selectText.textItem ? 'greyed-out' : ''
                        } ${
                          !downloading &&
                          overlapIndex &&
                          overlapIndex.find((o) => parseInt(o) === item.id)
                            ? 'input-overlap-error'
                            : ''
                        }`}
                        ref={(el) => (realRefs.current[item.id] = el)}
                        placeholder={`${i18n.t('IntendentWord')}...`}
                        defaultValue={item.realText}
                        key={item.id}
                        data-index={item.id}
                        onClick={() => {
                          if (!items?.inputItem?.placeholder) {
                            inputItemClicked(item.id)
                          }
                        }}
                        onChange={(e) => handleRealTextChange(e.target.value, index)}
                      />
                    </>
                    <div className="list-icon">
                      <Dropdown onSelect={onIconChange(index)}>
                        <Dropdown.Toggle
                          className="pixgen-dropdown-btn"
                          variant="outline-white"
                          id="icon-style"
                          size="sm"
                          ref={(el) => (dropdownRefs.current[index] = el)}>
                          {item.icon === '' ? (
                            <img
                              src={`${Helpers.getBaseUrl()}${decodeURI(
                                Helpers.getIconForButton(icons, config.input.placeholderIcon)
                              )}`}
                              width="30"
                              alt={config.input.placeholderIcon}
                            />
                          ) : (
                            <img
                              src={`${Helpers.getBaseUrl()}${decodeURI(
                                Helpers.getIconForButton(icons, item.icon)
                              )}`}
                              width="30"
                              alt={item.icon}
                            />
                          )}
                        </Dropdown.Toggle>
                        <Dropdown.Menu popperConfig={{ strategy: 'fixed' }}>
                          {renderDropdownIcon(index)}
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                    <>
                      <FormControl
                        type="text"
                        className={`form-control-sm pixgen-word-entry ${
                          item.id !== selectText.textItem ? 'greyed-out' : ''
                        } ${
                          !downloading &&
                          overlapIndex &&
                          overlapIndex.find((o) => parseInt(o) === item.id)
                            ? 'input-overlap-error'
                            : ''
                        }`}
                        ref={(el) => (spokenRefs.current[item.id] = el)}
                        placeholder={`${i18n.t('SpokenWord')}...`}
                        key={item.id}
                        defaultValue={item.spokenText}
                        data-index={item.id}
                        onClick={() => {
                          if (!items?.inputItem?.placeholder) {
                            inputItemClicked(item.id)
                          }
                        }}
                        onChange={(e) => handleSpokenTextChange(e.target.value, index)}
                      />
                      {!downloading &&
                      overlapIndex &&
                      overlapIndex.find((o) => parseInt(o) === item.id) ? (
                        <OverlayTrigger
                          placement="right"
                          overlay={Helpers.renderTooltip(i18n.t('ItemOverlapCanvas'))}>
                          <span>
                            <FontAwesomeIcon
                              style={{ color: '#b60000' }}
                              icon={faExclamationCircle}
                            />
                          </span>
                        </OverlayTrigger>
                      ) : (
                        <></>
                      )}
                    </>
                  </InputGroup>
                </div>
              )
            })}
        </div>
        <Button
          variant="outline-primary"
          className="pixadd-button "
          size="sm"
          onClick={addInputItem}>
          <FontAwesomeIcon icon={faPlus} /> {i18n.t('Add')}
        </Button>
        <hr />
        {admin.isAdmin ? (
          <InputGroup className="mb-3">
            <FormControl
              className="form-control-sm"
              ref={emailRef}
              type="email"
              required
              placeholder={i18n.t('Email')}
              aria-label={i18n.t('Email')}
              onChange={(e) => handleEmailChange(e.target.value)}
            />
            <Button
              type="submit"
              variant="primary"
              id="button-addon2"
              size="sm"
              disabled={!emailDialog}
              onClick={showConfirmDialog}>
              {i18n.t('Send')}
            </Button>
          </InputGroup>
        ) : (
          <></>
        )}
      </Nav>
      {canSave ? (
        <SendDialog
          show={showDialog}
          dialogFn={showConfirmDialog}
          title={i18n.t('SendToEmail')}
          description={i18n.t('SendToEmailDescription')}
          data={dataUrl}
          actionFn={sendToEmail}
        />
      ) : (
        <ErrorDialog
          show={showDialog}
          dialogFn={showConfirmDialog}
          title={i18n.t('CannotSave')}
          description={i18n.t('ContentIsEmpty')}
        />
      )}

      <EmailToast
        showToast={showEmailToast}
        description={toastMessage}
        onClose={closeEmailToast}
        title={i18n.t('SendToEmail')}
      />

      <ErrorDialog
        show={showInputError}
        dialogFn={() => setShowInputError((showInputError) => !showInputError)}
        title={i18n.t('AddWordEntryError')}
        description={i18n.t('AddWordEntryErrorDescription')}
      />
    </div>
  )
}

export default SideBar
