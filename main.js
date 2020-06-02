// Copyright 2018 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import "@babel/polyfill";
import * as mobilenetModule from '@tensorflow-models/mobilenet';
import * as tf from '@tensorflow/tfjs';
import * as knnClassifier from '@tensorflow-models/knn-classifier';
import { disposeVariables } from "@tensorflow/tfjs";

// import CNN model classifier

// Number of classes to classify
var NUM_CLASSES = 2;
// Webcam Image size. Must be 227. 
const IMAGE_SIZE = 400;
// K value for KNN
const TOPK = 10;
/*
navigator.getUserMedia = ( navigator.getUserMedia ||
navigator.webkitGetUserMedia ||
navigator.mozGetUserMedia ||
navigator.msGetUserMedia);
  
var video;
var webcamStream;

function start_webcam() {
  if (navigator.getUserMedia) {
    navigator.getUserMedia ({
      video: true,
      audio: false
      
    },
    function(localMediaStream){
      video.document.querySelector('video');
      video.src =
      window.URL.createObjectURL(localMediaStream);
        webcamStream = localMediaStream;
    },
    //error callback
    function(err){
      console.log("The following error occured: " + err);

    });

  }else {
    console.log("getUserMedia is not supported");
  }
}
function stopWebcam() {
  webcamStream.stop();
}
*/

var result = document.createElement('section');
var infoTexts = [];
var video = document.createElement('video');
var train_button = document.createElement("button");
var export_button = document.createElement("button");
var canvases = new Array();
var training = -1; // -1 when no class is being trained

// Create training button
const class_button = document.createElement('button')

