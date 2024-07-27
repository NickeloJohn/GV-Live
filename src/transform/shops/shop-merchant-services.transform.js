const _ = require('lodash');
const fs = require('fs');
const moment = require('moment');
const later = require('later');
const { getSlots } = require('slot-calculator');
const { DateTime, Settings } = require('luxon');

const { calculateDnstiscountPrice, writeDataToFile } = require('../../utils/functions');
const { DEFAULT_IMAGE } = require('../../utils/constant');
const { getProductById, getProductBysIds, getServiceStoreBrachNameById, getOrderHistoryServiceByDateTodayAndServiceId, getRatings, getMerchantNameById, getMerchantById } = require('../../services/helper.service');
const { objectToString } = require('../../utils/functions');
const pick = require('../../utils/pick');
const { transformImageUrl } = require('../../utils/transform');

const generateSlots = ({ startDate, endDate, repeat, durations, repeatType, daysSelected, availability, unavailability }) => {
  const allSlots = [];
  const start = moment.utc(startDate);
  const end = moment.utc(endDate);
  const startTime = moment.utc(startDate).format('HH:mm');
  const endTime = moment.utc(endDate).format('HH:mm');

  // Create a new moment object for the current date
  let currentDate = moment(start);

  // Loop until the current date is after the end date
  while (currentDate.isSameOrBefore(end)) {
    // If the current date is before the current day, skip this iteration

    if (currentDate.isBefore(moment.utc())) {
      currentDate.add(repeat, repeatType);
      continue;
    }

    // If the current day of the week is in the selected days or no days are selected
    if (daysSelected.length === 0 || daysSelected.includes(currentDate.day())) {
      // Create a new moment object for the start and end time of the slot
      const slotStartDate = moment(currentDate.format('YYYY-MM-DD') + ' ' + startTime);
      const slotEndDate = moment(currentDate.format('YYYY-MM-DD') + ' ' + endTime);

      // Generate the slots for this day
      const slots = getSlots({
        from: slotStartDate.toISOString(),
        to: slotEndDate.toISOString(),
        duration: durations,
        // outputTimezone: 'Asia/Manila',
        availability: availability,
        unavailability: unavailability
      });

      // Add the generated slots to the allSlots array
      allSlots.push(...slots.availableSlots);
    }

    // Increment the current date by the repeat value
    currentDate.add(repeat, repeatType);
  }

  return allSlots;
};

const getCapacitySlots = async (capacity, availability) => {
  const allSlots = [];

  capacity.forEach((cap) => {
    const slots = generateSlots({
      availability,
      startDate: cap.startDate,
      endDate: cap.endDate,
      repeat: cap.repeat,
      durations: cap.durations,
      repeatType: cap.repeatType || 'days',
      daysSelected: cap.daysSelected.length > 0 ? cap.daysSelected : [] // Monday, Tuesday, Wednesday
    });

    allSlots.push(...slots);
  });

  return allSlots;
};

const getEachDoctorSlots = async (capacity, serviceId) => {
  const schedules = capacity.schedules;
  const capacityId = capacity._id.toString();
  const vetId = capacity.vetId.toString();

  const unavailableSlots = await getOrderHistoryServiceByDateTodayAndServiceId(serviceId, vetId);

  const eachDoctorSlots = [];
  schedules.forEach((schedule) => {
    // generate slots for each schedule
    const slots = generateSlots({
      unavailability: unavailableSlots,
      startDate: schedule.startDate,
      endDate: schedule.endDate,
      repeat: schedule.repeat,
      durations: schedule.durations,
      repeatType: schedule.repeatType || 'days',
      daysSelected: schedule.daysSelected.length > 0 ? schedule.daysSelected : [] // Monday, Tuesday, Wednesday
    });

    // check if the capacityId is already in the eachDoctorSlots array and add the slots to the existing capacityId
    const index = eachDoctorSlots.findIndex((slot) => slot.capacityId?.toString() === capacityId);
    if (index === -1) {
      eachDoctorSlots.push({
        capacityId: capacityId,
        vetId: vetId,
        slots: slots
      });
    } else {
      eachDoctorSlots[index].slots.push(...slots);
    }
  });

  return eachDoctorSlots;
};

