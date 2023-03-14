import React from 'react'
import './Loader.scss'
import i18n from '../../utils/i18n'

function Loader() {
  return (
    <div className="Loader">
      <p>{i18n.t('Initializing')}...</p>
    </div>
  )
}

export default Loader
