import { Router } from 'express';
import { HolidayController } from '../controllers/holiday.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireHR } from '../middleware/role.middleware';

const router = Router();
const holidayController = new HolidayController();

// All routes require authentication and HR role
router.use(authenticate);
router.use(requireHR);

router.post('/', (req, res, next) => holidayController.createOrUpdateHolidayCalendar(req, res, next));
router.get('/all', (req, res, next) => holidayController.getAllHolidayCalendars(req, res, next));
router.get('/:year', (req, res, next) => holidayController.getHolidayCalendar(req, res, next));
router.delete('/:year', (req, res, next) => holidayController.deleteHolidayCalendar(req, res, next));

export default router;

