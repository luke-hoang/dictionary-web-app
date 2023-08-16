// toggle font options display when clicking font selector
document
  .getElementById('font-selected')
  .addEventListener('click', () => {
    const fontOptions = document.getElementById('font-options');
    if (fontOptions.style.display === 'block') {
      fontOptions.style.display = 'none';
    } else {
      fontOptions.style.display = 'block';
    }
  });


// hide font options when clicking outside the font menu
document.addEventListener('click', (event) => {
  const fontMenu = document.getElementById('font-menu');
  if (!fontMenu.contains(event.target)) {
    document.getElementById('font-options').style.display = 'none';
  }
});


// switch between custom fonts
document
  .getElementsByName('font')
  .forEach(fontOption => {
    fontOption.addEventListener('change', ({target}) => {
      document.querySelector('#font-selected > span').textContent = target.value;
      document.documentElement.setAttribute('font', target.value);
      document.getElementById('font-options').style.display = 'none';
    })
  });


// switch between light and dark themes
document
  .getElementById('dark-theme')
  .addEventListener('change', ({target}) => {
    const rootEl = document.documentElement;
    if (target.checked) {
      rootEl.setAttribute('theme', 'dark');
    } else {
      rootEl.setAttribute('theme', 'light');
    }
  });


// display results
const searchForm = document.getElementById('search-form');
searchForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const inputError = document.getElementById('input-error');
  if (inputError !== null) {
    inputError.remove();
  }

  document.querySelector('main').innerHTML = '';

  const searchInput = document.getElementById('search-input');
  if (searchInput.value.trim().length > 0) {
    search(searchInput.value);
    searchForm.style.border = 'none';
  } else {
    const message = renderInputError();
    searchForm.after(message);
    searchForm.style.border = '1px solid #FF5252'
  }
});