import logging
import os
from typing import Optional, Dict
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from models.payment import OrderModel, OrderCreateRequest
from utils.token_generator import (
    generate_receipt_number,
    generate_download_token,
    generate_token_expiry,
    is_token_expired
)

logger = logging.getLogger(__name__)


class OrderService:
    """Service for managing orders in MongoDB"""

    def __init__(self, db: AsyncIOMotorDatabase):
        """
        Initialize order service

        Args:
            db: MongoDB database instance
        """
        self.db = db
        self.orders_collection = db.orders

    async def create_order(
        self,
        order_id: str,
        amount: int,
        template_id: str,
        customer_email: str,
        customer_name: Optional[str] = None
    ) -> OrderModel:
        """
        Create a new order in database

        Args:
            order_id: Razorpay order ID
            amount: Amount in paise
            template_id: Product/template identifier
            customer_email: Customer email
            customer_name: Customer name (optional)

        Returns:
            Created order model
        """
        receipt = generate_receipt_number()

        order = OrderModel(
            order_id=order_id,
            receipt=receipt,
            amount=amount,
            currency="INR",
            status="created",
            template_id=template_id,
            customer_email=customer_email,
            customer_name=customer_name,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )

        # Convert to dict for MongoDB
        order_dict = order.model_dump()
        order_dict['created_at'] = order_dict['created_at'].isoformat()
        order_dict['updated_at'] = order_dict['updated_at'].isoformat()

        await self.orders_collection.insert_one(order_dict)
        logger.info(f"Created order in database: {order_id}")

        return order

    async def get_order_by_order_id(self, order_id: str) -> Optional[OrderModel]:
        """
        Retrieve order by Razorpay order ID

        Args:
            order_id: Razorpay order ID

        Returns:
            Order model or None if not found
        """
        order_dict = await self.orders_collection.find_one(
            {"order_id": order_id},
            {"_id": 0}
        )

        if not order_dict:
            return None

        # Convert ISO strings back to datetime
        if isinstance(order_dict.get('created_at'), str):
            order_dict['created_at'] = datetime.fromisoformat(order_dict['created_at'])
        if isinstance(order_dict.get('updated_at'), str):
            order_dict['updated_at'] = datetime.fromisoformat(order_dict['updated_at'])
        if isinstance(order_dict.get('download_token_expires'), str):
            order_dict['download_token_expires'] = datetime.fromisoformat(order_dict['download_token_expires'])

        return OrderModel(**order_dict)

    async def get_order_by_download_token(self, token: str) -> Optional[OrderModel]:
        """
        Retrieve order by download token

        Args:
            token: Download token

        Returns:
            Order model or None if not found
        """
        order_dict = await self.orders_collection.find_one(
            {"download_token": token},
            {"_id": 0}
        )

        if not order_dict:
            return None

        # Convert ISO strings back to datetime
        if isinstance(order_dict.get('created_at'), str):
            order_dict['created_at'] = datetime.fromisoformat(order_dict['created_at'])
        if isinstance(order_dict.get('updated_at'), str):
            order_dict['updated_at'] = datetime.fromisoformat(order_dict['updated_at'])
        if isinstance(order_dict.get('download_token_expires'), str):
            order_dict['download_token_expires'] = datetime.fromisoformat(order_dict['download_token_expires'])

        return OrderModel(**order_dict)

    async def mark_order_paid(
        self,
        order_id: str,
        payment_id: str,
        expiry_hours: int = 48
    ) -> Optional[OrderModel]:
        """
        Mark order as paid and generate download token

        Args:
            order_id: Razorpay order ID
            payment_id: Razorpay payment ID
            expiry_hours: Hours until download link expires

        Returns:
            Updated order model or None if not found
        """
        download_token = generate_download_token()
        token_expires = generate_token_expiry(expiry_hours)

        result = await self.orders_collection.update_one(
            {"order_id": order_id},
            {
                "$set": {
                    "status": "paid",
                    "payment_id": payment_id,
                    "download_token": download_token,
                    "download_token_expires": token_expires.isoformat(),
                    "updated_at": datetime.utcnow().isoformat()
                }
            }
        )

        if result.modified_count == 0:
            logger.warning(f"Order not found or not updated: {order_id}")
            return None

        logger.info(f"Marked order as paid: {order_id}")
        return await self.get_order_by_order_id(order_id)

    async def mark_order_failed(self, order_id: str) -> bool:
        """
        Mark order as failed

        Args:
            order_id: Razorpay order ID

        Returns:
            True if updated, False otherwise
        """
        result = await self.orders_collection.update_one(
            {"order_id": order_id},
            {
                "$set": {
                    "status": "failed",
                    "updated_at": datetime.utcnow().isoformat()
                }
            }
        )

        if result.modified_count > 0:
            logger.info(f"Marked order as failed: {order_id}")
            return True

        return False

    async def increment_download_count(self, order_id: str) -> bool:
        """
        Increment download count for an order

        Args:
            order_id: Razorpay order ID

        Returns:
            True if updated, False otherwise
        """
        result = await self.orders_collection.update_one(
            {"order_id": order_id},
            {
                "$inc": {"download_count": 1},
                "$set": {"updated_at": datetime.utcnow().isoformat()}
            }
        )

        return result.modified_count > 0

    def is_download_token_valid(self, order: OrderModel) -> bool:
        """
        Check if download token is valid (not expired and order is paid)

        Args:
            order: Order model

        Returns:
            True if valid, False otherwise
        """
        if order.status != "paid":
            logger.warning(f"Order {order.order_id} is not paid")
            return False

        if not order.download_token or not order.download_token_expires:
            logger.warning(f"Order {order.order_id} has no download token")
            return False

        if is_token_expired(order.download_token_expires):
            logger.warning(f"Download token expired for order {order.order_id}")
            return False

        return True

    async def create_indexes(self):
        """Create database indexes for optimal query performance"""
        await self.orders_collection.create_index("order_id", unique=True)
        await self.orders_collection.create_index("download_token")
        await self.orders_collection.create_index("customer_email")
        await self.orders_collection.create_index("created_at")
        logger.info("Created database indexes for orders collection")


def get_order_service(db: AsyncIOMotorDatabase) -> OrderService:
    """
    Get order service instance

    Args:
        db: MongoDB database instance

    Returns:
        OrderService instance
    """
    return OrderService(db)
