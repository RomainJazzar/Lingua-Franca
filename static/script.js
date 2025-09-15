document.addEventListener('DOMContentLoaded', () => {
    const translateBtn = document.getElementById('translateBtn');
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const sourceLang = document.getElementById('sourceLang');
    const targetLang = document.getElementById('targetLang');
    const statusDiv = document.getElementById('status');

    translateBtn.addEventListener('click', async () => {
        const text = inputText.value.trim();
        if (!text) return alert('Please enter text to translate.');

        translateBtn.disabled = true;
        statusDiv.textContent = 'Translating...';

        try {
            const response = await fetch('/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text,
                    source_lang: sourceLang.value,
                    target_lang: targetLang.value
                })
            });

            const result = await response.json();
            if (result.error) {
                outputText.value = '';
                statusDiv.textContent = 'Error: ' + result.error;
            } else {
                outputText.value = result.translatedText;
                statusDiv.textContent = sourceLang.value === 'auto' ? `Detected: ${result.detectedSourceLanguage}` : '';
            }
        } catch (err) {
            outputText.value = '';
            statusDiv.textContent = 'Translation failed.';
        } finally {
            translateBtn.disabled = false;
        }
    });
});
