import React, { useRef, useEffect } from "react";
import "../styles/Game.css";

export default function Game() {
    const canvasRef = useRef(null);
    const startCoordinates = { x: -560, y: -1300 };
    const backgroundXRef = useRef(startCoordinates.x);
    const backgroundYRef = useRef(startCoordinates.y);
    const backgroundRotationRef = useRef(0);
    const keysRef = useRef({});
    const timerRef = useRef(0);
    const bestLaptimeRef = useRef(0.0);
    let centerPixelColorRef = useRef("rgb(41, 41, 41)");
    let velocityRef = useRef({ vx: 0, vy: 0 });

    // Define the acceleration and deceleration constants
    const THROTTLE_ACCELERATION = 0.05;
    const BRAKE_DECELERATION = 0.1;
    const REVERSE_ACCELERATION = 0.025;
    const GEAR_BRAKE_DECELERATION = 0.05;
    const MAX_VELOCITY = 9;
    const STEERING_ACCELERATION = 0.015;

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

        const updateCanvas = (timestamp) => {
            if (timerRef.current === 0) {
                timerRef.current = timestamp;
            }
            const seconds = Math.floor((timestamp - timerRef.current) / 1000);
            const milliseconds = timestamp - timerRef.current - seconds * 1000;

            if (centerPixelColorRef === "rgb(134, 2, 0)") {
                // Update bestLaptime if the current laptime on the format is better
                const currentLaptime = seconds + milliseconds / 1000;
                if (currentLaptime < bestLaptimeRef.current) {
                    bestLaptimeRef.current = currentLaptime;
                }
            }
            if (centerPixelColorRef !== "rgb(41, 41, 41)") {
                timerRef.current = 0;
                setTimeout(() => {
                    velocityRef.current.vy = 0;
                    velocityRef.current.vx = 0;
                    backgroundRotationRef.current = 0;
                    backgroundXRef.current = startCoordinates.x;
                    backgroundYRef.current = startCoordinates.y;
                }, 600);
            }

            if (velocityRef.current.vy === 0) {
                backgroundRotationRef.current = 0;
            } else if (keysRef.current["ArrowLeft"]) {
                backgroundRotationRef.current -= STEERING_ACCELERATION;
                velocityRef.current.vx -=
                    0.004 * (MAX_VELOCITY - velocityRef.current.vy);
            } else if (keysRef.current["ArrowRight"]) {
                backgroundRotationRef.current += STEERING_ACCELERATION;
                velocityRef.current.vx +=
                    0.006 * (MAX_VELOCITY - velocityRef.current.vy);
            } else {
                if (velocityRef.current.vx > 0) {
                    velocityRef.current.vx -= BRAKE_DECELERATION;
                } else if (velocityRef.current.vx < 0) {
                    velocityRef.current.vx += BRAKE_DECELERATION;
                }
            }

            if (keysRef.current["ArrowUp"]) {
                velocityRef.current.vy += THROTTLE_ACCELERATION;
                if (velocityRef.current.vy >= MAX_VELOCITY) {
                    velocityRef.current.vy = MAX_VELOCITY;
                }
            } else if (keysRef.current["ArrowDown"]) {
                if (velocityRef.current.vy > 0) {
                    velocityRef.current.vy -= BRAKE_DECELERATION;
                } else if (velocityRef.current.vy < 0) {
                    velocityRef.current.vy -= REVERSE_ACCELERATION;
                } else {
                    velocityRef.current.vy = 0;
                }
            } else {
                if (velocityRef.current.vy > 0) {
                    velocityRef.current.vy -= GEAR_BRAKE_DECELERATION;
                } else if (velocityRef.current.vy < 0) {
                    velocityRef.current.vy += GEAR_BRAKE_DECELERATION;
                }
            }

            // Clear the canvas
            context.clearRect(0, 0, canvas.width, canvas.height);

            // Draw the background
            context.save();
            // Rotate around the center of the canvas
            context.translate(canvas.width / 2, canvas.height / 2);
            context.rotate(-backgroundRotationRef.current);
            context.translate(-canvas.width / 2, -canvas.height / 2);

            // if (velocityRef.current.vy < 0.01) {
            //     velocityRef.current.vy = 0;
            // }

            backgroundXRef.current +=
                Math.cos(backgroundRotationRef.current) *
                    velocityRef.current.vx -
                Math.sin(backgroundRotationRef.current) *
                    velocityRef.current.vy;
            backgroundYRef.current +=
                Math.sin(backgroundRotationRef.current) *
                    velocityRef.current.vx +
                Math.cos(backgroundRotationRef.current) *
                    velocityRef.current.vy;

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
            centerPixelColorRef = `rgb(${imageData.data[0]}, ${imageData.data[1]}, ${imageData.data[2]})`;

            const centerX = canvas.width / 2 - carImage.width / 2;
            const centerY = canvas.height / 2 - carImage.height / 2;
            context.drawImage(carImage, centerX, centerY);

            // Draw the timer
            context.fillStyle = "white";
            context.font = "24px Arial";
            context.fillText(
                `${(seconds + milliseconds / 1000).toFixed(3)}`,
                10,
                30
            );

            // Draw best laptime
            context.fillText(
                `Best laptime: ${bestLaptimeRef.current.toFixed(3)}`,
                10,
                60
            );

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
