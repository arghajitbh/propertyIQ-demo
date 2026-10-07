

from fastapi.concurrency import asynccontextmanager
import pickle
from fastapi import FastAPI

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting application and loading model...")
    try:
        with open("housing_model.pkl", "rb") as file:
            app.state.model = pickle.load(file)
        print("Model loaded successfully into memory.")
    except FileNotFoundError:
        raise RuntimeError("Model file 'housing_model.pkl' not found. Please train and save the model first.")
    
    yield
    
    if hasattr(app.state, 'model'):
        del app.state.model
        print("--> Cleanup: Housing model dropped.")