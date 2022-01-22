import React, { useEffect, useState } from 'react'
import { FlatList, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native'
import styles from './styles'
import { firebase } from '../../firebase/config'

export default function FakeCollectionScreen({navigation, route, extraData}) {
    const collection = route.params.collection
    const userID = extraData.id

    const [newSnippet, setNewSnippet] = useState('')
    const [snippets, setSnippets] = useState([])

    const snippetRef = firebase.firestore().collection('snippets')
    const snippetUserRef = firebase.firestore().collection('snippet_user')

    useEffect(() => {
        const unsubscribe = 
        snippetUserRef
            .where('userID', '==', userID)
            .where('collectionID', '==', collection.id)
            .orderBy('addedAt', 'desc')
            .onSnapshot(
                querySnapshot => {
                    const newSnippets = []
                    querySnapshot.forEach(doc => {
                        const snippetUser = doc.data()
                        snippetUser.id = doc.id
                        snippetRef.doc(snippetUser.snippetID).get()
                            .then(textDoc => {
                                if (textDoc.exists) {
                                    const snippetText = textDoc.data()
                                    const snippet = {
                                        ...snippetUser,
                                        ...snippetText
                                    }
                                    newSnippets.push(snippet)
                                } else {
                                    alert("Snippet " + snippetID + " not found")
                                }
                            })
                        
                    })
                    setSnippets(newSnippets)
                },
                error => {
                    console.log(error)
                }
            )
        return () => unsubscribe();
    }, [])

    const onAddButtonPress = () => {
        if (newSnippet && newSnippet.length > 0) {
            const timestamp = firebase.firestore.FieldValue.serverTimestamp()
            const data = {
                text: newSnippet,
                authorID: userID,
                createdAt: timestamp
            }
            snippetRef
                .add(data)
                .then(doc => {
                    setNewSnippet('')
                    Keyboard.dismiss()

                    const snippetID = doc.id

                    const userData = {
                        userID: userID,
                        snippetID: snippetID,
                        collectionID: collection.id,
                        addedAt: timestamp
                    }

                    snippetUserRef
                        .add(userData)
                })                        
                .catch(error => {
                    alert(error)
                })
        }
    }

    const renderSnippet = ({item, index}) => {
        return (
            <TouchableOpacity 
                style={styles.collectionContainer}>
                    <Text style={styles.collectionText}>
                        {item.text}
                    </Text>
                </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    placeholder='Type a new snippet'
                    placeholderTextColor='#aaaaaa'
                    onChangeText={(text) => setNewSnippet(text)}
                    value={newSnippet}
                    underlineColorAndroid='transparent'
                    autoCapitalize='none'
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={onAddButtonPress}>
                    <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
            </View>
            { snippets && (
                <View style={styles.listContainer}>
                    <FlatList
                        data={snippets}
                        renderItem={renderSnippet}
                        keyExtractor={(snippet) => snippet.id}
                        removeClippedSubviews={true}
                    />
                </View>
            )}
        </View>
    )
}