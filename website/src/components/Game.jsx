import React, { useRef, useEffect } from "react";

import "../styles/Game.css";

export default function Game() {
    const canvasRef = useRef(null);
    const backgroundImageRef = useRef(null);
    const backgroundXRef = useRef(0);
    const backgroundYRef = useRef(0);
    const carImageRef = useRef(null);
    const keysRef = useRef({});

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // Load the background image
        const backgroundImage = new Image();
        backgroundImage.src = "game/bilspill-demospor.png";
        backgroundImageRef.current = backgroundImage;

        // Load the car image
        const carImage = new Image();
        carImage.src = "game/bilspill-bil-v1-transparent.png";
        carImageRef.current = carImage;

        // Draw the background image and car image on the canvas
        backgroundImage.onload = () => {
            canvas.width = backgroundImage.width;
            canvas.height = backgroundImage.height;
            ctx.drawImage(backgroundImage, 0, 0);

            carImage.onload = () => {
                const centerX = canvas.width / 2 - carImage.width / 2;
                const centerY = canvas.height / 2 - carImage.height / 2;
                ctx.drawImage(carImage, centerX, centerY);
            };
        };
    }, []);

    useEffect(() => {
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

    useEffect(() => {
        const updateCanvas = () => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            const backgroundImage = backgroundImageRef.current;
            const carImage = carImageRef.current;
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
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(
                backgroundImage,
                backgroundXRef.current,
                backgroundYRef.current
            );
            const centerX = canvas.width / 2 - carImage.width / 2;
            const centerY = canvas.height / 2 - carImage.height / 2;
            ctx.drawImage(carImage, centerX, centerY);
            requestAnimationFrame(updateCanvas);
        };
        requestAnimationFrame(updateCanvas);
    }, []);

    return <canvas ref={canvasRef} id="game" />;
}
