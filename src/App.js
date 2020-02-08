import React, { useState, useEffect } from 'react';
import questions from "./qa_pairs";
import CodeBlock from './CodeBlock';
import { Carousel } from 'react-responsive-carousel';
import cx from 'classnames';
import ReactMarkdown from 'react-markdown';
import { CheckIcon, XIcon, RefreshIcon } from './icons';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import './App.css';

const initialData = [
  { question: '## Loading...', answer: '## Loading Answer...' },
  { question: '## Loading...', answer: '## Loading Answer...' },
  { question: '## Loading...', answer: '## Loading Answer...' },
];

const alterData = (data, selectedItem) => data.map((x, index) => {
  var temp = { ...x };
  if (index === selectedItem) {
    temp.isShowingAnswer = !x.isShowingAnswer;
  } else {
    temp.isShowingAnswer = false;
  }

  return temp;
});

const resetData = data => data.map(x => {
  var temp = { ...x };
  temp.isShowingAnswer = false;
  return temp;
});

const reshuffle = ({ e, filteredData, selectedItem, setSelectedItem }) => {
  if (e) {
    e.stopPropagation();
  }

  if (selectedItem < filteredData.length - 1) {
    setSelectedItem(selectedItem + 1);
  } else {
    setSelectedItem(0);
  }
}

const handleStatusClick = ({ e, filteredData, setFilteredData, selectedItem, setSelectedItem, status }) => {
  e.stopPropagation();

  if (status === 'good') {
    const temp = [...filteredData].map(x => ({ ...x }));
    temp.splice(selectedItem, 1);
    setFilteredData(temp);
  } else {
    reshuffle({ selectedItem, filteredData, setSelectedItem });
  }
}

const fullRefresh = ({ e, data, setFilteredData, setSelectedItem }) => {
  if (e) {
    e.stopPropagation();
  }
  setFilteredData(data);
};

function App() {
  const [data, setData] = useState(initialData);
  const [selectedItem, setSelectedItem] = useState(0);
  const [filteredData, setFilteredData] = useState(initialData);

  useEffect(() => {
    if (filteredData.length > 0 && selectedItem > filteredData.length - 1) {
      setSelectedItem(filteredData.length - 1);
    }
  }, [filteredData.length]);

  useEffect(() => {
    var fetchMarkdownPromises = questions.map(q => Object.values(q).reduce((total, item) => { return [...total, item]; }, [])).flat().map(x => fetch(x));
    Promise.all(fetchMarkdownPromises)
      .then(response => Promise.all(response.map(x => x.text())))
      .then(blah => {
        var temp = questions.map((q, i) => { q.question = blah[i + i]; q.answer = blah[i + i + 1]; return q; });
        setData([...temp]);
        setFilteredData([...temp]);
      });
  }, []);

  return (
    <div className="App">
      <Carousel swipeScrollTolerance={45} showThumbs={false} showStatus={false} showArrows={false} showIndicators={false} onChange={(index) => { setSelectedItem(index); setFilteredData(resetData(filteredData)); }} selectedItem={selectedItem} useKeyboardArrows emulateTouch>
        {filteredData.map((item, index) => (
          <div className={cx('Slide', {
            'is-flipped': item.isShowingAnswer
          })} aria-hidden={index === selectedItem ? 'true' : 'false'}>
            <div role="button" tabIndex={index === selectedItem ? null : '-1'} className="Slide-content" type="div" onClick={() => { setFilteredData(alterData(filteredData, selectedItem)) }}>
              <div className="Card Card--front">
                <div className="Card-num">{`${index + 1}/${filteredData.length}`}</div>
                <ReactMarkdown renderers={{ code: CodeBlock }} source={item.question} escapeHtml={false} />
                {filteredData.length < data.length && (
                  <button className="Card-reshuffleBtn" onClick={e => fullRefresh({ e, data, setFilteredData, setSelectedItem })}>
                    <span className="Card-reshuffleNum">{data.length}</span>
                    <RefreshIcon className="Card-reshuffleIcon" />
                  </button>
                )}
              </div>
              <div className="Card Card--back">
                <ReactMarkdown renderers={{ code: CodeBlock }} source={item.answer} escapeHtml={false} />
              </div>
            </div>
            <button onClick={e => handleStatusClick({ e, filteredData, setFilteredData, selectedItem, setSelectedItem, status: 'good' })} className="Card-icon Card-icon--right">
              <CheckIcon />
            </button>
            <button onClick={e => handleStatusClick({ e, filteredData, setFilteredData, selectedItem, setSelectedItem, status: 'bad' })} className="Card-icon Card-icon--left">
              <XIcon />
            </button>
          </div>
        ))}
      </Carousel>
      {filteredData.length === 0 && (
        <div className="Slide">
          <div className="Slide-content">
            <div className="Card Card--front Card--noNumbers">
              <button className="Card-refreshBtn" onClick={(e) => fullRefresh({ e, data, setFilteredData, setSelectedItem })}>Great job! Tap here to refresh!</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
