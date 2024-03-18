'use client'
// import Image from "next/image";
// import Link from 'next/link';
// import MyDashboard from "@/components/MyDashboard";
// import React, { useRef, useState, useEffect } from 'react';

// import Tesseract from "tesseract.js";



// export default function Child() {
  
//   const videoRef = useRef<any>(null);
//      const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
//      const [snapshot, setSnapshot] = useState<string>('');

//      const sendVideoData = (data: string) => {
//         //  socket.emit("videoData", data);
//      };

//      useEffect(() => {
//          const enableVideoStream = async () => {
//              try {
//                  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//                  setMediaStream(stream);
//              } catch (error) {
//                  console.error('Error accessing webcam', error);
//              }
//          };

//          enableVideoStream();
//      }, []);

//      useEffect(() => {
//          if (videoRef.current && mediaStream) {
//              videoRef.current.srcObject = mediaStream;
//          }
//      }, [videoRef, mediaStream]);

//      useEffect(() => {
//          return () => {
//              if (mediaStream) {
//                  mediaStream.getTracks().forEach((track) => {
//                      track.stop();
//                  });
//              }
//          };
//      }, [mediaStream]);

//      const takeSnapshot = () => {
//       if (mediaStream) {
//         console.log('test',videoRef.current)
//           // Create a video element to display the stream
//           // const videoElement = document.createElement('video');
//           // videoElement.srcObject = mediaStream;
//           // videoElement.play();

//           // Create a canvas element to capture the snapshot
//           const canvas = document.createElement('canvas');
//           canvas.width = videoRef.current.videoWidth;
//           canvas.height = videoRef.current.videoHeight;

//           // Draw the current frame of the video onto the canvas
//           const ctx = canvas.getContext('2d');
//           ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

//           // // Get the base64 representation of the image data
//           const snapshotData = canvas.toDataURL('image/png');
//           setSnapshot(snapshotData);
          
          

//           const boom = async ()=>{
//             const respo=  await Tesseract.recognize(snapshotData,'eng',{logger(arg) {
                
//             },})
//             const { data } = respo;
//             console.log(data)
          
//           }

//           boom()
//       }
//   };



  
//   return <div>
//   <video ref={videoRef} autoPlay={true} />
//   <button onClick={takeSnapshot}>Take Snapshot</button>
//   {snapshot && (
//                 <div>
//                     <h2>Preview</h2>
//                     <img height={200} width={200} src={snapshot} alt="Snapshot" />
//                 </div>
//             )}
//   </div>
//  }




 import React, { useRef, useState, useEffect, RefObject, useCallback } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd"
// 1. TODO - Import required model here
// e.g. import * as tfmodel from "@tensorflow-models/tfmodel";
import Webcam from "react-webcam";
// 2. TODO - Import drawing utility here
// e.g. import { drawRect } from "./utilities";

function App() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [snapshot, setSnapshot] = useState<string>('');

  
  const takeSnapshot = useCallback(() => {
    // const imageSrc = (webcamRef.current as any).getScreenshot();
    // setSnapshot(imageSrc);
    getObject()
    
  }, [webcamRef]);  

  const getObject= async ()=>{
    const video=(webcamRef.current as any).video
    const net = await cocoSsd.load();
    const obj = await net.detect(video);
    console.log(obj)
  }
  useEffect(() => {
    const initializeBackend = async () => {
      try {
        await tf.setBackend('webgl');
      } catch (error) {
        console.error('Error initializing WebGL backend:', error);
      }
    };

    initializeBackend();
  }, []);
  // Main function
  const runCoco = async () => {
    // 3. TODO - Load network 
     const net = await cocoSsd.load();
        
    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 10);
  };

  const detect = async (net:any) => {
    // Check data is available
    if (
        webcamRef && webcamRef.current && (webcamRef.current as any).video?.readyState === 4
    ) {
      // Get Video Properties
      const video = (webcamRef.current as any).video;
      const videoWidth = (webcamRef.current as any).video.videoWidth;
      const videoHeight = (webcamRef.current as any).video.videoHeight;

      // Set video width
      (webcamRef.current as any).video.width = videoWidth;
      (webcamRef.current as any).video.height = videoHeight;

      // Set canvas height and width
      (canvasRef.current as any).width = videoWidth;
      (canvasRef.current as any).height = videoHeight;

      // 4. TODO - Make Detections
      const obj = await net.detect(video);
      console.log(obj)

      // Draw mesh
      const ctx = (canvasRef.current as any).getContext("2d");

      // 5. TODO - Update drawing utility
       drawSomething(obj, ctx)  
    }
  };

  const drawSomething = (obj:any, ctx:any) =>{
      obj.forEach((prediction:any) => {
        const [x,y, width,height]= prediction['bbox']
        const text=prediction['class']

        const color='green'
        ctx.strokeSylt=color
        ctx.font='18px Arial'
        ctx.fillStyle=color

        ctx.beginPath()
        ctx.fillText(text,x,y)
        ctx.rect(x,y,width,height)
        ctx.stroke()
      });
  }

  useEffect(()=>{runCoco()},[]);

  return (
    <>
    <div className="App">
      <header className="App-header">
        {!snapshot && <Webcam
          ref={webcamRef}
          muted={true} 
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />}

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 8,
            width: 640,
            height: 480,
          }}
        />
      </header>
       
    </div>
    <button onClick={takeSnapshot}>Take Snapshot</button>
    {snapshot && (
                   <div>
                       <h2>Preview</h2>
                      <img height={480} width={640} src={snapshot} alt="Snapshot" />
                  </div>
              )}
    </>
    
  );
}

export default App;
