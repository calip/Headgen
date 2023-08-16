import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAlignLeft, faSave } from '@fortawesome/free-solid-svg-icons'
import { Navbar, Button, Nav, Dropdown, DropdownButton, FormCheck } from 'react-bootstrap'
import './Navbar.scss'
import DropdownToggle from 'react-bootstrap/esm/DropdownToggle'
import DropdownMenu from 'react-bootstrap/esm/DropdownMenu'
import DropdownItem from 'react-bootstrap/esm/DropdownItem'
import Helpers from '../../utils/Helpers'
import i18n from '../../utils/i18n'

const FONT_SPACING = ['0', '0.3', '0.5', '0.7', '1', '1.3']

function NavBar({ toggle, font, items, config, admin, downloadFn, addToCart }) {
  const currentWidth = items.inputItem.width
  const currentHeight = items.inputItem.height
  const currentUnit = items.inputItem.unit
  const currentFontSelection = items.inputItem.fontSelection
  const currentSpaceSelection = items.inputItem.spaceSelection
  const currentFonts = items.inputItem.fonts

  const onFontTypeChange = (eventkey) => {
    font.setFontType(eventkey)
  }

  const onFontSpaceChange = (eventkey) => {
    font.setFontSpacing(eventkey)
  }

  const onSwitchChange = (event) => {
    admin.setIsAdmin(event.target.checked)
  }

  return (
    <Navbar bg="light" className="pixgen-navbar shadow-sm p-3 bg-white" expand>
      <Button variant="outline-secondary" size="sm" onClick={toggle}>
        <FontAwesomeIcon icon={faAlignLeft} />
      </Button>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="ms-auto me-auto pixgen-nav" navbar>
          {currentFontSelection ? (
            <DropdownButton
              variant="outline-dark"
              className={'font-style-dropdown ps-1'}
              disabled={font.fontType == null || font.fontType === ''}
              id="font-style"
              size="sm"
              title={Helpers.getLabelForFontStyle(font.fontType ?? i18n.t('FontFamily'))}
              onSelect={onFontTypeChange}>
              {currentFonts.map((fontType) => (
                <Dropdown.Item eventKey={fontType} key={fontType}>
                  <label className={fontType}>{Helpers.getLabelForFontStyle(fontType)}</label>
                </Dropdown.Item>
              ))}
            </DropdownButton>
          ) : (
            <></>
          )}
          {currentSpaceSelection ? (
            <DropdownButton
              variant="outline-dark"
              className={'font-style-dropdown ps-1'}
              disabled={font.fontSpacing == null}
              id="font-space"
              size="sm"
              title={Helpers.getLabelForFontSpacing(font.fontSpacing ?? i18n.t('Spacing'))}
              onSelect={onFontSpaceChange}>
              {FONT_SPACING.map((fontSpace) => (
                <Dropdown.Item eventKey={fontSpace} key={fontSpace}>
                  <label className={fontSpace}>{Helpers.getLabelForFontSpacing(fontSpace)}</label>
                </Dropdown.Item>
              ))}
            </DropdownButton>
          ) : (
            <></>
          )}
        </Nav>
        <Nav>
          {config.admin ? (
            <FormCheck
              type="switch"
              label="Admin"
              className="switch-mode"
              checked={admin.isAdmin}
              onChange={onSwitchChange}
              reverse
            />
          ) : (
            <></>
          )}
          {admin.isAdmin ? (
            <Dropdown align="end">
              <DropdownToggle size="sm" variant="outline-primary">
                <FontAwesomeIcon icon={faSave} />
              </DropdownToggle>

              <DropdownMenu>
                <DropdownItem size="sm" onClick={downloadFn('low')}>
                  <small>{i18n.t('LowerQuality')}</small>
                </DropdownItem>
                <DropdownItem size="sm" onClick={downloadFn('high')}>
                  <small>
                    {i18n.t('HighResolution')} ({currentWidth} x {currentHeight} {currentUnit})
                  </small>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <>
              {config.wordpress.active ? (
                <Button variant="primary" size="sm" onClick={addToCart}>
                  {i18n.t('AddToCart')}
                </Button>
              ) : (
                <></>
              )}
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default NavBar
