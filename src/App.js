import React, { useState, useEffect } from 'react';
import questions from "./questions";
import CodeBlock from './CodeBlock';
import { Carousel } from 'react-responsive-carousel';
import cx from 'classnames';
import ReactMarkdown from 'react-markdown';

import "react-responsive-carousel/lib/styles/carousel.min.css";
import './App.css';

const rawData = [
  { question: 'first', answer: 'this is the answer' },
  { question: 'What is your biggest weakness?', answer: 'answer '.repeat(100) },
  { question: 'What is your biggest strength?', answer: 'knowing how to party real well' },
];

rawData.forEach((x, i) => { x.id = i });

const alterData = (data, selectedItem) => data.map((x, index) => {
  console.log('pressed button ', x, selectedItem);
  if (index === selectedItem) {
    x.isShowingAnswer = !x.isShowingAnswer;
  } else {
    x.isShowingAnswer = false;
  }

  return x;
});

// Get an array of filenames
// const questionData = questions.map(x => {
//   return Object.entries(x).reduce((newObj, [question, answer]) => {

//     console.log(question, answer);
//     newObj.question = raw(question);
//     newObj.answer = raw(answer);

//     return newObj;
//   }, {});
// });

console.log('what in the fuck  asdf', questions);

const resetData = data => data.map(x => { x.isShowingAnswer = false; return x; });

function App() {
  const [data, setData] = useState(rawData);
  const [selectedItem, setSelectedItem] = useState(0);

  useEffect(() => {
    var hey = questions.map(q => Object.values(q).reduce((total, item) => { console.log(item); return [...total, item]; }, [])).flat().map(x => fetch(x));
    console.log('help ', hey);
    Promise.all(hey)
      .then(response => Promise.all(response.map(x => x.text())))
      .then(blah => { console.log('after fetching: ', blah); setData(questions.map((q, i) => { q.question = blah[i + i]; q.answer = blah[i + i + 1]; return q; })) })
  }, []);

  return (
    <div className="App">
      <Carousel swipeScrollTolerance={40} showThumbs={false} showStatus={false} showArrows={false} showIndicators={false} onChange={(index) => { setSelectedItem(index); setData(resetData(data)); }} selectedItem={selectedItem} useKeyboardArrows emulateTouch>
        {data.map((item, index) => (
          <div className="Slide" aria-hidden={index === selectedItem ? 'true' : 'false'}>
            <div role="button" tabIndex={index === selectedItem ? null : '-1'} className={cx('Slide-content', {
              'is-flipped': item.isShowingAnswer
            })} type="div" onClick={() => { setData(alterData(data, selectedItem)) }}>
              <div className="Card Card--front">
                <ReactMarkdown renderers={{ code: CodeBlock }} source={item.question} escapeHtml={false} />
              </div>
              <div className="Card Card--back">
                <ReactMarkdown renderers={{ code: CodeBlock }} source={item.answer} escapeHtml={false} />
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div >
  );
}

export default App;
