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
// limitations under the License

import "@babel/polyfill";
import * as mobilenetModule from '@tensorflow-models/mobilenet';
import * as tf from '@tensorflow/tfjs';
import * as knnClassifier from '@tensorflow-models/knn-classifier';
//import { disposeVariables } from "@tensorflow/tfjs";
import * as tfvis from '@tensorflow/tfjs-vis';
//import * as modeljs from '~/model';

// import CNN model classifier

// main page

var main_page_paragraph = document.createElement('p');
var main_page_contents = document.createElement('div');
var main_page_submit = document.createElement('button');
var paper_link = document.createElement('button');

// page 1
// Number of classes to classify
//var num_class_input;
var NUM_CLASSES;

//var page1 = document.createElement('body');
var num_class_input = document.createElement('input');
var num_class_contents = document.createElement('div');
var num_class_settings = document.createElement("div");

var page1_paragraph = document.createElement('p');
page1_paragraph.style.display = 'none';
var num_class_submit = document.createElement('button');

// page 2
// define class one by one
var page2_paragraph = document.createElement('p');
page2_paragraph.style.display = 'none';
var page2_contents = document.createElement('div');
var page2_submit = [];
var page2_div_titles = [];
var page2_divs = [];
var page2_names = [];
var page2_name_sign = [];

// page 3
// define and train model
var page3_paragraph = document.createElement('p');
var train_button = document.createElement('button');
page3_paragraph.style.margin = '10% auto';
page3_paragraph.style.display = 'none';

// page 4
var page4_paragraph = document.createElement('p');
page4_paragraph.style.margin = '10% auto';
page4_paragraph.style.display = 'none';



// Webcam Image size. Must be 227.
const IMAGE_SIZE = 400;

var result = document.createElement('section');
var infoTexts = [];
var video = document.createElement('video');
var train_button = document.createElement("button");
//knn classifier setting part
var settings_button = document.createElement("button");
var settings_modal = document.createElement("div");
var modal_contents = document.createElement("div");
var close_button = document.createElement("button");
var k_val_setting = document.createElement("p");
var paragraph2 = document.createElement("p");
var k_val = document.createElement("input");
var k = 10;
var settings_submit = document.createElement("button");

