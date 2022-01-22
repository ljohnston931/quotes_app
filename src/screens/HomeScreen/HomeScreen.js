/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { FlatList, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native'
import styles from './styles'
import { firebase } from '../../firebase/config'

// eslint-disable-next-line no-unused-vars
export default function HomeScreen({navigation, route, extraData}) {

	const [collectionName, setCollectionName] = useState('')
	const [collections, setCollections] = useState([])

	const collectionRef = firebase.firestore().collection('collections')
	const userID = extraData.id

	useEffect(() => {
		const unsubscribe = 
		collectionRef
			.where('authorID', '==', userID)
			.orderBy('createdAt', 'desc')
			.onSnapshot(
				querySnapshot => {
					const newCollections = []
					querySnapshot.forEach(doc => {
						const collection = doc.data()
						collection.id = doc.id
						newCollections.push(collection)
					})
					setCollections(newCollections)
				},
				error => {
					console.log(error)
				}
			)
		return () => unsubscribe()
	}, [])

	const onAddButtonPress = () => {
		if (collectionName && collectionName.length > 0) {
			const timestamp = firebase.firestore.FieldValue.serverTimestamp()
			const data = {
				text: collectionName,
				authorID: userID,
				createdAt: timestamp,
			}
			collectionRef
				.add(data)
				.then( _ => {
					setCollectionName('')
					Keyboard.dismiss()
				})
				.catch((error) => {
					alert(error)
				})
		}
	}
    
	const openCollection = (collection) => {
		navigation.navigate('Collection', {"collection": collection})
	}

	// eslint-disable-next-line no-unused-vars
	const renderCollection = ({item, index}) => {
		return (
			<TouchableOpacity 
				style={styles.collectionContainer} 
				onPress={() => openCollection(item)}>
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
					placeholder='Start a new collection'
					placeholderTextColor="#aaaaaa"
					onChangeText={(text) => setCollectionName(text)}
					value={collectionName}
					underlineColorAndroid="transparent"
					autoCapitalize="none"
				/>
				<TouchableOpacity style={styles.button} onPress={onAddButtonPress}>
					<Text style={styles.buttonText}>Add</Text>
				</TouchableOpacity>
			</View>
			{ collections && (
				<View style={styles.listContainer}>
					<FlatList
						data={collections}
						renderItem={renderCollection}
						keyExtractor={(collection) => collection.id}
						removeClippedSubviews={true}
					/>
				</View>
			)}
		</View>
	)
}