class Main {
  constructor() {
    // Initiate variables
    //this.infoTexts = [];
    this.divs = new Array();
    //this.canvases = new Array();
    //this.training = -1; // -1 when no class is being trained
    this.videoPlaying = false;

    // Initiate deeplearn.js math and knn classifier objects
    this.bindPage();
    
    // header
    var header = document.createElement('header');
    header.innerText = "Teachable Machine";
    header.style.textAlign = 'center';
    header.style.font = 'Roboto';
    header.style.backgroundColor = '#f0f0f0';
    header.style.fontSize = '30px';
    document.getElementById('header').appendChild(header);

    // Create video element that will contain the webcam image
    //this.video = document.createElement('video');
    video.setAttribute('autoplay', '');
    video.setAttribute('playsinline', '');
    video.style.margin = 'auto';
    video.style.display = 'flex';

    // Add video element to DOM
    //document.getElementById("content").appendChild(this.video);

    const section1 = document.createElement('section');
    document.getElementById("content3").appendChild(section1);
    section1.style.width = "300px";
    section1.style.height = "200px";
    //section1.style.marginLeft ="60%";
    section1.style.borderStyle = 'ridge';
    section1.style.borderRadius = '10px';
    section1.style.marginRight ='0px';
    section1.style.right ='200px';
    section1.style.margin ='auto';
    section1.style.textAlign = 'center';
    section1.style.marginLeft = '170px';
    section1.style.marginBottom = '20px';

    const train_title = document.createElement('p');
    train_title.innerText ="Training";
    train_title.style.font = "Montserrat";
    train_title.style.fontSize = "20px";
    train_title.style.marginBottom ="0px";
    train_title.style.borderBottom = 'ridge';
    section1.appendChild(train_title);

    //this.train_button = document.createElement("button");
    train_button.innerText = 'Train model';
    train_button.style.width = '200px';
    train_button.style.height = '30px';
    train_button.style.margin = '10px';
    train_button.style.backgroundColor = 'white';
    train_button.style.borderRadius = '10px';
    section1.appendChild(train_button);
    
    train_button.addEventListener('mouseup', () => training = -1);
    train_button.addEventListener('click', () => {

      if (canvases.length > 0){
        result.style.display = "block";
        // Create info text
        train_button.innerText = 'model trained';
        //while(this.result.firstChild){
          //this.result.removeChild(this.result.firstChild);
        //}
        result.appendChild(video);
        for (let i = 0; i < NUM_CLASSES; i++) {
          infoTexts[i].style.display = 'block';
          
        }
      }
      else {
        alert("Please create your data first !!");
      }
      
    });
    
    //this.result = document.createElement('section');
    document.getElementById("content3").appendChild(result);
    result.style.width = "500px";
    //section1.style.marginLeft ="60%";
    result.style.borderStyle = 'ridge';
    result.style.borderRadius = '10px';
    result.style.marginRight ='0px';
    result.style.right ='200px';
    result.style.margin ='auto';
    result.style.marginLeft ="50px";
    result.style.marginBottom = "30px";
    result.style.textAlign = 'center';
    //result.style.display = "none";

    const result_title = document.createElement('p');
    result_title.innerText ="Preview";
    result_title.style.font = "Montserrat";
    result_title.style.fontSize = "20px";
    result_title.style.marginBottom ="0px";
    result_title.style.borderBottom = 'ridge';
    result.appendChild(result_title);

    export_button.innerText = "Export Model";
    export_button.style.font = "Montserrat";
    export_button.style.fontSize = "15px";
    export_button.style.textAlign = 'center';
    export_button.style.borderRadius = "10px";
    export_button.style.backgroundColor = "white";
    export_button.style.display = 'flex';
    export_button.style.marginLeft = '75%';
    export_button.addEventListener("click", function() {
      read_file.click();
    });
    result_title.appendChild(export_button);

    var addclass_button = document.createElement('input');
    addclass_button.setAttribute('type', 'button');
    addclass_button.setAttribute('value', 'Add a class');
    //addclass_button.innerText = 'Add a class';
    addclass_button.style.width = '140px';
    addclass_button.style.height = '30px';
    addclass_button.style.margin = '10px';
    addclass_button.style.backgroundColor = 'white';
    addclass_button.style.borderRadius = '10px';
    document.getElementById("content2").appendChild(addclass_button);


    for (let i = 0; i < NUM_CLASSES; i++) {
      const infoText = document.createElement('h4')
      infoText.innerText =   "class "  + (i + 1) + " : No examples added";
      infoText.style.fontSize = "20px";
      infoText.style.width = "300px";
      infoText.style.marginBottom = "5px";
      infoText.style.display = "none";
      result.appendChild(infoText);
      infoTexts.push(infoText);
    }

    // Create training buttons and info texts    
    for (let i = 0; i < NUM_CLASSES; i++) {
      const div_title = document.createElement('section');
      document.getElementById("content2").appendChild(div_title);
      div_title.style.width ="650px";
      div_title.style.height = "50px";
      div_title.style.borderStyle = 'ridge';
      div_title.style.borderRadius = '10px';
      //div_title.style.display = 'flex';

      const div = document.createElement('div');
      //document.body.appendChild(div);
      div.style.marginBottom = '10px';
      div.style.width = '650px';
      div.style.borderStyle = 'ridge';
      div.style.borderRadius = '10px';
      div.style.marginRight = '0px';
      div.style.marginBottom = "20px";
      document.getElementById("content2").appendChild(div);

      //div.style.display = 'block';
      //webcam button
      const webcam_button = document.createElement('button');
      webcam_button.innerText = 'Webcam';
      webcam_button.style.width = '100px';
      webcam_button.style.height = '30px';
      webcam_button.style.margin = '10px';
      webcam_button.style.backgroundColor = 'white';
      webcam_button.style.borderRadius = '10px';
      div.appendChild(webcam_button);
      webcam_button.addEventListener('mousedown', () => {
            // Add video element to DOM
        div.appendChild(video);
        train_button.innerText ='Train model';
      });

      // Create training button
      var class_button = document.createElement('button')
      class_button.style.width = '100px';
      class_button.style.height = '30px';
      class_button.style.margin = '10px';
      class_button.style.backgroundColor = 'white';
      class_button.style.borderRadius = '10px';
      class_button.innerText = "class " + (i + 1);
      div_title.appendChild(class_button);

      // Listen for mouse events when clicking the button
      //button.addEventListener('mousedown', () => this.training = i);
      class_button.addEventListener('mouseup', () => training = -1);
      class_button.addEventListener('mousedown', () => {
        var hiddenCanvas = document.createElement('canvas');
        hiddenCanvas.height = IMAGE_SIZE / 4;
        hiddenCanvas.width = IMAGE_SIZE / 4;
        var context = hiddenCanvas.getContext('2d');
        var frame = document.querySelector('video');
        context.drawImage(frame, 0, 0, IMAGE_SIZE/4, IMAGE_SIZE/4);
        div.appendChild(hiddenCanvas);
        // push canvas
        canvases.push(hiddenCanvas);
        console.log(canvases);

        training = i;
        for (let i = 0; i < NUM_CLASSES; i++) {
          infoTexts[i].style.display = 'none';
          
        }
      });
    }

    addclass_button.addEventListener("click", function(){
      NUM_CLASSES = NUM_CLASSES + 1;

      var infoText = document.createElement('h4')
      infoText.innerText =   "class "  + (NUM_CLASSES) + " : No examples added";
      infoText.style.fontSize = "20px";
      infoText.style.width = "300px";
      infoText.style.marginBottom = "5px";
      infoText.style.display = "none";
      result.appendChild(infoText);
      infoTexts.push(infoText);

      var div_title = document.createElement('section');
      document.getElementById("content2").appendChild(div_title);
      div_title.style.width ="650px";
      div_title.style.height = "50px";
      div_title.style.borderStyle = 'ridge';
      div_title.style.borderRadius = '10px';
      //div_title.style.display = 'flex';

      var div = document.createElement('div');
      //document.body.appendChild(div);
      div.style.marginBottom = '10px';
      div.style.width = '650px';
      div.style.borderStyle = 'ridge';
      div.style.borderRadius = '10px';
      div.style.marginRight = '0px';
      div.style.marginBottom = "20px";
      document.getElementById("content2").appendChild(div);

      //div.style.display = 'block';
      //webcam button
      var webcam_button = document.createElement('button');
      webcam_button.innerText = 'Webcam';
      webcam_button.style.width = '100px';
      webcam_button.style.height = '30px';
      webcam_button.style.margin = '10px';
      webcam_button.style.backgroundColor = 'white';
      webcam_button.style.borderRadius = '10px';
      div.appendChild(webcam_button);
      webcam_button.addEventListener('mousedown', () => {
            // Add video element to DOM
        div.appendChild(video);
        train_button.innerText ='Train model';
        //result.style.display = "none";
      });

      // Create training button
      var class_button = document.createElement('button')
      class_button.style.width = '100px';
      class_button.style.height = '30px';
      class_button.style.margin = '10px';
      class_button.style.backgroundColor = 'white';
      class_button.style.borderRadius = '10px';
      class_button.innerText = "class " + (NUM_CLASSES);
      const serial_num = NUM_CLASSES - 1;
      
      div_title.appendChild(class_button);

      // Listen for mouse events when clicking the button
      class_button.addEventListener('mouseup', () => training = -1);
      class_button.addEventListener('mousedown', () => {
        var hiddenCanvas = document.createElement('canvas');
        hiddenCanvas.height = IMAGE_SIZE / 4;
        hiddenCanvas.width = IMAGE_SIZE / 4;
        var context = hiddenCanvas.getContext('2d');
        var frame = document.querySelector('video');
        context.drawImage(frame, 0, 0, IMAGE_SIZE/4, IMAGE_SIZE/4);
        div.appendChild(hiddenCanvas);
        // push canvas
        canvases.push(hiddenCanvas);
        console.log(canvases);

        training = serial_num;
        for (let i = 0; i < NUM_CLASSES; i++) {
          infoTexts[i].style.display = 'none';
          
        }
      });
      
      
    });
    


    // Setup webcam
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then((stream) => {
        video.srcObject = stream;
        video.width = IMAGE_SIZE;
        video.height = IMAGE_SIZE;

        video.addEventListener('playing', () => this.videoPlaying = true);
        video.addEventListener('paused', () => this.videoPlaying = false);
      })
  }