var export_button = document.createElement("button");
var canvases = [];
var training = -1; // -1 when no class is being trained
var train_clicked = 0;
var data_complete = 0;

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

    //wait for NUM_CLASSES
    function checkVariable() {
      console.log(typeof(NUM_CLASSES));
      if (typeof NUM_CLASSES !== "undefined" ){
        for (var i = 0; i < NUM_CLASSES; i++) {
          canvases[i] = new Array();
          }

        // page 2
        // Create training buttons and info texts
        page2_contents.className = 'page2-content';
        page2_contents.innerText ="Step 2. Define each class";
        page2_contents.style.textAlign = 'center';
        document.getElementById('content2').appendChild(page2_paragraph);
        page2_paragraph.appendChild(page2_contents);


        for (let i = 0; i < NUM_CLASSES; i++) {

          page2_div_titles[i] = document.createElement('section');
          page2_div_titles[i].style.textAlign = 'left';
          page2_contents.appendChild(page2_div_titles[i]);

          page2_name_sign[i] = document.createElement('div');
          page2_name_sign[i].className = 'page-content_2';
          page2_name_sign[i].innerText = "The name of class " + (i + 1);
          page2_contents.appendChild(page2_name_sign[i]);

          page2_names[i] = document.createElement('input');
          page2_name_sign[i].appendChild(page2_names[i]);
          page2_names[i].style.textAlign = 'center';
          page2_names[i].style.marginLeft = '40px';
          page2_names[i].style.width = 'auto';
          page2_names[i].type ="text";
          page2_names[i].defaultValue = "Class" + (i+1);

          page2_divs[i] = document.createElement('div');
          page2_divs[i].style.width = 'auto';
          page2_divs[i].style.borderStyle = 'ridge';
          page2_divs[i].style.borderRadius = '10px';
          page2_divs[i].style.margin = 'auto';
          page2_divs[i].style.textAlign = 'center';
          page2_contents.appendChild( page2_divs[i]);

          //div.style.display = 'block';
          //webcam button
          const webcam_button = document.createElement('button');
          webcam_button.innerText = 'Webcam';
          webcam_button.style.marginRight = '10px'; 
          webcam_button.id = 'submit';
          page2_divs[i].appendChild(webcam_button);
          webcam_button.addEventListener('mousedown', () => {
                // Add video element to DOM
            video.addEventListener('playing', () => this.videoPlaying = true);
            page2_divs[i].appendChild(video);
            train_clicked = 0;
            data_complete = 0;
          });

          // Create training button
          //const data_arr = new Array();
          //canvases.push(data_arr);
          var class_button = document.createElement('button')
          class_button.id = 'submit';
          class_button.innerText = "Capture";
          page2_divs[i].appendChild(class_button);

          // Listen for mouse events when clicking the button
          //button.addEventListener('mousedown', () => this.training = i);
          class_button.addEventListener('mouseup', () => training = -1);
          class_button.addEventListener('mousedown', () => {

            var hiddenCanvas = document.createElement('canvas');

            hiddenCanvas.height = IMAGE_SIZE / 4;
            hiddenCanvas.width = IMAGE_SIZE / 4;
            hiddenCanvas.style.margin = '2px';
            var context = hiddenCanvas.getContext('2d');
            var frame_img = tf.fromPixels(video);
            var frame = document.querySelector('video');
            context.drawImage(frame, 0, 0, IMAGE_SIZE/4, IMAGE_SIZE/4);
            page2_divs[i].appendChild(hiddenCanvas);
            // push canvas
            //console.log(tf.shape(frame_img));
            canvases[i].push(frame_img);
            console.log(canvases);

            training = i;
            //for (let i = 0; i < NUM_CLASSES; i++) {
              //infoTexts[i].style.display = 'none';

            //}
          });

          if (i > 0){
          page2_divs[i].style.display = 'none';
          page2_div_titles[i].style.display ='none';
          page2_name_sign[i].style.display = 'none';
          }
        }

        for (let i = 0; i < NUM_CLASSES; i++) {
          console.log(i);
          page2_submit[i] = document.createElement('button');

          page2_submit[i].innerText ="Next";
          page2_submit[i].id = "submit";
          page2_contents.appendChild(page2_submit[i]);

          if (i > 0){
            page2_submit[i].style.display = 'none';
          }

          page2_submit[i].addEventListener('click', () => {
            page2_divs[i].style.display = 'none';
            page2_div_titles[i].style.display = 'none';
            page2_submit[i].style.display = 'none';
            page2_name_sign[i].style.display = 'none';

            if (i != NUM_CLASSES - 1){
              page2_divs[i+1].style.display = 'block';
              page2_div_titles[i+1].style.display = 'block';
              page2_submit[i+1].style.display = 'block';
              page2_name_sign[i+1].style.display = 'block';
            }
            else{
              page2_paragraph.style.display = 'none';
              page3_paragraph.style.display = 'block';
            }
          });
        }
        // page 3
        checkVariable2();
      }
      else{
          setTimeout(checkVariable, 250);
        }
    }
    checkVariable();

    function checkVariable2() {
      console.log(canvases.length);
      if (canvases.length !== 0){

        document.getElementById('content').appendChild(page3_paragraph);
        page3_paragraph.style.textAlign = 'center';
        var section1 = document.createElement('div');
        section1.className = 'page-content';
        section1.style.margin = 'auto';
        page3_paragraph.appendChild(section1);

        var train_title = document.createElement('div');
        //train_title.className = 'page-content'
        train_title.innerText ="Step 3. Model setting and training";
        train_title.style.margin = 'auto';
        train_title.style.marginBottom = '5px';
        section1.appendChild(train_title);

        const class_num = document.createElement('div');
        class_num.className = 'page-content_2';
        class_num.innerText ="Number of classes:  " + NUM_CLASSES;
        class_num.style.font = "Montserrat";
        class_num.style.fontSize = "18px";
        class_num.style.margin ="auto";
        section1.appendChild(class_num);

        //const class_review = document.createElement('canvas');
        //class_review.style.margin = "auto";
        // #review test
        //const image = tf.toPixels(canvases[0], class_review);
        //section1.appendChild(class_review);

        //settings_modal.className = 'modal';
        //settings_modal.id = "myModal";
        //section1.appendChild(settings_modal);

        modal_contents.className = 'modal-content';
        modal_contents.innerText ="Knn classifier settings";
        modal_contents.style.fontSize = '15px';
        //section1.appendChild(modal_contents);

        k_val_setting.className = 'page-content_2';
        k_val_setting.innerText = "K val:";
        section1.appendChild(k_val_setting);

        k_val.style.marginLeft = '10px';
        k_val.type ="number";
        k_val.defaultValue = k;
        k_val.min = 1;
        k_val.max = 99;
        k_val.maxLength = 2;
        k_val_setting.appendChild(k_val);

        //section1.appendChild(paragraph2);

        //close_button.className = 'fa fa-close';
        //close_button.innerText = "close";
        //close_button.value = "close";
        //close_button.id = 'submit';
        //paragraph2.appendChild(close_button);

        //settings_submit.innerText ="submit";
        //settings_submit.id = "submit";
        //paragraph2.appendChild(settings_submit);
        train_button.id = 'submit';
        train_button.style.margin = 'auto';
        train_button.innerText = 'Train Model';
        section1.appendChild(train_button);

        train_button.addEventListener('mouseup', () => training = -1);
        train_button.addEventListener('click', () => {

          if (canvases.length > 0){
            k = k_val.value;
            page3_paragraph.style.display = 'none';
            page4_paragraph.style.display = 'block';
            train_clicked = 1;
            for (let i = 0; i < NUM_CLASSES; i++) {
              //infoTexts[i].style.display = 'block';

            }
          }
          else {
            alert("Please create your data first !!");
          }

        });

        settings_submit.addEventListener('click', () => {
          k = k_val.value;
          settings_modal.style.display = 'none';
        });

        close_button.addEventListener('click', () => {
          settings_modal.style.display = "none";
        });

        settings_button.className ='fa fa-gear';
        settings_button.style.fontSize = '24px';
        settings_button.style.backgroundColor = 'white';
        settings_button.style.borderRadius = '10px';
        //section1.appendChild(settings_button);

        settings_button.addEventListener('click', () => {
          settings_modal.style.display = "block";
        });

        checkVariable3();
      }
      else{
        setTimeout(checkVariable2, 250);
      }
    }

    function checkVariable3() {
      if (train_clicked == 1){
        document.getElementById('content').appendChild(page4_paragraph);
        page4_paragraph.appendChild(result);
        result.appendChild(video);
        //result.style.width = "70%";
        //section1.style.marginLeft ="60%";
        result.style.borderStyle = 'ridge';
        result.style.borderRadius = '10px';
        result.style.margin ='10% auto';
        result.style.textAlign = 'center';
        //result.style.display = "none";

        const result_title = document.createElement('p');
        result_title.innerText ="Result Preview";
        result_title.style.font = "Montserrat";
        result_title.style.fontSize = "20px";
        result_title.style.margin = 'auto';
        result_title.style.borderBottom = 'ridge';
        result.appendChild(result_title);

        export_button.innerText = "Save Model";
        export_button.id = 'submit';
        export_button.style.display = 'flex';
        export_button.style.marginLeft = '75%';
        export_button.addEventListener("click", function() {
          read_file.click();
        });
        result_title.appendChild(export_button);

        /*
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
    */

        for (let i = 0; i < NUM_CLASSES; i++) {
          const infoText = document.createElement('h4')
          infoText.innerText =   "class "  + (i + 1) + " : No examples added";
          infoText.style.fontSize = "20px";
          infoText.style.width = "70%";
          infoText.style.marginBottom = "5px";
          //nfoText.style.display = "none";
          result.appendChild(infoText);
          infoTexts.push(infoText);
        }
      }
      else{
        setTimeout(checkVariable3, 250);
      }
    }
    // main page
    document.getElementById('content2').appendChild(main_page_paragraph);
    main_page_contents.className = 'page-content';
    main_page_contents.innerText = 'Welcome to Teachable Machine!';
    main_page_paragraph.appendChild(main_page_contents);

    var main_page_box = document.createElement('div');
    main_page_box.className = 'page-content_2';
    main_page_box.style.marginBottom = '0px';
    main_page_contents.appendChild(main_page_box);


    main_page_submit.innerText ="Start New Project";
    main_page_submit.id = "submit";
    main_page_box.appendChild(main_page_submit);

    main_page_submit.addEventListener('click', () => {
      main_page_paragraph.style.display = 'none';
      page1_paragraph.style.display = 'block';
    });

    var main_page_box2 = document.createElement('div');
    main_page_box2.className = 'page-content_2';
    main_page_contents.appendChild(main_page_box2);
    paper_link.innerText = "Visit Project Paper";
    paper_link.id = 'submit';
    main_page_box2.appendChild(paper_link);
    
    paper_link.addEventListener('click', () =>{
      window.open("https://dl.acm.org/doi/abs/10.1145/3334480.3382839");
    });






    //page 1
    document.getElementById('content2').appendChild(page1_paragraph);

    num_class_contents.className = 'page-content';
    num_class_contents.innerText ="Step 1. Set the number of classes";
    page1_paragraph.appendChild(num_class_contents);

    num_class_settings.className = 'page-content_2';
    num_class_settings.innerText = "The number of classes";
    num_class_contents.appendChild(num_class_settings);

    num_class_input.style.textAlign = 'center';
    num_class_input.style.marginLeft = '40px';
    num_class_input.type ="number";
    num_class_input.defaultValue = 2;
    num_class_input.min = 2;
    num_class_input.max = 99;
    num_class_input.maxLength = 2;
    num_class_settings.appendChild(num_class_input);


    num_class_submit.innerText ="submit";
    num_class_submit.id = "submit";
    num_class_contents.appendChild(num_class_submit);

    num_class_submit.addEventListener('click', () => {
      NUM_CLASSES = parseInt(num_class_input.value);
      page1_paragraph.style.display = 'none';
      page2_paragraph.style.display = 'block';
    });

    // Add video element to DOM
    //document.getElementById("content").appendChild(this.video);


    //this.result = document.createElement('section');

    /*
    addclass_button.addEventListener("click", function(){
      train_clicked = 0;
      data_complete = 0;
      NUM_CLASSES = NUM_CLASSES + 1;
      canvases[NUM_CLASSES - 1] = new Array();

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
        train_clicked = 0;
        data_complete = 0;
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

        var frame_img = tf.fromPixels(video);
        var frame = document.querySelector('video');
        context.drawImage(frame, 0, 0, IMAGE_SIZE/4, IMAGE_SIZE/4);
        div.appendChild(hiddenCanvas);
        // push canvas
        canvases[serial_num].push(frame_img);
        console.log(canvases);

        training = serial_num;
        for (let i = 0; i < NUM_CLASSES; i++) {
          infoTexts[i].style.display = 'none';

        }
      });


    });
    */


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
    //first knn
    this.knn = knnClassifier.create();

    //tfvis.show.modelSummary({name: 'Model Summary'}, this.knn_2);
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
      // input: k dimensional vector
      // output: class object
      // x label: k attributes
      // y label: multiple objects
      const infer = () => this.mobilenet.infer(image, 'conv_preds');

      // Train class if one of the buttons is held down
      /*if (train_clicked == 1) {

        // More code will be added below
        // Create the model
        const model = createModel();
        //tfvis.show.modelSummary({name: 'Model Summary'}, model);


        // Convert the data to a form we can use for training.
        const inputTensor = tf.tensor2d(canvases, [canvases.length, 4]);
        const tensorData = inputTensor;
        // const {inputs} = segmentationInput;
        // https://github.com/tensorflow/tfjs-examples/blob/master/mnist-node/data.js
        const labels = new Int32Array(tf.util.sizeFromShape([NUM_CLASSES, 1]));

        // Train the model
        await trainModel(model, inputs, labels);
        console.log('Training Done');

        // Make some predictions using the model and compare them to the
        // original data
        //testModel(model, data, tensorData);

      }*/
      if (train_clicked == 1 && data_complete == 0 ) {
        console.log("data collecting");

        //const model = createModel();
        //tfvis.show.modelSummary({name: 'Model Summary'}, model);

        for (let i = 0; i < NUM_CLASSES; i++){
          for (let j = 0; j < canvases[i].length; j++){
            const infer = () => this.mobilenet.infer(canvases[i][j], 'conv_preds');
            logits = infer();
            this.knn.addExample(logits, i);
          }
        }
        data_complete = 1;
        console.log("data completed");
      }

      const numClasses = this.knn.getNumClasses();

      if (numClasses > 0){
        // If classes have been added run predict
        logits = infer();
        //console.log("k value: ", k);
        const res = await this.knn.predictClass(logits, k);

        for (let i = 0; i < NUM_CLASSES; i++) {
          //console.log(infoTexts.length);

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

            infoTexts[i].innerText = page2_names[i].value + " : " + ` ${exampleCount[i]} examples - ${res.confidences[i] * 100}%`
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

/*async function run() {

  // More code will be added below
  // Create the model
    const model = createModel();
    tfvis.show.modelSummary({name: 'Model Summary'}, model);

    // Convert the data to a form we can use for training.
    const tensorData = canvases;
    const {inputs} = tensorData;
    const {labels} = [1,2];

    // Train the model
    await trainModel(model, inputs, labels);
    console.log('Training Done');

    // Make some predictions using the model and compare them to the
    // original data
    testModel(model, data, tensorData);
}
*/
//document.addEventListener('DOMContentLoaded', run);
