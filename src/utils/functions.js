
const crypto = require("crypto");
const _ = require("lodash");
const cryptoJs = require("crypto-js");
const sgMail = require("@sendgrid/mail");
const phLocations = require('ph-locations').psgc;
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { validationResult } = require("express-validator");

const { AzureStorage } = require("./azure-storage");
const UploadUtils = require("../utils/upload");
const config = require("../config/config");
const { transformImageUrl } = require("./transform");
const AzureBlobStorageHelper = require('./azure-storage-v2');



exports.encryptPassword = (password) => {
    const ciphertext = cryptoJs.AES.encrypt(password.toString(), process.env.SECRET_KEY_ENCRYPT_PASSWORD).toString();
    return ciphertext;
}

exports.decryptPassword= (password) => {
    const bytes  = cryptoJs.AES.decrypt(password.toString(), process.env.SECRET_KEY_ENCRYPT_PASSWORD);
    const originalText = bytes.toString(cryptoJs.enc.Utf8);
    return originalText;
}

exports.encryptData = (data) => {
    const ciphertext = cryptoJs.AES.encrypt(data.toString(), process.env.SECRET_KEY_ENCRYPT_PASSWORD).toString();
    return ciphertext;
}

exports.decryptData= (data) => {
    const bytes  = cryptoJs.AES.decrypt(data, process.env.SECRET_KEY_ENCRYPT_PASSWORD);
    const originalText = bytes.toString(cryptoJs.enc.Utf8);
    return originalText;
}

exports.createFileName = (filename) => {
    const extension = filename.split(".").pop();
    const identifier = Math.random().toString().replace(/0\./, ''); // remove "0." from start of string
    return `${identifier}${crypto.randomInt(0, Date.now())}.${extension}`;
};

exports.uploadFileAzure = async ({ req, container = 'users', path }) => {
    const azure = new AzureStorage({
        container,
        path
    });

    await azure.upload(req.file);
}

exports.deleteUploadPathFileAzure = async ({ req, container = 'users', path }) => {
    const azure = new AzureStorage({
        container,
        path
    });

    await azure.deletePath(path);
}

exports.defaultPaginate = (query) => {
	let page = 1;
    let limit = 30;

    if (query?.page) page = parseInt(query.page || page);
    if (query?.limit) limit = parseInt(query.limit || limit);
	
	return {
		page: page,
        limit: limit,
        collation: { locale: 'en' },
        customLabels: { 
            docs: 'list',
            totalDocs: 'count',
        }
	};
}

exports.validate = (validations) => {
    return async (req, res, next) => {
      for (let validation of validations) {
        const result = await validation.run(req);
        if (result.errors.length) break;
      }
  
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }
  
      res.status(400).json({ errors: errors.array() });
    };
};

exports.capitalize = (s) => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
};


exports.getAddress = (address) => {
    let fullAddress = [];
    address = address.find( val => val?.isPrimary);
    for(const row of address) {
        fullAddress.push(row?.houseAndUnitNumber || '')
        fullAddress.push(row?.streetName || '')
        fullAddress.push(row?.barangay || '')
        fullAddress.push(row?.zipCode || '')
        fullAddress.push(row?.province || '')
        fullAddress.push(row?.cityAndMunicipality || '')
    }

    return fullAddress.join(" ");
}


exports.generateReferenceNumber = (codeSeries) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');
  const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  const referenceNumber = `${codeSeries}-${year}${month}${day}-${randomSuffix}`;
  
  return referenceNumber;
}

exports.delay = async(time = 1000) => {
    await new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
}

exports.toJSONObject = (object) => {
    return JSON.parse(JSON.stringify(object))
}

exports.objectToString = (object) => {
    return JSON.parse(JSON.stringify(object))
}

