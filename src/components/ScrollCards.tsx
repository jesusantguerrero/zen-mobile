import React from 'react';
import { FlatList } from 'react-native-gesture-handler'
import { Task } from '../utils/data';
import ScrollCard from "./ScrollCard";

export default function TodoScroll({ items, onPress, onDone, onRemove }: {items: Task[], onPress: Function, onDone: Function, onRemove: Function}) {
    return (
        <FlatList
            style={{ marginBottom: 100 }}
            data={items}
            scrollEnabled={false}
            keyExtractor={(item: Task, index: number) => `item-scroll-${item.uid}-${index}`}
            renderItem={props => 
                <ScrollCard {...props} onPress={onPress} onDone={onDone} onRemove={onRemove}></ScrollCard>
            }
            showsHorizontalScrollIndicator={false}
        />
    );
}
