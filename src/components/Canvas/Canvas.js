import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react'
import './Canvas.scss'
import TableItem from '../Table/TableItem'
import Helpers from '../../utils/Helpers'
import FontStyled from '../../utils/FontStyled'
import ItemLoader from '../../utils/ItemLoader'

const Canvas = forwardRef((props, ref) => {
  const currentTemplate = props.config.templates.find(
    (item) => item.id === props.items.inputItem.template
  )

  const zoomSize = parseInt(props.zoomSize)
  const [data, setData] = useState({})
  const contentRef = useRef()
  const titleRef = useRef()
  const [itemSize, setItemSize] = useState(512)

  const selectedText = props.selectText.textItem
  const clickTitle = props.selectText.clickTitle
  const fontType = props.font.fontType === 'FontFamily' ? '' : props.font.fontType
  const fontSpacing =
    props.font.fontSpacing === 'Spacing' || props.font.fontSpacing === '0'
      ? ''
      : props.font.fontSpacing

  const initWidth = Helpers.cmToPxConversion(props.items.inputItem.width, props.layout.layoutDpc)
  const initHeight = Helpers.cmToPxConversion(props.items.inputItem.height, props.layout.layoutDpc)
  const initPadding = Helpers.cmToPxConversion(props.layout.layoutPadding, props.layout.layoutDpc)

  const width = Math.abs(initWidth / 10)
  const height = Math.abs(initHeight / 10)
  const padding = Math.abs(initPadding / 10)
  const border = Math.abs(props.layout.layoutBorder)
  const icons = props.icons
  const [itemSelected, setItemSelected] = useState()
  const [fontSelected, setFontSelected] = useState('')
  const [spacingSelected, setSpacingSelected] = useState('0')
  const [titleSelected, setTitleSelected] = useState(false)

  const fontTypeChanged = Helpers.useHasChanged(fontType)
  const fontSpacingChanged = Helpers.useHasChanged(fontSpacing)
  const itemSelectedChanged = Helpers.useHasChanged(itemSelected)

  const titleSelectedChanged = Helpers.useHasChanged(titleSelected)
  const selectedTextChanged = Helpers.useHasChanged(selectedText)
  const selectedTitleChanged = Helpers.useHasChanged(clickTitle)
  const dataChanged = Helpers.useHasChanged(props.items)
  const contentChanged = Helpers.useHasChanged(data)
  const imgPath = props.config.wordpress.active
    ? `${props.config.wordpress.baseUrl}${props.config.wordpress.pluginPath}`
    : ''

  useLayoutEffect(() => {
    if (dataChanged) {
      setData(props.items)
    }
  })

  useLayoutEffect(() => {
    if (selectedTextChanged) {
      setItemSelected(selectedText)
    }
  })

  useLayoutEffect(() => {
    if (selectedTitleChanged) {
      setTitleSelected(clickTitle)
    }
  })

  const onTitleSelect = (event) => {
    event.stopPropagation()
    setItemSelected()
    setTitleSelected(true)
    props.selectText.setClickTitle(true)
    props.selectText.setClickItem(false)
    props.selectText.setTextItem()
  }

  const onItemSelect = (id) => (event) => {
    event.stopPropagation()
    setItemSelected(id)
    props.selectText.setClickItem(true)
    props.selectText.setTextItem(id)
    props.selectText.setClickTitle(false)
    setTitleSelected(false)
  }

  useEffect(() => {
    const event = new Event('onClick')
    removeSelectedItem(event)
  }, [props.clickOutCanvas])

  const removeSelectedItem = (event) => {
    event.stopPropagation()
    setItemSelected()
    props.selectText.setClickItem(false)
    props.selectText.setTextItem()
    setTitleSelected(false)
    props.selectText.setClickTitle(false)
    props.font.setFontType('')
    props.font.setFontSpacing(null)
  }

  useLayoutEffect(() => {
    const currentFont = props.font.fontType === 'FontFamily' ? '' : props.font.fontType
    setFontSelected(currentFont)
  }, [props.font.fontType])

  useLayoutEffect(() => {
    const currentSpacing =
      props.font.fontSpacing === 'Spacing' || props.font.fontSpacing === '0'
        ? ''
        : props.font.fontSpacing
    setSpacingSelected(currentSpacing)
  }, [props.font.fontSpacing])

  useLayoutEffect(() => {
    if (fontTypeChanged && titleSelected) {
      let temp = data.inputItem
      temp.font = fontType
      setData((prevState) => {
        return { ...prevState, [data.inputItem.items]: temp.items }
      })
      props.items.setInputItem(data.inputItem)
      Helpers.storeInputItem(props.config, props.items.inputItem)
    }
    if (data.inputItem && titleSelectedChanged && data.inputItem.font !== fontType) {
      props.font.setFontType(titleSelected ? data.inputItem.font : fontType)
    }

    if (fontSpacingChanged && titleSelected) {
      let temp = data.inputItem
      temp.fontSpacing = fontSpacing
      setData((prevState) => {
        return { ...prevState, [data.inputItem.items]: temp.items }
      })
      props.items.setInputItem(data.inputItem)
      Helpers.storeInputItem(props.config, props.items.inputItem)
    }
    if (data.inputItem && titleSelectedChanged && data.inputItem.fontSpacing !== fontSpacing) {
      props.font.setFontSpacing(titleSelected ? data.inputItem.fontSpacing : fontSpacing)
    }
  }, [
    titleSelected,
    fontSelected,
    spacingSelected,
    fontType,
    fontTypeChanged,
    data.inputItem,
    props.items,
    props.font,
    itemSelectedChanged,
    fontSpacingChanged,
    fontSpacing
  ])

  useLayoutEffect(() => {
    let arrItem = null
    if (data.inputItem && data.inputItem.items) {
      arrItem = data.inputItem.items.find((item) => item.id === itemSelected)
    }

    if (fontTypeChanged && itemSelected >= 0) {
      if (arrItem && arrItem.font !== fontType) {
        arrItem.font = fontType

        let temp = data.inputItem
        let tempItems = data.inputItem.items.map((i) => i)
        const curIndex = data.inputItem.items.findIndex((item) => item.id === arrItem.id)
        tempItems[curIndex] = arrItem
        temp.items = tempItems
        setData((prevState) => {
          return { ...prevState, [data.inputItem.items]: temp.items }
        })
        props.items.setInputItem(data.inputItem)
        Helpers.storeInputItem(props.config, props.items.inputItem)
      }
    }
    if (arrItem && itemSelectedChanged && arrItem.font !== fontType) {
      props.font.setFontType(arrItem.font)
    }

    if (fontSpacingChanged && itemSelected >= 0) {
      if (arrItem && arrItem.fontSpacing !== fontSpacing) {
        arrItem.fontSpacing = fontSpacing.length > 0 ? fontSpacing : 0
        let temp = data.inputItem
        let tempItems = data.inputItem.items.map((i) => i)
        const curIndex = data.inputItem.items.findIndex((item) => item.id === arrItem.id)
        tempItems[curIndex] = arrItem
        temp.items = tempItems
        setData((prevState) => {
          return { ...prevState, [data.inputItem.items]: temp.items }
        })
        props.items.setInputItem(data.inputItem)
        Helpers.storeInputItem(props.config, props.items.inputItem)
      }
    }

    if (itemSelectedChanged && arrItem && arrItem.fontSpacing !== fontSpacing) {
      props.font.setFontSpacing(arrItem.fontSpacing)
    }
  }, [
    itemSelected,
    fontSelected,
    spacingSelected,
    fontType,
    fontTypeChanged,
    data.inputItem,
    props.items,
    props.font,
    itemSelectedChanged,
    fontSpacingChanged,
    fontSpacing,
    props.config
  ])

  const [dragId, setDragId] = useState()
  const [targetDrag, setTargetDrag] = useState()

  const handleDrag = (ev) => {
    setDragId(Math.abs(ev.currentTarget.id))
  }

  const handleDragOver = (e) => {
    if (e.cancelable) e.preventDefault()
    const targetId = Math.abs(e.currentTarget.id)
    if (targetId !== dragId) {
      setTargetDrag(targetId)
    }
  }

  const handleDrop = (ev) => {
    const targetId = Math.abs(ev.currentTarget.id)
    const dragBox = data.inputItem.items.find((box) => box.id === dragId)
    const dropBox = data.inputItem.items.find((box) => box.id === targetId)
    const dragBoxOrder = dragBox.order
    const dropBoxOrder = dropBox.order

    const newBoxState = data.inputItem.items.map((box) => {
      if (box.id === dragId) {
        box.order = dropBoxOrder
      }
      if (box.id === targetId) {
        box.order = dragBoxOrder
      }
      return box
    })

    setTargetDrag()
    let temp = data.inputItem
    temp.items = newBoxState
    setData((prevState) => {
      return { ...prevState, [data.inputItem.items]: temp.items }
    })

    props.reload()
    props.items.setInputItem(data.inputItem)
    Helpers.storeInputItem(props.config, props.items.inputItem)
  }

  const handleTouchTarget = (targetId) => {
    const dragBox = data.inputItem.items.find((box) => box.id === dragId)
    const dropBox = data.inputItem.items.find((box) => box.id === targetId)

    const dragBoxOrder = dragBox.order
    const dropBoxOrder = dropBox.order

    const newBoxState = data.inputItem.items.map((box) => {
      if (box.id === dragId) {
        box.order = dropBoxOrder
      }
      if (box.id === targetId) {
        box.order = dragBoxOrder
      }
      return box
    })

    let temp = data.inputItem
    temp.items = newBoxState
    setData((prevState) => {
      return { ...prevState, [data.inputItem.items]: temp.items }
    })

    props.reload()
    props.items.setInputItem(data.inputItem)
    Helpers.storeInputItem(props.config, props.items.inputItem)
  }

  useLayoutEffect(() => {
    if (contentChanged) {
      const childElement = contentRef.current
      const titleElement = titleRef.current
      if (childElement && titleElement) {
        const initHeight = childElement.clientHeight
        const initTitleHeight = titleElement.clientHeight
        setTimeout(() => {
          const titleHeight = titleElement.clientHeight
          if (titleHeight > 0 && titleHeight !== initTitleHeight) {
            const scaleHeight = childElement.clientHeight
            const totalHeight = Math.abs(initHeight - titleHeight)
            const totalItem = data.inputItem.items.length
            const scaleSize = Math.abs(totalHeight / totalItem)
            const updateSize = scaleHeight >= initHeight ? scaleSize : itemSize
            setItemSize(updateSize)
          }
        }, 0)
      }
    }
  })

  useEffect(() => {
    if (props.parentRef.current && props.canvasRef.current) {
      const { clientWidth: cw, clientHeight: ch } = props.canvasRef.current
      const { clientWidth: pw, clientHeight: ph } = props.parentRef.current
      const scale = Math.min(pw / cw, ph / ch)

      const zoom = zoomSize ? zoomSize : 5
      if (zoom) {
        const scaleAmtX = (scale * zoom) / 100
        const scaleAmtY = scaleAmtX
        props.canvasRef.current.style.transform = `scale(${scaleAmtX}, ${scaleAmtY})`
      }

      if (props.zoomSize === null) {
        initScaleSize()
      }
    }
  }, [zoomSize])

  useEffect(() => {
    initScaleSize()
  }, [])

  const initScaleSize = () => {
    if (props.parentRef.current && props.canvasRef.current) {
      const { clientWidth: cw, clientHeight: ch } = props.canvasRef.current
      const { clientWidth: pw, clientHeight: ph } = props.parentRef.current
      const scale = Math.min(pw / cw, ph / ch)

      const initScale = 100 / scale
      const scaleAmtX = Math.round((scale * initScale) / 100)
      const scaleAmtY = scaleAmtX
      props.setZoomSize(initScale)
      props.canvasRef.current.style.transform = `scale(${scaleAmtX}, ${scaleAmtY})`
    }
  }

  useEffect(() => {
    if (data.inputItem?.placeholder) {
      const inputTitle = data.inputItem.title.length > 0
      const inputItems = data.inputItem.items.some(
        (item) => item.realText.length > 0 || item.spokenText.length > 0
      )
      if (inputTitle || inputItems) {
        let temp = data.inputItem
        temp.placeholder = false
        Helpers.saveInputToLocalStorage(props.items, props.config, temp.items)
      }
    }
  }, [data.inputItem])

  if (dataChanged) {
    return (
      <div className="pix-editor-canvas">
        <div className="pix-canvas" style={{ minWidth: `${width}px`, minHeight: `${height}px` }}>
          <div className="center-screen" style={{ margin: `10px` }}>
            <p>Loading</p>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="pix-editor-canvas">
        {data.inputItem.placeholder ? (
          <div
            className="pix-canvas"
            style={{
              minWidth: `${width}px`,
              maxWidth: `${width}px`,
              minHeight: `${height}px`,
              maxHeight: `${height}px`
            }}>
            <div
              className={border ? 'center-screen' : null}
              style={{
                margin: `${padding}px`,
                display: 'table'
              }}>
              <div
                style={{
                  display: 'table-cell',
                  verticalAlign: 'middle',
                  color: '#a1a1a1',
                  pointerEvents: 'none'
                }}>
                <div>
                  <table className="pixgen-table">
                    <tbody>
                      <tr>
                        <td>
                          <FontStyled
                            value={props.config.placeholder}
                            multiline={false}
                            maxSize={300}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <table className="pixgen-table">
                    <tbody>
                      {props.config.placeholder.items.map((item, index) => {
                        const lastIndex = data.length - 1
                        const space =
                          index >= 0 && data.length > 1 && index != lastIndex ? true : false
                        return (
                          <tr key={index}>
                            <td>
                              <FontStyled
                                value={item}
                                icons={icons}
                                space={space}
                                multiline={true}
                                maxSize={itemSize}
                                imgPath={imgPath}
                              />
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="pix-canvas"
            style={{
              minWidth: `${width}px`,
              maxWidth: `${width}px`,
              minHeight: `${height}px`,
              maxHeight: `${height}px`
            }}
            ref={ref}>
            <div
              className={border ? 'center-screen' : null}
              ref={contentRef}
              style={{
                margin: `${padding}px`,
                display: 'table'
              }}
              onClick={removeSelectedItem}>
              <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>
                {data.inputItem.title ? (
                  <div ref={titleRef}>
                    <table className="pixgen-table">
                      <tbody>
                        <tr>
                          {data.inputItem.title.length >= 3 ? (
                            <td
                              className={`pix-title ${titleSelected ? 'pix-title-selected' : ''}`}
                              onClick={onTitleSelect}>
                              <FontStyled value={data.inputItem} multiline={false} maxSize={300} />
                            </td>
                          ) : (
                            <td>
                              <ItemLoader data={data.inputItem.title} />
                            </td>
                          )}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <></>
                )}
                {data.inputItem.items ? (
                  <div>
                    <TableItem
                      imgPath={imgPath}
                      maxSize={itemSize}
                      items={data.inputItem.items}
                      icons={icons}
                      template={currentTemplate}
                      onItemSelect={onItemSelect}
                      itemSelected={itemSelected}
                      handleDrag={handleDrag}
                      handleDragOver={handleDragOver}
                      handleDrop={handleDrop}
                      dragId={dragId}
                      targetDrag={targetDrag}
                      setDragId={setDragId}
                      handleTouchTarget={handleTouchTarget}
                    />
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
})

export default Canvas