const sendEmail = async (msg, other = {}) => {
    try {
        sgMail.setApiKey(process.env.SEND_GRID_KEY);
        msg.from = process.env.SEND_GRID_EMAIL_FROM;
        const send =  await sgMail.send(msg);
        console.log(JSON.stringify({
            message: 'Successfully send to email: ' + msg?.from,
            send: send
        }));
    } catch (error) {
        console.log(JSON.stringify({
            message: 'Error send to email: ' + msg?.from,
            error: error?.message
        }));
        return {
            error: error?.message
        };
    }
};

exports.sendEmail = sendEmail;

exports.getFullName = (data) => {
    let fullname = '';
    if (data?.firstName) fullname += data?.firstName;
    if (data?.middleName) fullname += ' ' + data?.middleName;
    if (data?.lastName) fullname += ' ' + data?.lastName;
    return fullname;
};

exports.uploadFileToAzure = async ({ req, container, filePath }) => {
    const upload = new UploadUtils(req.file);

    upload.file.container = container || 'users';
    upload.file.filePath = `${filePath}/${upload.file.filename}`;
    upload.file.user = req.user.id;

    upload.azure = await upload.toAzureStorage();
    return upload;
}

exports.isImage = ({ mimetype }) => {
    return mimetype.includes('image');
}

exports.isVideo = ({ mimetype }) => {
    return mimetype.includes('video');
}

const createRandomFilename = (filename) => {
    const extension = filename.split(".").pop();
    const identifier = Math.random().toString().replace(/0\./, ''); // remove "0." from start of string
    return `${identifier}${crypto.randomInt(0, Date.now())}.${extension}`;
};

exports.createRandomFilename = createRandomFilename;

exports.generateRandomFilename = (extension = "") => {
  // Generate a random 16-character hexadecimal string
  const randomString = crypto.randomBytes(8).toString('hex');
  // Combine the random string with the provided extension (e.g., '.jpg')
  const filename = `${randomString}.${extension}`;
  return filename;
}

exports.debugLogger = (...logs) => {
    if (config.env === "local") console.log(...logs);
    else console.log(JSON.stringify(logs))
}

exports.calculateDiscountPrice = (originalPrice, discountPercentage) => {
    if (!discountPercentage) return 0;
    
    const discountPrice = originalPrice - (originalPrice * discountPercentage / 100);
    return discountPrice
}

exports.createDictionaryUsingMap = (array, key) => {
    const dictionary = new Map();
    array.forEach((item) => {
        dictionary.set(item[key].toString(), item);
    });
    return dictionary;
}

exports.buildString = (...strings) => {
    return strings.join('');
}

exports.generatePetUsernameSuggestions = async (username) => {
    // Check if the pet name already exists
    const petUsernameExist = await isPetUsernameAlreadyExist(username);

    const suggestions = [];
    // If the pet name exists, generate 5 suggested pet names
    if (petUsernameExist) {
        for (let i = 1; i <= 5; i++) {
            const fiveDigitsNumberRandom = Math.floor(10000 + Math.random() * 90000);
            const suggestedName = `${username}${fiveDigitsNumberRandom}`;
            const suggestedPetExists = await isPetUsernameAlreadyExist(suggestedName);

            // If the suggested pet name doesn't exist, add it to the suggestions
            if (!suggestedPetExists) {
                suggestions.push(suggestedName);
            }
        }
        return suggestions;
    }

    // If the pet name doesn't exist, return null
    return {
        isUsernameExist: petExists ? true : false,
        suggestions: suggestions
    };
};

exports.generateReferralCode = (length) => {
    let referralCode = crypto.randomBytes(length)
        .toString('hex') // convert to hexadecimal format
        .slice(0, length); // return required number of characters

    // Convert some characters to uppercase
    referralCode = referralCode.split('').map(char => {
        return Math.random() < 0.5 ? char.toUpperCase() : char;
    }).join('');

    return referralCode;
}

exports.getWelcomeEmailImagesUrl = async (filename) => {
    return transformImageUrl({
        container: 'cms',
        filePath: `welcome_email/${filename}`
    })
}

exports.generateOrderId = () => {
    return crypto.randomBytes(16).toString('hex');
}

