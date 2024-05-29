# AD2
E-Commerce web scraping website

Certainly! Let's build a complete web scraping website step-by-step. We'll use the following technology stack:

- **Front-end:** React
- **Back-end:** Flask (Python)
- **Web Scraping:** BeautifulSoup (Python)
- **Database:** We won't use a database in this initial version for simplicity.
- **Hosting:** You can deploy the front-end on Vercel and the back-end on Heroku.

### Step 1: Set Up the Project Structure

#### Directory Structure
```
webscraping-website/
|-- backend/
|   |-- app.py
|   |-- scraper.py
|   |-- requirements.txt
|-- frontend/
|   |-- public/
|   |   |-- index.html
|   |-- src/
|   |   |-- App.js
|   |   |-- components/
|   |   |   |-- SearchBar.js
|   |   |   |-- Results.js
|   |-- package.json
|-- README.md
```

### Step 2: Set Up the Front-End

#### 1. Create the React App
```bash
npx create-react-app frontend
cd frontend
```

#### 2. Create the Search Bar Component

```javascript
// src/components/SearchBar.js
import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a product..."
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;
```

#### 3. Create the Results Component

```javascript
// src/components/Results.js
import React from 'react';

const Results = ({ results }) => {
  return (
    <div className="results">
      {results.map((result, index) => (
        <div key={index} className="result-item">
          <h3>{result.productName}</h3>
          <p>Price: {result.price}</p>
          <p>Rating: {result.rating}</p>
          <p>Availability: {result.availability}</p>
        </div>
      ))}
    </div>
  );
};

export default Results;
```

#### 4. Integrate Components in App.js

```javascript
// src/App.js
import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import Results from './components/Results';
import './App.css';

const App = () => {
  const [results, setResults] = useState([]);

  const handleSearch = async (query) => {
    const response = await fetch(`/api/search?query=${query}`);
    const data = await response.json();
    setResults(data);
  };

  return (
    <div className="app">
      <SearchBar onSearch={handleSearch} />
      <Results results={results} />
    </div>
  );
};

export default App;
```

#### 5. Basic Styling (Optional)

```css
/* src/App.css */
.app {
  text-align: center;
  padding: 50px;
}

.search-bar {
  margin-bottom: 20px;
}

.search-bar input {
  padding: 10px;
  font-size: 16px;
}

.search-bar button {
  padding: 10px;
  font-size: 16px;
  margin-left: 10px;
}

.results {
  margin-top: 20px;
}

.result-item {
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px 0;
  text-align: left;
}
```

### Step 3: Set Up the Back-End

#### 1. Create a Flask App

```bash
mkdir backend
cd backend
python -m venv venv
source venv/bin/activate
pip install flask beautifulsoup4 requests
```

#### 2. Create the Scraper

```python
# backend/scraper.py
import requests
from bs4 import BeautifulSoup

def scrape_amazon(query):
    url = f"https://www.amazon.com/s?k={query.replace(' ', '+')}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.content, "html.parser")

    results = []
    for item in soup.select(".s-result-item"):
        title = item.select_one("h2 .a-text-normal")
        price = item.select_one(".a-price .a-offscreen")
        rating = item.select_one(".a-icon-alt")
        availability = item.select_one(".a-size-small .a-color-success")

        if title and price and rating:
            results.append({
                "productName": title.text.strip(),
                "price": price.text.strip() if price else "N/A",
                "rating": rating.text.strip(),
                "availability": availability.text.strip() if availability else "N/A"
            })
    return results
```

#### 3. Create the Flask API

```python
# backend/app.py
from flask import Flask, request, jsonify
from scraper import scrape_amazon

app = Flask(__name__)

@app.route('/api/search', methods=['GET'])
def search():
    query = request.args.get('query')
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400
    results = scrape_amazon(query)
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)
```

#### 4. Add Dependencies to requirements.txt

```txt
flask
beautifulsoup4
requests
```

#### 5. Run the Flask App

```bash
export FLASK_APP=app.py
flask run
```

### Step 4: Connect Front-End and Back-End

1. Ensure your Flask server is running on port 5000. The React app will run on port 3000 by default.
2. In development, you can set up a proxy in the `frontend/package.json`:

```json
{
  "name": "frontend",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^17.0.2",
    "react-dom": "^17.0.2",
    "react-scripts": "4.0.3"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "proxy": "http://localhost:5000"
}
```

### Step 5: Deploy the Website

#### 1. Deploy Back-End on Heroku

```bash
cd backend
heroku create your-app-name
git init
heroku git:remote -a your-app-name
echo "web: flask run" > Procfile
pip freeze > requirements.txt
git add .
git commit -m "Initial commit"
git push heroku master
```

#### 2. Deploy Front-End on Vercel

1. Sign up at [Vercel](https://vercel.com/).
2. Link your GitHub repository or drag-and-drop your project folder.
3. Configure the build settings if needed and deploy.

### Step 6: Additional Considerations

- **Handling Rate Limits and CAPTCHAs:** Implement strategies to handle rate limits and CAPTCHAs (e.g., rotating proxies, headless browsers).
- **Data Storage:** If you need persistent data storage, integrate a database like MongoDB or PostgreSQL.
- **Error Handling:** Ensure your app handles errors gracefully, such as failed scrapes or invalid queries.

This guide should get you started with a functional web scraping website. If you need further customization or have specific requirements, feel free to ask!