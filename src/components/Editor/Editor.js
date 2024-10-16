import React, { useEffect, useState, useRef, Fragment } from 'react'
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
import Zoom from '../Tools/Zoom/Zoom'
import Joyride from 'react-joyride'
import TourModal from '../Tools/Tour/TourModal'

function Editor({ config, products, selectItem, currency }) {
  let format =
    config.wordpress.active && products.length > 0
      ? Helpers.extractProducts(products)
      : config.format
  const selectedFormat = config.layout.format
  const width = config.layout.width
  const height = config.layout.height
  const padding = config.layout.padding
  const dpc = config.layout.dpc
  const unit = config.layout.unit
  const border = config.layout.border
  const backgroundColor = config.layout.backgroundColor
  const fontColor = config.layout.fontColor
  const icons = config.input.icons
  const templates = config.templates
  const language = config.language
  const tutorial = config.tutorial
  const fonts = config.fonts
  const fontSelection = config.toolbar.fontFamily
  const spaceSelection = config.toolbar.fontSpacing
  const sidebarOpen = Helpers.isTouchScreenDevice() ? false : true
  const panelOpen = Helpers.isTouchScreenDevice() ? false : true

  const [initFormat, setInitFormat] = useState(false)
  const initialInput = Helpers.setData(unit, width, height, fontSelection, spaceSelection, fonts)

  const [isAdmin, setIsAdmin] = useState(false)
  const [fontType, setFontType] = useState('FontFamily')
  const [fontSize, setFontSize] = useState('FontSize')
  const [fontSpacing, setFontSpacing] = useState('NoSpacing')
  const [isSidebarOpen, setSidebarOpen] = useState(sidebarOpen)
  const [isPanelOpen, setPanelOpen] = useState(panelOpen)
  const [layoutFormat, setLayoutFormat] = useState(selectedFormat)
  const [layoutWidth, setLayoutWidth] = useState(width)
  const [layoutHeight, setLayoutHeight] = useState(height)
  const [layoutUnit, setLayoutUnit] = useState(unit)
  const [layoutDpc, setLayoutDpc] = useState(dpc)
  const [layoutBorder, setLayoutBorder] = useState(border)
  const [layoutBackgroundColor, setLayoutBackgroundColor] = useState(backgroundColor)
  const [layoutFontColor, setLayoutFontColor] = useState(fontColor)
  const [layoutPadding, setLayoutPadding] = useState(padding)
  const [inputItem, setInputItem] = useState(initialInput)
  const [inputTemplate, setInputTemplate] = useState(templates[0])
  const exportRef = useRef()
  const [renderCanvas, setRenderCanvas] = useState(false)
  const [textItem, setTextItem] = useState()
  const [clickItem, setClickItem] = useState(false)
  const [clickTitle, setClickTitle] = useState(false)
  const [showErrorCart, setShowErrorCart] = useState(false)
  const [showConfirmCart, setConfirmCart] = useState(false)
  const [showErrorExport, setShowErrorExport] = useState(false)
  const [titleError, setTitleError] = useState(false)
  const [loadWordpress, setLoadWordpress] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  const { i18n } = useTranslation()
  const editorRef = useRef()
  const canvasRef = useRef()

  const [zoomSize, setZoomSize] = useState(null)
  const [clickOutCanvas, setClickOutCanvas] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const handleDownload = (quality) => () => {
    if (!exportRef.current) {
      showErrorExportDialog()
      return
    }
    setDownloading(true)
    exportAsImage(
      exportRef.current,
      layoutDpc,
      config.appName,
      quality,
      items.inputItem?.backgroundColor
    ).then(() => {
      setDownloading(false)
    })
  }

  const showConfirmCartDialog = () => {
    setConfirmCart((showConfirmCart) => !showConfirmCart)
  }

  const showErrorCartDialog = () => {
    setShowErrorCart((showErrorCart) => !showErrorCart)
  }

  const showErrorExportDialog = () => {
    setShowErrorExport((showErrorExport) => !showErrorExport)
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
    const encodeData = Helpers.encodeJsonData(contentData)
    Helpers.fetchJson(`${config.wordpress.baseUrl}/wp-json/wc/store/cart`, true).then((key) => {
      Helpers.postJson(
        `${config.wordpress.baseUrl}/wp-json/wc/store/cart/add-item`,
        items.inputItem.variation.id,
        encodeData,
        key
      ).then(() => {
        window.open(`${config.wordpress.baseUrl}${config.wordpress.cartSlug}`, '_self')
      })
    })
  }

  useEffect(() => {
    if (config.admin) {
      setIsAdmin(true)
    }
  }, [config])

  useEffect(() => {
    const search = window.location.search
    const params = new URLSearchParams(search)
    const pixgen = params.get('pixgen')
    if (pixgen) {
      const data = encodeURI(pixgen).replace(/%20/g, '+')
      const result = Helpers.gzuncompress(data)
      if (result) {
        Helpers.storeInputItem(config, Helpers.decodeJsonData(result))
        loadLocalStorage(config)
        Helpers.clearUrlHistory(config)
      }
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
    layoutUnit: layoutUnit,
    setLayoutUnit: setLayoutUnit,
    layoutDpc: layoutDpc,
    setLayoutDpc: setLayoutDpc,
    layoutPadding: layoutPadding,
    setLayoutPadding: setLayoutPadding,
    layoutFormat: layoutFormat,
    setLayoutFormat: setLayoutFormat,
    layoutBorder: layoutBorder,
    setLayoutBorder: setLayoutBorder,
    layoutBackgroundColor: layoutBackgroundColor,
    setLayoutBackgroundColor: setLayoutBackgroundColor,
    layoutFontColor: layoutFontColor,
    setLayoutFontColor: setLayoutFontColor
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
      i18n.changeLanguage(language)
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
    setShowTutorial(false)
    setFontType('FontFamily')
    setFontSpacing('0')
    setInitFormat(false)
    const input = Helpers.setData(unit, width, height)
    setInputItem(input)
    loadLocalStorage(config)
  }

  const reloadCanvas = () => {
    loadLocalStorage(config)
  }

  const handleShowTutorial = () => {
    setShowTutorial(true)
  }

  const handleTutorialCallback = (data) => {
    if (data.status === 'skipped') {
      setShowTutorial(false)
    }
    if (data.status === 'finished') {
      setShowTutorial(false)
    }
  }

  return (
    <Fragment key={inputItem.id}>
      {showTutorial && tutorial?.active ? (
        <Joyride
          callback={handleTutorialCallback}
          steps={tutorial?.steps}
          continuous={true}
          showProgress={true}
          showSkipButton={true}
          tooltipComponent={TourModal}
        />
      ) : (
        <></>
      )}
      <SideBar
        toggle={toggleSidebar}
        isOpen={isSidebarOpen}
        items={items}
        icons={icons}
        template={template}
        config={config}
        admin={admin}
        selectText={selectText}
        downloading={downloading}
      />

      <div className="pixgen-editor-wrapper">
        <div className="pixgen-actionbar-wrapper">
          <Navbar
            toggle={toggleSidebar}
            font={font}
            items={items}
            config={config}
            admin={admin}
            downloadFn={handleDownload}
            addToCart={handleAddToCart}
          />
        </div>

        <div
          className="pixgen-editor"
          ref={editorRef}
          onClick={() => {
            if (!items?.inputItem?.placeholder) {
              setClickOutCanvas((clickOutCanvas) => !clickOutCanvas)
            }
          }}>
          <div className="pixgen-editor-padder" ref={canvasRef}>
            <div className="pixgen-editor-frame">
              <div className="device-container">
                <Canvas
                  font={font}
                  items={items}
                  render={render}
                  icons={icons}
                  layout={layout}
                  config={config}
                  selectText={selectText}
                  reload={reloadCanvas}
                  parentRef={editorRef}
                  canvasRef={canvasRef}
                  zoomSize={zoomSize}
                  setZoomSize={setZoomSize}
                  clickOutCanvas={clickOutCanvas}
                  ref={exportRef}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pixgen-footer-wrapper">
          <div className="tools-footer">
            <Zoom zoomSize={zoomSize} setZoomSize={setZoomSize} />
          </div>
        </div>
      </div>

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
        setZoomSize={setZoomSize}
        selectItem={selectItem}
        currency={currency}
        resetSession={clearSession}
        showTutorial={handleShowTutorial}
      />

      <ErrorDialog
        show={showErrorCart}
        dialogFn={showErrorCartDialog}
        title={i18n.t('AddToCartError')}
        description={titleError ? i18n.t('InputTitleEmpty') : i18n.t('InputItemEmpty')}
      />

      <ErrorDialog
        show={showErrorExport}
        dialogFn={showErrorExportDialog}
        title={i18n.t('ExportError')}
        description={i18n.t('UnableToSaveEmptyCanvas')}
      />

      <Dialog
        title={i18n.t('AddToCart')}
        description={i18n.t('AddToCartConfirmation')}
        show={showConfirmCart}
        dialogFn={showConfirmCartDialog}
        actionFn={addToCart}
      />
    </Fragment>
  )
}

export default Editor
