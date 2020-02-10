import React, { useState, useEffect } from 'react';
import qaPairs from "./qa_pairs";
import CodeBlock from './CodeBlock';
import { Carousel } from 'react-responsive-carousel';
import cx from 'classnames';
import ReactMarkdown from 'react-markdown';
import { CheckIcon, XIcon, RefreshIcon } from './icons';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./Global.css";
import "./Prism.css";
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

const goToNextCard = ({ e, filteredData, selectedItem, setSelectedItem }) => {
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
    goToNextCard({ selectedItem, filteredData, setSelectedItem });
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
    // If there is still some cards left and the selectedItem is going to be one past the last, swing it around to the first card
    if (filteredData.length > 0 && selectedItem > filteredData.length - 1) {
      setSelectedItem(0);
    }
  }, [filteredData.length]);

  useEffect(() => {
    // Fetching markdown on initial mount
    var fetchMarkdownPromises = qaPairs.map(q => Object.values(q).reduce((total, item) => { return [...total, item]; }, [])).flat().map(x => fetch(x));
    Promise.all(fetchMarkdownPromises)
      .then(response => Promise.all(response.map(x => x.text())))
      .then(markdownText => {
        var temp = qaPairs.map((q, i) => { q.question = markdownText[i + i]; q.answer = markdownText[i + i + 1]; return q; });
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
          })}>
            <div role="button" aria-label={item.isShowingAnswer ? 'Back to Question' : 'See Answer'} tabIndex={index === selectedItem && 0} className="Card" onClick={() => { setFilteredData(alterData(filteredData, selectedItem)) }}>
              <div className="Card-front">
                <div className="Card-num">{`${index + 1}/${filteredData.length}`}</div>
                <ReactMarkdown renderers={{ code: CodeBlock }} source={item.question} escapeHtml={false} />
                {filteredData.length < data.length && (
                  <button className="Card-reshuffleBtn" onClick={e => fullRefresh({ e, data, setFilteredData, setSelectedItem })}>
                    <span className="Card-reshuffleNum">{data.length}</span>
                    <RefreshIcon className="Card-reshuffleIcon" />
                  </button>
                )}
              </div>
              <div className="Card-back">
                <div className="Card-backInner">
                  <ReactMarkdown renderers={{ code: CodeBlock }} source={item.answer} escapeHtml={false} />
                </div>
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
          <div className="Card">
            <div className="Card-front Card-front--noNumbers">
              <button className="Card-refreshBtn" onClick={(e) => fullRefresh({ e, data, setFilteredData, setSelectedItem })}>Great job! Tap here to refresh!</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
