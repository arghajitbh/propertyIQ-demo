from fastapi import FastAPI
from routes import router
import uvicorn
import os
import dotenv
dotenv.load_dotenv()

app = FastAPI(title="Housing Price Estimator API", version="1.0.0", docs_url="/api-docs")
app.include_router(router)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("FASTAPI_PORT", 8000)), reload=True)