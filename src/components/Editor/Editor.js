import React, { useEffect, useState } from 'react'
import { useRef } from 'react'
import { Container } from 'react-bootstrap'
import SideBar from '../Sidebar/Sidebar'
import Panel from '../Panel/Panel'
import exportAsImage from './../../utils/exportAsImage'
import Canvas from '../Canvas/Canvas'
import Navbar from '../Navbar/Navbar'
import Input from '../../utils/Input'
import Helpers from '../../utils/Helpers'
import { useTranslation } from 'react-i18next'
import '../../utils/i18n'
import './Editor.scss'

function Editor({ config }) {
  const width = config.layout.width
  const height = config.layout.height
  const padding = config.layout.padding
  const dpc = config.layout.dpc
  const icons = config.input.icons
  const templates = config.templates
  const language = config.language
  const sidebarOpen = Helpers.isTouchScreenDevice() ? false : true

  const [isAdmin, setIsAdmin] = useState(false)
  const [fontType, setFontType] = useState('FontFamily')
  const [fontSize, setFontSize] = useState('FontSize')
  const [fontSpacing, setFontSpacing] = useState('NoSpacing')
  const [layoutType, setLayoutType] = useState('Layout')
  const [isSidebarOpen, setSidebarOpen] = useState(sidebarOpen)
  const [isPanelOpen, setPanelOpen] = useState(false)
  const [layoutWidth, setLayoutWidth] = useState(width)
  const [layoutHeight, setLayoutHeight] = useState(height)
  const [layoutDpc, setLayoutDpc] = useState(dpc)
  const [layoutPadding, setLayoutPadding] = useState(padding)
  const [inputItem, setInputItem] = useState(Input)
  const [inputTemplate, setInputTemplate] = useState(templates[0])
  const exportRef = useRef()
  const [renderCanvas, setRenderCanvas] = useState(false)

  const handleDownload = (quality) => () => {
    exportAsImage(exportRef.current, layoutDpc, config.appName, quality)
  }

  const { i18n } = useTranslation()

  //get query param to load json file
  //url http://localhost:3000/?file=http://localhost:5001/api/marketing-announcement
  // const query = Helpers.getQuery();
  // const file = query.get('file');
  // Helpers.fetchJson(file).then(result =>
  // {
  //   console.log(result)
  // });

  useEffect(() => {
    if (config.admin) {
      setIsAdmin(true)
    }
  }, [config])

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

  const layout = {
    layoutWidth: layoutWidth,
    setLayoutWidth: setLayoutWidth,
    layoutHeight: layoutHeight,
    setLayoutHeight: setLayoutHeight,
    layoutDpc: layoutDpc,
    setLayoutDpc: setLayoutDpc,
    layoutPadding: layoutPadding,
    setLayoutPadding: setLayoutPadding,
    layoutType: layoutType,
    setLayoutType: setLayoutType
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
    inputItem: inputItem,
    setInputItem: setInputItem
  }

  const toggleSidebar = () => {
    setSidebarOpen((isSidebarOpen) => !isSidebarOpen)
  }

  const togglePanel = () => {
    setPanelOpen((isPanelOpen) => !isPanelOpen)
  }

  useEffect(() => {
    const items = Helpers.getInputItem(config)
    if (items) {
      setInputItem(items)
      i18n.changeLanguage(language)
    }
  }, [config])

  return (
    <>
      <SideBar
        toggle={toggleSidebar}
        isOpen={isSidebarOpen}
        items={items}
        icons={icons}
        template={template}
        config={config}
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
          ref={exportRef}
        />

        <Panel
          toggle={togglePanel}
          isOpen={isPanelOpen}
          layout={layout}
          items={items}
          template={template}
          config={config}
        />
        {/* <div style={{ position: 'absolute', bottom: '0', left: 0 }}>
          <a className="btn btn-primary" href="#">
            Yes
          </a>
          <a className="btn btn-primary" href="#">
            No
          </a>
        </div> */}
      </Container>
    </>
  )
}

export default Editor
