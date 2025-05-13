# HeartPlan Backend

## Overview
This is the backend for the HeartPlan project, built with Django and Django REST Framework.

## Setup Instructions

### Prerequisites
- Python 3.11 or 3.12
- pip (Python package manager)
- Virtual environment (recommended)

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd HeartPlan/backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows, use `.venv\Scripts\activate`
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the `backend` directory with the following content:
   ```
   SECRET_KEY=your-secret-key
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1
   ```

5. Run migrations:
   ```bash
   python manage.py migrate
   ```

6. Start the development server:
   ```bash
   python manage.py runserver
   ```

## Project Structure
- `core/`: Main application for the project.
- `backend/`: Project settings and configuration.

## API Documentation
API documentation will be added as the project progresses.

## Contributing
Please follow the contributing guidelines outlined in the main project README. 