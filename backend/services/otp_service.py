import logging
import os
import random
import string
from datetime import datetime, timedelta
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorDatabase

from models.user import OTPModel, UserModel

logger = logging.getLogger(__name__)

# OTP expiry in minutes
OTP_EXPIRY_MINUTES = 5


class OTPService:
    """Service for managing OTP verification"""

    def __init__(self, db: AsyncIOMotorDatabase):
        """
        Initialize OTP service

        Args:
            db: MongoDB database instance
        """
        self.db = db
        self.otp_collection = db.otps
        self.users_collection = db.users

    def generate_otp(self, length: int = 6) -> str:
        """
        Generate a random numeric OTP

        Args:
            length: Length of OTP (default 6)

        Returns:
            Generated OTP string
        """
        return ''.join(random.choices(string.digits, k=length))

    async def create_otp(self, email: str) -> OTPModel:
        """
        Create and store a new OTP for the given email

        Args:
            email: User email

        Returns:
            Created OTP model
        """
        # Delete any existing OTPs for this email
        await self.otp_collection.delete_many({"email": email})

        otp_code = self.generate_otp()
        expires_at = datetime.utcnow() + timedelta(minutes=OTP_EXPIRY_MINUTES)

        otp = OTPModel(
            email=email,
            otp=otp_code,
            created_at=datetime.utcnow(),
            expires_at=expires_at,
            verified=False
        )

        otp_dict = otp.model_dump()
        otp_dict['created_at'] = otp_dict['created_at'].isoformat()
        otp_dict['expires_at'] = otp_dict['expires_at'].isoformat()

        await self.otp_collection.insert_one(otp_dict)
        logger.info(f"Created OTP for email: {email}")

        return otp

    async def verify_otp(self, email: str, otp_code: str) -> bool:
        """
        Verify OTP for the given email

        Args:
            email: User email
            otp_code: OTP to verify

        Returns:
            True if OTP is valid, False otherwise
        """
        otp_doc = await self.otp_collection.find_one({
            "email": email,
            "otp": otp_code,
            "verified": False
        })

        if not otp_doc:
            logger.warning(f"Invalid OTP attempt for email: {email}")
            return False

        # Check if OTP has expired
        expires_at = datetime.fromisoformat(otp_doc['expires_at'])
        if datetime.utcnow() > expires_at:
            logger.warning(f"Expired OTP attempt for email: {email}")
            await self.otp_collection.delete_one({"_id": otp_doc["_id"]})
            return False

        # Mark OTP as verified and delete it
        await self.otp_collection.delete_one({"_id": otp_doc["_id"]})
        logger.info(f"OTP verified successfully for email: {email}")

        return True

    async def get_or_create_user(self, email: str) -> UserModel:
        """
        Get existing user or create a new one

        Args:
            email: User email

        Returns:
            User model
        """
        user_doc = await self.users_collection.find_one(
            {"email": email},
            {"_id": 0}
        )

        if user_doc:
            # Update last login
            await self.users_collection.update_one(
                {"email": email},
                {"$set": {"last_login": datetime.utcnow().isoformat()}}
            )

            # Convert datetime strings back
            if isinstance(user_doc.get('created_at'), str):
                user_doc['created_at'] = datetime.fromisoformat(user_doc['created_at'])
            if isinstance(user_doc.get('last_login'), str):
                user_doc['last_login'] = datetime.fromisoformat(user_doc['last_login'])

            return UserModel(**user_doc)

        # Create new user
        user = UserModel(
            email=email,
            created_at=datetime.utcnow(),
            last_login=datetime.utcnow(),
            purchases=[]
        )

        user_dict = user.model_dump()
        user_dict['created_at'] = user_dict['created_at'].isoformat()
        user_dict['last_login'] = user_dict['last_login'].isoformat()

        await self.users_collection.insert_one(user_dict)
        logger.info(f"Created new user: {email}")

        return user

    async def get_user_by_email(self, email: str) -> Optional[UserModel]:
        """
        Get user by email

        Args:
            email: User email

        Returns:
            User model or None if not found
        """
        user_doc = await self.users_collection.find_one(
            {"email": email},
            {"_id": 0}
        )

        if not user_doc:
            return None

        # Convert datetime strings back
        if isinstance(user_doc.get('created_at'), str):
            user_doc['created_at'] = datetime.fromisoformat(user_doc['created_at'])
        if isinstance(user_doc.get('last_login'), str):
            user_doc['last_login'] = datetime.fromisoformat(user_doc['last_login'])

        return UserModel(**user_doc)

    async def add_purchase_to_user(self, email: str, template_id: str) -> bool:
        """
        Add a purchase to user's purchase list

        Args:
            email: User email
            template_id: Template/product ID that was purchased

        Returns:
            True if updated successfully
        """
        result = await self.users_collection.update_one(
            {"email": email},
            {"$addToSet": {"purchases": template_id}}
        )

        if result.modified_count > 0:
            logger.info(f"Added purchase {template_id} to user {email}")
            return True

        return False

    async def create_indexes(self):
        """Create database indexes for optimal query performance"""
        await self.otp_collection.create_index("email")
        await self.otp_collection.create_index("expires_at")
        await self.users_collection.create_index("email", unique=True)
        logger.info("Created database indexes for OTP and users collections")


def get_otp_service(db: AsyncIOMotorDatabase) -> OTPService:
    """
    Get OTP service instance

    Args:
        db: MongoDB database instance

    Returns:
        OTPService instance
    """
    return OTPService(db)
