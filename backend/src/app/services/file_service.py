import os
import uuid
from fastapi import UploadFile, HTTPException
from typing import Optional
import aiofiles

# Configuration
UPLOAD_DIR = "uploads"
ALLOWED_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"}
MAX_FILE_SIZE = 5 * 1024 * 1024 # 5MB

class FileService:
    """
    Handles file uploads for worker documents.
    """
    
    @staticmethod
    async def save_file(file: UploadFile, subfolder: str = "general") -> dict:
        """
        Save an uploaded file to disk
        """
        await file.seek(0)  
        if not file.filename:
            raise HTTPException(
                status_code=400,
                detail="Uploaded file must have a filename."
            )

        # Validate file extension
        file_ext = os.path.splitext(file.filename)[1].lower()
        if file_ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"File type {file_ext} not allowed. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
            )
        
        # Create upload directory if it doesn't exist
        subfolder = os.path.basename(subfolder)
        upload_path = os.path.join(UPLOAD_DIR, subfolder)
        os.makedirs(upload_path, exist_ok=True)

        # Generate unique filenames
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        file_path = os.path.join(upload_path, unique_filename)

        size = 0

        try:
            async with aiofiles.open(file_path, "wb") as out_file:
                while True: 
                    chunk = await file.read(1024 * 1024)
                    if not chunk:
                        break
                    size += len(chunk)
                    if size > MAX_FILE_SIZE:
                        os.remove(file_path)
                        raise HTTPException(
                            status_code=400,
                            detail="File size exceeds 5MB limit."
                        )
                    await out_file.write(chunk)

        except HTTPException:
            raise

        except Exception as e:
            if os.path.exists(file_path):
                os.remove(file_path)
            raise HTTPException(
                status_code=500,
                detail=f"Failed to save file: {str(e)}"
            )
        
        # Return file info
        return {
            "filename": file.filename,  
            "file_url": file_path.replace("\\", "/"),   
            "file_size": size
        }
    
    @staticmethod
    def delete_file(file_url: str) -> bool:
        """
        Delete a file from disk
        """

        try:
            file_path = os.path.abspath(os.path.normpath(file_url.lstrip("/")))
            upload_root = os.path.abspath(UPLOAD_DIR)

            if not file_path.startswith(upload_root):
                return False

            if os.path.exists(file_path):
                os.remove(file_path)
                return True
            return False
        except Exception:
            return False
        
    @staticmethod
    def get_file_url(filename: str, subfolder: str = "general") -> str:
        """
        Generate a URL for a file
        """

        path = os.path.join(UPLOAD_DIR, subfolder, filename)
        return f"/{path.replace('\\', '/')}"