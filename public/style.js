let styles = [
    {
    stylers: [
        { saturation: "-100" },
        { lightness: "30" }
    ]
    },{
    featureType: "poi",
    stylers: [
        { visibility: "off" }
    ]
    },{
    featureType: "transit",
    stylers: [
        { visibility: "off" }
    ]
    },{
    featureType: "road",
    stylers: [
        { lightness: "50" },
        { visibility: "on" }
    ]
    },{
    featureType: "landscape",
    stylers: [
        { lightness: "40" }
    ]
    }
];

export default styles;