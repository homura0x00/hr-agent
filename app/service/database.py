from sqlmodel import SQLModel, Session, create_engine

from app.core.config import settings

def _connect_args(url: str) -> dict:
    """Build driver-specific connect arguments.

    ``check_same_thread`` is a SQLite-only flag; passing it to psycopg2 raises.
    FastAPI runs sync dependencies in a threadpool, so the default SQLite
    thread affinity has to be relaxed for development.
    """
    return {"check_same_thread": False} if url.startswith("sqlite") else {}

engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DATABASE_ECHO,
    pool_pre_ping=True,
    connect_args=_connect_args(settings.DATABASE_URL),
)

def create_db_and_tables() -> None:
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

