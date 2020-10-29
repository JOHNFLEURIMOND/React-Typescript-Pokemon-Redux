# :checkered_flag:What It Looks Like :checkered_flag:: 

# How It's Made :nut_and_bolt:🔨 :hammer::wrench::
 This application built with React.js, Express, Node, Webpack, & Babel.

## Optimizations.
This is just a basic template layout to start my fullstack apps


 # How It's Works:white_check_mark::
1.) The client side sends a request to the backend server.

2.) The backend server response back with a message saying its connected.

## My Awesome Project && Lessons Learned :mortar_board::

I learned how to get React going without using `create-react-app` By using `Babel` which is code transpiler, it will ES6 Javascript and transpiles it to ES5 Javascript which will be readable for more modern browser. With plugins `preset-env` that helps compiles to ES5 but also takes the browser into play for the environment setup  `preset-react` that helps compiles the jsx syntax, other plugings to help with the syntax tree to help with the source code. 

`Webpack` is a module bundler that all of your Javascript files and creates one big file. It will sort all dependencies and configure scope. I defined my entry point at `Main.js`, this is where I tell webpack to started looking for other dependencies, so it can make a dependency graph. It will parse this javascript file and view all imports there and create another Abstract Syntax Tree, kind like babel but looks for import statements depending on other files and sort that and output one big file.

`React` is a library to build composable user interfacts. Composablility being that system design princile of that deals with the inter relationships of components, like how each component contains its own state and being resuseable components. It is a one of the top Javascript frameworks. You don't need to use `Webpack` or `Babel`, you can easily use `npx create-react-app my-app`, `cd my-app`, and `npm start`, tada! you have yourself an app but I wanted to challenge my self.

## Express, Nodemon, Body-Parser, Cors

The first thing I wanted to do is to create a server where browsers can connect to. We can do so with the help of a listen method provided by `Express` You define routing using methods of the Express app object that correspond to HTTP methods; for example, app.get() to handle GET requests and app.post to handle POST requests. Like app.METHOD or You can also use app.all() to handle all HTTP methods and app.use() to specify middleware as the callback function and using Nodemon to restart the server automatically whenever I or the user save a file that the server uses.

```const express = require('express');
const app = express();

app.use(express.json());
```

```//------
app.listen(8080, function() {
  console.log('listening on 3000')
})
```
or 

```//------
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Our app is running on port ${PORT}`);
});
```

`Express` allows us to add middleware like body-parser to our application with the use method. You’ll hear the term middleware a lot when dealing with `Express`. These things are basically plugins that change the request or response object before they get handled by our application. Make sure you place body-parser before your CRUD handlers!

```//------
const express = require('express')
const bodyParser= require('body-parser')
const app = express()

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
// All your handlers here...
```
A request for a resource (like an image or a font) outside of the origin is known as a cross-origin request. CORS (cross-origin resource sharing) manages cross-origin requests.

Cross-origin requests, however, that means servers must implement ways to handle requests from origins outside of their own. CORS allows servers to specify who (i.e., which origins) can access the assets on the server, among many other things.

The `CORS` standard is needed because it allows servers to specify not just who can access its assets, but also how the assets can be accessed.

```const cors = require('cors');

app.use(cors());
```


# Portfolio :open_file_folder::

** :computer:   WEBSITE:** [John Fleurimond](http://johnfleurimond.com)

# How To Get It Started :arrow_forward: :

## Installation

1. Clone repo
2. run `npm install`

## Available Scripts

In the project directory, you can run:

### `npm run serve`

Runs the app in the development mode.<br>
Open [http://localhost:5000](http://localhost:5000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](#running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](#deployment) for more information.
### `npm run prettier`
This corrects the format.
