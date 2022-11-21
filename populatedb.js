#! /usr/bin/env node

console.log('This script populates some test parts and categories to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
const userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
const async = require('async')
const Category = require('./models/category')
const Part = require('./models/part')


const mongoose = require('mongoose');
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const categories = []
const parts = []

function categoryCreate(name, description, cb) {
  const category = new Category({ name: name, description: description});

  category.save(function (err) {
    if (err) {
      cb(err, null)
      return;
    }
    console.log(`New category: ${category}`);
    categories.push(category);
    cb(null, category);
  })
}

function partCreate(name, description, category, price, quantity, cb) {
  const part = new Part({name, description, category, price, quantity});

  part.save(function(err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log(`New part: ${part}`);
    parts.push(part);
    cb(null, part)
  })
}

function createCategories(callback) {
  async.series([
    function(callback) {
      categoryCreate('CPU', 'Computer Processors with several socket-type from brands like Nvidia and AMD', callback)
    },
    function(callback) {
      categoryCreate('GPU', 'Graphic cards from brands like Nvidia and AMD', callback)
    },
    function(callback) {
      categoryCreate('PSU', 'Power supply with ratings from 450w upward', callback)
    },
    function(callback) {
      categoryCreate('RAM', 'Both laptop and desktop rams from 4gb upward', callback)
    },
    function(callback) {
      categoryCreate('HDD', 'Modern hard drives with great capacity', callback)
    },
    function(callback) {
      categoryCreate('SSD', 'Reliable Solid State Drive with great capacity', callback)
    },
    function(callback) {
      categoryCreate('Motherboard', 'Motherboards from Asus, Gigabyte, and MSI', callback)
    },
    function(callback) {
      categoryCreate('Monitor', 'Monitors with TN and IPS panel', callback)
    },
  ], function (err, results) {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, results);
  })
}

function createParts(callback) {
  async.parallel([
    function(callback) {
      partCreate('13th Generation Intel® Core™ 2023', 'Processor 36M Cache, up to 5.80 GHz', categories[0], 699, 5, callback);
    },
    function(callback) {
      partCreate('AMD Ryzen™ 7000 Series', 'AMD Ryzen™ 9 7950X 5.7GHz 64MB Cache 16 Core 32Thread', categories[0], 795, 8, callback);
    },
    function(callback) {
      partCreate('AMD Ryzen™ 5000 Series', 'AMD Threadripper™ 1900X3.8GHz 16MB Cache 8 Core 16Thread', categories[0], 199, 10, callback);
    },
    function(callback) {
      partCreate('ROG-STRIX-RTX3060TI-O8G V2', 'Power Connectors : 2x8-Pin Recommended PSU : 750W Maximum Display Support : 4 Bus Standard : PCI Express 4.0 CUDA Core : 4864', categories[1], 565, 5, callback);
    },
    function(callback) {
      partCreate('MSI RTX™ 4090 SUPRIM X 24G', 'Power Connectors : 16-pin x 1 Recommended PSU : 1000W (Min. 850W) Maximum Display Support : 4 INTERFACE : PCI Express 4.0 CUDA Core : 16384 Units', categories[1], 2299, 8, callback);
    },
    function(callback) {
      partCreate('MSI RTX™ 4090 GAMING X TRIO 24G', 'Power Connectors : 16-pin x 1 Recommended PSU : 850W Maximum Display Support : 4 INTERFACE : PCI Express 4.0 CUDA Core : 16384 Units', categories[1], 2199, 10, callback);
    },
    function(callback) {
      partCreate('NZXT C650 Bronze', 'Wattage: 650W 80 Plus', categories[2], 79, 5, callback);
    },
    function(callback) {
      partCreate('Cooler Master Watt Maker PLATINUM', 'Cooler Master V 1300 80 Plus Platinum ( MPZ-D001-AFBAPV-EU ) Wattage: 1300W', categories[2], 279, 8, callback);
    },
    function(callback) {
      partCreate('Cooler Master V SFX GOLD', 'Cooler Master V SFX Gold Mini PSU for Mini Case(MPY-8501-SFHAGV-EU) Wattage: 850W', categories[2], 159, 10, callback);
    },
    function(callback) {
      partCreate('G-Skill DDR5 Overclocking DRAM', 'DDR5 5600MHz 16GB', categories[3], 85, 5, callback);
    },
    function(callback) {
      partCreate('PNY DDR5 Overclocking DRAM', 'DDR5 6000MHz (16GB x 1 )', categories[3], 99, 8, callback);
    },
    function(callback) {
      partCreate('DDR5 4800MHz LAPTOP', 'DDR5 4800MHz 8GB', categories[3], 99, 10, callback);
    },
    function(callback) {
      partCreate('HDD SEAGATE SKYHAWK BARRACUDA 3.5', 'Write-speed: 7200RPM 64MB', categories[4], 35, 5, callback);
    },
    function(callback) {
      partCreate('HDD SEAGATE I RONWOFT Pro 3.5', 'NAS Write-speed: 5900RPM 256MB', categories[4], 85, 8, callback);
    },
    function(callback) {
      partCreate('HDD WD RED PLUS', 'Write-speed: 5400RPM 128MB', categories[4], 149, 10, callback);
    },
    function(callback) {
      partCreate('CX2 SSD 2.5" SATA III', 'SATA III 256gb', categories[5], 29, 5, callback);
    },
    function(callback) {
      partCreate('SAMSUNG 870Evo', 'SATA III 512gb', categories[5], 49, 8, callback);
    },
    function(callback) {
      partCreate('SAMSUNG 980 Pro M.2', 'PCIe 4.0 500gb', categories[5], 105, 10, callback);
    },
    function(callback) {
      partCreate('Gigabyte H610M H', '12th Generation IntelLGA1700 socket DDR4 x2', categories[6], 96, 5, callback);
    },
    function(callback) {
      partCreate('GA-B660 AORUS MASTER', '12th Generation Intel LGA1700 socket DDR5 x4', categories[6], 269, 8, callback);
    },
    function(callback) {
      partCreate('NZXT N5 Z690 WHITE EDITION Wifi', ' LGA 1700 Support CPU 12th Gen 2022 Support DDR4 Ram', categories[6], 239, 10, callback);
    },
    function(callback) {
      partCreate('AOC 28" 4K UHD Monitor U28P2U/BS', 'Display Size : 28" Inch (IPS) Resolution : 3840 × 2160 (UHD) Brightness : 300 cd/m² (typical) Contrast Ratio : 1000 :50 Million: 1(DCR) Input Connection : HDMI 2.0× 2, DP 1.2 × 1', categories[7], 399, 5, callback);
    },
    function(callback) {
      partCreate('Dell 27" P2723QE 4K Monitor', 'Display Size : 27 Inch IPS Resolution : 4K 3840x2160 at 60Hz Brightness : 350 cd/m² Contrast Ratio : 1000:1 Input Connection : USB-C , DP & HDMI x 2', categories[7], 459, 8, callback);
    },
    function(callback) {
      partCreate('Dell 23.8" S2421HN Monitor', 'Display Size : 23.8 Inch IPS Resolution : 1920x1080 at 75Hz Brightness : 250 cd/m² Contrast Ratio : 1000:1 Input Connection : Audio Line Out & HDMI x 2', categories[7], 160, 10, callback);
    },
  ], function (err, results) {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, results);
  })
}

async.series([
  createCategories,
  createParts,
], function(err, results) {
  if (err) {
    console.log(`FINAL ERR: ${err}`);
    return;
  } else {
    console.log(`Parts; ${parts}`);
  }

  mongoose.connection.close();
})