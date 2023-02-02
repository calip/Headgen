import { ReactFitty } from 'react-fitty'
import { ReactSVG } from 'react-svg'
import styled from 'styled-components'
import Helpers from './Helpers'

const FontContainer = styled(ReactFitty)`
  line-height: 100%;
  font-family: ${(props) => props.font}-Wordpix;
`
const FontStyled = (props) => {
  if (props && props.value) {
    if (props.multiline) {
      return (
        <FontContainer wrapText font={props.value.font}>
          <div style={{ display: 'flex' }}>
            <div
              style={{
                letterSpacing: `${props.value.fontSpacing}px`
              }}>
              {props.value.realText}
            </div>
            {props.value.icon ? (
              <div>
                <div style={{ position: 'relative' }}>
                  <div style={{ visibility: 'hidden', width: '100%', height: '100%' }}>W</div>
                  <div
                    className="parent-icon-container"
                    style={{
                      width: '100%',
                      height: '100%',
                      zIndex: 10,
                      position: 'absolute',
                      top: 0
                    }}>
                    <ReactSVG
                      beforeInjection={(svg) => {
                        const size = Helpers.getIconSizeForFontStyle(props.value.font)
                        svg.setAttribute(
                          'style',
                          `width: ${size}; height: ${size}; display: ${props.value.iconDisplay}`
                        )
                      }}
                      src={Helpers.getIconForButton(props.icons, props.value.icon)}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
            <div
              style={{
                letterSpacing: `${props.value.fontSpacing}px`
              }}>
              {props.value.spokenText}
              {props.space ? <span>&nbsp;</span> : <></>}
            </div>
          </div>
        </FontContainer>
      )
    }
    return (
      <FontContainer font={props.value.font}>
        <div style={{ letterSpacing: `${props.value.fontSpacing}px` }}>{props.value.title}</div>
      </FontContainer>
    )
  }
}

export default FontStyled
