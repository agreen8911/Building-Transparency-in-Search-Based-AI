import logging
from flask import Flask, jsonify, request
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv
from google import genai
from google.genai import types
import os

load_dotenv()
perplexity_key = os.getenv('PERPLEXITY_API_KEY')
google_key = os.getenv('GOOGLE_API_KEY')

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

client_openai = OpenAI(api_key=perplexity_key, base_url="https://api.perplexity.ai")
client_google = genai.Client(api_key=google_key)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Routes
@app.route('/api/data')
def get_data():
    return jsonify({"message": "Hello from the Python backend!"})

@app.route('/api/chat/perplexity', methods=['POST'])
def perplexity_chat():
    try:
        messages = request.json['messages']
        response = client_openai.chat.completions.create(
            model="llama-3.1-sonar-large-128k-online",
            messages=messages
        )
        content = response.choices[0].message.content
        citations = response.citations if hasattr(response, 'citations') else []
        return jsonify({
            "content": content,
            "citations": citations,
            "model": "perplexity"
        })
    except Exception as e:
        logging.error(f"Error in perplexity_chat: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/chat/gemini', methods=['POST'])
def gemini_chat():
    try:
        messages = request.json['messages']
        prompt = " ".join([m['content'] for m in messages])
        response = client_google.models.generate_content(
            model="gemini-2.0-flash", contents=prompt
        )
        return jsonify({
            "content": response.text,
            "citations": [],
            "model": "gemini"
        })
    except Exception as e:
        logging.error(f"Error in gemini_chat: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/chat/all', methods=['POST', 'OPTIONS'])
def all_chat():
    if request.method == 'OPTIONS':
        return jsonify({}), 200

    try:
        messages = request.json['messages']
        responses = []
        try:
            perplexity_response = client_openai.chat.completions.create(
                model="llama-3.1-sonar-large-128k-online",
                messages=messages
            )
            responses.append({
                "content": perplexity_response.choices[0].message.content,
                "citations": perplexity_response.citations if hasattr(perplexity_response, 'citations') else [],
                "model": "perplexity"
            })
        except Exception as e:
            logging.error(f"Error in perplexity response: {e}")
            responses.append({
                "content": "Error getting response",
                "citations": [],
                "model": "perplexity",
                "error": str(e)
            })
        try:
            prompt = " ".join([m['content'] for m in messages])
            response = client_google.models.generate_content(
                model='gemini-2.0-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    tools=[types.Tool(
                        google_search=types.GoogleSearchRetrieval
                    )]
                )
            )
            # Extract citations from grounding_metadata of the first candidate
            citations = []
            if response.candidates and len(response.candidates) > 0:
                candidate = response.candidates[0]
                grounding = candidate.grounding_metadata
                if grounding and grounding.grounding_chunks:
                    citations = [
                        {"uri": chunk.web.uri, "title": chunk.web.title}
                        for chunk in grounding.grounding_chunks
                        if chunk.web and getattr(chunk.web, "uri", None)
                    ]
            
            responses.append({
                "content": response.text,
                "citations": citations,
                "model": "gemini"
            })
        except Exception as e:
            logging.error(f"Error in gemini response: {e}")
            responses.append({
                "content": "Error getting response",
                "citations": [],
                "model": "gemini",
                "error": str(e)
            })
        return jsonify({"responses": responses})
    except Exception as e:
        logging.error(f"Error in all_chat: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
