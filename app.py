import os
from flask import Flask, render_template, request, jsonify
from google.cloud import translate_v2 as translate
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set credentials from .env path
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

app = Flask(__name__)
translate_client = translate.Client()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/translate', methods=['POST'])
def translate_text():
    data = request.get_json()
    text = data.get('text')
    source_lang = data.get('source_lang')
    target_lang = data.get('target_lang')

    if not text:
        return jsonify({'error': 'No text provided'}), 400

    try:
        result = translate_client.translate(
            text,
            target_language=target_lang,
            source_language=None if source_lang == 'auto' else source_lang
        )
        return jsonify({
            'translatedText': result['translatedText'],
            'detectedSourceLanguage': result.get('detectedSourceLanguage', source_lang)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
