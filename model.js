console.log('Hello TensorFlow');

// Webcam Image size. Must be 227. 
const IMAGE_SIZE = 400;

/**
 * Get the car data reduced to just the variables we are interested
 * and cleaned of missing data.
 */
async function getData() {
    
    /*
    const carsDataReq = await fetch('https://storage.googleapis.com/tfjs-tutorials/carsData.json');  
    const carsData = await carsDataReq.json();  
    const cleaned = carsData.map(car => ({
      mpg: car.Miles_per_Gallon,
      horsepower: car.Horsepower,
    }))
    .filter(car => (car.mpg != null && car.horsepower != null));
    */
    return cleaned;
  }

function createModel() {
    // Create a sequential model
    const model = tf.sequential(); 
    
    model.add(tf.layers.conv2d({
      inputShape: [400, 400, 3],
      filters: 32,
      kernelSize: 3,
      activation: 'relu',
    }));
    model.add(tf.layers.conv2d({
      filters: 32,
      kernelSize: 3,
      activation: 'relu',
    }));
    model.add(tf.layers.maxPooling2d({poolSize: [2, 2]}));
    model.add(tf.layers.conv2d({
      filters: 64,
      kernelSize: 3,
      activation: 'relu',
    }));
    model.add(tf.layers.conv2d({
      filters: 64,
      kernelSize: 3,
      activation: 'relu',
    }));
    model.add(tf.layers.maxPooling2d({poolSize: [2, 2]}));
    model.add(tf.layers.flatten());
    model.add(tf.layers.dropout({rate: 0.25}));
    model.add(tf.layers.dense({units: 512, activation: 'relu'}));
    model.add(tf.layers.dropout({rate: 0.5}));
    model.add(tf.layers.dense({units: 10, activation: 'softmax'}));
    
    return model;
}

async function trainModel(model, inputs, labels) {
  // Prepare the model for training.  
  model.compile({
    //optimizer: tf.train.adam(),
    optimizer: 'rmsprop',
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });
  
  const batchSize = 32;
  const epochs = 50;
  
  return await model.fit(inputs, labels, {
    batchSize,
    epochs,
    shuffle: true,
    callbacks: tfvis.show.fitCallbacks(
      { name: 'Training Performance' },
      ['loss', 'Crossentropy'], 
      { height: 200, callbacks: ['onEpochEnd'] }
    )
  });
  }

function convertDataToTensors(data, numClasses) {
    const numExamples = data.length;
    const imgRows = data[0].x.length;
    const imgCols = data[0].x[0].length;
    const xs = [];
    const ys = [];
    data.map(example => {
      xs.push(example.x);
      ys.push(this.indexToOneHot(example.y, numClasses));
    });
    let xsTensor = tf.reshape(
        tf.tensor3d(xs, [numExamples, imgRows, imgCols]),
        [numExamples, imgRows, imgCols, 1]);
    xsTensor = tf.mul(tf.scalar(1 / 255), xsTensor);
    const ysTensor = tf.tensor2d(ys, [numExamples, numClasses]);
    return {x: xsTensor, y: ysTensor};
  }
