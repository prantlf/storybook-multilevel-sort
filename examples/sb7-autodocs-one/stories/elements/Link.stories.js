export default {
  title: 'Elements/Link'
}

const Template = ({ label }) => {
  return `<div>${label}</div>`
}

export const Active = Template.bind({})
Active.args = {
  label: 'Active Link'
}

export const Default = Template.bind({})
Default.args = {
  label: 'Default Link'
}

export const LikeAButton = Template.bind({})
LikeAButton.args = {
  label: 'Link Like a Button'
}
