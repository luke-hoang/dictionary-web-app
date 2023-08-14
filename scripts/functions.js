async function search(word) {
  const endpoint = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  const response = await fetch(endpoint);
  
  if (response.ok) {
    const results = await response.json();
    results.forEach(result => {
      renderSearchResult(result);
    });
  } else {
    const error = await response.json();
    renderSearchError(error);
  }
}


function renderInputError() {
  const inputErrorParagraph = document.createElement('p');
  inputErrorParagraph.setAttribute('id', 'input-error');
  inputErrorParagraph.textContent = 'Whoops, can\'t be empty...';
  return inputErrorParagraph;
}


function renderSearchError(error) {
  const searchErrorArticle = document.createElement('article');
  searchErrorArticle.setAttribute('id', 'search-error');
    
  const searchErrorHeading = document.createElement('h2');
  searchErrorHeading.textContent = error.title;
  searchErrorArticle.appendChild(searchErrorHeading);
  
  const searchErrorParagraph = document.createElement('p');
  searchErrorParagraph.textContent = `${error.message} ${error.resolution}`;
  searchErrorArticle.appendChild(searchErrorParagraph);

  const main = document.querySelector('main');
  main.appendChild(searchErrorArticle);
}


function renderSearchResult(result) {
  const searchResultArticle = document.createElement('article');
  searchResultArticle.setAttribute('class', 'search-result');
  
  const phoneticSection = createPhoneticSection(result.word, result.phonetic);
  searchResultArticle.appendChild(phoneticSection);

  const meaningsSection = createMeaningsSection(result.meanings);
  searchResultArticle.appendChild(meaningsSection);

  const sourcesSection = createSourceSection(result.sourceUrls);
  searchResultArticle.appendChild(sourcesSection);

  const main = document.querySelector('main');
  main.appendChild(searchResultArticle);
}


function createPhoneticSection(word, phonetic) {
  const phoneticSection = document.createElement('section');
  phoneticSection.setAttribute('class', 'phonetic');

  const wordHeading = document.createElement('h1');
  wordHeading.textContent = word;
  phoneticSection.appendChild(wordHeading);

  const phoneticHeading = document.createElement('h2');
  phoneticHeading.textContent = phonetic;
  phoneticSection.appendChild(phoneticHeading);

  return phoneticSection;
}


function createMeaningsSection(meanings) {
  const meaningsSection = document.createElement('section');
  meaningsSection.setAttribute('class', 'meanings');

  for (const meaning of meanings) {
    const meaningSection = document.createElement('section');
    meaningSection.setAttribute('class', 'meaning'); 

    const partOfSpeech = document.createElement('h2');
    partOfSpeech.setAttribute('class', 'part-of-speech');
    partOfSpeech.textContent = meaning.partOfSpeech;
    meaningSection.appendChild(partOfSpeech);

    const definitions = createDefinitionsSection(meaning.definitions);
    meaningSection.appendChild(definitions);

    if (meaning.synonyms.length > 0 ) {
      const synoynmsSection = createSynonymsSection(meaning.synonyms);
      meaningSection.appendChild(synoynmsSection);
    }

    if (meaning.antonyms.length > 0) {
      const antonymsSection = createAntonymsSection(meaning.antonyms);
      meaningSection.appendChild(antonymsSection);
    }

    meaningsSection.append(meaningSection);
  }

  return meaningsSection;
}


function createDefinitionsSection(definitions) {
  const definitionsSection = document.createElement('section');
  definitionsSection.setAttribute('class', 'definitions');

  const definitionsHeading = document.createElement('h3');
  definitionsHeading.textContent = 'Meaning'
  definitionsSection.appendChild(definitionsHeading);

  const definitionList = document.createElement('ul');
  for (const obj of definitions) {
    const definitionItem = document.createElement('li');

    const definitionParagph = document.createElement('p');
    definitionParagph.setAttribute('class', 'definition');
    definitionParagph.textContent = obj.definition;
    definitionItem.appendChild(definitionParagph);

    if (obj.hasOwnProperty('example')) {
      const exampleParagraph = document.createElement('p');
      exampleParagraph.setAttribute('class', 'example');
      exampleParagraph.textContent = obj.example;
      definitionItem.appendChild(exampleParagraph);
    }
    
    definitionList.appendChild(definitionItem);
  }

  definitionsSection.append(definitionList);

  return definitionsSection;
}


function createSynonymsSection(synonynms) {
  const synonymsSection = document.createElement('section');
  synonymsSection.setAttribute('class', 'synonyms');

  const synonymsHeading = document.createElement('h3');
  synonymsHeading.textContent = 'Synonyms';
  synonymsSection.appendChild(synonymsHeading);

  const synonymsParagraph = document.createElement('p');
  synonymsParagraph.textContent = synonynms.join(', ');
  synonymsSection.appendChild(synonymsParagraph);

  return synonymsSection;
}


function createAntonymsSection(antonynms) {
  const antonynmsSection = document.createElement('section');
  antonynmsSection.setAttribute('class', 'antonyms');

  const antonymsHeading = document.createElement('h3');
  antonymsHeading.textContent = 'Antonyms';
  antonynmsSection.appendChild(antonymsHeading);

  const antonymsParagraph = document.createElement('p');
  antonymsParagraph.textContent = antonynms.join(', ');
  antonynmsSection.appendChild(antonymsParagraph);

  return antonynmsSection;
}


function createSourceSection(sources) {
  const sourceSection = document.createElement('section');
  sourceSection.setAttribute('class', 'source');

  const sourceHeading = document.createElement('h4');  
  if (sources.length > 1) {
    sourceHeading.textContent = 'Sources';
  } else {
    sourceHeading.textContent = 'Source';
  }
  sourceSection.appendChild(sourceHeading);

  const sourceDiv = document.createElement('div');
  for (const source of sources) {
    const sourceAnchor = document.createElement('a');
    sourceAnchor.setAttribute('class', 'source-link')
    sourceAnchor.setAttribute('target', '_blank');
    sourceAnchor.setAttribute('href', source);
    sourceAnchor.textContent = source;

    const newWindowIcon = document.createElement('img');
    newWindowIcon.setAttribute('src', './assets/images/icon-new-window.svg');
    sourceAnchor.appendChild(newWindowIcon);

    sourceDiv.appendChild(sourceAnchor);
  }

  sourceSection.appendChild(sourceDiv);

  return sourceSection;
}
