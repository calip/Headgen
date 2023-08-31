import { ReactFitty } from 'react-fitty'
import { ReactSVG } from 'react-svg'
import styled from 'styled-components'
import Helpers from './Helpers'
import Nbsp from './nbsp'

const FontContainer = styled(ReactFitty)`
  line-height: 100%;
  text-indent: ${(props) => props.spacing}em;
  text-align: center;
  letter-spacing: ${(props) => props.spacing}em;
  font-family: ${(props) => props.font}-Wordpix;
`

const FontStyled = (props) => {
  if (props && props.value) {
    if (props.multiline) {
      const realTextLeft = props.value.realText.slice(0, 1)
      const realTextRight = props.value.realText.slice(-1)
      const spokenTextLeft = props.value.spokenText.slice(0, 1)
      const spokenTextRight = props.value.spokenText.slice(-1)

      const leftRealLetters = Helpers.italiannoSpace().find((char) => {
        if (realTextLeft.length > 0) {
          if (char.letter.includes(realTextLeft)) {
            return char
          }
        }
      })

      const rightRealLetters = Helpers.italiannoSpace().find((char) => {
        if (realTextRight.length > 0) {
          if (char.letter.includes(realTextRight)) {
            return char
          }
        }
      })

      const leftSpokenLetters = Helpers.italiannoSpace().find((char) => {
        if (spokenTextLeft.length > 0) {
          if (char.letter.includes(spokenTextLeft)) {
            return char
          }
        }
      })

      const rightSpokenLetters = Helpers.italiannoSpace().find((char) => {
        if (spokenTextRight.length > 0) {
          if (char.letter.includes(spokenTextRight)) {
            return char
          }
        }
      })

      const leftRealSpace =
        leftRealLetters && props.value.fontSpacing < 1 ? leftRealLetters.leftSpace : 0
      const rightRealSpace =
        rightRealLetters && props.value.fontSpacing < 1 ? rightRealLetters.rightSpace : 0
      const leftSpokenSpace =
        leftSpokenLetters && props.value.fontSpacing < 1 ? leftSpokenLetters.leftSpace : 0
      const rightSpokenSpace =
        rightSpokenLetters && props.value.fontSpacing < 1 ? rightSpokenLetters.rightSpace : 0
      const defRightRealSpace = props.value.fontSpacing > 0 ? 0 : 1
      const defLeftSpokenSpace = props.value.fontSpacing > 0 ? 0 : 1

      return (
        <FontContainer
          wrapText
          font={props.value.font}
          spacing={props.value.fontSpacing}
          minSize={1}
          maxSize={props.maxSize}>
          <div style={{ display: 'flex', width: '100%', height: '100%', boxSizing: 'border-box' }}>
            <div>
              {props.value.font === 'italianno' && props.value.realText.length > 0 ? (
                <Nbsp count={leftRealSpace} />
              ) : (
                <></>
              )}
              {props.value.realText.length > 0 ? props.value.realText : ' '}
              {props.value.font === 'italianno' && props.value.realText.length > 0 ? (
                <Nbsp count={props.value.icon ? defRightRealSpace : rightRealSpace} />
              ) : (
                <></>
              )}
            </div>
            {props.value.icon ? (
              <div>
                <div style={{ position: 'relative' }}>
                  <div style={{ visibility: 'hidden', width: '100%', height: '100%' }}>
                    {Helpers.getIconLetter(props.value.font)}
                  </div>
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
                        const paths = svg.querySelectorAll('path')
                        for (let i = 0; i < paths.length; i++) {
                          paths[i].setAttribute('style', `fill: ${props.fontColor}`)
                        }
                        svg.setAttribute('style', Helpers.getIconStyle(props.value.font))
                      }}
                      src={`${props.imgPath}${Helpers.getIconForButton(
                        props.icons,
                        props.value.icon
                      )}`}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
            <div>
              {props.value.font === 'italianno' && props.value.spokenText.length > 0 ? (
                <Nbsp count={props.value.icon ? defLeftSpokenSpace : leftSpokenSpace} />
              ) : (
                <></>
              )}
              {props.value.spokenText.length > 0 ? props.value.spokenText : ' '}
              {props.value.font === 'italianno' && props.value.spokenText.length > 0 ? (
                <Nbsp count={rightSpokenSpace} />
              ) : (
                <></>
              )}
              {props.value.spokenText.length > 0 ? <Nbsp count={props.space} /> : <></>}
            </div>
          </div>
        </FontContainer>
      )
    } else {
      const titleLeft = props.value.title.slice(0, 1)
      const titleRight = props.value.title.slice(-1)

      const leftTitleLetters = Helpers.italiannoSpace().find((char) => {
        if (titleLeft.length > 0) {
          if (char.letter.includes(titleLeft)) {
            return char
          }
        }
      })

      const rightTitleLetters = Helpers.italiannoSpace().find((char) => {
        if (titleRight.length > 0) {
          if (char.letter.includes(titleRight)) {
            return char
          }
        }
      })

      const leftTitlepace = leftTitleLetters ? leftTitleLetters.leftSpace : 0
      const righTitleSpace = rightTitleLetters ? rightTitleLetters.rightSpace : 1

      return (
        <FontContainer
          wrapText
          font={props.value.font}
          spacing={props.value.fontSpacing}
          minSize={1}
          maxSize={props.maxSize}>
          <div>
            {props.value.font === 'italianno' ? <Nbsp count={leftTitlepace} /> : <></>}
            {props.value.title}
            {props.value.font === 'italianno' ? <Nbsp count={righTitleSpace} /> : <></>}
          </div>
        </FontContainer>
      )
    }
  }
}

export default FontStyled
