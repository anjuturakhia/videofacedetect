import { Component, 
  OnInit, 
  ViewChild,
  ElementRef,
  PLATFORM_ID, 
  Inject } from '@angular/core';
import * as faceapi from 'face-api.js';
import {isPlatformBrowser} from '@angular/common';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
  title = 'facedetection';
    input = document.getElementById('myImg');
    @ViewChild('video', {static: true}) video: ElementRef<HTMLVideoElement>;
   
    fileToUpload: any;
     imageUrl: any;
     newuplpoad: any;
     matchscore:string = '';
     totalfaces : number = null;
     imagemached = '-';

     sayHiya: any;
     counter = 0;

     
    constructor(@Inject(PLATFORM_ID) private _platform: Object) {}

   onStart(){
      console.log(navigator.mediaDevices);
      
      if(isPlatformBrowser(this._platform) && 'mediaDevices' in navigator) {
        console.log(2);
        navigator.mediaDevices.getUserMedia({video: true}).then((ms: MediaStream) => {
          const _video = this.video.nativeElement;
          _video.srcObject = ms;
          console.log(_video);
          _video.play(); 
       
        
       
          let canvas;
          let displayValues;


          this.sayHiya =    setInterval(async () => {

       //  let canvas;
     
       if (canvas) canvas.remove();
       if(img) img.remove();
       if(img) img.src = '';
          
          canvas = await faceapi.createCanvasFromMedia(_video);
          document.body.append(canvas);
          console.log(canvas);
          const queryImage1 = await faceapi.bufferToImage(this.fileToUpload);

           displayValues = { 
            width: 500,
            height: 375
        };
         
    
          /* Display detected face bounding boxes */
          const detections = await faceapi
          .detectAllFaces(_video, new faceapi.TinyFaceDetectorOptions()) //Face Detectors
          .withFaceLandmarks()  // Get cordinates of landmarks
          .withFaceDescriptors();  //Get Face Expression confidence values
      // resize the detected boxes in case your displayed image has a different size than the original

           

    //const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        faceapi.matchDimensions(canvas, displayValues);
            const resizedDetections = faceapi.resizeResults(detections, displayValues);
      // draw detections into the canvas
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
     // faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
      //Printing the detection coordinates
      console.log(detections);
      console.log("reached here also size");

      canvas.getContext('2d')
  .drawImage(_video, 0, 0, canvas.width, canvas.height);
// convert it to a usable data URL
    const dataURL = canvas.toDataURL();
    console.log(dataURL);
    var img = document.createElement("img");
    img.src = dataURL;
    console.log(img.src);

      this.totalfaces = detections.length;

      const faceMatcher = new faceapi.FaceMatcher(detections);
      console.log(faceMatcher);
      // const queryImage1 = await faceapi.fetchImage('./assets/yashvi.jpg');
      console.log(this.fileToUpload);
     

      console.log(queryImage1);
       
      const singleResult = await faceapi.detectSingleFace(queryImage1).withFaceLandmarks().withFaceDescriptor();
      console.log(singleResult);

        if (singleResult) {
          const bestMatch = faceMatcher.findBestMatch(singleResult.descriptor)
          console.log(bestMatch.toString());
          this.matchscore = bestMatch.toString();
          console.log(bestMatch.distance);
          if(bestMatch.distance > 0.6){
              this.imagemached = 'yes';
              document.getElementById('loader').style.display = "none";
              document.getElementById('resultsrecord').style.display = "block";
              document.getElementById('undetectedimage').style.display = "none";
              clearInterval(this.sayHiya);
              return true;
          }else{
            this.imagemached = 'no';
         //   this.matchscore = '';

            this.counter = this.counter + 1;;
            console.log(this.counter);
            
                 if (this.counter >= 25) {
                  document.getElementById('loader').style.display = "none";
                  document.getElementById('resultsrecord').style.display = "block";
                  document.getElementById('undetectedimage').style.display = "none";
                   clearInterval(this.sayHiya);
               }


          }
        
        }else{
          document.getElementById('loader').style.display = "none";
          document.getElementById('resultsrecord').style.display = "none";
          document.getElementById('undetectedimage').style.display = "block";
          clearInterval(this.sayHiya);
          
          
        }

        console.log("reached");
        //  const img = await faceapi.bufferToImage(this.newuplpoad);
        // image2.src = img.src;

        }, 500);


      })

      }
    }



   ngOnInit(){

     Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri('./assets'),
      faceapi.nets.faceLandmark68TinyNet.loadFromUri('./assets'),
      faceapi.nets.ssdMobilenetv1.loadFromUri('./assets'),
      faceapi.loadFaceLandmarkModel('./assets'),
      faceapi.loadFaceRecognitionModel('./assets'),
      faceapi.nets.tinyFaceDetector.loadFromUri('./assets'),
     faceapi.nets.faceLandmark68Net.loadFromUri('./assets'),
     faceapi.nets.faceRecognitionNet.loadFromUri('./assets'),
     faceapi.nets.faceExpressionNet.loadFromUri('./assets')


     ]);



   }


 async handleFileInput(file: FileList) {

    // let image2= document.getElementById('myImg') as HTMLImageElement;
    
    this.fileToUpload = file.item(0);
    // console.log(1);
    //  const img = await faceapi.bufferToImage(this.fileToUpload);
    // image2.src = img.src;
    //Show image preview
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
      console.log(2);
    }
    reader.readAsDataURL(this.fileToUpload);
    this.onStart();
   // document.getElementById('videostart').style.display = "block";
    document.getElementById('loader').style.display = "block";
    document.getElementById('resultsrecord').style.display = "none";
    document.getElementById('undetectedimage').style.display = "none";
  }

  


}
