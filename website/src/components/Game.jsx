import React, { useRef, useEffect } from "react";
import "../styles/Game.css";

export default function Game() {
    const canvasRef = useRef(null);
    const startCoordinates = { x: -370, y: -1000 };
    const backgroundXRef = useRef(startCoordinates.x);
    const backgroundYRef = useRef(startCoordinates.y);
    const backgroundRotationRef = useRef(0);
    const keysRef = useRef({});
    let centerPixelColor = useRef("rgb(41, 41, 41)");

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        // Load the background image
        const backgroundImage = new Image();
        backgroundImage.src = "game/track1.png";
        backgroundImage.onload = () => {
            canvas.width = 0.4 * window.innerWidth;
            canvas.height = 0.9 * window.innerHeight;
        };

        // Load the car image
        const carImage = new Image();
        carImage.src = "game/racecar.png";
        carImage.onload = () => {
            requestAnimationFrame(updateCanvas);
        };

        const updateCanvas = () => {
            if (centerPixelColor === "rgb(41, 41, 41)") {
                if (keysRef.current["ArrowLeft"]) {
                    backgroundRotationRef.current += 0.015;
                } else if (keysRef.current["ArrowRight"]) {
                    backgroundRotationRef.current -= 0.015;
                }
                if (keysRef.current["ArrowUp"]) {
                    const angle = backgroundRotationRef.current;
                    const dx = Math.sin(angle) * 5;
                    const dy = Math.cos(angle) * 5;
                    backgroundXRef.current += dx;
                    backgroundYRef.current += dy;
                } else if (keysRef.current["ArrowDown"]) {
                    const angle = backgroundRotationRef.current;
                    const dx = Math.sin(angle) * 5;
                    const dy = -Math.cos(angle) * 5;
                    backgroundXRef.current += dx;
                    backgroundYRef.current += dy;
                }
            } else {
                setTimeout(() => {
                    // reset the car position after 300ms
                    backgroundXRef.current = startCoordinates.x;
                    backgroundYRef.current = startCoordinates.y;
                    backgroundRotationRef.current = 0;
                }, 300);
            }

            // Clear the canvas
            context.clearRect(0, 0, canvas.width, canvas.height);

            // Draw the background
            context.save();
            // Rotate around the center of the canvas
            context.translate(canvas.width / 2, canvas.height / 2);
            context.rotate(backgroundRotationRef.current);
            context.translate(-canvas.width / 2, -canvas.height / 2);
            context.drawImage(
                backgroundImage,
                backgroundXRef.current,
                backgroundYRef.current
            );

            context.restore();

            // Get the color of the pixel in the middle of the canvas
            const canvasMiddleX = canvas.width / 2;
            const canvasMiddleY = canvas.height / 2;
            const imageData = context.getImageData(
                canvasMiddleX,
                canvasMiddleY,
                1,
                1
            );
            centerPixelColor = `rgb(${imageData.data[0]}, ${imageData.data[1]}, ${imageData.data[2]})`;
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
        </div>
    );
}
