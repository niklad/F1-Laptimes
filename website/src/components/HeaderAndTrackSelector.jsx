import React from "react";
import { useEffect, useRef } from "react";

import "/node_modules/flag-icons/css/flag-icons.min.css";

// A map of track names to flag icons
export const trackFlagMap = {
    "DRIVER STANDINGS": "standings-trophy",
    SILVERSTONE: "fi fi-gb",
    SPA: "fi fi-be",
    SUZUKA: "fi fi-jp",
    "RED BULL RING": "fi fi-at",
    MONZA: "fi fi-it",
    MONTREAL: "fi fi-ca",
    MELBOURNE: "fi fi-au",
    BAKU: "fi fi-az",
    SINGAPORE: "fi fi-sg",
    "ABU DHABI": "fi fi-ae",
    AUSTIN: "fi fi-us",
    INTERLAGOS: "fi fi-br",
    MONACO: "fi fi-mc",
    BAHRAIN: "fi fi-bh",
    SOCHI: "fi fi-ru",
    HUNGARORING: "fi fi-hu",
    BARCELONA: "fi fi-es",
    ZANDVOORT: "fi fi-nl",
    JEDDAH: "fi fi-sa",
    IMOLA: "fi fi-it",
    "PAUL RICARD": "fi fi-fr",
};

// A map of track names to track country
export const trackCountryMap = {
    SILVERSTONE: "UK",
    SPA: "BELGIUM",
    SUZUKA: "JAPAN",
    "RED BULL RING": "AUSTRIA",
    MONZA: "ITALY",
    MONTREAL: "CANADA",
    MELBOURNE: "AUSTRALIA",
    BAKU: "AZERBAIJAN",
    SINGAPORE: "SINGAPORE",
    "ABU DHABI": "UAE",
    AUSTIN: "US",
    INTERLAGOS: "BRAZIL",
    MONACO: "MONACO",
    BAHRAIN: "BAHRAIN",
    SOCHI: "RUSSIA",
    HUNGARORING: "HUNGARY",
    BARCELONA: "SPAIN",
    ZANDVOORT: "NETHERLANDS",
    JEDDAH: "SAUDI ARABIA",
    IMOLA: "ITALY",
    "PAUL RICARD": "FRANCE",
};

// A map of the colors in each track's flag
export const trackFlagColorMap = {
    SILVERSTONE: ["#012169", "#FFFFFF", "#CE1126"],
    SPA: ["#000000", "#FFD700", "#FF0000"],
    SUZUKA: ["#FFFFFF", "#DC143C"],
    MONZA: ["#009246", "#FFFFFF", "#DC0000"],
    MONTREAL: ["#FFFFFF", "#DC143C"],
    BAKU: ["#3F8AE0", "#ED2939"],
    SINGAPORE: ["#FFFFFF", "#DC143C"],
    INTERLAGOS: ["#009B3A", "#FEE12B", "#FFFFFF", "#009B3A"],
};

// A map of track name to track layout svg file name
export const trackLayoutMap = {
    SILVERSTONE: "greatbritain.svg",
    SPA: "belgium.svg",
    SUZUKA: "japan.svg",
    "RED BULL RING": "austria.svg",
    MONZA: "italy.svg",
    MONTREAL: "canada.svg",
    MELBOURNE: "australia.svg",
    BAKU: "azerbaijan.svg",
    SINGAPORE: "singapore.svg",
    "ABU DHABI": "abudhabi.svg",
    AUSTIN: "usa.svg",
    INTERLAGOS: "brazil.svg",
    MONACO: "monaco.svg",
    BAHRAIN: "bahrain.svg",
    SOCHI: "russia.svg",
    HUNGARORING: "hungary.svg",
    BARCELONA: "spain.svg",
    ZANDVOORT: "netherlands.svg",
    JEDDAH: "../bragis.jpg",
    IMOLA: "../bragis.jpg",
    "PAUL RICARD": "france.svg",
};

export function TrackSelector({ trackOptions, selectedTrack, onChange }) {
    const containerRef = useRef(null);

    useEffect(() => {
        const trackDivWidth =
            containerRef.current.querySelector("div").offsetWidth;
        const selectedIndex = trackOptions.indexOf(selectedTrack);
        const scrollAmount =
            trackDivWidth * selectedIndex + 0.5 * trackDivWidth;
        containerRef.current.scrollTo({
            left: scrollAmount,
            behavior: "smooth",
        });
    }, [trackOptions, selectedTrack]);

    return (
        <div className="track-selector">
            <div className="container" ref={containerRef}>
                {trackOptions.map((track) => (
                    <div key={track} onClick={() => onChange(track)}>
                        <div
                            className={
                                track === selectedTrack
                                    ? `${trackFlagMap[track]} selected-flag`
                                    : `${trackFlagMap[track]}`
                            }
                        ></div>
                    </div>
                ))}
            </div>
            <div>{selectedTrack}</div>
        </div>
    );
}

export default TrackSelector;
