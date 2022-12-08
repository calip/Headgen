import Helpers from '../../utils/Helpers'
import TableData from './TableData'

const TableItem = ({
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
  setTargetDrag,
  handleTouchTarget
}) => {
  let table = []
  const layout = template.layout
  let start = 0
  let count = 0
  while (count < items.length) {
    layout.map((temp) => {
      const id = Helpers.getRandomId()
      count = count + temp
      const data = items.sort((a, b) => a.order - b.order).slice(start, count)
      start = start + temp
      table.push(
        <div key={id}>
          <table>
            <tbody>
              <tr>
                <TableData
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
                  setTargetDrag={setTargetDrag}
                  handleTouchTarget={handleTouchTarget}
                />
              </tr>
            </tbody>
          </table>
        </div>
      )
    })
  }
  if (items.length > count) {
    count = 0
  }
  return table
}

export default TableItem
