from fastapi import FastAPI
from fastapi.responses import JSONResponse

from contextlib import asynccontextmanager
from app.api import api_router
from app.core import logger
from app.core.config import settings
from app.service.database import create_db_and_tables

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    logger.info(
        "startup env=%s version=%s llm=%s",
        settings.ENVIRONMENT.value,
        settings.VERSION,
        settings.LLM.model,
    )
    yield
    logger.info("shutdown complete")


app = FastAPI(
    title="HR AI Agent",
    version="0.0.1",
    lifespan=lifespan,
)

app.include_router(api_router, prefix="api/v1")

@app.get("/health", tags=["ops"], summary="Service health")
async def health() -> JSONResponse:
    resp = {

    }

    return JSONResponse(content=resp, status_code=200)