const paginateArray = (items, page = 1, limit = 10) => {
    // Calculate start and end index
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Slice items array to get items for the current page
    const paginatedItems = items.slice(startIndex, endIndex);

    // Calculate total pages
    const totalPages = Math.ceil(items.length / limit);

    // Determine if there are previous or next pages
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;

    // Calculate previous and next page numbers
    const prevPage = hasPrevPage ? page - 1 : null;
    const nextPage = hasNextPage ? page + 1 : null;

    // Return paginated items and pagination info
    return {
        items: paginatedItems,
        total: items.length,
        totalPages,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        limit,
        page
    };
}

exports.paginateArray = paginateArray

exports.getCities = async (req) => {
    // const { page = 1, limit = 10, keyword } = req.query;
    const psgc = await axios.get(`https://psgc.gitlab.io/api/regions`);
    if (psgc.data) {
        // Filter cities by keyword
        // await Location.deleteMany({ type: 'provinces' });
        // for(const row of psgc.data) {
        //     const isExist = await Location.findOne({ code: row.code, type: 'regions' });
        //     if (!isExist) {
        //         const location = new Location({
        //             type: 'regions',
        //             code: row.code,
        //             name: row.name,
        //             regionName: row.regionName,
        //             // isCapital: row.isCapital,
        //             // provinceCode: row.provinceCode,
        //             // districtCode: row.districtCode,
        //             // regionCode: row.region,
        //             islandGroupCode: row.islandGroupCode,
        //             psgc10DigitCode: row.psgc10DigitCode,
        //         });
        //         await location.save();

        //     } else {
        //         console.log("exist", row.name)
        //     }
        // }
        // let filteredCities = [];
        // if (keyword) filteredCities = psgc.data.filter(city => new RegExp(keyword, 'i').test(city.name))
        // else filteredCities = psgc.data;

        // // Paginate filtered cities
        // const paginatedCities = paginateArray(filteredCities, page, limit);
        // return paginatedCities;
    }

    return paginateArray([], page, limit);
}

exports.removeSpaces = (str) => {
    return str.replace(/\s+/g, '');
}

// exports.getPriceValueByCountry = ( data ) => {
//     let price = 0;

//     if (data === "object") {
//         if (data?.country)
//         {
//             switch (data?.country) {
//                 case price = :
//                 break;
            
//                 default:
//                     break;
//             }
//         }
//     }
// }

exports.ensureString = (value) => {
    return value ? value : '';
}

exports.ensureBoolean = (value) => {
    return value ? true : false;
}

