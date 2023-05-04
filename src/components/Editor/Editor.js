import React, { useEffect, useState, useRef } from 'react'
import { Container } from 'react-bootstrap'
import SideBar from '../Sidebar/Sidebar'
import Panel from '../Panel/Panel'
import exportAsImage from './../../utils/exportAsImage'
import Canvas from '../Canvas/Canvas'
import Navbar from '../Navbar/Navbar'
import Helpers from '../../utils/Helpers'
import { useTranslation } from 'react-i18next'
import '../../utils/i18n'
import './Editor.scss'
// import PreviewButton from '../Tools/Preview/PreviewButton'
// import PreviewDialog from '../Dialog/PreviewDialog'

function Editor({ config }) {
  const format = config.format
  const selectedFormat = config.layout.format
  const width = config.layout.width
  const height = config.layout.height
  const padding = config.layout.padding
  const dpc = config.layout.dpc
  const border = config.layout.border
  const icons = config.input.icons
  const templates = config.templates
  const language = config.language
  const sidebarOpen = Helpers.isTouchScreenDevice() ? false : true

  const [initFormat, setInitFormat] = useState(false)
  const initialInput = Helpers.setData(width, height)

  const [isAdmin, setIsAdmin] = useState(false)
  const [fontType, setFontType] = useState('FontFamily')
  const [fontSize, setFontSize] = useState('FontSize')
  const [fontSpacing, setFontSpacing] = useState('NoSpacing')
  const [isSidebarOpen, setSidebarOpen] = useState(sidebarOpen)
  const [isPanelOpen, setPanelOpen] = useState(false)
  const [layoutFormat, setLayoutFormat] = useState(selectedFormat)
  const [layoutWidth, setLayoutWidth] = useState(width)
  const [layoutHeight, setLayoutHeight] = useState(height)
  const [layoutDpc, setLayoutDpc] = useState(dpc)
  const [layoutBorder, setLayoutBorder] = useState(border)
  const [layoutPadding, setLayoutPadding] = useState(padding)
  const [inputItem, setInputItem] = useState(initialInput)
  const [inputTemplate, setInputTemplate] = useState(templates[0])
  // const [showPreview, setShowPreview] = useState(false)
  const exportRef = useRef()
  const [renderCanvas, setRenderCanvas] = useState(false)
  const [textItem, setTextItem] = useState()
  const [clickItem, setClickItem] = useState(false)
  const [clickTitle, setClickTitle] = useState(false)

  const handleDownload = (quality) => () => {
    exportAsImage(exportRef.current, layoutDpc, config.appName, quality)
  }

  const { i18n } = useTranslation()

  useEffect(() => {
    if (config.admin) {
      setIsAdmin(true)
    }
  }, [config])

  useEffect(() => {
    const search = window.location.search
    const params = new URLSearchParams(search)
    const data = params.get('data')

    if (data) {
      Helpers.storeInputItem(config, Helpers.decodeJsonData(data))
      loadLocalStorage(config)
      const url = `${window.location.origin}`
      window.history.pushState({ path: url }, '', url)
    }
  }, [])

  const admin = {
    isAdmin: isAdmin,
    setIsAdmin: setIsAdmin
  }

  const font = {
    fontType: fontType,
    setFontType: setFontType,
    fontSize: fontSize,
    setFontSize: setFontSize,
    fontSpacing: fontSpacing,
    setFontSpacing: setFontSpacing
  }

  const selectText = {
    textItem: textItem,
    setTextItem: setTextItem,
    clickItem: clickItem,
    setClickItem: setClickItem,
    clickTitle: clickTitle,
    setClickTitle: setClickTitle
  }

  const layout = {
    layoutWidth: layoutWidth,
    setLayoutWidth: setLayoutWidth,
    layoutHeight: layoutHeight,
    setLayoutHeight: setLayoutHeight,
    layoutDpc: layoutDpc,
    setLayoutDpc: setLayoutDpc,
    layoutPadding: layoutPadding,
    setLayoutPadding: setLayoutPadding,
    layoutFormat: layoutFormat,
    setLayoutFormat: setLayoutFormat,
    layoutBorder: layoutBorder,
    setLayoutBorder: setLayoutBorder
  }

  const render = {
    renderCanvas: renderCanvas,
    setRenderCanvas: setRenderCanvas
  }

  const template = {
    templates: templates,
    inputTemplate: inputTemplate,
    setInputTemplate: setInputTemplate
  }

  const items = {
    initFormat: initFormat,
    setInitFormat: setInitFormat,
    inputItem: inputItem,
    setInputItem: setInputItem
  }

  const toggleSidebar = () => {
    setSidebarOpen((isSidebarOpen) => !isSidebarOpen)
  }

  const togglePanel = () => {
    setPanelOpen((isPanelOpen) => !isPanelOpen)
  }

  const loadLocalStorage = (config) => {
    const items = Helpers.getInputItem(config)
    if (items) {
      setInputItem(items)
      i18n.changeLanguage(language)
    } else {
      setInitFormat(true)
    }
  }

  useEffect(() => {
    loadLocalStorage(config)
  }, [config])

  const clearSession = () => {
    Helpers.clearInputItem()
    setFontType('FontFamily')
    setFontSpacing('0')
    setInitFormat(false)
    const input = Helpers.setData(width, height)
    setInputItem(input)
    loadLocalStorage(config)
  }

  const reloadCanvas = () => {
    loadLocalStorage(config)
  }
  // const showPreviewDialog = () => {
  //   setShowPreview((showPreview) => !showPreview)
  // }

  return (
    <>
      <SideBar
        toggle={toggleSidebar}
        isOpen={isSidebarOpen}
        items={items}
        icons={icons}
        template={template}
        config={config}
        selectText={selectText}
      />
      <Container fluid className="content">
        <Navbar
          toggle={toggleSidebar}
          font={font}
          layout={layout}
          config={config}
          admin={admin}
          downloadFn={handleDownload}
        />
        <Canvas
          font={font}
          items={items}
          render={render}
          icons={icons}
          layout={layout}
          config={config}
          selectText={selectText}
          reload={reloadCanvas}
          ref={exportRef}
        />

        <Panel
          toggle={togglePanel}
          isOpen={isPanelOpen}
          layout={layout}
          items={items}
          template={template}
          config={config}
          format={format}
          resetSession={clearSession}
        />

        {/* <PreviewDialog show={showPreview} dialogFn={showPreviewDialog} title={i18n.t('Preview')} />
        <PreviewButton previewFn={showPreviewDialog} isPanelOpen={isPanelOpen} /> */}
      </Container>
    </>
  )
}

export default Editor
