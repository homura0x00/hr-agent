from fastapi import FastAPI
from fastapi.responses import JSONResponse

from app.api import api_router

app = FastAPI(
    title="HR AI Agent",
    version="0.0.1",
)

app.include_router(api_router, prefix="api/v1")

@app.get("/health", tags=["ops"], summary="Service health")
async def health() -> JSONResponse:
    resp = {

    }

    return JSONResponse(content=resp, status_code=200)