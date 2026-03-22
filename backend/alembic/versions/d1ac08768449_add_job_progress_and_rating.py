"""add job_progress and rating

Revision ID: d1ac08768449
Revises: 5f840c4756d6
Create Date: 2026-03-18 14:26:31.953955

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa



# revision identifiers, used by Alembic.
revision: str = 'd1ac08768449'
down_revision: Union[str, Sequence[str], None] = 'c5aba0b2d9b0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
