# ColorPicker

> A component to select a color.

## Usage

Use the `v-model` directive to control the value of the ColorPicker.

<component-code :props="{"modelValue":"#00C16A"}" :ignore="["modelValue"]" :external="["modelValue"]">

</component-code>

Use the `default-value` prop to set the initial value when you do not need to control its state.

<component-code :props="{"defaultValue":"#00BCD4"}" :ignore="["defaultValue"]">

</component-code>

### RGB Format

Use the `format` prop to set `rgb` value of the ColorPicker.

<component-code :props="{"format":"rgb","modelValue":"rgb(0, 193, 106)"}" :ignore="["modelValue","format"]" :external="["modelValue"]">

</component-code>

### HSL Format

Use the `format` prop to set `hsl` value of the ColorPicker.

<component-code :props="{"format":"hsl","modelValue":"hsl(153, 100%, 37.8%)"}" :ignore="["modelValue","format"]" :external="["modelValue"]">

</component-code>

### CMYK Format

Use the `format` prop to set `cmyk` value of the ColorPicker.

<component-code :props="{"format":"cmyk","modelValue":"cmyk(100%, 0%, 45.08%, 24.31%)"}" :ignore="["modelValue","format"]" :external="["modelValue"]">

</component-code>

### CIELab Format

Use the `format` prop to set `lab` value of the ColorPicker.

<component-code :props="{"format":"lab","modelValue":"lab(68.88% -60.41% 32.55%)"}" :ignore="["modelValue","format"]" :external="["modelValue"]">

</component-code>

### Throttle

Use the `throttle` prop to set the throttle value of the ColorPicker.

<component-code :props="{"throttle":100,"modelValue":"#00C16A"}" :ignore="["modelValue"]" :external="["modelValue"]">

</component-code>

### Size

Use the `size` prop to set the size of the ColorPicker.

<component-code :props="{"size":"xl"}">

</component-code>

### Disabled

Use the `disabled` prop to disable the ColorPicker.

<component-code :props="{"disabled":true}">

</component-code>

## Examples

### As a Color chooser

Use a [Button](/docs/components/button) and a [Popover](/docs/components/popover) component to create a color chooser.

<component-example name="color-picker-chooser-example">

</component-example>

## API

### Props

<component-props>

</component-props>

### Emits

<component-emits>

</component-emits>

## Theme

<component-theme>

</component-theme>

## Changelog

<component-changelog>

</component-changelog>