const getDoctorAvailabilitySchedules = async (service) => {
  const serviceId = service._id.toString();
  const capacityDetails = service.capacityDetails;

  // Use Promise.all and map to create a new array by applying getEachDoctorSlots to each capacity detail
  const promiseSlots = await Promise.all(capacityDetails.map((cap) => getEachDoctorSlots(cap, serviceId)));

  const uniqueSlots = [];
  const dataJson = [];

  promiseSlots.forEach((allSlots) => {
    allSlots.forEach((slot) => {
      dataJson.push(slot);

      slot.slots.forEach((s) => {
        const isExist = uniqueSlots.some((us) => us.from === s.from && us.to === s.to);
        if (!isExist) {
          uniqueSlots.push(s);
        }
      });
    });
  });

  writeDataToFile('../../tmp/services', `${serviceId}.json`, JSON.stringify(dataJson));
  // Return the array of unique slots.
  return uniqueSlots;
};

/**
 * ovewrite the duration of the capacityDetails from the service capacity
 * @param {*} service
 * @returns
 */
const overideCapacityDetailsDuration = (service) => {
  return (service.capacityDetails = service.capacityDetails.map((cd) => ({
    ...cd,
    schedules: cd.schedules.map((s) => ({
      ...s,
      durations: service.capacity.length > 0 ? service.capacity[0].durations : 0
    }))
  })));
};

const getSchedules = (capacityDetails) => {

  const schedules = [];
  capacityDetails.forEach((capacity) => {
    capacity.schedules.forEach((schedule) => {
      const startDate = schedule.startDate;
      const endDate = schedule.endDate;
      const dateToday = moment().toDate();

      const slots = getSlots({
        from: startDate.toISOString(),
        to: endDate.toISOString(),
        duration: capacity.duration,
        unavailability: [
          {
            from: '2024-06-15T11:30:00.000Z',
            to: '2024-06-15T12:00:00.000Z'
          }
        ]
      });
      schedules.push(...slots.availableSlots);
    });
  });
  return schedules;
};

const transformMerchantService = async (service, isAddNewObject) => {
  const merchant= await getMerchantById(product.merchant, 'name profilePicture');

  const serviceImages = [];

  if (service.images) serviceImages.push({ image: transformImageUrl(service.images) || DEFAULT_IMAGE });
  if (service.serviceGallery && service.serviceGallery.length > 0) serviceImages.push(...service.serviceGallery.map((image) => ({ image: transformImageUrl(image) || DEFAULT_IMAGE })));

  const data = {
    id: service._id,
    merchant: {
      id: merchant._id,
      name: merchant.name,
      image: merchant?.profilePicture?.filename ? transformImageUrl(merchant.profilePicture) : 'https://placehold.co/200x200'
    },
    name: service.name,
    description: service.description,
    price: service.price,
    ratings: service?.rating || 0,
    discount: service?.discount || 0,
    images: serviceImages
  };

  if (isAddNewObject) {
    data.serviceType = service.capacityDetails[0].serviceType === 0 ? 'short_time' : 'long_time';
    data.serviceSlots = getSchedules(service.capacityDetails);
  }

  return data;
};

const transformMerchantServices = async (merchantServices) => {
  return await Promise.all(merchantServices.map((services) => transformMerchantService(services)));
};

const transformMerchantServiceCart = async (merchantService) => {
  const merchantServiceDetails = await getProductById(merchantService.product);

  return {
    id: merchantService.id || merchantService._id,
    name: merchantServiceDetails.name,
    price: merchantServiceDetails.price,
    discountPrice: calculateDiscountPrice(merchantServiceDetails.price, merchantServiceDetails?.discount)
  };
};

const transformMerchantServiceCarts = async (merchantServices) => {
  const cleanedProductCarts = merchantServices.map(({ product, id, _id, quantity }) => ({ product, id, _id, quantity }));

  const productIds = cleanedProductCarts.map((item) => item.product);
  const merchantServicesList = await getProductBysIds(productIds);

  const productsDictionary = merchantServicesList.reduce((acc, service) => {
    acc[objectToString(service.id)] = service;
    return acc;
  }, {});

  const transformedCarts = await Promise.all(
    cleanedProductCarts.map(async (merchantService) => {
      merchantService.info = productsDictionary[objectToString(merchantService.product)];
      return await transformMerchantServiceCart(merchantService);
    })
  );

  return transformedCarts;
};

const transformCheckout = (orderHistory) => {
  return {
    orderId: orderHistory.id || orderHistory._id,
    products: orderHistory.products.map((product) => _.pick(product, ['productId', 'name', 'price', 'discountPrice', 'discountPercentage', 'startDate', 'endDate'])),
    payment: _.pick(orderHistory.payment, ['method', 'status', 'amount', 'payUrl', 'paymentId'])
  };
};

module.exports = {
  transformMerchantServices,
  transformMerchantService,
  transformMerchantServiceCart,
  transformMerchantServiceCarts,
  transformCheckout
};
