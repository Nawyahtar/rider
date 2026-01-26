import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import { ChevronUp } from 'lucide-react-native';
import Colors from '../../styles/Color';

const CustomAccordion = ({ title = 'Accordion', children }) => {
    console.log("custom adccor")
    const [collapsed, setCollapsed] = useState(true);

    return (
        <View style={styles.card}>
            {/* Header section */}
            <View style={styles.header}>
                <Text style={styles.headerText}>{title}</Text>

                {/* Only icon is pressable */}
                <TouchableOpacity
                    onPress={() => setCollapsed(!collapsed)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <ChevronUp
                        size={20}
                        color={Colors.text}
                        style={{
                            transform: [{ rotate: collapsed ? '180deg' : '0deg' }],
                        }}
                    />
                </TouchableOpacity>
            </View>

            <Collapsible collapsed={collapsed}>
                <View style={styles.content}>
                    {children}
                </View>
            </Collapsible>
        </View>
    );
};

export default CustomAccordion;

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 16,
        marginTop: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    header: {
        padding: 16,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.text,
    },
    content: {
        paddingBottom: 16,
    },
});
