import React, { Dispatch, SetStateAction, useState } from "react";
import { Platform, ScrollView, StyleSheet, useWindowDimensions, View } from "react-native";
import { Button, HelperText, Text, TextInput, useTheme } from "react-native-paper";
import Animated, { Layout } from "react-native-reanimated";
import { useRecipeBookState } from "../../../state";
import { AnimatedTag } from "./AnimatedTag";


/**
 * Displays all the tags that the user can select to filter the recipes
 * @param tags The current tags set to filter
 * @param setTags the function to set the tags to filter
 */
export function Tags({ tags, setTags, title, clear=false, addTags=false }: { tags: string[], setTags: Dispatch<SetStateAction<string[]>>, title: string, clear?: boolean, addTags?: boolean }) {
    const styles = createStyles();
    const { recipeBook } = useRecipeBookState();    
    
    const allTags = recipeBook.getAllTags();
    const mostRecentTags = allTags.slice().splice(0, 20);
    const [text, setText] = useState("");
    const [suggestions, setSuggestions] = useState(false);
    const suggestionTags = allTags.filter((tag) => tag.toUpperCase().includes(text.toUpperCase()) && !tags.includes(tag));

    /**
     * Submits the text to be added or not added
     */
    function submitText() {
        // Check to make sure the text isn't empty
        if (text !== "") {
            // If the text doesn't exsist in all tags and there are suggestions and the first suggestion is not already in use
            // then set the text to be the first suggestion
            if (!allTags.includes(text) && suggestionTags.length > 0 && !tags.includes(suggestionTags[0])) {
                setText(suggestionTags[0])
            }
            
            setTimeout(() => {
                // Check to make sure the text is in all tags
                // Or if we are adding new tags
                if (allTags.includes(text) || addTags) {
                    // Make sure the text isn't already included
                    if (!tags.includes(text)) {
                        // add the tag
                        addTag(text);
                    }
                    setText("");
                }
                else {
                    // If the text is not in all tags -> take the first suggestion if the suggestion is not already in use
                    if (suggestionTags.length > 0 && !tags.includes(suggestionTags[0])) {
                        addTag(suggestionTags[0]);
                        setText("");
                    }
                }
            }, 100)
        }
    }

    /**
     * Adds a tag to the current tag-filters
     * @param tag The tag to add
     */
    function addTag(tag: string) {
        setTags([...tags, tag]);
    }

    /**
     * Removes a tag from the filtering tags
     * @param tag The tag to remove from the filtering Tags
     */
    function removeTag(tag: string) {

        let newTags: string[] = [];
        tags.forEach((value) => {
            if (value != tag) {
                newTags.push(value);
            }
        })
        
        setTags(newTags);
    }

    /**
     * Toggles the suggestions that appear under the text entry
     */
    function toggleSuggestions() {
        setSuggestions(!suggestions);
    }

    return (
        <View style={styles.container}>
            <ScrollView style={{height: 350}}>
            <View style={styles.header}>
                <Text style={{paddingHorizontal: 12}} variant="titleLarge">{title}</Text>
                {clear && <Button onPress={tags.length > 0 ? () => setTags([]) : undefined}>{tags.length > 0 ? "Clear": " "}</Button> }
            </View>
            <View style={styles.tagContainer}>
            {
                tags.map((value, index) => {
                    return <AnimatedTag key={index} title={value} onPress={() => removeTag(value)} remove />
                })
            }
            </View>

            <Animated.View layout={Layout}>
            <TextInput 
                dense 
                label="Enter Tag" 
                value={text} onChangeText={text => setText(text)}
                right={<TextInput.Icon icon="arrow-right" forceTextInputFocus={false} onPress={submitText} />}
                onFocus={toggleSuggestions} onBlur={toggleSuggestions}
                onSubmitEditing={submitText}
            />
                        {
                            suggestions &&
                            <View style={styles.suggestionsContainer}>
                                <Text numberOfLines={1} variant="titleMedium"> <HelperText type={"info"} padding="none">Suggestions: </HelperText>
                                {
                                    suggestionTags.map((tag, index, array) => {
                                        return <Text variant="titleMedium" key={index}>
                                            <Text onPress={() => setText(tag)}>{tag}</Text>{index != array.length - 1 ? ", " : ""}
                                        </Text>
                                    })
                                }
                                </Text>

                            </View>
                        }
            </Animated.View>

            <Animated.View layout={Layout}>
            <Text style={{ paddingTop: 30 }}>Most Used Tags:</Text>
            <View style={styles.tagContainer}>
            {
                mostRecentTags.map((value, index) => {
                    if (!tags.includes(value)) {
                        
                        return  <AnimatedTag key={index} title={value} onPress={() => addTag(value)} />
                    }
                })
            }
            </View>
            </Animated.View>
            
            </ScrollView>


        </View>
    );
}


/**
 * Creates the styles for the component
 * @returns The styles
 */
function createStyles() {
    const screenWidth = useWindowDimensions().width;
    const dark = useTheme().dark;

    return StyleSheet.create({
        container: {
            padding: 15,
            maxWidth: screenWidth > 700 ? 400 : undefined
        },
        header: {
            flexDirection: "row", alignItems: 'center', justifyContent: "space-between" 
        },
        tagContainer: {
            flexDirection: "row", flexWrap: "wrap",
            paddingTop: 5, paddingBottom: 30
        },
        suggestionsContainer: {
            width: "100%",
            paddingHorizontal: 5,
        }
    });
}
