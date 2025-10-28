export default {
  title: 'Components/Navigation/Header',
  tags: ['autodocs']
}

const Template = ({ label }) => {
  return `<div>${label}</div>`
}

export const Collapsed = Template.bind({})
Collapsed.args = {
  label: 'Collapsed Header'
}

export const Default = Template.bind({})
Default.args = {
  label: 'Default Header'
}

export const Expanded = Template.bind({})
Expanded.args = {
  label: 'Expanded Header'
}

export const WithSearch = Template.bind({})
WithSearch.args = {
  label: 'Header With Search'
}
