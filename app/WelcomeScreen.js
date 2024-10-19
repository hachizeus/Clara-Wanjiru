import React, { useState, useCallback } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Modal } from "react-native";

// Preload images statically
const images = {
  1: require("./assets/1.png"),
  2: require("./assets/2.png"),
  3: require("./assets/3.png"),
  4: require("./assets/4.png"),
  5: require("./assets/5.png"),
  6: require("./assets/6.png"),
  7: require("./assets/7.png"),
  8: require("./assets/8.png"),
  10: require("./assets/10.png"),
  11: require("./assets/11.png"),
  12: require("./assets/12.png"),
};

const WelcomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Open Modal with selected image
  const openModal = useCallback((src) => {
    setSelectedImage(src);
    setModalVisible(true);
  }, []);

  // Close Modal
  const closeModal = useCallback(() => {
    setModalVisible(false);
    setSelectedImage(null);
  }, []);

  return (
    <ScrollView style={styles.body}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerH1}>Jewelry Management System Solutions</Text>
      </View>

      {/* Solutions Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Proposed Solutions</Text>
        {[
          "Implementing comprehensive Jewelry Management Systems",
          "Streamlining operations by automating routine tasks",
          "Improving customer experience",
          "Enhancing decision making",
          "Implementing strict security measures",
          "Generating detailed financial reports",
          "Compliance and quality control",
          "Monitoring sales performance",
        ].map((item, index) => (
          <Text key={index} style={styles.listItem}>• {item}</Text>
        ))}
      </View>

      {/* Systems Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Application Systems Used</Text>
        {[
          { title: "Point of Sale (POS) Systems", description: "Automates sales transactions, manages customer data, and tracks inventory in real-time." },
          { title: "Customer Relationship Management (CRM)", description: "Maintains detailed customer profiles, tracks purchase history, and personalizes marketing efforts." },
          { title: "Inventory Management Systems", description: "Provides accurate stock tracking, automates reordering, and reduces the risk of overstocking or stock-outs." },
          { title: "Financial Management Systems", description: "Helps with budgeting, forecasting, and financial reporting for strategic financial planning." },
        ].map((system, index) => (
          <View key={index}>
            <Text style={styles.subTitle}>{system.title}</Text>
            <Text style={styles.paragraph}>{system.description}</Text>
          </View>
        ))}
      </View>

      {/* Portfolio Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Image Portfolio</Text>
        <View style={styles.portfolioGallery}>
          {Array.from({ length: 12 }, (_, index) => (
            <TouchableOpacity key={index} onPress={() => openModal(images[index + 1])}>
              <Image source={images[index + 1]} style={styles.image} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Modal for Image */}
      <Modal visible={modalVisible} transparent={true} onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={closeModal} style={styles.modalBackdrop}>
            <View style={styles.modalContent}>
              <Image source={selectedImage} style={styles.modalImage} />
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  body: {
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: "#1f1f1f",
    flex: 1,
  },
  header: {
    padding: 40,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    alignItems: "center",
  },
  headerH1: {
    fontSize: 30,
    color: "#0ff",
    textShadowColor: "rgba(0, 255, 255, 0.7)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#fff",
  },
  listItem: {
    fontSize: 16,
    color: "#fff",
    marginVertical: 5,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#0ff",
    marginVertical: 10,
  },
  paragraph: {
    fontSize: 16,
    color: "#ddd",
    marginBottom: 20,
  },
  portfolioGallery: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackdrop: {
    flex: 1,
    width: "100%",
  },
  modalContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: 300,
    height: 300,
  },
});

export default WelcomeScreen;
