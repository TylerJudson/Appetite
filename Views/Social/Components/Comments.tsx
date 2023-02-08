import { View, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Avatar, IconButton, Text } from "react-native-paper";
export type Comment = {
    author: { authorId: string, authorName: string, authorPic?: string }; 
    value: string;
}


export function Comments({ comments, source} : { comments: Comment[], source: string }) {
    
    const styles = createStyles();
    
    return (
        <View style={styles.container}>
            <Text style={styles.commentTitle} variant="headlineSmall" >Comments</Text>

            <View style={styles.commentListContainer}>
                {
                    comments.map((comment, index) => {
                        return (
                            <>
                            <View style={styles.commentContainer} key={index} >
                                <View style={styles.commentHeaderContainer}>
                                    <TouchableOpacity style={styles.authorContainer}>
                                        <Avatar.Image style={styles.authorImage} size={25} source={comment.author.authorPic ? { uri: comment.author.authorPic } : require("../../../assets/images/defaultProfilePic.jpeg")} />
                                        <Text style={styles.authorTitle} variant="labelLarge" >{comment.author.authorName}</Text>
                                    </TouchableOpacity>
                                    {
                                        true &&
                                        <IconButton icon="dots-vertical" style={styles.editButton} />
                                    }                                    
                                </View>

                                <Text style={styles.commentText} >{comment.value}</Text>
                            </View>
                            { index != comments.length - 1 && <View style={styles.separatorContainer}><View style={styles.separator} /></View> }
                            </>
                        )
                    })
                }
            </View>
        </View>
    );
}






/**
 * Creates the styles for the component
 * @returns The styles
 */
function createStyles() {

    return StyleSheet.create({
        container: {
            padding: 10
        },
        commentTitle: {

        },
        commentListContainer: {

        },
        commentContainer: {
            padding: 5
        },
        commentHeaderContainer: {
            flexDirection: 'row', alignItems: 'center', justifyContent: "space-between"
        },
        authorContainer: {
            flexDirection: 'row', alignItems: 'center'
        },
        authorImage: {

        },
        authorTitle: {
            marginLeft: 5
        },
        editButton: {

        },
        commentText: {
            paddingHorizontal: 10
        },
        separatorContainer: {

        },
        separator: {

        }

    });
}
