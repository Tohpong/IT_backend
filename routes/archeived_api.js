import express from 'express';

import {
  getAllMember,getMemberById,createMember,updateMember,deleteMember,
  //getAllMember, //loginUser,
} from '../controllers/archeived_member_controller.js';
/*
import {
  getAllProducts, getProductById, createProduct, updateProduct, deleteProduct,
} from '../controllers/productController.js';

import {
  getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder,
} from '../controllers/orderController.js';

import {
  getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory,
} from '../controllers/categoryController.js';

import {
  getAllOrderItems, getOrderItemById, createOrderItem, updateOrderItem, deleteOrderItem,
} from '../controllers/orderItemController.js';
*/


const router = express.Router();

// router.get('/', listMembers);     // จบที่ '/' ภายใน router

/*
// Products
router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);


// Orders
router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrderById);
router.post('/orders', createOrder);
router.put('/orders/:id', updateOrder);
router.delete('/orders/:id', deleteOrder);

// Categories
router.get('/categories', getAllCategories);
router.get('/categories/:id', getCategoryById);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// OrderItems
router.get('/order-items', getAllOrderItems);
router.get('/order-items/:id', getOrderItemById);
router.post('/order-items', createOrderItem);
router.put('/order-items/:id', updateOrderItem);
router.delete('/order-items/:id', deleteOrderItem);
*/

// Member
router.get('/member', getAllMember);
router.get('/member/:id', getMemberById);
router.post('/member', createMember);
//router.post('/users/login', loginUser);
router.put('/member/:id', updateMember);
router.delete('/member/:id', deleteMember);

export default router;
