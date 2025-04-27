import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Some common flavor suggestions, but users can add their own
const SUGGESTIONS = [
  // Red wine flavors
  'Cherry', 'Blackberry', 'Plum', 'Chocolate', 'Vanilla',
  'Pepper', 'Cinnamon', 'Oak', 'Smoke', 'Leather',
  
  // White wine flavors
  'Apple', 'Pear', 'Lemon', 'Honey', 'Butter',
  'Floral', 'Mineral', 'Grass', 'Melon', 'Tropical',
  
  // General descriptors
  'Tannic', 'Acidic', 'Full-bodied', 'Smooth', 'Rich',
  'Crisp', 'Dry', 'Sweet', 'Balanced', 'Bold'
];

export default function FlavorTagSelector({ selectedTags, onTagsChange }) {
  const [newTag, setNewTag] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Filter suggestions based on input
  const filteredSuggestions = SUGGESTIONS.filter(tag => 
    tag.toLowerCase().includes(newTag.toLowerCase()) && 
    !selectedTags.includes(tag)
  ).slice(0, 5); // Limit to 5 suggestions
  
  // Add a tag from suggestions or input
  const addTag = (tag) => {
    if (tag && !selectedTags.includes(tag)) {
      const updatedTags = [...selectedTags, tag];
      onTagsChange(updatedTags);
      setNewTag('');
    }
  };
  
  // Remove a tag
  const removeTag = (tagToRemove) => {
    const updatedTags = selectedTags.filter(tag => tag !== tagToRemove);
    onTagsChange(updatedTags);
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Flavor Notes</Text>
      
      {/* Selected Tags */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tagContainer}
      >
        {selectedTags.map(tag => (
          <TouchableOpacity 
            key={tag} 
            style={styles.tag}
            onPress={() => removeTag(tag)}
          >
            <Text style={styles.tagText}>{tag}</Text>
            <Ionicons name="close-circle" size={16} color="#fff" style={styles.tagIcon} />
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {/* Input for new tags */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newTag}
          onChangeText={(text) => {
            setNewTag(text);
            setShowSuggestions(text.length > 0);
          }}
          placeholder="Add flavor notes (e.g., Cherry, Oak, etc.)"
          onSubmitEditing={() => {
            addTag(newTag);
            setShowSuggestions(false);
          }}
        />
        
        {newTag.length > 0 && (
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => {
              addTag(newTag);
              setShowSuggestions(false);
            }}
          >
            <Ionicons name="add-circle" size={24} color="#8E2DE2" />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Suggestions */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <View style={styles.suggestions}>
          {filteredSuggestions.map(suggestion => (
            <TouchableOpacity
              key={suggestion}
              style={styles.suggestion}
              onPress={() => {
                addTag(suggestion);
                setShowSuggestions(false);
              }}
            >
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      {/* Suggestions for quick selection */}
      <Text style={styles.sectionTitle}>Suggestions (or type your own)</Text>
      <View style={styles.quickTagsContainer}>
        {SUGGESTIONS.slice(0, 15).map(tag => (
          <TouchableOpacity
            key={tag}
            style={[
              styles.quickTag,
              selectedTags.includes(tag) && styles.quickTagSelected
            ]}
            onPress={() => {
              if (selectedTags.includes(tag)) {
                removeTag(tag);
              } else {
                addTag(tag);
              }
            }}
          >
            <Text 
              style={[
                styles.quickTagText,
                selectedTags.includes(tag) && styles.quickTagTextSelected
              ]}
            >
              {tag}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <Text style={styles.helpText}>
        Tap to add suggestions, or enter your own flavor notes above. 
        Tap on added tags to remove them.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    marginBottom: 10,
  },
  tag: {
    backgroundColor: '#8E2DE2',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagText: {
    color: '#fff',
    marginRight: 5,
  },
  tagIcon: {
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    backgroundColor: '#f9f9f9',
    fontSize: 15,
  },
  addButton: {
    padding: 8,
    marginLeft: 8,
  },
  suggestions: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginTop: -10,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  suggestion: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 10,
    color: '#666',
  },
  quickTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  quickTag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  quickTagSelected: {
    backgroundColor: '#E9D5FF',
  },
  quickTagText: {
    color: '#333',
    fontSize: 12,
  },
  quickTagTextSelected: {
    color: '#8E2DE2',
    fontWeight: '500',
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 5,
  },
});