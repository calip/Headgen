import { forwardRef, useEffect, useRef, useState } from 'react'
import './Canvas.scss'
import FontStyled from '../../utils/FontStyled'
import TableItem from '../Table/TableItem'
import Helpers from '../../utils/Helpers'

const Canvas = forwardRef((props, ref) => {
  const currentTemplate = props.config.templates.find(
    (item) => item.id === props.items.inputItem.template
  )
  const [data, setData] = useState({})
  const fontType = props.font.fontType === 'Font Family' ? 'comfortaa' : props.font.fontType
  const fontSpacing =
    props.font.fontSpacing === 'Spacing' || props.font.fontSpacing === '0'
      ? ''
      : props.font.fontSpacing
  const width = Math.abs(props.layout.layoutWidth) / 10
  const height = Math.abs(props.layout.layoutHeight) / 10
  const padding = Math.abs(props.layout.layoutPadding)
  const icons = props.icons
  const [itemSelected, setItemSelected] = useState()
  const [fontSelected, setFontSelected] = useState('comfortaa')
  const [spacingSelected, setSpacingSelected] = useState('0')
  const [titleSelected, setTitleSelected] = useState(false)

  const fontTypeChanged = useHasChanged(fontType)
  const fontSpacingChanged = useHasChanged(fontSpacing)
  const itemSelectedChanged = useHasChanged(itemSelected)

  const titleSelectedChanged = useHasChanged(titleSelected)
  const dataChanged = useHasChanged(props.items)

  useEffect(() => {
    if (dataChanged) {
      setData(props.items)
    }
  })

  const onTitleSelect = (event) => {
    event.stopPropagation()
    setItemSelected()
    setTitleSelected(true)
  }

  const onItemSelect = (id) => (event) => {
    event.stopPropagation()
    setItemSelected(id)
    setTitleSelected(false)
  }

  const removeSelectedItem = (event) => {
    event.stopPropagation()
    setItemSelected()
    setTitleSelected(false)
    props.font.setFontType('Font Family')
    props.font.setFontSpacing('0')
  }

  useEffect(() => {
    const currentFont = props.font.fontType === 'Font Family' ? 'comfortaa' : props.font.fontType
    setFontSelected(currentFont)
  }, [props.font.fontType])

  useEffect(() => {
    const currentSpacing =
      props.font.fontSpacing === 'Spacing' || props.font.fontSpacing === '0'
        ? ''
        : props.font.fontSpacing
    setSpacingSelected(currentSpacing)
  }, [props.font.fontSpacing])

  useEffect(() => {
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
      props.font.setFontType(data.inputItem.font)
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

  useEffect(() => {
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
    props.items.setInputItem(data.inputItem)
    Helpers.storeInputItem(props.config, props.items.inputItem)
  }

  if (dataChanged) {
    return (
      <div className="pix-editor">
        <div className="pix-canvas" style={{ minWidth: `400px`, minHeight: `${height}px` }}>
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
          style={{ minWidth: `${width}px`, minHeight: `${height}px` }}
          ref={ref}>
          <div
            className="center-screen"
            style={{ margin: `${padding}px`, display: 'table' }}
            onClick={removeSelectedItem}>
            <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>
              {data.inputItem.title ? (
                <div>
                  <table>
                    <tbody>
                      <tr>
                        <td
                          className={`pix-title ${titleSelected ? 'pix-title-selected' : ''}`}
                          onClick={onTitleSelect}>
                          <FontStyled value={data.inputItem} multiline={false} />
                        </td>
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
                    setTargetDrag={setTargetDrag}
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

const useHasChanged = (val) => {
  const prevVal = usePrevious(val)
  return prevVal !== val
}

const usePrevious = (value) => {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

export default Canvas
