export default {
  title: 'Elements/Button'
}

const Template = ({ label }) => {
  return `<div>${label}</div>`
}

export const Active = Template.bind({});
Active.args = {
  label: 'Active Button'
}

export const Default = Template.bind({})
Default.args = {
  label: 'Default Button'
}
