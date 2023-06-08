import React, { useEffect, useState, useRef, Fragment } from 'react'
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
import ErrorDialog from '../Dialog/ErrorDialog'
import Dialog from '../Dialog/Dialog'
import PreviewButton from '../Tools/Preview/PreviewButton'
import PreviewDialog from '../Dialog/PreviewDialog'

function Editor({ config, products, selectItem }) {
  let format =
    config.wordpress.active && products.length > 0
      ? Helpers.extractProducts(products)
      : config.format
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
  const [showPreview, setShowPreview] = useState(false)
  const exportRef = useRef()
  const [renderCanvas, setRenderCanvas] = useState(false)
  const [textItem, setTextItem] = useState()
  const [clickItem, setClickItem] = useState(false)
  const [clickTitle, setClickTitle] = useState(false)
  const [showErrorCart, setShowErrorCart] = useState(false)
  const [showConfirmCart, setConfirmCart] = useState(false)
  const [titleError, setTitleError] = useState(false)
  const [loadWordpress, setLoadWordpress] = useState(false)
  const { i18n } = useTranslation()

  const handleDownload = (quality) => () => {
    exportAsImage(exportRef.current, layoutDpc, config.appName, quality)
  }

  const showConfirmCartDialog = () => {
    setConfirmCart((showConfirmCart) => !showConfirmCart)
  }

  const showErrorCartDialog = () => {
    setShowErrorCart((showErrorCart) => !showErrorCart)
  }

  const handleAddToCart = () => {
    if (items.inputItem.title.length <= 0) {
      setShowErrorCart(true)
      setTitleError(true)
      return
    }

    if (items.inputItem.items.length < 3) {
      setShowErrorCart(true)
      setTitleError(false)
      return
    }
    setShowErrorCart(false)
    showConfirmCartDialog()
  }

  const addToCart = () => {
    const contentData = Helpers.getInputItem(config)
    setConfirmCart(false)
    clearSession()
    setLoadWordpress(true)
    setTimeout(() => {
      window.open(
        `${config.wordpress.baseUrl}${config.wordpress.cartSlug}/?add-to-cart=${
          items.inputItem.format.id
        }&quantity=1&variation_id=${items.inputItem.variation.id}&pixgen=${Helpers.encodeJsonData(
          contentData
        )}`,
        '_self'
      )
    }, 3000)
  }

  useEffect(() => {
    if (config.admin) {
      setIsAdmin(true)
    }
  }, [config])

  useEffect(() => {
    const search = window.location.search
    const params = new URLSearchParams(search)
    const data = params.get('pixgen')

    if (data) {
      Helpers.storeInputItem(config, Helpers.decodeJsonData(data))
      loadLocalStorage(config)
      Helpers.clearUrlHistory(config)
    }
  }, [])

  const admin = {
    isAdmin: isAdmin,
    setIsAdmin: setIsAdmin
  }

  const wp = {
    loadWordpress: loadWordpress,
    setLoadWordpress: setLoadWordpress
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
    products: products,
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
    if (selectItem.selectedProduct && selectItem.selectedVariation) {
      clearSession()
    }
  }, [])

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
  const showPreviewDialog = () => {
    setShowPreview((showPreview) => !showPreview)
  }

  return (
    <Fragment key={inputItem.id}>
      <SideBar
        toggle={toggleSidebar}
        isOpen={isSidebarOpen}
        items={items}
        icons={icons}
        template={template}
        config={config}
        admin={admin}
        selectText={selectText}
      />
      <Container fluid className="content">
        <Navbar
          toggle={toggleSidebar}
          font={font}
          items={items}
          config={config}
          admin={admin}
          downloadFn={handleDownload}
          addToCart={handleAddToCart}
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
          admin={admin}
          wp={wp}
          selectItem={selectItem}
          resetSession={clearSession}
        />

        <ErrorDialog
          show={showErrorCart}
          dialogFn={showErrorCartDialog}
          title={i18n.t('AddToCartError')}
          description={titleError ? i18n.t('InputTitleEmpty') : i18n.t('InputItemEmpty')}
        />

        <Dialog
          title={i18n.t('AddToCart')}
          description={i18n.t('AddToCartConfirmation')}
          show={showConfirmCart}
          dialogFn={showConfirmCartDialog}
          actionFn={addToCart}
        />

        <PreviewDialog show={showPreview} dialogFn={showPreviewDialog} title={i18n.t('Preview')} />
        <PreviewButton previewFn={showPreviewDialog} isPanelOpen={isPanelOpen} />
      </Container>
    </Fragment>
  )
}

export default Editor
