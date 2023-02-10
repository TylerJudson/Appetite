import { child, get, getDatabase, push, ref, remove, set, update } from "firebase/database";
import { Fragment, useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Avatar, Button, IconButton, Menu, Text, useTheme } from "react-native-paper";
import { useUserState } from "../../../state";
import { v4 as uuidv4 } from "uuid";
import { alert } from "../../../utilities/Alert";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation";


export type Comment = {
    commentId: string;
    author: { authorId: string, authorName: string, authorPic?: string }; 
    value: string;
    date: number;
}


export function Comments({ comments, setComments, postId, postUserId, postTitle, navigation }: { comments: Comment[], setComments: React.Dispatch<React.SetStateAction<Comment[]>>, postId: string, postUserId: string, postTitle: string, navigation: NativeStackNavigationProp<RootStackParamList, "PostScreen", undefined> }) {
    const colors = useTheme().colors;

    const user = useUserState();
    
    const styles = createStyles();

    const [newComment, setNewComment] = useState("");


    async function sendComment() {
        if (user) {

            let commentId = uuidv4();
            let comment = {
                authorId: user.uid,
                value: newComment,
                date: Date.now()
            };

            const db = getDatabase();
            const updates: any = {};


            // If the post is in public posts then update it there
            await get(ref(db, "users-social/posts/" + postId)).then(publicPostSnapshot => {
                if (publicPostSnapshot.exists() && publicPostSnapshot.val()) {
                    updates["/users-social/posts/" + postId + "/comments/" + commentId] = comment;
                }
            })

            // Update the post on the author's posts
            updates["/users-social/users/" + postUserId + "/posts/" + postId + "/comments/" + commentId] = comment;

            // Update the post in all of the author's friends friend feed
            await get(ref(db, "users-social/users/" + postUserId + "/friends")).then(snapshot => {
                if (snapshot.exists() && snapshot.val()) {
                    Object.keys(snapshot.val()).forEach(friend => {
                        updates["/users-social/users/" + friend + "/friendFeed/" + postId + "/comments/" + commentId] = comment;
                    });
                }
            })

            if (postUserId !== user.uid) {
                const notficId = push(child(ref(db), "users-social/users/" + postUserId + "inbox/notifications/")).key;
                updates["users-social/users/" + postUserId + "/inbox/notifications/" + notficId] = { code: "comment", id: user.uid, postId: postId, date: Date.now(), title: postTitle, read: false };
            }

            update(ref(db), updates);

            setNewComment("");            
        }
    }

    function deleteComment(commentId: string) {

        const deleteCmmnt = async () => {
            setComments(prevVal => prevVal.filter(value => value.commentId !== commentId));

            const db = getDatabase();
            // If the post is in public posts then update it there
            await get(ref(db, "users-social/posts/" + postId)).then(publicPostSnapshot => {
                if (publicPostSnapshot.exists() && publicPostSnapshot.val()) {
                    remove(ref(db, "/users-social/posts/" + postId + "/comments/" + commentId));
                }
            })

            // Update the post on the author's posts
            remove(ref(db, "/users-social/users/" + postUserId + "/posts/" + postId + "/comments/" + commentId));

            // Update the post in all of the author's friends friend feed
            await get(ref(db, "users-social/users/" + postUserId + "/friends")).then(snapshot => {
                if (snapshot.exists() && snapshot.val()) {
                    Object.keys(snapshot.val()).forEach(friend => {
                        remove(ref(db, "/users-social/users/" + friend + "/friendFeed/" + postId + "/comments/" + commentId));
                    });
                }
            })

        }

        alert("Delete Comment?", "Are you sure you want to delete this comment?", [{ text: "No", style: "cancel" }, { text: "Yes", style: "destructive", onPress: deleteCmmnt}], deleteCmmnt);
    }
    
    return (

        <View style={styles.container}>
            <Text style={styles.commentTitle} variant="headlineSmall" >Comments</Text>

            <View style={styles.commentListContainer}>
                {
                    comments.map((comment, index) => {
                        let showEdit = false;
                        if (user) {
                            showEdit = user.uid === comment.author.authorId || user.uid === postUserId;
                        }
                        return (
                            <Fragment key={index}>
                            <View style={styles.commentContainer} >
                                <View style={styles.commentHeaderContainer}>
                                    <TouchableOpacity style={styles.authorContainer} onPress={() => navigation.navigate("PublicProfile", { id: comment.author.authorId })}>
                                        <Avatar.Image style={styles.authorImage} size={25} source={comment.author.authorPic ? { uri: comment.author.authorPic } : require("../../../assets/images/defaultProfilePic.jpeg")} />
                                        <Text style={styles.authorTitle} variant="labelLarge" >{comment.author.authorName}</Text>
                                    </TouchableOpacity>
                                    <IconButton icon="delete-outline" size={15} style={styles.editButton} iconColor={showEdit ? colors.error : colors.background} onPress={showEdit ? () => deleteComment(comment.commentId) : undefined} />
                                </View>

                                <Text style={styles.commentText} >{comment.value}</Text>
                            </View>
                            <View style={styles.separatorContainer}><View style={styles.separator} /></View>
                            </ Fragment>
                        )
                    })
                }
            </View>

            { comments.length == 0 && <Text style={[styles.commentText, { marginTop: 10 }]}>No Comments Yet</Text> }

            <View style={styles.newCommentContainer}>
                <Text variant="titleLarge" style={styles.newCommentTitle}>Add a Comment:</Text>
                <TextInput
                    style={styles.newCommentInput}
                    value={newComment}
                    onChangeText={setNewComment}
                    multiline
                />
                {newComment.length > 0 && <Button mode="contained" style={styles.sendButton} onPress={sendComment} >Send</Button>}
            </View>
        </View>
    );
}






/**
 * Creates the styles for the component
 * @returns The styles
 */
function createStyles() {
    const colors = useTheme().colors;

    return StyleSheet.create({
        container: {
            padding: 10, marginTop: 20
        },
        commentTitle: {

        },
        newCommentContainer: {
            margin: 10, marginRight: 15, marginTop: 50
        },
        newCommentInput: {
            color: colors.onBackground,
            paddingHorizontal: 10, paddingVertical: 10,
            height: 100,
            borderRadius: 12,
            borderWidth: 1, borderColor: colors.onBackground
        },
        newCommentTitle: {
            marginVertical: 5
        },
        sendButton: {
            position: "absolute", bottom: 5, right: 0,
            transform: [{scale: 0.75}]
        },
        commentListContainer: {

        },
        commentContainer: {
            paddingBottom: 5, paddingHorizontal: 5
        },
        commentHeaderContainer: {
            flexDirection: 'row', alignItems: 'center', justifyContent: "space-between",
            marginVertical: 5
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
            paddingRight: 15, paddingLeft: 5
        },
        separatorContainer: {
            marginHorizontal: 15, marginTop: 10
        },
        separator: {
            borderBottomWidth: 0.75, borderColor: colors.outline
        }

    });
}
