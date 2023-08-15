import React, { useRef, useEffect } from "react";
import "../styles/Game.css";

export default function Game() {
    const canvasRef = useRef(null);
    const backgroundXRef = useRef(0);
    const backgroundYRef = useRef(0);
    const keysRef = useRef({});

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        // Load the background image
        const backgroundImage = new Image();
        backgroundImage.src = "game/track1.png";
        backgroundImage.onload = () => {
            canvas.width = 0.4 * window.innerWidth;
            canvas.height = 0.9 * window.innerHeight;
            // Set the initial position of the background image
            // backgroundXRef.current = -375;
            // backgroundYRef.current = -800;
        };

        // Load the car image
        const carImage = new Image();
        carImage.src = "game/racecar.png";
        carImage.onload = () => {
            requestAnimationFrame(updateCanvas);
        };

        const updateCanvas = () => {
            if (keysRef.current["ArrowLeft"]) {
                backgroundXRef.current += 5;
            } else if (keysRef.current["ArrowRight"]) {
                backgroundXRef.current -= 5;
            }
            if (keysRef.current["ArrowUp"]) {
                backgroundYRef.current += 5;
            } else if (keysRef.current["ArrowDown"]) {
                backgroundYRef.current -= 5;
            }

            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(
                backgroundImage,
                backgroundXRef.current,
                backgroundYRef.current
            );

            // Get the color of the pixel in the middle of the canvas
            const cX = canvas.width / 2;
            const cY = canvas.height / 2;
            const imageData = context.getImageData(cX, cY, 1, 1);
            let pixelColor = `rgb(${imageData.data[0]}, ${imageData.data[1]}, ${imageData.data[2]})`;
            console.log(pixelColor);
            const centerX = canvas.width / 2 - carImage.width / 2;
            const centerY = canvas.height / 2 - carImage.height / 2;
            context.drawImage(carImage, centerX, centerY);

            requestAnimationFrame(updateCanvas);
        };

        const handleKeyDown = (event) => {
            keysRef.current[event.key] = true;
        };
        const handleKeyUp = (event) => {
            keysRef.current[event.key] = false;
        };
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    return (
        <div>
            <canvas ref={canvasRef} id="game" />
            <p>hello</p>
        </div>
    );
}
