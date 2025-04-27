import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';

export default function RatingSlider({ 
  label, 
  value, 
  onValueChange, 
  style,
  showStars = true // 🆕 NEW: whether to show stars or not (default yes)
}) {
  const [displayValue, setDisplayValue] = useState(value || 0);

  const handleValueChange = (newValue) => {
    const roundedValue = Math.round(newValue * 10) / 10;
    setDisplayValue(roundedValue);
  };

  const handleValueComplete = (newValue) => {
    const roundedValue = Math.round(newValue * 10) / 10;
    onValueChange(roundedValue);
  };

  useEffect(() => {
    setDisplayValue(value || 0);
  }, [value]);

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(displayValue);
    const hasHalfStar = displayValue - fullStars >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={`full-${i}`} name="star" size={20} color="#FFD700" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={20} color="#FFD700" />
      );
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons key={`empty-${i}`} name="star-outline" size={20} color="#FFD700" />
      );
    }

    return stars;
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{displayValue.toFixed(1)}</Text>
      </View>

      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={5}
          step={0.1}
          minimumTrackTintColor="#8E2DE2"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#8E2DE2"
          value={displayValue}
          onValueChange={handleValueChange}
          onSlidingComplete={handleValueComplete}
        />

        {/* 🆕 Only show stars if showStars is true */}
        {showStars && (
          <View style={styles.starsContainer}>
            {renderStars()}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8E2DE2',
  },
  sliderContainer: {
    alignItems: 'center',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  starsContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
});