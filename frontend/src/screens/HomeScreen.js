import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import EvilIcons from '@expo/vector-icons/EvilIcons';

export default function HomeScreen(){
    return (
        <View style={styles.container}>
            <Text>Bienvenido a la homescreen</Text>

            <TouchableOpacity
                style={[styles.button, {backgroundColor: '#F93827'}]}
                onPress={() => Alert.alert('Hiciste click!!!')}
            >
                <FontAwesome name="star" size={64} color="#FFA49C" />
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, {backgroundColor: '#FEBA17'}]}
                onPress={() => Alert.alert('Hiciste click!!!')}
            >
                <EvilIcons name="pencil" size={64} color="#FFE094" />
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, {backgroundColor: '#FEBA17'}]}
                onPress={() => Alert.alert('Hiciste click!!!')}
            >
                <EvilIcons name="pencil" size={64} color="#FFE094" />
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, {backgroundColor: '#FEBA17'}]}
                onPress={() => Alert.alert('Hiciste click!!!')}
            >
                <EvilIcons name="pencil" size={64} color="#FFE094" />
            </TouchableOpacity>

            <StatusBar style="auto"/>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
  },
title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
  },
  button: {
    width: 132,
    height: 128,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
});