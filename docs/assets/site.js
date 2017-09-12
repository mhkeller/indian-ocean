// // Filter UI
var filter_input = document.getElementById('filter-input');

filter_input.addEventListener('keyup', function(e) {
  var i, element, children;

  // enter key
  if (e.keyCode === 13) {
    // go to the first displayed item in the toc
    for (i = 0; i < tocElements.length; i++) {
      element = tocElements[i];
      if (!element.classList.contains('display-none')) {
        location.replace(element.firstChild.href);
        return e.preventDefault();
      }
    }
  }

  var match = function() {
    return true;
  };

  var value = this.value.toLowerCase();

  if (!value.match(/^\s*$/)) {
    match = function(element) {
      var html = element.firstChild.innerHTML;
      return html && html.toLowerCase().indexOf(value) !== -1;
    };
  }

  for (i = 0; i < tocElements.length; i++) {
    element = tocElements[i];
    children = Array.from(element.getElementsByTagName('li'));
    if (match(element) || children.some(match)) {
      element.classList.remove('display-none');
    } else {
      element.classList.add('display-none');
    }
  }
});

filter_input.focus();
