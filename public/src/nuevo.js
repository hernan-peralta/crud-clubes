document.querySelector('#defaultOpen').click();

function cambiarPestaña(event, pestaña) {
  event.preventDefault();

  // Get all elements with class="tabcontent" and hide them
  const tabcontent = document.getElementsByClassName('tab-content');
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = 'none';
  }
  // Get all elements with class="tablinks" and remove the class "active"
  const tablinks = document.getElementsByClassName('tab-link');
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(' active', '');
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(pestaña).style.display = 'block';
  event.currentTarget.className += ' active';
}
