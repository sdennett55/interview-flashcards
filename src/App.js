import React, { useState, useEffect } from 'react';
import questions from "./qa_pairs";
import CodeBlock from './CodeBlock';
import { Carousel } from 'react-responsive-carousel';
import cx from 'classnames';
import ReactMarkdown from 'react-markdown';

import "react-responsive-carousel/lib/styles/carousel.min.css";
import './App.css';

const initialData = [
  { question: 'Loading...', answer: 'Loading Answer...' },
  { question: 'Loading...', answer: 'Loading Answer...' },
  { question: 'Loading...', answer: 'Loading Answer...' },
];

const alterData = (data, selectedItem) => data.map((x, index) => {
  console.log('pressed button ', x, selectedItem);
  if (index === selectedItem) {
    x.isShowingAnswer = !x.isShowingAnswer;
  } else {
    x.isShowingAnswer = false;
  }

  return x;
});

const resetData = data => data.map(x => { x.isShowingAnswer = false; return x; });

// Randomize Array Algorithm to guarantee unique order
function sattoloCycle(items) {
  for(var i = items.length; i-- > 1; ) {
    var j = Math.floor(Math.random() * i);
    var tmp = items[i];
    items[i] = items[j];
    items[j] = tmp;
  }
  return items;
}

const reshuffle = ({e, data, setData, selectedItem, setSelectedItem}) => {
  e.stopPropagation();

  const shuffledData = sattoloCycle([...data]);

  setData(shuffledData);

  console.log({data, selectedItem});
}

function App() {
  const [data, setData] = useState(initialData);
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
                {console.log('within render!!')}
                <ReactMarkdown renderers={{ code: CodeBlock }} source={item.question} escapeHtml={false} />
                <button className="Card-reshuffleBtn" onClick={e => reshuffle({e, data, setData, selectedItem, setSelectedItem})}>
                  <svg className="Card-reshuffleIcon" viewBox="0 0 512 512">
                    <path d="M506.24,371.7l-96-80c-4.768-4-11.424-4.8-17.024-2.208c-5.632,2.656-9.216,8.288-9.216,14.496v48h-26.784
                      c-22.208,0-42.496-11.264-54.272-30.08l-103.616-165.76c-23.52-37.664-64.096-60.16-108.544-60.16H0v64h90.784
                      c22.208,0,42.496,11.264,54.272,30.08l103.616,165.76c23.552,37.664,64.128,60.16,108.544,60.16H384v48
                      c0,6.208,3.584,11.84,9.216,14.496c2.144,0.992,4.48,1.504,6.784,1.504c3.68,0,7.328-1.248,10.24-3.712l96-80
                      c3.68-3.04,5.76-7.552,5.76-12.288C512,379.252,509.92,374.74,506.24,371.7z"/>
                    <path d="M506.24,115.7l-96-80c-4.768-3.968-11.424-4.8-17.024-2.176C387.584,36.116,384,41.78,384,47.988v48h-26.784
                      c-44.448,0-85.024,22.496-108.544,60.16l-5.792,9.28l37.728,60.384l22.336-35.744c11.776-18.816,32.064-30.08,54.272-30.08H384v48
                      c0,6.208,3.584,11.872,9.216,14.496c2.144,0.992,4.48,1.504,6.784,1.504c3.68,0,7.328-1.28,10.24-3.712l96-80
                      c3.68-3.04,5.76-7.552,5.76-12.288C512,123.252,509.92,118.74,506.24,115.7z"/>
                    <path d="M167.392,286.164l-22.304,35.744c-11.776,18.816-32.096,30.08-54.304,30.08H0v64h90.784
                      c44.416,0,84.992-22.496,108.544-60.16l5.792-9.28L167.392,286.164z"/>
                  </svg>
                </button>
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
