export default {
  title: 'Components/Navigation/List'
}

const Template = ({ label }) => {
  return `<div>${label}</div>`
}

export const Collapsed = Template.bind({});
Collapsed.args = {
  label: 'Collapsed List'
}

export const Default = Template.bind({});
Default.args = {
  label: 'Default List'
}

export const Expanded = Template.bind({});
Expanded.args = {
  label: 'Expanded List'
}
