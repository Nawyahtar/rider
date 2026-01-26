import React, { memo } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Timeline from "../../assets/images/timeline.png"
import { Font } from '../../styles/Font';

const TimelineRowComponent = ({ restaurantName, receiverName, fromBikeToRestaurant, fromRestaurantToReceiver }) => {
    return (
        <View style={styles.container}>
            {/* Timeline dots and lines */}
            <View style={styles.timelineColumn}>
                <View style={styles.dot} />
                <View style={[styles.line, { backgroundColor: 'purple' }]} />
                <View style={styles.dot} />
                <View style={[styles.line, { backgroundColor: 'orange' }]} />
                <View style={styles.dot} />
            </View>

            {/* Labels */}
            <View style={styles.labelColumn}>
                <Text style={styles.icon}>🚴</Text>
                <Text style={styles.label}>{restaurantName}</Text>
                <Text style={styles.label}>{receiverName}</Text>
            </View>
            <View style={styles.timelineWrapper}>
                <Image
                    source={Timeline}
                    style={styles.timelineImage}
                    resizeMode="contain"
                />
                <Image
                    source={Timeline}
                    style={styles.timelineImage}
                    resizeMode="contain"
                />
            </View>

            {/* Time column */}
            <View style={styles.timeColumn}>
                <Text style={styles.time}>{fromBikeToRestaurant} mins</Text>
                <Text style={styles.time}>{fromRestaurantToReceiver} mins</Text>
            </View>
        </View>
    );
};

export default memo(TimelineRowComponent);
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 16,
    },
    timelineColumn: {
        alignItems: 'center',
        marginRight: 10,
        marginTop: 2,
        justifyContent:'center'
    },
    dot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#2c3e50',
        borderWidth: 3,
        borderColor: '#dbe4ed',
    },
    line: {
        width: 3,
        height: 20,
        marginVertical: 2,
        borderRadius: 1,
    },
    labelColumn: {
        flex: 1,
        gap: 18,
        justifyContent:"center"
    },
    icon: {
        fontSize: 18,
    },
    label: {
        fontSize: 14,
        color: '#333',
    },
    timeColumn: {
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        paddingVertical: 10,
    },
    time: {
        fontSize: 14,
        fontWeight: '700',
        fontFamily: Font.Bold,

    },
    timelineWrapper: {
        justifyContent: 'center',
        paddingTop: 4,
    },
    timelineImage: {
        width: 70,
        height: 39,

    },
});
