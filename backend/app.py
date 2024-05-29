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
