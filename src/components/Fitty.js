import React from 'react'
import fitty from 'fitty'

class Fitty extends React.Component {
  fitty_props = ['minSize', 'maxSize', 'multiLine']

  constructor(props) {
    super(props)

    this.init = this.init.bind(this)
    this.filtered_props = this.filtered_props.bind(this)
  }

  init(ref) {
    if (ref) {
      fitty(ref, {
        minSize: this.props.minSize || 16,
        maxSize: this.props.maxSize || 512,
        multiLine: this.props.multiLine || true
      })
    }
  }

  filtered_props() {
    return Object.keys(this.props).reduce((props, prop) => {
      if (this.fitty_props.indexOf(prop) !== -1) {
        props[prop] = this.props[prop]
      }
      return props
    }, {})
  }

  render() {
    return (
      <div>
        <div {...this.filtered_props()} ref={this.init}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default Fitty

// export default class extends React.Component {
//   render() {
//     return (
//       <div>
//         <style>{`
//           .parent {
//             width: 100%;
//             height: 100%;
//             padding: 10px;
//             text-align: center;
//             line-height: 100%;
//             overflow: hidden;
//           }
//         `}</style>
//         <div className="parent">
//           <Fitty className="child" minsize={6} maxsize={50}>
//             {this.props.value}
//           </Fitty>
//         </div>
//       </div>
//     )
//   }
// }
