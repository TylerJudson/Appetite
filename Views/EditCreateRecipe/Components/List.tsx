import React, { MutableRefObject, useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { IconButton, Text, useTheme } from "react-native-paper";
import { SwipeToDelete } from "./Swipe";




// TODO: docs

interface ListProps {
    title: string, 
    list: string[], 
    onDelete: (index: number) => void, 
    onItemChange: (text: string, index: number) => void,
    onAdd: (value: string) => void,
    addPlaceholder: string,
    scrollRef: MutableRefObject<ScrollView>,
    affix?: "Index" | "Checks",
    multiline?: boolean
}

export function List({ title, list, onDelete, onItemChange, onAdd, addPlaceholder, scrollRef, affix="Index", multiline=false }: ListProps) {
    
    const [addItem, setAddItem] = useState("");
    const styles = createStyles();
    const colors = useTheme().colors;

    return (
        <>
        <View style={styles.listContainer}>
            <Text variant="titleLarge" style={{ margin: 5 }}>{title}</Text>
                {
                    list.map((item, index) => {
                        return (
                            <View style={{marginBottom: 1}} key={index}>
                            <SwipeToDelete scrollRef={scrollRef} onSwipe={() => onDelete(index)}>
                                <View style={styles.listInputContainer}>
                                    {   affix === "Index" 
                                            ? <Text style={{padding: 15}}>{index + 1}.</Text>
                                            : <IconButton icon="square-outline" size={20} />
                                    }
                                    <TextInput style={styles.listInput} multiline={multiline} value={item} onChangeText={text => onItemChange(text, index)} />
                                </View>
                            </SwipeToDelete>
                            </View>
                        )
                    })
                }
        </View>
        <View style={styles.listInputContainer}>
            <IconButton icon="plus" size={20} />
            <TextInput 
                style={[styles.listInput]} 
                value={addItem} blurOnSubmit={false} 
                numberOfLines={1} multiline
                placeholder={addPlaceholder}
                placeholderTextColor={colors.onSurfaceVariant}
                scrollEnabled={false}
                onChangeText={text => {
                    if (text[text.length - 1] === "\n") {
                        setAddItem("");

                        onAdd(text.substring(0, text.length - 1));
                    }
                    else {
                        setAddItem(text)
                    }
                }} 
            />
        </View>
        </>
    )
}




/**
 * Creates the styles for the component
 * @returns The styles
 */
function createStyles() {
    const colors = useTheme().colors;
    return StyleSheet.create({
        listContainer: {
            marginTop: 20
        },
        listInputContainer: {
            backgroundColor: colors.surfaceVariant,
            flexDirection: "row", alignItems: "center",
        },
        listInput: {
            right: 5,
            flex: 1,
            color: colors.onSurface,
            paddingTop: 10, paddingBottom: 10
        }
    });
}
