## Mobile Flashcards App

An app that allows you to write practice interview questions and answers in markdown and then test yourself with the mobile app on-the-go!

### Why this one?
There are _plenty_ of flashcard apps out there to help developers with interview prep. However, I noticed a few things about most of them that I wasn't thrilled about:

* Requires an account 
* Must use their app to input custom questions and answers
* No code syntax highlighting
* Not built for mobile use
* Advertisements and/or paid plans
* Overly complex

I longed for an app where I could simply write my questions and answers in **markdown files** and then use a **simple mobile app** to practice with. A flashcards app _truly_ meant for developers. Besides, most collections of open source interview questions exist as markdown files (i.e. [https://github.com/yangshun/front-end-interview-handbook](https://github.com/yangshun/front-end-interview-handbook))

### How to Use

1. Clone the repo
2. `cd interview-flashcards && npm start` (bootstrapped with create-react-app) 
3. Add any questions and answers to the `public/question_answer_pairs` directory
4. Publish to github and then a hosting platform of your choice ([Netlify](https://www.netlify.com/) perhaps), or just run locally and hit your computers IP on port 3000 on your mobile device

----

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm run add (num: optional)`

Writes additional qa_pair directories to the `/question_answer_pairs` directory.

### Versions:

Node: v11.15.0
NPM: v6.7.0