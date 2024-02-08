import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  ImageBackground, 
  Dimensions 
} from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const EstateBuy = ({ route }) => {
  const { id } = route.params;
  const [estateData, setEstateData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "Estate", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setEstateData(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching estate data: ", error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <ScrollView style={styles.container}>
      <ImageBackground 
        source={{ uri: estateData?.imageUrl }} 
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>{estateData?.Name}</Text>
          <Text style={styles.description}>{estateData?.description}</Text>
        </View>
      </ImageBackground>
      <View style={styles.detailsContainer}>
        <Text style={styles.details}>Quantity: {estateData?.quantity}</Text>
        <Text style={styles.details}>Price: ${estateData?.Price}</Text>
        <TouchableOpacity style={styles.purchaseButton}>
          <Text style={styles.buttonText}>Purchase</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageBackground: {
    width: windowWidth,
    height: windowHeight * 0.4,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  detailsContainer: {
    padding: 20,
  },
  details: {
    fontSize: 18,
    marginBottom: 10,
  },
  purchaseButton: {
    backgroundColor: "#0782f9",
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EstateBuy;
