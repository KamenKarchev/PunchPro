import React from 'react';
import { View } from 'react-native';
import Svg, { Text } from 'react-native-svg';

const SvgText = ({ 
  text, 
  fontSize, 
  strokeWidth = 0, 
  strokeColor = '#000000', 
  fillColor = '#ffffff',
  style,
  innerStrokeWidth = 0,
  innerStrokeColor = '#000000',
  outerStrokeWidth = 0,
  outerStrokeColor = '#000000'
}) => {
  // Calculate total stroke width to ensure enough space for all strokes
  const maxStrokeWidth = Math.max(strokeWidth, innerStrokeWidth, outerStrokeWidth);
  const svgHeight = fontSize * 1.2 + maxStrokeWidth * 4; // Multiply by 4 to account for top and bottom strokes
  const textY = (svgHeight / 2) + (fontSize / 3); // Center text vertically

  return (
    <View style={style}>
      <Svg height={svgHeight} width="100%">
        {/* stroke */}
        <Text
          x="50%"
          y={textY}
          fontSize={fontSize}
          textAnchor="middle"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="none"
        >
          {text}
        </Text>
        {/* Inner stroke */}
        <Text
          x="50%"
          y={textY}
          fontSize={fontSize}
          textAnchor="middle"
          stroke={innerStrokeColor}
          strokeWidth={innerStrokeWidth}
          fill="none"
        >
          {text}
        </Text>
        {/* outer stroke */}
        <Text
          x="50%"
          y={textY}
          fontSize={fontSize}
          textAnchor="middle"
          stroke={outerStrokeColor}
          strokeWidth={outerStrokeWidth}
          fill="none"
        >
          {text}
        </Text>
        {/* Fill */}
        <Text
          x="50%"
          y={textY}
          fontSize={fontSize}
          textAnchor="middle"
          fill={fillColor}
        >
          {text}
        </Text>
      </Svg>
    </View>
  );
};

export default SvgText; 