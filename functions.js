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
  const searchResultArticle = document.createElement('article');
  searchResultArticle.setAttribute('class', 'search-result');
  
  const phoneticSection = createPhoneticSection(result.word, result.phonetic);
  searchResultArticle.appendChild(phoneticSection);

  const meaningsSection = createMeaningsSection(result.meanings);
  searchResultArticle.appendChild(meaningsSection);

  const sourcesSection = createSourcesSection(result.sourceUrls);
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
      const antonyms = generateAntonyms(meaning.antonyms);
      meaningSection.appendChild(antonyms);
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


function generateAntonyms(antonynms) {
  const content = document.createElement('section');
  content.setAttribute('class', 'antonyms');

  const heading = document.createElement('h3');
  heading.textContent = 'Antonyms';
  content.appendChild(heading);

  const paragraph = document.createElement('p');
  paragraph.textContent = antonynms.join(', ');
  content.appendChild(paragraph);

  return content;
}


function createSourcesSection(sources) {
  const sourcesSection = document.createElement('section');
  sourcesSection.setAttribute('class', 'sources');
  
  for (const source of sources) {
    const sourceSection = createSourceSection(source);
    sourcesSection.appendChild(sourceSection);
  }

  return sourcesSection;
}


function createSourceSection(source) {
  const sourceSection = document.createElement('section');
  sourceSection.setAttribute('class', 'source');

  const sourceHeading = document.createElement('h3');
  sourceHeading.textContent = 'Source';
  sourceSection.appendChild(sourceHeading);

  const sourceAnchor = document.createElement('a');
  sourceAnchor.setAttribute('class', 'source')
  sourceAnchor.setAttribute('target', '_blank');
  sourceAnchor.setAttribute('href', source);
  sourceAnchor.textContent = source;
  sourceSection.appendChild(sourceAnchor);

  const newWindowIcon = document.createElement('img');
  newWindowIcon.setAttribute('src', './assets/images/icon-new-window.svg');
  sourceSection.appendChild(newWindowIcon);

  return sourceSection;
}
