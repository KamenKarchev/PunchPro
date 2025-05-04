import React from 'react';
import { View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { useWindowDimensions } from 'react-native';

const SquarePattern = () => {
  const { width, height } = useWindowDimensions();
  const squareSize = 40;
  const gap = 10;
  const totalSize = squareSize + gap;

  const cols = Math.ceil(width / totalSize) + 1;
  const rows = Math.ceil(height / totalSize) + 1;

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      <Svg height="100%" width="100%">
        {Array.from({ length: rows }).map((_, row) => (
          Array.from({ length: cols }).map((_, col) => (
            <Rect
              key={`${row}-${col}`}
              x={col * totalSize}
              y={row * totalSize}
              width={squareSize}
              height={squareSize}
              fill="#22272e"
              stroke="#210554"
              strokeWidth="2"
              opacity="0.1"
            />
          ))
        ))}
      </Svg>
    </View>
  );
};

export default SquarePattern; 