from flask import Flask, render_template_string
import yfinance as yf
from statsmodels.tsa.arima.model import ARIMA

app = Flask(__name__)

def fetch_close_prices():
    data = yf.download('^GSPC', period='1y', interval='1d')
    return data['Close'].dropna()

def predict_next_close():
    close_prices = fetch_close_prices()
    model = ARIMA(close_prices, order=(1, 1, 1))
    model_fit = model.fit()
    forecast = model_fit.forecast()
    return float(forecast.values[0])

@app.route('/')
def index():
    prediction = predict_next_close()
    html = """
    <html>
    <head><title>S&P 500 Forecast</title></head>
    <body>
        <h1>S&P 500 next trading day closing price forecast</h1>
        <p>Predicted close: {{ prediction | round(2) }}</p>
        <p><em>Disclaimer: Forecasts are generated using historical data and statistical models. They are not financial advice and may be inaccurate.</em></p>
    </body>
    </html>
    """
    return render_template_string(html, prediction=prediction)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
