import React from 'react';
import { Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function MagicCard({
    title,
    icon,
    onPress,
    colors = ["#4facfe", "#00f2fe"],
    size = "small", // "small" | "wide" | "tall"
    delay = 0,
    fontSize = 16
}) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const handlePressIn = () => {
        scale.value = withSpring(0.95);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1);
    };

    const getCardStyle = () => {
        switch (size) {
            case "wide":
                return { width: width - 40, height: 120 }; // Reduced height
            case "tall":
                return { width: (width - 50) / 2, height: 180 }; // Reduced height
            case "small":
            default:
                return { width: (width - 50) / 2, height: 120 }; // Reduced height
        }
    };

    return (
        <Animated.View
            entering={FadeInDown.delay(delay).duration(500)}
            style={[styles.container, getCardStyle()]}
        >
            <Animated.View style={[{ flex: 1 }, animatedStyle]}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={onPress}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    style={{ flex: 1 }}
                >
                    <LinearGradient
                        colors={colors}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.gradient}
                    >
                        <Animated.View style={styles.iconContainer}>
                            {icon}
                        </Animated.View>
                        <Text style={[styles.title, { fontSize }]}>{title}</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 20, // Slightly reduced radius
        marginBottom: 10, // Reduced margin
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 8,
    },
    gradient: {
        flex: 1,
        borderRadius: 24,
        padding: 20,
        justifyContent: 'space-between',
    },
    iconContainer: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        width: 50,
        height: 50,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        color: '#FFF',
        fontWeight: 'bold',
        textShadowColor: 'rgba(0,0,0,0.1)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    }
});
