"""
Test to verify services work
"""

from app.database import SessionLocal
from app.services.worker_service import WorkerService
from app.models.worker import SkillCategory

def test_worker_service():
    db = SessionLocal()

    try:
        # Test: Search workers in Colombo
        workers = WorkerService.search_workers(
            db=db,
            city="Colombo",
            limit=5
        )
        print(f"Found {len(workers)} workers in Colombo")

        # Test: Search by skill
        plumber = WorkerService.search_workers(
            db=db,
            skill=SkillCategory.PLUMBING.value,
            limit=5
        )
        print(f"Found {len(plumber)} plumbers")

    finally:
        db.close()

if __name__ == "__main__":
    test_worker_service()
    print("\nService tests passed!")