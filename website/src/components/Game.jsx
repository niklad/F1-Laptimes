import React, { useRef, useEffect } from "react";
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

    const personalBestLaptimeRef = useRef(
        parseFloat(localStorage.getItem("personalBestLaptime")) || 0.0
    );

    // Define the acceleration and deceleration constants
    const scaleFactor = 1;
    const THROTTLE_ACCELERATION = 0.05 / scaleFactor;
    const BRAKE_DECELERATION = 0.1 / scaleFactor;
    const REVERSE_ACCELERATION = 0.025 / scaleFactor;
    const GEAR_BRAKE_DECELERATION = 0.05 / scaleFactor;
    const MAX_VELOCITY = 10 / scaleFactor;
    // const STEERING_ACCELERATION = 0.015 / scaleFactor;

    const controls = useRef({
        throttle: "8",
        brake: "ArrowDown",
        steerLeft: "4",
        steerRight: "6",
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        const backgroundImage = new Image();
        backgroundImage.src = "game/track1.png";
        backgroundImage.onload = () => {
            canvas.width = 0.4 * window.innerWidth;
            canvas.height = 0.9 * window.innerHeight;
        };

        const carImage = new Image();
        carImage.src = "game/racecar.png";
        carImage.onload = () => {
            requestAnimationFrame(updateCanvas);
        };

        const updateCanvas = () => {
            switch (gameStateRef.current) {
                case "idle":
                    if (
                        keysRef.current[controls.current.throttle] ||
                        keysRef.current[controls.current.steerRight] ||
                        keysRef.current[controls.current.steerLeft]
                    ) {
                        gameStateRef.current = "running";
                    }
                    break;
                case "running":
                    startLap(
                        timerRef,
                        elapsedTimeRef,
                        centerPixelColorRef,
                        personalBestLaptimeRef,
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

            handleControls(
                keysRef,
                controls,
                velocityRef,
                backgroundRotationRef,
                MAX_VELOCITY,
                BRAKE_DECELERATION,
                THROTTLE_ACCELERATION,
                REVERSE_ACCELERATION,
                GEAR_BRAKE_DECELERATION
            );

            context.clearRect(0, 0, canvas.width, canvas.height);

            context.scale(scaleFactor, scaleFactor);

            renderBackground(
                context,
                canvas,
                scaleFactor,
                backgroundRotationRef,
                backgroundXRef,
                velocityRef,
                backgroundYRef,
                backgroundImage
            );

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

            renderCar(canvas, carImage, context, scaleFactor);
            context.scale(1 / scaleFactor, 1 / scaleFactor);

            resetPersonalBestLaptimeButton(
                context,
                canvas,
                personalBestLaptimeRef
            );

            displayTimeInfo(context, elapsedTimeRef, personalBestLaptimeRef);

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
    }, [
        BRAKE_DECELERATION,
        GEAR_BRAKE_DECELERATION,
        MAX_VELOCITY,
        THROTTLE_ACCELERATION,
        REVERSE_ACCELERATION,
        controls,
        personalBestLaptimeRef,
    ]);

    return (
        <div>
            <canvas ref={canvasRef} id="game" />
        </div>
    );
}

function renderCar(canvas, carImage, context, scaleFactor) {
    const centerX = canvas.width / 2 - carImage.width / 2;
    const centerY = canvas.height / 2 - carImage.height / 2;
    context.drawImage(carImage, centerX / scaleFactor, centerY / scaleFactor);
}

function resetPersonalBestLaptimeButton(
    context,
    canvas,
    personalBestLaptimeRef
) {
    context.fillStyle = "white";
    context.fillRect(10, 90, 150, 30);
    context.fillStyle = "black";
    context.font = "24px PressStart2P-Regular";
    context.fillText("Reset Laptime", 10, 110);

    // Check if the button is clicked
    canvas.addEventListener("click", (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        if (x >= 10 && x <= 160 && y >= 90 && y <= 120) {
            personalBestLaptimeRef.current = 0.0;
            localStorage.setItem(
                "personalBestLaptime",
                personalBestLaptimeRef.current
            );
        }
    });
}

function renderBackground(
    context,
    canvas,
    scaleFactor,
    backgroundRotationRef,
    backgroundXRef,
    velocityRef,
    backgroundYRef,
    backgroundImage
) {
    context.save();
    // Rotate around the center of the canvas
    context.translate(
        canvas.width / (2 * scaleFactor),
        canvas.height / (2 * scaleFactor)
    );
    context.rotate(-backgroundRotationRef.current);
    context.translate(
        -canvas.width / (2 * scaleFactor),
        -canvas.height / (2 * scaleFactor)
    );

    backgroundXRef.current +=
        Math.cos(backgroundRotationRef.current) * velocityRef.current.vx -
        Math.sin(backgroundRotationRef.current) * velocityRef.current.vy;
    backgroundYRef.current +=
        Math.sin(backgroundRotationRef.current) * velocityRef.current.vx +
        Math.cos(backgroundRotationRef.current) * velocityRef.current.vy;

    context.drawImage(
        backgroundImage,
        backgroundXRef.current,
        backgroundYRef.current
    );

    context.restore();
}

function handleControls(
    keysRef,
    controls,
    velocityRef,
    backgroundRotationRef,
    MAX_VELOCITY,
    BRAKE_DECELERATION,
    THROTTLE_ACCELERATION,
    REVERSE_ACCELERATION,
    GEAR_BRAKE_DECELERATION
) {
    if (
        keysRef.current[controls.current.steerLeft] ||
        keysRef.current[controls.current.steerRight]
    ) {
        if (velocityRef.current.vy === 0) {
            backgroundRotationRef.current = 0;
        } else if (keysRef.current[controls.current.steerLeft]) {
            backgroundRotationRef.current -=
                // (0.03 / (1.5 * MAX_VELOCITY)) *
                // (1.5 * MAX_VELOCITY - velocityRef.current.vy);
                0.004 *
                Math.sqrt(
                    Math.abs(velocityRef.current.vy) *
                        (MAX_VELOCITY - 0.85 * velocityRef.current.vy)
                );
        }
        if (keysRef.current[controls.current.steerRight]) {
            backgroundRotationRef.current +=
                // (0.03 / (1.5 * MAX_VELOCITY)) *
                // (1.5 * MAX_VELOCITY - velocityRef.current.vy);
                0.004 *
                Math.sqrt(
                    Math.abs(velocityRef.current.vy) *
                        (MAX_VELOCITY - 0.85 * velocityRef.current.vy)
                );
        }
    } else {
        if (velocityRef.current.vx > 0) {
            velocityRef.current.vx -= 2 * BRAKE_DECELERATION;
        } else if (velocityRef.current.vx < 0) {
            velocityRef.current.vx += 2 * BRAKE_DECELERATION;
        }
    }

    if (
        keysRef.current[controls.current.throttle] ||
        keysRef.current[controls.current.brake]
    ) {
        if (keysRef.current[controls.current.throttle]) {
            velocityRef.current.vy += THROTTLE_ACCELERATION;
            if (velocityRef.current.vy >= MAX_VELOCITY) {
                velocityRef.current.vy = MAX_VELOCITY;
            }
        }
        if (
            keysRef.current[controls.current.brake] ||
            keysRef.current["ArrowDown"]
        ) {
            if (velocityRef.current.vy > 0) {
                velocityRef.current.vy -= BRAKE_DECELERATION;
            } else if (velocityRef.current.vy < 0) {
                velocityRef.current.vy -= REVERSE_ACCELERATION;
            } else {
                velocityRef.current.vy = 0;
            }
        }
    } else {
        if (velocityRef.current.vy > 0) {
            velocityRef.current.vy -= GEAR_BRAKE_DECELERATION;
        } else if (velocityRef.current.vy < 0) {
            velocityRef.current.vy += GEAR_BRAKE_DECELERATION;
        }
    }
}

function displayTimeInfo(context, elapsedTimeRef, personalBestLaptimeRef) {
    context.fillStyle = "white";
    // ADd an arcade font
    context.font = "24px PressStart2P-Regular";
    context.fillText(`Time: ${elapsedTimeRef.current.toFixed(3)}`, 10, 30);

    // Draw best laptime
    context.fillText(`Best Laptime: ${personalBestLaptimeRef.current}`, 10, 60);
}

function updatePersonalBestLaptime(personalBestLaptimeRef, elapsedTimeRef) {
    if (
        personalBestLaptimeRef.current === 0.0 ||
        elapsedTimeRef.current < personalBestLaptimeRef.current
    ) {
        personalBestLaptimeRef.current = elapsedTimeRef.current;
    }
    localStorage.setItem("personalBestLaptime", personalBestLaptimeRef.current);
}

function startLap(
    timerRef,
    elapsedTimeRef,
    centerPixelColorRef,
    personalBestLaptimeRef,
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
        updatePersonalBestLaptime(personalBestLaptimeRef, elapsedTimeRef);
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
