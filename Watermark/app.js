// Default spacing values for watermark repetition
let horizontalSpacing = 200;
let verticalSpacing = 180;

// Add click event listener to "Apply Watermark" button
document.getElementById('applyWatermark').addEventListener('click', async function() {

    // Get selected watermark spacing option from radio buttons
    const selectedOption = document.querySelector('input[name="watermarkChoice"]:checked').value;
    const [horizontal, vertical] = selectedOption.split(',').map(Number);
    horizontalSpacing = horizontal;
    verticalSpacing = vertical;

    // Get image input element
    const imageInput = document.getElementById('imageInput');
    // Get watermark text input by user
    const watermarkText = document.getElementById('watermarkText').value;
    // Get image element to display watermarked image
    const watermarkedImage = document.getElementById('watermarkedImage');
    // Get download link element
    const downloadLink = document.getElementById('downloadLink');

    // Validate that image and watermark text are provided
    if (imageInput.files.length === 0 || !watermarkText.trim()) {
        alert('Please select an image and enter watermark text.');
        return; // Stop execution if inputs are incomplete
    }

    // Show the watermarked image element (initially hidden)
    watermarkedImage.style.display = "block";

    // Get the selected image file
    const file = imageInput.files[0];
    const reader = new FileReader();

    // When image file is loaded, process it
    reader.onload = async function(event) {
        const imageDataUrl = event.target.result;

        // Create a canvas element to draw image and watermark
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Create new Image object and set its source to loaded data URL
        const img = new Image();
        img.src = imageDataUrl;

        // Wait for image to fully load
        await new Promise(resolve => img.onload = resolve);

        // Set canvas dimensions to match image dimensions
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw original image on canvas
        ctx.drawImage(img, 0, 0);

        // Set font and style for watermark text
        ctx.font = "30px Arial";
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)"; // White with 30% opacity
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Draw watermark text repeatedly at 45-degree angle
        for (let x = 0; x < canvas.width; x += horizontalSpacing) {
            for (let y = 0; y < canvas.height; y += verticalSpacing) {
                ctx.save(); // Save current canvas state
                ctx.translate(x + 100, y + 50); // Move origin to position
                ctx.rotate(Math.PI / 4); // Rotate 45 degrees (π/4 radians)
                ctx.fillText(watermarkText, 0, 0); // Draw watermark text
                ctx.restore(); // Restore canvas to previous state
            }
        }

        // Get data URL of watermarked image
        const watermarkedImageDataUrl = canvas.toDataURL();

        // Set image element source to watermarked image
        watermarkedImage.src = watermarkedImageDataUrl;

        // Set download link href to watermarked image
        downloadLink.href = watermarkedImageDataUrl;
    };

    // Start reading image file as data URL
    reader.readAsDataURL(file);
});
