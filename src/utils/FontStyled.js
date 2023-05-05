import { ReactFitty } from 'react-fitty'
import { ReactSVG } from 'react-svg'
import styled from 'styled-components'
import Helpers from './Helpers'
import Nbsp from './nbsp'

const FontContainer = styled(ReactFitty)`
  line-height: 100%;
  letter-spacing: ${(props) => props.spacing}px;
  font-family: ${(props) => props.font}-Wordpix;
`
const FontStyled = (props) => {
  if (props && props.value) {
    if (props.multiline) {
      return (
        <FontContainer
          wrapText
          font={props.value.font}
          spacing={props.value.fontSpacing}
          minSize={8}
          maxSize={props.maxSize}>
          <div style={{ display: 'flex' }}>
            <div>
              {props.value.font === 'italianno' ? <Nbsp count={1} /> : <></>}
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
            <div>
              {props.value.spokenText}
              {props.value.font === 'italianno' ? <Nbsp count={1} /> : <></>}
              {props.space ? <span>&nbsp;</span> : <></>}
            </div>
          </div>
        </FontContainer>
      )
    }
    return (
      <FontContainer
        font={props.value.font}
        spacing={props.value.fontSpacing}
        minSize={8}
        maxSize={props.maxSize}>
        <div>
          {props.value.font === 'italianno' ? <Nbsp count={2} /> : <></>}
          {props.value.title}
          {props.value.font === 'italianno' ? <Nbsp count={2} /> : <></>}
        </div>
      </FontContainer>
    )
  }
}

export default FontStyled
