from fastapi import APIRouter

from app.api.chatbot import router as chat_router

api_router = APIRouter()
api_router.include_router(chat_router, tags=["chatbot"])


__all__ = ["api_router"]