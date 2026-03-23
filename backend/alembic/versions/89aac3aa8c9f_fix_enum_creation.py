"""fix_enum_creation

Revision ID: 89aac3aa8c9f
Revises: d1ac08768449
Create Date: 2026-03-22 12:42:03.315929

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '89aac3aa8c9f'
down_revision: Union[str, Sequence[str], None] = 'd1ac08768449'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
