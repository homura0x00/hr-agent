from sqlmodel import SQLModel, Field


class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_account: str = Field(index=True)
    user_password: str
    user_name: str
