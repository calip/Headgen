import i18n from '../../../utils/i18n'
import './TourModal.scss'

const TourModal = ({ index, size, step, skipProps, primaryProps, tooltipProps, isLastStep }) => (
  <div {...tooltipProps} className="pixgen-tour">
    <div className="pixgen-tour-content">
      <div>{step.content}</div>
    </div>
    <div className="pixgen-tour-footer">
      <div>
        <button {...skipProps}>{i18n.t('Skip')}</button>
      </div>
      <button {...primaryProps}>
        <span>{isLastStep ? i18n.t('Close') : `${i18n.t('Next')} ${index + 1}/${size}`}</span>
      </button>
    </div>
  </div>
)

export default TourModal
