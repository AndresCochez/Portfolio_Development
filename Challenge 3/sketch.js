const webcamElement = document.getElementById('webcam');
const canvasElement = document.getElementById('canvas');
const captureButton = document.getElementById('capture');
const predictionElement = document.getElementById('prediction');

// Initialize webcam
const webcam = new Webcam(webcamElement, 'user', canvasElement);
webcam.start()
    .then(result => {
        console.log("webcam started");
    })
    .catch(err => {
        console.error(err);
    });

let net;

// Load the MobileNet model
async function loadModel() {
    console.log('Loading MobileNet model...');
    net = await mobilenet.load();
    console.log('Successfully loaded model');
}

loadModel();

captureButton.addEventListener('click', async () => {
    // Capture the photo
    let picture = webcam.snap();
    
    // Draw the image on the canvas
    let ctx = canvasElement.getContext('2d');
    let img = new Image();
    img.src = picture;
    img.onload = async () => {
        ctx.drawImage(img, 0, 0, canvasElement.width, canvasElement.height);
        
        // Get the image data from the canvas
        let imageData = ctx.getImageData(0, 0, canvasElement.width, canvasElement.height);
        
        // Make a prediction using MobileNet
        const predictions = await net.classify(imageData);
        
        // Display the predictions
        predictionElement.innerText = `Prediction: ${predictions[0].className}\nProbability: ${predictions[0].probability.toFixed(2)}`;
    };
});
