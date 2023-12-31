const express = require('express');

// get all the functions;

const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');

const router = express.Router();

// router.param('id', tourController.checkId);
router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours);
router.route('/tour-stats').get(tourController.getTourStats);
//router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);
router.route('/monthly-plan/:year').get(tourController.getmontlyData);




router.route('/')
.get(authController.protect, tourController.getAllTours)
.post(tourController.createTour);

router.route('/:id')
.get(tourController.getTourById)
.patch(tourController.updateTour)
.delete(tourController.deleteTour);


module.exports = router;