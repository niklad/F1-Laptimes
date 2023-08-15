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

    // Define the acceleration and deceleration constants
    const THROTTLE_ACCELERATION = 0.05;
    const BRAKE_DECELERATION = 0.05;
    const GEAR_BRAKE_DECELERATION = 0.1;
    const MIN_VELOCITY = 0;
    const MAX_VELOCITY = 5;
    const STEERING_ACCELERATION = 0.05;

    // Define the current velocity of the car
    let velocityX = 0;
    let velocityY = 0;
    let steeringAngle = 0;

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
            if (centerPixelColor !== "rgb(41, 41, 41)") {
                setTimeout(() => {
                    // reset the car position after 300ms
                    backgroundXRef.current = startCoordinates.x;
                    backgroundYRef.current = startCoordinates.y;
                    backgroundRotationRef.current = 0;
                    velocityX = 0;
                    velocityY = 0;
                }, 300);
            }

            if (keysRef.current["ArrowLeft"]) {
                backgroundRotationRef.current += 0.015;
                velocityX -= Math.sin(backgroundRotationRef.current) * 0.1;

                // 0.01 *
                // Math.log(Math.sqrt(velocityX ** 2 + velocityY ** 2));
                // velocityY -= Math.cos(backgroundRotationRef.current) * 0.1;
            } else if (keysRef.current["ArrowRight"]) {
                backgroundRotationRef.current -= 0.015;
                velocityX += Math.sin(backgroundRotationRef.current) * 0.1;
                // 0.01 *
                // Math.log(Math.sqrt(velocityX ** 2 + velocityY ** 2));

                // velocityY += Math.cos(backgroundRotationRef.current) * 0.1;
            }
            // Convert the velocity vectors based on the reference point of the car instead of the background
            console.log(
                "velocityX:",
                velocityX,
                "velocityY:",
                velocityY,
                "backgroundRotationRef.current:",
                backgroundRotationRef.current,
                "sin(backgroundRotationRef.current):",
                Math.sin(backgroundRotationRef.current),
                "cos(backgroundRotationRef.current):",
                Math.cos(backgroundRotationRef.current)
            );
            if (keysRef.current["ArrowUp"]) {
                velocityX +=
                    Math.sin(backgroundRotationRef.current) *
                    THROTTLE_ACCELERATION;
                velocityY +=
                    Math.cos(backgroundRotationRef.current) *
                    THROTTLE_ACCELERATION;
            } else {
                // Deal with the deceleration when the background image is oriented in any direction
                // if (velocityX > 0) {
                //     velocityX -=
                //         Math.sin(backgroundRotationRef.current) *
                //         GEAR_BRAKE_DECELERATION;
                // }
                // if (velocityX < 0) {
                //     velocityX +=
                //         Math.sin(backgroundRotationRef.current) *
                //         GEAR_BRAKE_DECELERATION;
                // }
                // if (velocityY > 0) {
                //     velocityY -=
                //         Math.cos(backgroundRotationRef.current) *
                //         GEAR_BRAKE_DECELERATION;
                // }
                // if (velocityY < 0) {
                //     velocityY +=
                //         Math.cos(backgroundRotationRef.current) *
                //         GEAR_BRAKE_DECELERATION;
                // }
                velocityX = 0;
                velocityY = 0;
            }

            // Clear the canvas
            context.clearRect(0, 0, canvas.width, canvas.height);

            // Draw the background
            context.save();
            // Rotate around the center of the canvas
            context.translate(canvas.width / 2, canvas.height / 2);
            context.rotate(backgroundRotationRef.current);
            context.translate(-canvas.width / 2, -canvas.height / 2);

            // Limit the velocity to the maximum value
            const currentVelocity = Math.sqrt(velocityX ** 2 + velocityY ** 2);
            if (currentVelocity < MIN_VELOCITY) {
                // Prevent reverse driving
                velocityX = 0;
                velocityY = 0;
            } else if (currentVelocity > MAX_VELOCITY) {
                const angle = Math.atan2(velocityY, velocityX);
                velocityX = Math.cos(angle) * MAX_VELOCITY;
                velocityY = Math.sin(angle) * MAX_VELOCITY;
            }
            context.drawImage(
                backgroundImage,
                // Update the position based on the velocity
                (backgroundXRef.current += velocityX),
                (backgroundYRef.current += velocityY)
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
