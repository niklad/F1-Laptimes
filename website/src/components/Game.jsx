import React, { useRef, useEffect, useState } from "react";
import "../styles/Game.css";

export default function Game() {
    const canvasRef = useRef(null);
    const START_COORDINATES_REF = useRef({ x: -560, y: -1300 });
    const backgroundXRef = useRef(START_COORDINATES_REF.current.x);
    const backgroundYRef = useRef(START_COORDINATES_REF.current.y);
    const backgroundRotationRef = useRef(0);
    const keysRef = useRef({});
    const timerRef = useRef(0);
    const elapsedTimeRef = useRef(0);
    const gameStateRef = useRef("idle");
    let centerPixelColorRef = useRef("rgb (41, 41, 41)");
    let velocityRef = useRef({ vx: 0, vy: 0 });
    const [personalBestLaptime, setPersonalBestLaptime] = useState(() => {
        const storedpersonalBestLaptime = localStorage.getItem(
            "personalBestLaptime"
        );
        return storedpersonalBestLaptime !== null
            ? parseFloat(storedpersonalBestLaptime)
            : 0.0;
    });
    useEffect(() => {
        localStorage.setItem("personalBestLaptime", personalBestLaptime);
    }, [personalBestLaptime]);
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

        const updateCanvas = () => {
            switch (gameStateRef.current) {
                case "idle":
                    if (
                        keysRef.current["ArrowUp"] ||
                        keysRef.current["ArrowRight"] ||
                        keysRef.current["ArrowLeft"]
                    ) {
                        gameStateRef.current = "running";
                    }
                    break;
                case "running":
                    startLap(
                        timerRef,
                        elapsedTimeRef,
                        centerPixelColorRef,
                        personalBestLaptime,
                        setPersonalBestLaptime,
                        velocityRef,
                        backgroundRotationRef,
                        backgroundXRef,
                        START_COORDINATES_REF,
                        backgroundYRef,
                        gameStateRef
                    );
                    break;
                case "exceedingTrackLimits":
                    timerRef.current = 0;
                    resetGame(
                        timerRef,
                        velocityRef,
                        backgroundRotationRef,
                        backgroundXRef,
                        backgroundYRef,
                        START_COORDINATES_REF,
                        gameStateRef
                    );
                    setTimeout(() => {
                        gameStateRef.current = "idle";
                    }, 600);
                    break;
                case "finished":
                    resetGame(
                        timerRef,
                        velocityRef,
                        backgroundRotationRef,
                        backgroundXRef,
                        backgroundYRef,
                        START_COORDINATES_REF,
                        gameStateRef
                    );
                    setTimeout(() => {
                        gameStateRef.current = "idle";
                    }, 600);

                    break;
                default:
                    break;
            }

            if (velocityRef.current.vy === 0) {
                backgroundRotationRef.current = 0;
            } else if (keysRef.current["ArrowLeft"]) {
                backgroundRotationRef.current -= STEERING_ACCELERATION;
            } else if (keysRef.current["ArrowRight"]) {
                backgroundRotationRef.current += STEERING_ACCELERATION;
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

            context.clearRect(0, 0, canvas.width, canvas.height);

            context.save();

            context.translate(canvas.width / 2, canvas.height / 2);
            context.rotate(-backgroundRotationRef.current);
            context.translate(-canvas.width / 2, -canvas.height / 2);

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
            centerPixelColorRef.current = `rgb(${imageData.data[0]}, ${imageData.data[1]}, ${imageData.data[2]})`;

            const centerX = canvas.width / 2 - carImage.width / 2;
            const centerY = canvas.height / 2 - carImage.height / 2;
            context.drawImage(carImage, centerX, centerY);

            // Draw the timer
            context.fillStyle = "white";
            // ADd an arcade font
            context.font = "24px PressStart2P-Regular";
            context.fillText(
                `Time: ${elapsedTimeRef.current.toFixed(3)}`,
                10,
                30
            );

            // Draw best laptime
            context.fillText(`Best Laptime: ${personalBestLaptime}`, 10, 60);

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
    }, [personalBestLaptime]);

    return (
        <div>
            <canvas ref={canvasRef} id="game" />
        </div>
    );
}

function updatePersonalBestLaptime(
    personalBestLaptime,
    setPersonalBestLaptime,
    elapsedTimeRef
) {
    if (
        personalBestLaptime === 0.0 ||
        elapsedTimeRef.current < personalBestLaptime
    ) {
        setPersonalBestLaptime(elapsedTimeRef.current);
    }
}

function startLap(
    timerRef,
    elapsedTimeRef,
    centerPixelColorRef,
    personalBestLaptime,
    setPersonalBestLaptime,
    velocityRef,
    backgroundRotationRef,
    backgroundXRef,
    START_COORDINATES_REF,
    backgroundYRef,
    gameStateRef
) {
    const timestamp = performance.now();
    if (timerRef.current === 0) {
        timerRef.current = timestamp;
    }
    elapsedTimeRef.current = (timestamp - timerRef.current) / 1000;

    console.log(centerPixelColorRef.current);
    if (centerPixelColorRef.current === "rgb(134, 2, 0)") {
        updatePersonalBestLaptime(
            personalBestLaptime,
            setPersonalBestLaptime,
            elapsedTimeRef
        );
        gameStateRef.current = "finished";
    } else if (centerPixelColorRef.current !== "rgb(41, 41, 41)") {
        gameStateRef.current = "exceedingTrackLimits";
    }
}

function resetGame(
    timerRef,
    velocityRef,
    backgroundRotationRef,
    backgroundXRef,
    backgroundYRef,
    START_COORDINATES_REF,
    gameStateRef
) {
    timerRef.current = 0;
    velocityRef.current.vy = 0;
    velocityRef.current.vx = 0;
    backgroundRotationRef.current = 0;
    backgroundXRef.current = START_COORDINATES_REF.current.x;
    backgroundYRef.current = START_COORDINATES_REF.current.y;
}
