const Nbsp = (props) => {
  const items = []
  for (let i = 0; i < props.count; i++) {
    items.push('\u00A0')
  }

  return <>{items}</>
}

export default Nbsp
