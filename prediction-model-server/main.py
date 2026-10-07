import os

from fastapi import FastAPI
import dotenv
import uvicorn

from startup import lifespan
from route import router
dotenv.load_dotenv()


app = FastAPI(title="Housing Price Prediction API", lifespan=lifespan, version="1.0.0", docs_url="/api-docs")
app.include_router(router,prefix="/api")

if __name__ == "__main__":
    port = int(os.getenv("FASTAPI_PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)