  async bindPage() {
    this.knn = knnClassifier.create();
    this.mobilenet = await mobilenetModule.load();

    this.start();
  }

  start() {
    if (this.timer) {
      this.stop();
    }
    video.play();
    this.timer = requestAnimationFrame(this.animate.bind(this));
  }

  stop() {
    video.pause();
    cancelAnimationFrame(this.timer);
  }

  // 5/22 separate training function 1. take image and convert into vector (infer) 2. training knn part 3. testing and show result
  async animate() {
    if (this.videoPlaying) {
      // Get image data from video element
      const image = tf.fromPixels(video);

      let logits;
      // 'conv_preds' is the logits activation of MobileNet.
      const infer = () => this.mobilenet.infer(image, 'conv_preds');

      // Train class if one of the buttons is held down
      if (training != -1) {
        logits = infer();

        // Add current image to classifier
        
        this.knn.addExample(logits, training)
      }

      const numClasses = this.knn.getNumClasses();
      if (numClasses > 0) {

        // If classes have been added run predict
        logits = infer();
        const res = await this.knn.predictClass(logits, TOPK);

        for (let i = 0; i < NUM_CLASSES; i++) {
          console.log(infoTexts.length);

          // The number of examples for each class
          const exampleCount = this.knn.getClassExampleCount();

          // Make the predicted class bold
          if (res.classIndex == i) {
            infoTexts[i].style.fontWeight = 'bold';
          } else {
            infoTexts[i].style.fontWeight = 'normal';
          }

          // Update info text
          if (exampleCount[i] > 0 ) {
            infoTexts[i].style.fontSize = "20px";
            infoTexts[i].style.width = "300px";
            infoTexts[i].style.marginBottom = "5px";
            
            infoTexts[i].innerText = "class " + (i + 1) + " : " + ` ${exampleCount[i]} examples - ${res.confidences[i] * 100}%`
          }
        }
      }

      // Dispose image when done
      image.dispose();
      if (logits != null) {
        logits.dispose();
      }
    }
    this.timer = requestAnimationFrame(this.animate.bind(this));

    
  }
  
}

window.addEventListener('load', () => new Main());