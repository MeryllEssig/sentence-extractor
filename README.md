# Sentence Extractor

This project is aimed at providing a tool for auto-extracting sentences from text corpus (txt files) in a specific language, to create a corpus of sentences for Mozilla [Sentence Collector](https://common-voice.github.io/sentence-collector). 

## Install dependencies

```
git clone https://github.com/MeryllEssig/sentence-extractor
npm i -g sentence-splitter
npm install
```

## Usage

```
node index.js --lang="french" --min-words=3 --max-words=14 --max-chars=100 --display-stats=false
# These values are defaults for the program, feel free to experiment others.
```

---

## Features

+ Removes sentences with more than 1 of those characters: [".", "!", "?"]
+ Removes sentences containing digits
+ Removes sentences with more/less than max/min-words
+ Removes sentences with more than max-chars characters;
+ Removes sentences containing unwanted punctuation (see filters.js)