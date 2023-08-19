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
  
  const confusedFaceEmoji = document.createElement('p');
  confusedFaceEmoji.setAttribute('class', 'emoji');
  confusedFaceEmoji.innerHTML = '&#128533';
  searchErrorArticle.appendChild(confusedFaceEmoji);

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

  const wordHeading = document.createElement('h1');
  wordHeading.textContent = result.word;
  searchResultArticle.appendChild(wordHeading);

  const phoneticsSection = createPhoneticsSection(result.phonetic, result.phonetics);
  searchResultArticle.appendChild(phoneticsSection);

  const meaningsSection = createMeaningsSection(result.meanings);
  searchResultArticle.appendChild(meaningsSection);

  const sourcesSection = createSourcesSection(result.sourceUrls);
  searchResultArticle.appendChild(sourcesSection);

  const main = document.querySelector('main');
  main.appendChild(searchResultArticle);
}


function createPhoneticsSection(phonetic, phonetics) {
  const phoneticsSection = document.createElement('section');
  phoneticsSection.setAttribute('class', 'phonetics');

  const phoneticHeading = document.createElement('h2');
  phoneticHeading.textContent = phonetic;
  phoneticsSection.appendChild(phoneticHeading);

  for (const phonetic of phonetics) {
    const parser = new DOMParser;

    if (phonetic.text && phonetic.audio) {
      const phoneticSection = document.createElement('section');
      phoneticSection.setAttribute('class', 'phonetic');
      phoneticsSection.appendChild(phoneticSection);
      
      const startIndex = phonetic.audio.lastIndexOf('-') + 1;
      const endIndex = phonetic.audio.lastIndexOf('.');
      const audioId = phonetic.audio.slice(startIndex, endIndex);

      const phoneticAudio = document.createElement('audio');
      phoneticAudio.setAttribute('id', audioId);
      phoneticSection.appendChild(phoneticAudio);

      const phoneticSource = document.createElement('source');
      phoneticSource.setAttribute('src', phonetic.audio);
      phoneticAudio.appendChild(phoneticSource);

      const phoneticParagraph = document.createElement('p');
      phoneticParagraph.textContent = audioId.toUpperCase();
      phoneticSection.appendChild(phoneticParagraph);
      const playIconString = (
        `<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 75 75" onclick="playAudio('${audioId}')">
          <g class="play-icon" fill="#A445ED" fill-rule="evenodd">
            <circle cx="37.5" cy="37.5" r="37.5" opacity=".25"/>
            <path d="M29 27v21l21-10.5z"/>
          </g>
        </svg>`
      );
      const playIcon = parser.parseFromString(playIconString, 'text/html');
      phoneticSection.appendChild(playIcon.body.firstChild);
    }
  }
  
  return phoneticsSection;
}


function playAudio(audioId) {
  document.getElementById(audioId).play();
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


function createSourcesSection(sources) {
  const sourcesSection = document.createElement('section');
  sourcesSection.setAttribute('class', 'sources');

  const sourcesHeading = document.createElement('h4');  
  if (sources.length > 1) {
    sourcesHeading.textContent = 'Sources';
  } else {
    sourcesHeading.textContent = 'Source';
  }
  sourcesSection.appendChild(sourcesHeading);

  const sourcesDiv = document.createElement('div');
  sourcesDiv.setAttribute('class', 'source-links');
  sourcesSection.appendChild(sourcesDiv);

  for (const source of sources) {

    const sourceDiv = document.createElement('div');
    sourceDiv.setAttribute('class', 'source-link');
    sourcesDiv.appendChild(sourceDiv);

    const sourceAnchor = document.createElement('a');
    sourceAnchor.setAttribute('class', 'source-url')
    sourceAnchor.setAttribute('target', '_blank');
    sourceAnchor.setAttribute('href', source);
    sourceAnchor.textContent = source;
    sourceDiv.appendChild(sourceAnchor);

    const newWindowIcon = document.createElement('img');
    newWindowIcon.setAttribute('src', './images/icon-new-window.svg');
    sourceDiv.appendChild(newWindowIcon);
  }

  return sourcesSection;
}


function loadCustomSettings() {
  const customSettings = getCustomSettings();
  
  const root = document.documentElement;
  
  const fontOption = document.getElementById(customSettings.font);
  fontOption.checked = true;
  document.querySelector('#font-selected > span').textContent = fontOption.value;
  root.setAttribute('font', fontOption.id);

  root.setAttribute('theme', customSettings.theme);
  if (customSettings.theme === 'dark') {
    document.getElementById('dark-theme').checked = true;
  }
}


function getCustomSettings() {
  const appName = 'dictionary-web-app';
  const customSettings = localStorage.getItem(appName);
  if (customSettings === null) {
    localStorage.setItem(
      appName,
      JSON.stringify({
        font:'sans-serif',
        theme: window.matchMedia("(prefers-color-scheme: dark)").matches ? 'dark' : 'light'
      })
    );
  }
  return JSON.parse(localStorage.getItem(appName));
}


function setCustomSettings(customSettings) {
  localStorage.setItem(
    'dictionary-web-app',
    JSON.stringify(customSettings)
  );
}