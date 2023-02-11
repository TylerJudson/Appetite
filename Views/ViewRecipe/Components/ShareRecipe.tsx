import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getDatabase, ref, set } from "firebase/database";
import React, {  } from "react";
import { Alert, Platform, StyleSheet, View, Share } from "react-native";
import { TouchableRipple, Menu } from "react-native-paper";
import { Recipe } from "../../../Models/Recipe";
import { RootStackParamList } from "../../navigation";
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import * as FileSystem from 'expo-file-system'
import { useUserState } from "../../../state";



/**
 * Displays a view that allows the user to share a recipe
 * @param recipe The recipe to share
 */
export function ShareRecipe({ recipe, hideModal, navigation }: { recipe: Recipe, hideModal: VoidFunction, navigation: NativeStackNavigationProp<RootStackParamList, "Recipe", undefined> }) {
    const user = useUserState();  

    /**
     * Handles the action of the user clicking the create post option
     */
    function handleCreatePost() {
        hideModal();
        navigation.navigate("CreatePost", { linkedRecipe: recipe });
    }
    /**
     * Handles the action of the user clicking on the share pdf option
     */
    async function handleSharePdf() {

        // Turn the html into a pdf
        const html = createRecipeHtml(recipe);
        const { uri } = await Print.printToFileAsync({ html });

        // Rename the pdf
        const pdf = `${uri.slice(
            0,
            uri.lastIndexOf('/') + 1
        )}` + recipe.name.replaceAll(" ", "-") + `.pdf`
        await FileSystem.moveAsync({
            from: uri,
            to: pdf,
        })

        // Share the pdf
        Share.share({
            url: pdf,
            title: 'title share',
        });
        hideModal();

    }

    /**
     * Handles the action of the user clicking on the publish recipe
     */
    function handlePublish() {

        if (Platform.OS === "web") {
            if (window.confirm(`Publish Recipe? \n Are you sure you want to publish this recipe?`)) {
                publishRecipe();
            }
        }
        else {
            return Alert.alert(
                "Publish Recipe?",
                `Are you sure you want to publish this recipe?`,
                [
                    {
                        text: "Yes",
                        style: "cancel",
                        onPress: publishRecipe
                    },
                    {
                        text: "No",
                        style: "destructive"
                    },
                ]
            )
        }
       
    }


    function publishRecipe() {
        hideModal();
        const db = getDatabase();
        // Send data to the database
        set(ref(db, 'publicRecipes/shallow/' + recipe.id), {
            id: recipe.id,
            name: recipe.name,
            image: recipe.image,
            tags: recipe.tags,
        });
        const sendRecipe = recipe.onlyDefinedProperties();
        delete sendRecipe["favorited"];
        set(ref(db, 'publicRecipes/deep/' + recipe.id), sendRecipe);

        if (Platform.OS === "web") {
            if (window.confirm(`Recipe Published \n Your recipe was successfully published.`)) {
            }
        }
        else {
            return Alert.alert(
                "Recipe Published",
                `Your recipe was successfully published.`,
                [
                    {
                        text: "Okay",
                        style: "cancel",
                    }
                ]
            )
        }
    }

    return (
        <View style={{ padding: 10 }}>
            { user && <TouchableRipple onPress={handleCreatePost}>
                <Menu.Item leadingIcon="post" title="Create a Post" />
            </TouchableRipple> }
            <TouchableRipple onPress={handleSharePdf} >
                <Menu.Item leadingIcon="file" title="Share Pdf" />
            </TouchableRipple>
            { !recipe.readonly && <TouchableRipple onPress={handlePublish} >
                <Menu.Item leadingIcon="upload" title="Publish Recipe" />
            </TouchableRipple>}
        </View>
    );
}






function createRecipeHtml(recipe: Recipe): string {
    return `
<html>
  <head>
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"
    />
    <style>
      #imageTitleContainer {
        display: flex;
        flex-direction: row;
        background-color: "red";
      }
      #image {
        margin: 10px;
        height: 150px;
      }
      #titleContainer {
        padding: 10px;
        margin-top: 15px;
      }
      #timeContainer: {
        margin: 10px;
      }
      #title {
        margin: 5px 10px 10px 0px;
        font-size: 40;
      }
      .time {
        margin: 2px 2px 0px 2px;
        font-size: 14px;
      }
      #notesContainer {
        margin: 50px 30px 0px 30px;
      }
      #description {
        font-size: 12px;
        margin: 5px;
      }
      #tags {
        margin: 0px 5px 5px 5px;
        font-size: 12px;
      }
      #instructionIngredientContainer {
        margin: 10px 20px 10px 30px
      }
    </style>
  </head>
  <body style="margin: 20px">
    <section id="imageTitleContainer">
      <img
        id="image"
        src="${recipe.image}"
      />
      <div id="titleContainer">
        <h1 id="title">
          ${recipe.name}
        </h1>
        <div id="timeContainer">
          <p class="time" id="prepTime"><b>Prep time:</b> ${recipe.prepTime ? recipe.prepTime + " mins" : ""}</p>
          <p class="time" id="cookTime"><b>Cook time:</b> ${recipe.cookTime ? recipe.cookTime + " mins" : ""}</p>
          <p class="time" id="totalTime"><b>Total time:</b> ${(recipe.prepTime && recipe.cookTime) ? recipe.prepTime + recipe.cookTime + " mins" : ""}</p>
        </div>
      </div>
    </section>


    <section id="instructionIngredientContainer">
      <div id="ingredientContainer">
        <h2 id="ingredientTitle">Ingredients</h2>
        <div id="ingredientListContainer">
          <ul>
            ${recipe.ingredients.map(ingredient => {
                return `<li class="item">${ingredient}</li>`
            }).join("")}
          </ul>
        </div>
      </div>
      <div id="instructionContainer">
        <h2 id="instructionTitle">Instructions</h2>
        <div id="instructionListContainer">
          <ol>
            ${recipe.instructions.map(instruction => {
                return `<li class="item">${instruction}</li>`
            }).join("")}
          </ol>
        </div>
      </div>
    </section>

    <section id="notesContainer">
    <h3>${recipe.description ? "Notes" : ""}</h3>
    <p id="description">
          ${recipe.description}
        </p>
    </section>

  </body>
</html>
`
}