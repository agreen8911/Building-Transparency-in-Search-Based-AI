FROM python:3.11-slim

RUN groupadd -g 1001 appgroup && useradd -u 1001 -g appgroup -s /bin/false -m appuser

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN chown -R appuser:appgroup /app && chmod -R 755 /app

USER appuser

EXPOSE 5000

CMD ["python", "main.py"]