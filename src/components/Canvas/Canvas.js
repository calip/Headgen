import { forwardRef, useLayoutEffect, useRef, useState } from 'react'
import './Canvas.scss'
import TableItem from '../Table/TableItem'
import Helpers from '../../utils/Helpers'
import FontStyled from '../../utils/FontStyled'
import ItemLoader from '../../utils/ItemLoader'

const Canvas = forwardRef((props, ref) => {
  const currentTemplate = props.config.templates.find(
    (item) => item.id === props.items.inputItem.template
  )

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
  const width = Math.abs(props.items.inputItem.width) / 10
  const height = Math.abs(props.items.inputItem.height) / 10
  const padding = Math.abs(props.layout.layoutPadding)
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

  const removeSelectedItem = (event) => {
    event.stopPropagation()
    setItemSelected()
    props.selectText.setClickItem(false)
    props.selectText.setTextItem()
    setTitleSelected(false)
    props.selectText.setClickTitle(false)
    props.font.setFontType('')
    props.font.setFontSpacing('0')
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
      props.font.setFontSpacing(data.inputItem.fontSpacing)
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
      const parent = ref.current
      const child = contentRef.current
      const title = titleRef.current
      if (parent && child && title) {
        const initHeight = child.clientHeight - padding

        setTimeout(() => {
          const titleHeight = title.clientHeight
          const scaleHeight = Math.abs(child.clientHeight - padding)
          const totalHeight = Math.abs(initHeight - titleHeight)
          const totalItem = data.inputItem.items.length
          const scaleSize = Math.abs(totalHeight / totalItem)
          const updateSize = scaleHeight >= initHeight ? scaleSize : itemSize
          setItemSize(updateSize)
        }, 0)
      }
    }
  })

  if (dataChanged) {
    return (
      <div className="pix-editor">
        <div className="pix-canvas" style={{ minWidth: `${width}px`, minHeight: `${height}px` }}>
          <div className="center-screen" style={{ margin: `10px` }}>
            <p>Loading</p>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="pix-editor">
        <div
          className="pix-canvas"
          style={{
            minWidth: `${width}px`,
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
                  <table>
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
      </div>
    )
  }
})

export default Canvas