exports.writeDataToFile = (dirPath, fileName, data) => {
    // Resolve the directory and file paths
    const resolvedDirPath = path.resolve(__dirname, dirPath);
    const filePath = path.join(resolvedDirPath, fileName);

    // Create the directory if it doesn't exist
    fs.mkdirSync(resolvedDirPath, { recursive: true });
    console.log(filePath)
    // Write the data to the file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

exports.readDataFromFile = (dirPath, fileName) => {
    // Resolve the directory and file paths
    const resolvedDirPath = path.resolve(__dirname, dirPath);
    const filePath = path.join(resolvedDirPath, fileName);

    // Read the data from the file
    const data = fs.readFileSync(filePath, 'utf8');

    // Parse and return the data
    return JSON.parse(data);
};

exports.filterSlotsByDate = (data, startDate, endDate) => {
    // Convert the start date and end date to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Filter the slots
    const filteredSlots = data.flatMap(item => item.slots.filter(slot => {
        const from = new Date(slot.from);
        const to = new Date(slot.to);
        return from.getTime() === start.getTime() && to.getTime() === end.getTime();
    }).map(slot => ({ ...slot, vetId: item.vetId, capacityId: item.capacityId })));

    return filteredSlots;
};

exports.isDecimal = (str) => {
    return /^\d*\.\d+$/.test(str);
}

exports.uploadFileInAzureStorage = async ({ file, container, basePath }) => {
    const filename = createRandomFilename(file.originalname);
    const filePath = `${basePath}/${filename}`;
  
    const azureBlobStorageHelper = new AzureBlobStorageHelper({
      containerName: container,
      contentType: file.mimetype,
      fileBuffer: file.buffer,
      filePath: filePath
    });
  
    if (!(await azureBlobStorageHelper.isContainerExist())) {
      await azureBlobStorageHelper.createContainer();
    }
  
    await azureBlobStorageHelper.upload({
      createContainer: true
    });
  
    return {
      fileSize: file.size,
      filename: filename,
      originalFilename: file.originalname,
      container: container,
      type: file.mimetype,
      filePath: filePath
    };
  };

const ObjectId = require('mongoose').Types.ObjectId;
exports.ObjectId = ObjectId;

exports.extractHashtags = (caption) => {
    // Regular expression to match hashtags
    const hashtagRegex = /#\w+/g;

    // Find all matches
    const matches = caption.match(hashtagRegex);

    // If there are no matches, return an empty array
    if (!matches) {
        return [];
    }

    // Remove the '#' from each hashtag and return the result
    return matches.map(hashtag => hashtag.slice(1)).map(hashtag => hashtag.toLowerCase());
}

exports.sortArrayObjectIds = (objectIdArray) => {
  return objectIdArray.sort((a, b) => {
    const strA = a.toString();
    const strB = b.toString();

    if (strA < strB) {
      return -1;
    }
    if (strA > strB) {
      return 1;
    }
    return 0;
  });
};

exports.encodeDataToBase64 = (data) => {
    return Buffer.from(data).toString("base64")
}

exports.encryptMessage = (message, passphrase) => {
  // Derive a key from the passphrase using a key derivation function (e.g., PBKDF2)
  const key = crypto.pbkdf2Sync(passphrase, 'salt', 100000, 32, 'sha256');
  // Generate a random initialization vector (IV)
  const iv = crypto.randomBytes(16);
  // Create a Cipher object with AES-GCM algorithm
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  // Update the Cipher with the message
  const encryptedMessage = Buffer.concat([cipher.update(message, 'utf-8'), cipher.final()]);
  // Get the authentication tag
  const tag = cipher.getAuthTag();
  // Combine IV, encrypted message, and tag into a single buffer
  const resultBuffer = Buffer.concat([iv, encryptedMessage, tag]);
  // Return the result as a hexadecimal string
  return resultBuffer.toString('hex');
};

exports.decryptMessage = (encryptedHex, passphrase) => {
  // Derive the key using the same passphrase
  const key = crypto.pbkdf2Sync(passphrase, 'salt', 100000, 32, 'sha256');

  // Convert the input hexadecimal string to a buffer
  const encryptedBuffer = Buffer.from(encryptedHex, 'hex');

  // Extract IV, encrypted message, and tag from the buffer
  const iv = encryptedBuffer.subarray(0, 16);
  const encryptedMessage = encryptedBuffer.subarray(16, encryptedBuffer.length - 16);
  const tag = encryptedBuffer.subarray(encryptedBuffer.length - 16);

  // Create a Decipher object with AES-GCM algorithm
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);

  // Set the authentication tag
  decipher.setAuthTag(tag);

  // Update the Decipher with the encrypted message
  const decryptedMessage = Buffer.concat([decipher.update(encryptedMessage), decipher.final()]);

  // Return the decrypted message as a utf-8 string
  return decryptedMessage.toString('utf-8');
};

exports.getAllUniqueIdOfParticipantsInChat = (chats) => {
  const userIds = [];
  chats.forEach((chat) => {
    chat.participants.forEach((userId) => {
      if (!userIds.includes(userId)) {
        userIds.push(userId);
      }
    });
  });

  return userIds;
};

exports.formatDateTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return `${d.getFullYear()}-${("0" + (d.getMonth() + 1)).slice(-2)}-${("0" + d.getDate()).slice(-2)} ${("0" + d.getHours()).slice(-2)}:${("0" + d.getMinutes()).slice(-2)}:${("0" + d.getSeconds()).slice(-2)}`;
};