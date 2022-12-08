import React from 'react'
import { DropdownButton } from 'react-bootstrap'
import Helpers from '../../utils/Helpers'

function Dropdown(item, items, itemAction) {
  return (
    <DropdownButton
      variant="outline-dark"
      className={'font-style-dropdown ps-1'}
      disabled={item == null || item === ''}
      id="font-style"
      title={Helpers.getLabelForFontStyle(item ?? 'Font Family')}
      onSelect={itemAction}>
      {items.map((item) => (
        <Dropdown.Item eventKey={item} key={item}>
          <label className={item}>{Helpers.getLabelForFontStyle(item)}</label>
        </Dropdown.Item>
      ))}
    </DropdownButton>
  )
}

export default Dropdown
