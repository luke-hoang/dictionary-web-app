// load and store custom font and theme
loadCustomSettings();
const customSettings = getCustomSettings();


// toggle font options display when clicking font selector
document
  .getElementById('font-selected')
  .addEventListener('click', () => {
    const fontOptions = document.getElementById('font-options');
    if (fontOptions.style.visibility === 'hidden') {
      fontOptions.style.visibility = 'visible';
    } else {
      fontOptions.style.visibility = 'hidden';
    }
  });


// hide font options when clicking outside the font menu
document.addEventListener('click', (event) => {
  const fontMenu = document.getElementById('font-menu');
  if (!fontMenu.contains(event.target)) {
    document.getElementById('font-options').style.visibility = 'hidden';
  }
});


// switch between custom fonts
document
  .getElementsByName('font')
  .forEach(fontOption => {
    fontOption.addEventListener('change', ({target}) => {
      document.querySelector('#font-selected > span').textContent = target.value;
      document.documentElement.setAttribute('font', target.id);
      document.getElementById('font-options').style.visibility = 'hidden';
      customSettings.font = target.id;
      setCustomSettings(customSettings);
    })
  });


// switch between light and dark themes
document
  .getElementById('dark-theme')
  .addEventListener('change', ({target}) => {
    const rootEl = document.documentElement;
    if (target.checked) {
      rootEl.setAttribute('theme', 'dark');
      customSettings.theme = 'dark';
    } else {
      rootEl.setAttribute('theme', 'light');
      customSettings.theme = 'light';
    }
    setCustomSettings(customSettings);
  });


// search for a word
const searchForm = document.getElementById('search-form');
searchForm.addEventListener('submit', (event) => {
  event.preventDefault();

  // remove existing input error message prior to a new search attempt
  const inputError = document.getElementById('input-error');
  if (inputError !== null) {
    inputError.remove();
  }

  // reset main section
  document.querySelector('main').innerHTML = '';

  // check the input field
  // if there is value, attempt a search
  // else display an input error message
  const searchInput = document.getElementById('search-input');
  if (searchInput.value.trim().length > 0) {
    searchInput.removeAttribute('style');
    search(searchInput.value);
  } else {
    // if the input is blank, then display an input error message
    const message = renderInputError();
    searchInput.style.outline = '1px solid #FF5252';
    searchForm.after(message);
  }
});