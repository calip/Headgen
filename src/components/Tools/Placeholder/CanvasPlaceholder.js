import FontStyled from '../../../utils/FontStyled'
import TableItem from '../../Table/TableItem'

function CanvasPlaceholder(props) {
  const onItemSelect = () => {}

  const data = props.placeholder
  return (
    <div
      className="pix-canvas"
      style={{
        minWidth: `${props.width}px`,
        maxWidth: `${props.width}px`,
        minHeight: `${props.height}px`,
        maxHeight: `${props.height}px`
      }}>
      <div
        className={props.border ? 'center-screen' : null}
        ref={props.contentRef}
        style={{
          margin: `${props.padding}px`,
          display: 'table'
        }}>
        <div
          style={{
            display: 'table-cell',
            verticalAlign: 'middle',
            opacity: '0.3',
            pointerEvents: 'none'
          }}>
          <div ref={props.titleRef}>
            <table className="pixgen-table">
              <tbody>
                <tr>
                  <td>
                    <FontStyled value={data} multiline={false} maxSize={300} placeholder={true} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div ref={props.itemRef}>
            <TableItem
              imgPath={props.imgPath}
              maxSize={props.itemSize}
              items={data.items}
              icons={props.icons}
              template={props.currentTemplate}
              onItemSelect={onItemSelect}
              itemSelected={null}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CanvasPlaceholder
