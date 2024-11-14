const Car  = require('../model/vehicle.model');
const s3 = require('../config/s3');
const { v4: uuidv4 } = require('uuid');
const { BUCKET_NAME } = require('../config/constants.js');

const uploadImageToS3 = async (file) => {
  const fileKey = `car-images/${uuidv4()}_${file.originalname}`;
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const data = await s3.upload(params).promise();
  return data.Location;
};

// Create a new car
exports.createCar = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const images = [];
    if (req.files) {
      for (const file of req.files) {
        const imageUrl = await uploadImageToS3(file);
        images.push(imageUrl);
      }
    }

    const car = await Car.create({
      title,
      description,
      images,
      tags: JSON.parse(tags),
      userId: req.user.id,
    });

    res.status(201).json(car);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error creating car.' });
  }
};
 
// Update car details
exports.updateCar = async (req, res) => {
  try {

    const { id } = req.params;
    const { title, description, tags } = req.body;
    const car = await Car.findByPk(id);

    if (!car) return res.status(404).json({ error: 'Car not found.' });

    if (car.userId !== req.user.id) return res.status(403).json({ error: 'Unauthorized.' });

    const updatedImages = [...car.images];
    if (req.files) {
      for (const file of req.files) {
        const imageUrl = await uploadImageToS3(file);
        updatedImages.push(imageUrl);
      }
    }

    car.title = title || car.title;
    car.description = description || car.description;
    car.tags = tags ? JSON.parse(tags) : car.tags;
    car.images = updatedImages;

    await car.save();
    res.json(car);
  } catch (error) {
    res.status(500).json({ error: 'Error updating car.' });
  }
};

// View a particular car
exports.getCar = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await Car.findOne({ where: { id, userId: req.user.id } });

    if (!car) return res.status(404).json({ error: 'Car not found.' });

    res.json(car);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching car.' });
  }
};

// Delete a car
exports.deleteCar = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await Car.findByPk(id);

    if (!car) return res.status(404).json({ error: 'Car not found.' });

    if (car.userId !== req.user.id) return res.status(403).json({ error: 'Unauthorized.' });

    for (const imageUrl of car.images) {
      const fileKey = imageUrl.split('/').pop();
      await s3.deleteObject({
        Bucket: BUCKET_NAME,
        Key: `car-images/${fileKey}`,
      }).promise();
    }

    await car.destroy();
    res.json({ message: 'Car deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting car.' });
  }
};

// Get all Cars
exports.getCars = async (req,res) => {
    const userId = req.user.id
    try {
      const { keyword } = req.query;
      const searchCondition = keyword
        ? {
            userId,
            [Op.or]: [
              { title: { [Op.iLike]: `%${keyword}%` } },
              { description: { [Op.iLike]: `%${keyword}%` } },
              { tags: { [Op.iLike]: `%${keyword}%` } },
            ],
          }
        : { userId };
  
      const cars = await Car.findAll({ where: searchCondition });
        if(cars.length==0) return res.status(404).json({ error: 'Car not found.' });

        res.json(cars);

    } catch (err){
        res.status(500).json({ error: 'Error fetching cars.' });
    }
}