import requests

url = "https://edubin-selenerag.hf.space"
data = {"question": "What is Selene?"}

response = requests.get(url, json=data)

print(response.status_code)  # Should print 200 if it works
print(response.text)       # Should print the API response
