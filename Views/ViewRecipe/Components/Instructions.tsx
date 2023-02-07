import React, { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { InstructionIngredientWord as SpecialWord} from "./InstructionIngredientWord";


const ignoreWords = ["room", "temperature", "tsp", "tbsp", "teaspoon", "tablespoon", "cups", "and", "into", "cup", "to", "medium", "slices", "or", "your", "about", "for", "more", "pinch"]

/**
 * Displays an instruction with ingredients highlighted
 * @param instruction The instruction to display.
 * @param index The index the instruction appears.
 * @param ingredients All the ingredients in the recipe, so the instruction can highlight smilar words.
 */
export function Instructions({ instruction, index, ingredients }: { instruction: string, index: number, ingredients: string[] }) {
    const styles = createStyles();
    const theme = useTheme();
    const colors = theme.colors;

    const [checked, setChecked] = useState(false);

    //#region BEHAVIOR
    /**
     * Toggles whether or not the instruction has been completed
     */
    function toggleCheck() {
        setChecked(!checked);
    }

    /**
     * Finds all the ingredients a particular word is in
     * @param instructionWord the word to check if it's in the ingredients
     * @param ingredientsWords the ingredients to check if the instruction word is in
     * @returns an array of all the ingredients the instruction word is in
     */
    function instructionInIngredient(instructionWord: string, ingredientsWords: string[][]) {
        let ret: string[] = [];
        ingredientsWords.forEach(ingredientWords => {
            if (ingredientWords.some(word => word.toLowerCase() === instructionWord.toLowerCase())) {
                ret.push(ingredientWords.join(""));
            }
        });
        return ret;
    }


    /**
     * Recursively checks to see if a word (or multiple) words are inside of an ingredient.
     * @param instructionWords The array of all words in the instruction
     * @param i the index to start checking
     * @param ingredientsWords the ingredients to check if the words are in it
     * @returns The word, the ingredients the word is in, and the new index to continue searching
     */
    function getCompleteIngredient(instructionWords: string[], i: number, ingredientsWords: string[][]): {word: string, ingredientsIncluded: string[], newI: number} {
        // We don't want to check if the word is undefined or it contains non-alpha characters or if it is a word in the ignore list
        if (instructionWords[i] != undefined && /^[a-zA-Z]+$/.test(instructionWords[i]) && !ignoreWords.includes(instructionWords[i].toLowerCase())) {
            // Find all the ingredients the word is included in
            const ingredientsIncluded = instructionInIngredient(instructionWords[i].replace(/[^a-z]/gi, ""), ingredientsWords)
            // If the word is included in some ingredients check the next word to see if they are the same ingredient i.e. baking powder (two words...)
            if (ingredientsIncluded.length > 0) {
                // Check the next word. We add 2 to i because there is a space in between
                const nextWord = getCompleteIngredient(instructionWords, i + 2, ingredientsWords);
                // Find if they have any ingredients in common
                const ingredientsIncludedIntersection = ingredientsIncluded.filter(value => nextWord.ingredientsIncluded.includes(value));
                // If they do, return the new word and the intersection of their ingredients
                if (ingredientsIncludedIntersection.length > 0) {
                    return { word: instructionWords[i] + instructionWords[i + 1] + nextWord.word, ingredientsIncluded: ingredientsIncludedIntersection, newI: nextWord.newI }
                }
                else {
                    return { word: instructionWords[i], ingredientsIncluded: ingredientsIncluded, newI: i }
                }
            }
        }
        return { word: "", ingredientsIncluded: [], newI: i };
    }

    /**
     * Displays words and highlightes all "special words" (words that are in an ingredient)
     * @returns The instruction with special ingredient words highlighted
     */
    function displayInstruction() {
        const instructionWords = instruction.split(/([_\W])/); // Split the instruction by non-alpha characters
        const ingredientsWords = ingredients.map((value) => value.split(/([_\W])/)); // Split the ingredients also by non-alpha charachters

        let i = 0;
        let component = [];

        while (i < instructionWords.length) {
            // If the instruction word contains only alpha characters and is not included in the ignore list display it as a special word
            if (/^[a-zA-Z]+$/.test(instructionWords[i]) && !ignoreWords.includes(instructionWords[i])) {
                // Get's the special word and the ingredients included (if there are any)
                const specialWord = getCompleteIngredient(instructionWords, i, ingredientsWords);
                // If the length > 0 then the word is special; display it as such
                if (specialWord.ingredientsIncluded.length > 0) {
                    component.push(<SpecialWord key={i} ingredients={specialWord.ingredientsIncluded}>{specialWord.word}</SpecialWord>)
                    i = specialWord.newI;
                }
                else {
                    component.push(instructionWords[i]);
                }
            }
            else {
                component.push(instructionWords[i])
            }
            i++;
        }

        return (
            <Text>{component}</Text>
        )
        
    }
    //#endregion


    return (
        <TouchableOpacity style={[styles.container, { backgroundColor: index % 2 ? colors.surfaceVariant : undefined}]} onPress={toggleCheck}>
            <Text style={{ textDecorationLine: checked ? "line-through" : "none", textAlignVertical: 'center' }} variant="bodyLarge" >
                {index + 1}. {displayInstruction()}
            </Text>
        </TouchableOpacity>
    );
}






/**
 * Creates the styles for the component
 * @returns The styles
 */
function createStyles() {
    return StyleSheet.create({
        container: {
            padding: 10,
            flexDirection: "row", alignItems: "center",
            borderRadius: 10
        },
    });
}
