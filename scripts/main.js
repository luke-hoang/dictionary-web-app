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