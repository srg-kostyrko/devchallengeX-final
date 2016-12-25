export default {
  init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
    element.onchange = function () {
      var url = URL.createObjectURL(this.files[0])
      valueAccessor()(url)
    }
  }
}
