import React, { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'
import { Nav, Button, InputGroup, FormControl, Dropdown } from 'react-bootstrap'
import classNames from 'classnames'
import Helpers from '../../utils/Helpers'
import './Sidebar.scss'
import i18n from '../../utils/i18n'
import { useDebouncedCallback } from 'use-debounce'
import ErrorDialog from '../Dialog/ErrorDialog'
import EmailToast from '../Tools/Toast/EmailToast'
import SendDialog from '../Dialog/SendDialog'
import sendMail from '../../utils/sendMail'

function SideBar({ toggle, isOpen, items, icons, template, config, admin, selectText }) {
  const [showDialog, setShowDialog] = useState(false)
  const [canSave, setCanSave] = useState(false)
  const [emailDialog, setEmailDialog] = useState(false)
  const [showEmailToast, setShowEmailToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [dataUrl, setDataUrl] = useState()
  const scrollRef = useRef()
  const emailRef = useRef('')

  const dropdownRefs = useRef([])
  const realRefs = useRef([])
  const spokenRefs = useRef([])
  const titleRef = useRef()

  // console.log(items.inputItem.items)
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
    selectText.setClickTitle(true)
    selectText.setClickItem(false)
    selectText.setTextItem()
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
        const url = `${window.location.origin}?pixgen=${Helpers.encodeJsonData(items)}`
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
    tempItems[index].loading = false
    dropdownRefs.current[index].click()
    const selectedIcon = filteredIcons.length >= 1 ? filteredIcons[0]?.name : ''
    tempItems[index].previousIcon = tempItems[index].previousIcon
      ? tempItems[index].previousIcon
      : Helpers.getIcon(icons, selectedIcon)

    const previousIcon = tempItems[index].previousIcon ? tempItems[index].previousIcon.name : ''
    tempItems[index].icon = selectedIcon.length > 0 ? selectedIcon : previousIcon
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
      tempItems[index].font = currentTemplate.fonts[0]
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
    const prevIcon = icons.find((i) => i.name.toLowerCase() === event.toLowerCase())
    tempItems[index].previousIcon = prevIcon
    temp.items = tempItems
    items.setInputItem((prevState) => {
      return { ...prevState, [items]: temp.items }
    })
    Helpers.storeInputItem(config, items.inputItem)
  }

  const handleTitleChange = useDebouncedCallback((value) => {
    let temp = items.inputItem
    if (temp.font.length <= 0) {
      temp.font = currentTemplate.fontTitle
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
    const font = currentTemplate.fonts[items.inputItem.items.length % currentTemplate.fonts.length]
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
    if (items.inputItem.items[index].previousIcon) {
      expectedIcons.unshift(items.inputItem.items[index].previousIcon)
    }
    expectedIcons = expectedIcons.filter((item, index) => {
      return expectedIcons.indexOf(item) == index
    })

    return (
      <>
        {expectedIcons.map((icon, index) => (
          <Dropdown.Item eventKey={icon.name} key={index}>
            <img
              src={`${Helpers.getBaseUrl()}${Helpers.getIconForButton(icons, icon.name)}`}
              width="30"
              alt={icon.name}
            />
            {config.input.showTitle ? icon.name : ''}
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
            className={`form-control-sm ${selectText.clickTitle ? '' : 'greyed-out'}`}
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
                    <Button
                      variant="outline-default"
                      className="pixremove-button"
                      onClick={removeInputItem(item.id)}>
                      <FontAwesomeIcon icon={faMinus} />
                    </Button>
                    <>
                      <FormControl
                        type="text"
                        className={`form-control-sm ${
                          item.id !== selectText.textItem ? 'greyed-out' : ''
                        }`}
                        ref={(el) => (realRefs.current[item.id] = el)}
                        placeholder={`${i18n.t('TypeHere')}...`}
                        defaultValue={item.realText}
                        key={item.id}
                        data-index={item.id}
                        onKeyDown={() => loadSpinner(index)}
                        onClick={() => inputItemClicked(item.id)}
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
                              src={`${Helpers.getBaseUrl()}${Helpers.getIconForButton(
                                icons,
                                config.input.placeholderIcon
                              )}`}
                              width="30"
                              alt={config.input.placeholderIcon}
                            />
                          ) : (
                            <img
                              src={`${Helpers.getBaseUrl()}${Helpers.getIconForButton(
                                icons,
                                item.icon
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
                        className={`form-control-sm ${
                          item.id !== selectText.textItem ? 'greyed-out' : ''
                        }`}
                        ref={(el) => (spokenRefs.current[item.id] = el)}
                        placeholder={`${i18n.t('TypeHere')}...`}
                        key={item.id}
                        defaultValue={item.spokenText}
                        data-index={item.id}
                        onClick={() => inputItemClicked(item.id)}
                        onChange={(e) => handleSpokenTextChange(e.target.value, index)}
                      />
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
    </div>
  )
}

export default SideBar
