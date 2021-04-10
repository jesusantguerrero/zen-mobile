import React from 'react';
import { FlatList } from 'react-native-gesture-handler'
import ScrollCard from "./ScrollCard";

export default function TodoScroll({ items, onPress }) {
    return (
        <FlatList
            style={{ marginBottom: 100 }}
            data={items}
            scrollEnabled={false}
            keyExtractor={(item: Object, index: number) => `item-scroll-${item.uid}-${index}`}
            renderItem={props => <ScrollCard {...props} onPress={onPress}></ScrollCard>}
            showsHorizontalScrollIndicator={false}
        />
    );
}
