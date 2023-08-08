
const searchForm = document.getElementById('search');

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const inputError = document.getElementById('input-error');
  if (inputError !== null) {
    inputError.remove();
  }

  document.querySelector('main').innerHTML = '';
  
  const searchText = document.getElementById('search-text');
  if (searchText.value.length > 0) {
    search(searchText.value);
  } else {
    const message = renderInputError();
    searchForm.appendChild(message);
  }
});


async function search(word) {
  const endpoint = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  const response = await fetch(endpoint);
  
  if (response.ok) {
    const results = await response.json();
    results.forEach(result => {
      renderResult(result);
    });
  } else {
    const error = await response.json();
    renderSearchError(error);
  }
}


function renderInputError() {
  const paragraph = document.createElement('p');
  paragraph.setAttribute('id', 'input-error');
  paragraph.textContent = 'Whoops, can\'t be empty...';
  return paragraph;
}


function renderSearchError(error) {
  const content = document.createElement('article');
  
  const heading = document.createElement('h2');
  heading.textContent = error.title;
  content.appendChild(heading);
  
  const paragraph = document.createElement('p');
  paragraph.textContent = `${error.message} ${error.resolution}`;
  content.appendChild(paragraph);

  const main = document.querySelector('main');
  main.appendChild(content);
}


function renderResult(result) {
  const content = document.createElement('article');
  
  const word = document.createElement('h2');
  word.textContent = result.word;
  content.appendChild(word);

  const phonetic = document.createElement('h3');
  phonetic.textContent = result.phonetic;
  content.appendChild(phonetic);

  const meanings = renderMeanings(result.meanings);
  content.appendChild(meanings);

  const source = renderUrls(result.sourceUrls);
  content.appendChild(source);

  const main = document.querySelector('main');
  main.appendChild(content);
}


function renderMeanings(meanings) {
  const content = document.createElement('section');

  for (const meaning of meanings) {
    const partOfSpeech = document.createElement('h4');
    partOfSpeech.textContent = meaning.partOfSpeech;
    content.appendChild(partOfSpeech);

    const definitions = renderDefinitions(meaning.definitions);
    content.appendChild(definitions);

    if (meaning.synonyms.length > 0 ) {
      const synoynms = renderSynonyms(meaning.synonyms);
      content.appendChild(synoynms);
    }

    if (meaning.antonyms.length > 0) {
      const antonyms = renderAntonyms(meaning.antonyms);
      content.appendChild(antonyms);
    }
  }

  return content;
}


function renderDefinitions(definitions) {
  const content = document.createElement('section');
  
  const heading = document.createElement('h5');
  heading.textContent = 'Meaning'
  content.appendChild(heading);

  const list = document.createElement('ul');

  for (const obj of definitions) {
    const item = document.createElement('li');

    const definition = document.createElement('p');
    definition.textContent = obj.definition;
    item.appendChild(definition);

    if (obj.hasOwnProperty('example')) {
      const example = document.createElement('p');
      example.textContent = obj.example;
      item.appendChild(example);
    }
    
    list.appendChild(item);
  }

  content.append(list);

  return content;
}


function renderSynonyms(synonynms) {
  const content = document.createElement('section');

  const heading = document.createElement('h5');
  heading.textContent = 'Synonyms';
  content.appendChild(heading);

  const paragraph = document.createElement('p');
  paragraph.textContent = synonynms.join(', ');
  content.appendChild(paragraph);

  return content;
}


function renderAntonyms(antonynms) {
  const content = document.createElement('section');

  const heading = document.createElement('h5');
  heading.textContent = 'Antonyms';
  content.appendChild(heading);

  const paragraph = document.createElement('p');
  paragraph.textContent = antonynms.join(', ');
  content.appendChild(paragraph);

  return content;
}


function renderUrls(urls) {
  const content = document.createElement('section');

  const heading = document.createElement('h5');
  heading.textContent = 'Sources';
  content.appendChild(heading);

  for (const url of urls) {
    const anchor = document.createElement('a');
    anchor.setAttribute('href', url);
    anchor.setAttribute('target', '_blank');
    anchor.textContent = url;
    content.appendChild(anchor);
  }

  return content;
}