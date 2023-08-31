import { useEffect, useState } from 'react'
import FontStyled from '../../utils/FontStyled'

const TableData = ({
  imgPath,
  fontColor,
  maxSize,
  data,
  icons,
  onItemSelect,
  itemSelected,
  handleDrag,
  handleDragOver,
  handleDrop,
  dragId,
  targetDrag,
  setDragId,
  handleTouchTarget
}) => {
  const [top, setTop] = useState(0)
  const [left, setLeft] = useState(0)
  const [drag, setDrag] = useState(false)
  const [styleForImg, setStyleForImg] = useState({})
  const [xAtTouchPointStart, setXAtTouchPointStart] = useState(0)
  const [yAtTouchPointStart, setYAtTouchPointStart] = useState(0)

  useEffect(() => {
    if (drag) {
      setStyleForImg({
        position: 'relative',
        top: top,
        left: left,
        border: 'dashed 1px #0e6ffd',
        background: '#fff'
      })
    } else {
      setStyleForImg({})
    }
  }, [drag, top, left])

  const handleTouchStart = (e) => {
    if (e.cancelable) e.preventDefault()
    let evt = typeof e.originalEvent === 'undefined' ? e : e.originalEvent
    let touch = evt.touches[0] || evt.changedTouches[0]
    const x = +touch.pageX
    const y = +touch.pageY

    const element = document.elementFromPoint(touch.clientX, touch.clientY)
    const target = element.parentElement.closest('.pix-content')
    if (target) {
      const targetId = Math.abs(target.id)
      setDragId(targetId)
      setXAtTouchPointStart(x)
      setYAtTouchPointStart(y)
      setDrag(true)

      const child = target.querySelector('.parent-icon-container')
      if (child) {
        child.style.display = 'none'
      }
    }
  }

  const handleElementDrag = (e) => {
    e = e || window.event
    if (e.cancelable) e.preventDefault()
    let x = 0
    let y = 0

    let targetX = 0
    let targetY = 0

    if (
      e.type === 'touchstart' ||
      e.type === 'touchmove' ||
      e.type === 'touchend' ||
      e.type === 'touchcancel'
    ) {
      let evt = typeof e.originalEvent === 'undefined' ? e : e.originalEvent
      let touch = evt.touches[0] || evt.changedTouches[0]
      x = +touch.pageX
      y = +touch.pageY

      targetX = +touch.clientX
      targetY = +touch.clientY
    } else if (
      e.type === 'mousedown' ||
      e.type === 'mouseup' ||
      e.type === 'mousemove' ||
      e.type === 'mouseover' ||
      e.type === 'mouseout' ||
      e.type === 'mouseenter' ||
      e.type === 'mouseleave'
    ) {
      x = +e.clientX
      y = +e.clientY
    }

    const element = document.elementFromPoint(targetX, targetY)
    if (element) {
      const target = element.parentElement.closest('.pix-content')
      if (target) {
        const targetId = Math.abs(target.id)

        if (targetId > 0 && targetId !== dragId) {
          clearTargetStyle()
          target.style.background = '#7aafff'
        }
      }
    }

    const xRelativeToStart = x - xAtTouchPointStart
    const yRelativeToStart = y - yAtTouchPointStart - 35
    setTop(yRelativeToStart + 'px')
    setLeft(xRelativeToStart + 'px')
  }

  const clearTargetStyle = () => {
    const ele = document.querySelectorAll('.pix-content')
    Array.from(ele).map((el) => {
      el.style.background = ''
    })
  }

  const handleTouchEnd = (e) => {
    if (e.cancelable) e.preventDefault()
    const x = e.changedTouches[0].clientX
    const y = e.changedTouches[0].clientY
    const element = document.elementFromPoint(x, y)
    if (element) {
      const target = element.parentElement.closest('.pix-content')

      if (target) {
        const targetId = Math.abs(target.id)
        handleTouchTarget(targetId)
        setDrag(false)
        clearTargetStyle()
      }
    }
    setDrag(false)
    clearTargetStyle()
  }

  let td = []
  data.map((item, index) => {
    const lastIndex = data.length - 1
    const space = index >= 0 && data.length > 1 && index != lastIndex ? true : false
    td.push(
      <div
        draggable={true}
        onDragOver={handleDragOver}
        onDrag={handleDrag}
        onDrop={handleDrop}
        onTouchStart={(e) => handleTouchStart(e, item.id)}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleElementDrag}
        id={item.id}
        key={item.id}
        onClick={onItemSelect(item.id)}
        className={`pix-content ${item.id === itemSelected ? 'pix-content-selected' : ''} ${
          item.id === targetDrag ? 'pix-content-target' : ''
        }`}
        style={dragId === item.id ? styleForImg : {}}>
        <FontStyled
          value={item}
          icons={icons}
          space={space}
          multiline={true}
          maxSize={maxSize}
          imgPath={imgPath}
          fontColor={fontColor}
        />
      </div>
    )
  })
  return td
}

export default TableData
