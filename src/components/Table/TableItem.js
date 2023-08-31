import Helpers from '../../utils/Helpers'
import TableData from './TableData'

const TableItem = ({
  imgPath,
  fontColor,
  maxSize,
  items,
  icons,
  template,
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
  let content = []
  const layout = template.layout
  let start = 0
  let count = 0
  while (count < items.length) {
    layout.map((temp) => {
      const id = Helpers.getRandomId()
      count = count + temp
      const data = items.sort((a, b) => a.order - b.order).slice(start, count)
      start = start + temp
      if (data.length > 0) {
        content.push(
          <div className="pix-item" key={id}>
            <TableData
              imgPath={imgPath}
              fontColor={fontColor}
              maxSize={maxSize}
              data={data}
              icons={icons}
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
        )
      }
    })
  }
  if (items.length > count) {
    count = 0
  }
  return content
}

export default TableItem
