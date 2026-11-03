# ShieldAI — Email & SMS Spam Detection

A responsive Flask + Machine Learning academic project that classifies email and SMS/text messages as **Spam** or **Not Spam**.

## Features
- One interface for email and SMS/message text.
- TF-IDF text feature extraction + Multinomial Naive Bayes classifier.
- Spam probability, confidence, risk level and word count.
- Sample messages, responsive dashboard and JSON prediction API.
- Model is trained automatically the first time the app starts.

## Run on Windows (VS Code / PowerShell)

1. Extract `Smart_Spam_Detection.zip`.
2. Open the extracted `Smart_Spam_Detection` folder in VS Code.
3. Open Terminal in that folder.
4. Create a virtual environment (recommended):

   ```powershell
   py -m venv venv
   .\venv\Scripts\activate
   ```

   If `py` does not work, use `python` instead. If PowerShell blocks activation, run:
   `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`
   and activate again. Or use Command Prompt and run `venv\Scripts\activate.bat`.

5. Install libraries:

   ```powershell
   python -m pip install -r requirements.txt
   ```

6. Start the application:

   ```powershell
   python app.py
   ```

7. Open this address in Chrome:

   **http://127.0.0.1:5000**

Keep the terminal running while using the website. Press `Ctrl + C` in the terminal to stop it.

## Train the model again
```powershell
python train_model.py
```

## API
`POST /predict` with JSON body:
```json
{"message": "Congratulations, claim your free prize now"}
```

## Project structure
```text
Smart_Spam_Detection/
├── app.py
├── train_model.py
├── requirements.txt
├── README.md
├── data/
│   └── messages.csv
├── model/
│   └── (model file is generated on first run)
├── templates/
│   └── index.html
└── static/
    ├── style.css
    └── app.js
```

## Important academic note
The included CSV is a small, hand-curated demonstration dataset so the project runs immediately without downloading data. It is suitable for demonstrating the end-to-end ML workflow, but it is **not** a production-grade spam filter and its displayed confidence is not a guarantee. For stronger real-world performance, train with a larger, representative, properly licensed SMS/email dataset and evaluate it on a separate test set. The model does not open links, read inboxes, or send messages; it only classifies text pasted by the user.
