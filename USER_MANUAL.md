# 📘 Sentinel Fraud AI - User Manual

Welcome to the official user documentation for **Sentinel Fraud AI**. This manual provides a step-by-step guide to operating the platform, from initial data ingestion to production deployment.

---

## 👤 Owner & Maintainer Details
- **Project Lead:** Senior AI Engineer @ Sentinel Systems
- **Organization:** Sentinel AI Labs
- **Contact:** engineering@sentinel-ai.example.com
- **Support Hours:** 09:00 - 18:00 UTC

---

## 📋 Technical Requirements

### Supported Data Formats
- **Format:** CSV (Comma Separated Values)
- **Content:** Transactional data. Features should ideally be numerical (V1-V28 standard) or clearly labeled transaction attributes.
- **Target:** The system expects a binary target variable (e.g., `0` for legitimate, `1` for fraud).

---

## 🕹️ Step-by-Step Operations

### 1. Data Ingestion
- Navigate to the **Data Ingestion** tab.
- Drag and drop your `.csv` file into the upload zone.
- Click **"Continue to Data Profiling"**. The system will perform a local parse and prepare a data slice for AI analysis.

### 2. Automated Preprocessing
- The **Preprocessing** stage is autonomous.
- **AI Schema Discovery:** Gemini identifies the target variable and feature types.
- **SMOTE Engine:** The system automatically balances the dataset to ensure fraud cases are not overlooked by the model.
- Click **"Initialize Model Training"** once the pipeline green-lights all steps.

### 3. Hyperparameter Tuning
- Select your preferred **Algorithm** (XGBoost is recommended for tabular fraud data).
- Adjust the **Test Split** and **Learning Rate**.
- Click **"Start Training Engine"**. Observe the live Loss vs. Validation Loss curves to check for overfitting.

### 4. Performance Analytics
- Review the **Precision-Recall** metrics. 
- **Note:** In fraud detection, **Recall** is critical (identifying as many actual frauds as possible).
- Inspect the **Confusion Matrix** to see the distribution of True/False positives.

### 5. Production API Gateway
- Click **"Promote to Production"**.
- Use the **API Playground** to test individual transaction payloads.
- Copy the `CURL` command provided in the implementation snippet for integration into your backend systems.

---

## 🛠️ Troubleshooting

- **Error: Invalid CSV Format:** Ensure your file uses commas as delimiters and has a header row.
- **Model Bias:** If Recall is low, increase the SMOTE intensity by adjusting the training config or providing a more diverse dataset.
- **API Timeout:** Ensure your internet connection is stable; the Gemini engine requires an active connection for inference reasoning.

---

## ⚖️ Compliance & Privacy
Sentinel Fraud AI processes data in the client-side context where possible. Large datasets are summarized via secure embeddings before being analyzed by the Gemini 3 Pro reasoning engine.

*Document Version: 1.0.0*
