import { Router } from 'express';
import { LeaveTypeController } from '../controllers/leavetype.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireHR } from '../middleware/role.middleware';

const router = Router();
const leaveTypeController = new LeaveTypeController();

// All routes require authentication and HR role
router.use(authenticate);
router.use(requireHR);

router.post('/', (req, res, next) => leaveTypeController.createLeaveType(req, res, next));
router.get('/', (req, res, next) => leaveTypeController.getAllLeaveTypes(req, res, next));
router.get('/:leaveTypeId', (req, res, next) => leaveTypeController.getLeaveTypeById(req, res, next));
router.put('/:leaveTypeId', (req, res, next) => leaveTypeController.updateLeaveType(req, res, next));
router.delete('/:leaveTypeId', (req, res, next) => leaveTypeController.deleteLeaveType(req, res, next));

export default router;

