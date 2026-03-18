from sqlalchemy import Column, String, Integer, Float, Text, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Rating(Base):
    """
    Stores ratings given by users after job completion
    Each job can have 2 ratings: employer->worker and worker->employer
    """
    __tablename__ = "ratings"

    id = Column(Integer, primary_key=True, index=True)
    
    # Job reference
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False, index=True)
    
    # Who is rating whom
    rater_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # Person giving the rating
    rated_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # Person being rated
    
    # Rating details
    rating = Column(
        Integer, 
        nullable=False,
        # Ensures rating is between 1 and 5
    )
    review = Column(Text, nullable=True)  # Optional written review
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    job = relationship("Job", back_populates="ratings")
    rater = relationship("User", foreign_keys=[rater_id], back_populates="ratings_given")
    rated_user = relationship("User", foreign_keys=[rated_user_id], back_populates="ratings_received")
    
    # Constraints
    __table_args__ = (
        CheckConstraint('rating >= 1 AND rating <= 5', name='rating_range_check'),
    )

    def __repr__(self):
        return f"<Rating(id={self.id}, job_id={self.job_id}, rating={self.rating})>"

    def to_dict(self):
        """Convert to dictionary for API responses"""
        return {
            "id": self.id,
            "job_id": self.job_id,
            "rater_id": self.rater_id,
            "rated_user_id": self.rated_user_id,
            "rating": self.rating,
            "review": self.review,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

    def to_dict_with_details(self, include_rater=False, include_rated_user=False):
        """Include user details in response"""
        data = self.to_dict()
        
        if include_rater and self.rater:
            data["rater"] = {
                "id": self.rater.id,
                "name": getattr(self.rater.worker, 'full_name', None) or getattr(self.rater.employer, 'company_name', 'Unknown'),
                "user_type": self.rater.user_type.value if self.rater.user_type else None
            }
        
        if include_rated_user and self.rated_user:
            data["rated_user"] = {
                "id": self.rated_user.id,
                "name": getattr(self.rated_user.worker, 'full_name', None) or getattr(self.rated_user.employer, 'company_name', 'Unknown'),
                "user_type": self.rated_user.user_type.value if self.rated_user.user_type else None
            }
        
        return data


class RatingStatistics:
    """
    Helper class to calculate rating statistics for a user
    Not a database model, just a utility class
    """
    
    @staticmethod
    def calculate_average_rating(user_id, db):
        """Calculate average rating for a user"""
        from sqlalchemy import func
        
        result = db.query(
            func.avg(Rating.rating).label('average'),
            func.count(Rating.id).label('total')
        ).filter(
            Rating.rated_user_id == user_id
        ).first()
        
        return {
            "average_rating": round(float(result.average), 2) if result.average else 0.0,
            "total_ratings": result.total or 0
        }
    
    @staticmethod
    def get_rating_distribution(user_id, db):
        """Get distribution of ratings (how many 1-star, 2-star, etc.)"""
        from sqlalchemy import func
        
        distribution = db.query(
            Rating.rating,
            func.count(Rating.id).label('count')
        ).filter(
            Rating.rated_user_id == user_id
        ).group_by(
            Rating.rating
        ).all()
        
        # Create a dict with all ratings 1-5, default to 0
        result = {i: 0 for i in range(1, 6)}
        for rating, count in distribution:
            result[rating] = count
        
        return result
