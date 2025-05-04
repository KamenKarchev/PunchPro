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
  outerStrokeColor = '#000000',
  fontFamily = 'System',
  letterSpacing = 2
}) => {
  // Calculate total stroke width to ensure enough space for all strokes
  const maxStrokeWidth = Math.max(strokeWidth, innerStrokeWidth, outerStrokeWidth);
  const svgHeight = fontSize * 1.2 + maxStrokeWidth * 4; // Multiply by 4 to account for top and bottom strokes
  const textY = (svgHeight / 2) + (fontSize / 3); // Center text vertically

  // Calculate width based on text length and letter spacing
  const estimatedWidth = text.length * (fontSize * 0.6 + letterSpacing);

  return (
    <View style={style}>
      <Svg height={svgHeight} width={estimatedWidth}>
        {/* stroke */}
        <Text
          x="50%"
          y={textY}
          fontSize={fontSize}
          fontFamily={fontFamily}
          textAnchor="middle"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          letterSpacing={letterSpacing}
          fill="none"
        >
          {text}
        </Text>
        {/* Inner stroke */}
        <Text
          x="50%"
          y={textY}
          fontSize={fontSize}
          fontFamily={fontFamily}
          textAnchor="middle"
          stroke={innerStrokeColor}
          strokeWidth={innerStrokeWidth}
          letterSpacing={letterSpacing}
          fill="none"
        >
          {text}
        </Text>
        {/* outer stroke */}
        <Text
          x="50%"
          y={textY}
          fontSize={fontSize}
          fontFamily={fontFamily}
          textAnchor="middle"
          stroke={outerStrokeColor}
          strokeWidth={outerStrokeWidth}
          letterSpacing={letterSpacing}
          fill="none"
        >
          {text}
        </Text>
        {/* Fill */}
        <Text
          x="50%"
          y={textY}
          fontSize={fontSize}
          fontFamily={fontFamily}
          textAnchor="middle"
          letterSpacing={letterSpacing}
          fill={fillColor}
        >
          {text}
        </Text>
      </Svg>
    </View>
  );
};

export default SvgText; 