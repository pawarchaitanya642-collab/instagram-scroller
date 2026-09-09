# Use official Python image
FROM python:3.12-slim

# Set working directory inside container
WORKDIR /app

# Copy application files
COPY log_analyzer.py .
COPY requirements.txt .
COPY app.log .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Start the application
CMD ["python", "log_analyzer.py"]