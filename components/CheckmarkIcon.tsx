import React from 'react';
import Svg, { Path } from 'react-native-svg';

const CheckmarkIcon = ({ size = 40, color = "#1CAF49" }) => {
    // @ts-ignore
    return (
        <Svg width={size} height={size} viewBox="0 0 41 41" fill="none">
            <Path
                d="M37.5833 18.9283V20.5C37.5812 24.1839 36.3883 27.7684 34.1826 30.7189C31.9769 33.6695 28.8764 35.828 25.3437 36.8725C21.811 37.917 18.0353 37.7916 14.5797 36.5149C11.1241 35.2382 8.17377 32.8787 6.16871 29.7883C4.16365 26.6979 3.2113 23.0421 3.45369 19.3662C3.69608 15.6903 5.12022 12.1912 7.51372 9.3908C9.90722 6.59041 13.1418 4.63875 16.7351 3.82689C20.3285 3.01503 24.0879 3.38646 27.4529 4.88581M37.5833 6.83331L20.5 23.9337L15.375 18.8087"
                stroke={color}
                strokeWidth={4}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};

export default CheckmarkIcon;
