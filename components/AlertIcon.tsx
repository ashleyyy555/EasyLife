import React from 'react';
import Svg, { Path } from 'react-native-svg';

const AlertIcon = ({ size = 38, color = "#C72929" }) => {
    return (
        <Svg
            width={size}
            height={size}
            viewBox="0 0 38 38"
            fill="none"
        >
            <Path
                d="M19 12.6667V19M19 25.3334H19.0158M34.8333 19C34.8333 27.7445 27.7445 34.8334 19 34.8334C10.2555 34.8334 3.16663 27.7445 3.16663 19C3.16663 10.2555 10.2555 3.16669 19 3.16669C27.7445 3.16669 34.8333 10.2555 34.8333 19Z"
                stroke={color}
                strokeWidth={4}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};

export default AlertIcon;
