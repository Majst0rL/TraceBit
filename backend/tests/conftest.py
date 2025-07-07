# C:\UNI\DProject\tracebit\TraceBit\backend\tests\conftest.py

import pytest
import sys
import os
from fastapi.testclient import TestClient
from dotenv import load_dotenv

# Load .env file from backend folder
dotenv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".env"))
load_dotenv(dotenv_path)

# Add backend/ to sys.path for main import
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from main import app

@pytest.fixture
def client():
    return TestClient(app)
