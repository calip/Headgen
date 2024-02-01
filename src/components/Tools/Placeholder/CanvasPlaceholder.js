import { useEffect, useState } from 'react'
import FontStyled from '../../../utils/FontStyled'
import TableItem from '../../Table/TableItem'
import Helpers from '../../../utils/Helpers'

function CanvasPlaceholder(props) {
  const [loading, setLoading] = useState(true)
  const [placeholder, setPlaceholder] = useState([])
  const [templateItem, setTemplateItem] = useState(null)
  const [itemSize, setItemSize] = useState(512)
  const onItemSelect = () => {}

  useEffect(() => {
    setLoading(true)
    Helpers.fetchJson(`${Helpers.getBaseUrl()}/config/placeholder/placeholder.json`).then(
      (result) => {
        const emptyPlaceholder = Helpers.setEmptyPlaceholder(result)
        const curOrientation = Helpers.getCurrentOrientation(props.height, props.width)
        const initPlaceholder = props.placeholder.length > 0 ? props.placeholder : emptyPlaceholder
        const curPlaceholder = initPlaceholder.find((c) => c.orientation === curOrientation)
        const data = result.length > 0 && result.find((temp) => temp.id === curPlaceholder.value)
        setPlaceholder(data)
        const template = props.template.find((temp) => temp.id === data.template)
        setTemplateItem(template)
        if (curOrientation === 'landscape') {
          const initHeight = props.height - Math.abs(props.padding * 2)
          console.log(Math.abs(initHeight / 2))
          setItemSize(Math.abs(initHeight / 2))
        }
        setLoading(false)
      }
    )
  }, [])

  if (!loading) {
    return (
      <div
        style={{
          display: 'table-cell',
          verticalAlign: 'middle',
          opacity: '0.3',
          pointerEvents: 'none'
        }}>
        <div
          style={{
            overflow: 'hidden',
            display: 'block',
            padding: '1px',
            transition: '0.5s ease-out',
            maxHeight: `${props.height - Math.abs(props.padding * 2)}px`
          }}>
          <div className="pixgen-title-canvas">
            <div className="pix-title-container">
              <div className="pix-title" key={itemSize}>
                <FontStyled
                  value={placeholder}
                  multiline={false}
                  maxSize={itemSize}
                  placeholder={true}
                />
              </div>
            </div>
          </div>
          <div>
            <TableItem
              imgPath={props.imgPath}
              fontColor={props.fontColor}
              maxSize={props.itemSize}
              items={placeholder.items.filter((e) => {
                return e.realText.length > 0 || e.icon.length > 0 || e.spokenText.length > 0
              })}
              icons={props.icons}
              template={templateItem}
              onItemSelect={onItemSelect}
              itemSelected={null}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default CanvasPlaceholder
